import React, { useState } from 'react';

interface FileInputProps {
  label: string;
  onFileChange: (content: string) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ label, onFileChange }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      setFileName(file.name);
      onFileChange(text);
    }
  };

  return (
    <div className="mb-6 text-white">
      <label className="block mb-2 font-semibold">{label}</label>
      <input
        type="file"
        accept=".py"
        onChange={handleChange}
        className="text-white file:bg-blue-600 file:border-none file:px-3 file:py-1 file:text-white file:rounded file:cursor-pointer"
      />
      {fileName && <p className="text-sm mt-1 text-gray-300">Selected: {fileName}</p>}
    </div>
  );
};
