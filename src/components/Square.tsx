import React from 'react'

export interface SquareProps {
    value: number | undefined;
    updateSquare: (i: number, j: number, value: number) => void;
    i: number;
    j: number;
}

export const Square = ({ value, updateSquare, i, j }: SquareProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        // handle invalid input
        if (value > 9) {
            return;
        }
        updateSquare(i, j, value);
    }

    const randomAnimationDuration = Math.random() * (2 - 0.1) + 0.1;

    return (
        <input
            type="number"
            value={value || ''}
            min="1"
            max="9"
            onChange={handleChange}
            className="h-12 w-12 bg-neutral-800 hover:bg-neutral-700 border p-2 fade-2 text-white outline-none border-neutral-600 text-center"
            style={{
                animationDuration: `${randomAnimationDuration}s!important`,
            }}
        />
    );
}