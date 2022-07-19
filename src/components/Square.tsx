import React from 'react'

export interface SquareProps {
    value: number | undefined;
    updateSquare: (i: number, j: number, value: number) => void;
    i: number;
    j: number;
    isValid: boolean;
    isInitial: boolean;
}

export const Square = ({ value, updateSquare, i, j,isInitial,isValid }: SquareProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(isInitial) return;
        const raw = e.target.value;
        const value = parseInt(raw);
        // handle invalid input
        if (value < 0 || value > 9 || (raw && isNaN(value))) {
            e.preventDefault();
            e.target.value = "";
            updateSquare(i, j, 0);
            return;
        }
        updateSquare(i, j, value);
    }

    const randomAnimationDuration = Math.random() * (3 - 0.1) + 0.1;
    const customClasses = isValid ?
         isInitial ? "bg-neutral-800 dark:bg-neutral-100 hover:bg-neutral-700 dark:hover:bg-neutral-200 text-white dark:text-neutral-900" : 
            "font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-900 dark:text-white " 
         : "bg-pink-700 text-neutral-100 hover:bg-pink-800";

    const borderClassesY = i % 3 === 0 ? "mt-1" : "";
    const borderClassesX = j % 3 === 0 ? "ml-1" : "";

    return (
        <input
            type="number"
            pattern="\d*"
            value={value || ''}
            disabled={isInitial}
            min="1"
            max="9"
            onChange={handleChange}
            className={`h-8 w-8 md:h-12 md:w-12 fade-2 outline-none border border-neutral-400 dark:border-neutral-600
             text-center transition-background ease-in-out ${customClasses} duration-100 ${borderClassesY} ${borderClassesX}`}
            style={{
                animationDuration: `${randomAnimationDuration}s!important`,
            }}
        />
    );
}