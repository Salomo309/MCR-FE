import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

export interface FileInputRef {
  resetFile: () => void;
}

interface FileInputProps {
  label: string;
  onFileChange: (content: string) => void;
}

export const FileInput = forwardRef<FileInputRef, FileInputProps>(({ label, onFileChange }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      setFileName(file.name);
      onFileChange(text);
    }
  };

  useImperativeHandle(ref, () => ({
    resetFile: () => {
      setFileName(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }));

  return (
    <div className="mb-6 text-white">
      <label className="block mb-2 font-semibold">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept=".py"
        onChange={handleChange}
        className="text-white file:bg-blue-600 file:border-none file:px-3 file:py-1 file:text-white file:rounded file:cursor-pointer"
      />
      {fileName && <p className="text-sm mt-1 text-gray-300">Selected: {fileName}</p>}
    </div>
  );
});
