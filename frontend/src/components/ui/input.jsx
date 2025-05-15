// src/components/ui/input.jsx
import React from "react";

export const Input = ({ type = "text", placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border rounded px-3 py-2 w-full"
    />
  );
};
