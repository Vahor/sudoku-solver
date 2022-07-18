import React from 'react'
import { Button } from './Button';

export interface MenuProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>{
    // children is a function that takes a single argument, the current state of the menu
    label: string;
    children: (close: () => void) => React.ReactNode
}

export const Menu = ({children,label, ...props}: MenuProps) => {
    const [open, setOpen] = React.useState(false)
    const close = () => setOpen(false)
    return <div className='relative'>
        <Button 
            onClick={() => setOpen(!open)}
            {...props}
        >
            {label}
            <svg className="-mr-1 ml-2 h-5 w-5 rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
      </svg>
      </Button>
        <div className="absolute bottom-full right-0 mb-2 w-56 rounded-md shadow-lg bg-secondary-600 ring-1 ring-black ring-opacity-5 focus:outline-none">
        {open && children(close)}
        </div>

    </div>
   
}