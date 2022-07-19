import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({children, className, ...props}: ButtonProps) => {
  return <button
            className="inline-flex items-center w-full rounded-md border border-secondary-700 shadow-sm px-2 md:px-4 py-1 md:py-2 bg-secondary-900 text-xs md:text-sm font-medium text-gray-100 hover:bg-secondary-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
            {...props}
        >
            {children}
            </button>
}