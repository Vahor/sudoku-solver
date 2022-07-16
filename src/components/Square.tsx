import React, { useEffect } from 'react'

export interface SquareProps {
    value: number | undefined;
    updateSquare: (i: number, j: number, value: number) => void;
    i: number;
    j: number;
}

export const Square = ({ value, updateSquare, i, j }: SquareProps) => {

    const [edited, setEdited] = React.useState(false);

    useEffect(() => {
        if (!value) {
            setEdited(false);
        }
    }, [value]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        // handle invalid input
        if (value > 9) {
            return;
        }
        updateSquare(i, j, value);
        setEdited(!!value);
    }

    const randomAnimationDuration = Math.random() * (3 - 0.1) + 0.1;

    return (
        <input
            type="number"
            pattern="\d*"
            value={value || ''}
            min="1"
            max="9"
            onChange={handleChange}
            className={`h-8 w-8 md:h-12 md:w-12  border p-2 fade-2 text-white outline-none border-neutral-600 text-center 
            ${edited ?
                 "bg-pink-50 hover:bg-pink-100 text-neutral-900":
                 "bg-neutral-800 hover:bg-neutral-700"}`}
            style={{
                animationDuration: `${randomAnimationDuration}s!important`,
            }}
        />
    );
}