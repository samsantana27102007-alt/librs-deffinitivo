import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading,
  className = '',
  disabled,
  ...props 
}) => {
  // Height: 52px, Radius: 14px, Font: Button (16px/600)
  const baseStyle = "w-full flex items-center justify-center font-sans text-btn transition-all duration-200 active:scale-[0.98] rounded-btn h-[52px]";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-[#E68E36] disabled:opacity-40 disabled:hover:bg-primary disabled:cursor-not-allowed shadow-sm",
    secondary: "bg-transparent border-[2px] border-secondary text-secondary hover:bg-secondary/5 disabled:opacity-40",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium">Processando...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};