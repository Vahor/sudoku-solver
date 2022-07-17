import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({children, className, ...props}: ButtonProps) => {
  return <button
            className="inline-flex justify-center w-full rounded-md border border-neutral-400 shadow-sm px-4 py-2 bg-neutral-900 text-sm font-medium text-gray-100 hover:bg-neutral-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
            {...props}
        >
            {children}
            </button>
}