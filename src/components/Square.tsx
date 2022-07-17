import React, { useEffect } from 'react'

export interface SquareProps {
    value: number | undefined;
    updateSquare: (i: number, j: number, value: number) => void;
    i: number;
    j: number;
    isValid: boolean;
    setInitial: (b: boolean) => void;
    isInitial: boolean;
}

export const Square = ({ value, updateSquare, i, j,setInitial,isInitial }: SquareProps) => {

    useEffect(() => {
        if (!value) {
            setInitial(false);
        }
    }, [value,setInitial]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setInitial(!!value);
    }

    const randomAnimationDuration = Math.random() * (3 - 0.1) + 0.1;

    return (
        <input
            type="number"
            pattern="\d"
            value={value || ''}
            min="1"
            max="9"
            onChange={handleChange}
            className={`h-8 w-8 md:h-12 md:w-12  border p-2 fade-2 text-white outline-none border-neutral-600 text-center 
            ${isInitial ?
                 "bg-pink-100 hover:bg-pink-200 text-neutral-900":
                 "bg-neutral-800 hover:bg-neutral-700"}`
                }
            style={{
                animationDuration: `${randomAnimationDuration}s!important`,
            }}
        />
    );
}