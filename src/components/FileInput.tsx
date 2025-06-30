import React from 'react';

interface FileInputProps {
  label: string;
  onFileChange: (content: string) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ label, onFileChange }) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      onFileChange(text);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">{label}</label>
      <input type="file" accept=".py" onChange={handleChange} />
    </div>
  );
};
