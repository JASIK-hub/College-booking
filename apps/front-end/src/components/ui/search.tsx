import React from "react";
import { cn } from "../../lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        className={cn(
          "px-3 py-2 border rounded-md outline-none transition-colors",
          error ? "border-red-500" : "border-gray-300",
          "focus:border-black focus:ring-1 focus:ring-black",
          className
        )}
        {...props}
      />
    </div>
  );
};
