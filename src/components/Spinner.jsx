import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Reusable Spinner Component
 * 
 * @param {string} size - Size of the spinner ('sm', 'md', 'lg', 'xl')
 * @param {string} color - Tailwind text color class (e.g., 'text-blue-600', 'text-white')
 * @param {string} text - Optional loading text to display below or beside the spinner
 * @param {boolean} inline - Whether to display text inline (next to spinner) or stacked (below)
 * @param {string} className - Additional custom styling for the container
 */
const Spinner = ({
  size = "md",
  color = "text-blue-600",
  text = "",
  inline = false,
  className = "",
}) => {
  // Size mappings for the spinner icon
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  // Text size mappings to match spinner scale
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div
      className={`flex items-center justify-center ${
        inline ? "flex-row gap-2" : "flex-col gap-3"
      } ${className}`}
    >
      <Loader2
        className={`animate-spin ${sizeClasses[size] || sizeClasses.md} ${color}`}
      />
      {text && (
        <p className={`font-medium text-slate-600 ${textSizeClasses[size] || textSizeClasses.md}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Spinner;