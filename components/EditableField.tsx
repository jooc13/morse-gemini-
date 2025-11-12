import React, { useState, useEffect } from 'react';

interface EditableFieldProps {
  value: string | number;
  onSave: (newValue: string) => void;
  className?: string;
  inputType?: 'text' | 'number';
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  className = '',
  inputType = 'text',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(String(value));

  useEffect(() => {
    setCurrentValue(String(value));
  }, [value]);

  const handleSave = () => {
    if (currentValue !== String(value)) {
      onSave(currentValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setCurrentValue(String(value));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type={inputType}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`bg-white text-gray-900 p-1 rounded-md outline-none ring-2 ring-blue-500 w-full border border-gray-300 ${className}`}
        autoFocus
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-100 p-1 rounded-md transition-colors ${className}`}
    >
      {value}
    </span>
  );
};
