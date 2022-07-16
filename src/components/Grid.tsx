import React from 'react'
import { Square } from './Square';

export interface GridProps {
    squares: number[][];
    updateSquare: (i: number, j: number, value: number) => void;
}

export const Grid = ({ squares, updateSquare }: GridProps) => {

    const size = squares.length;
    const squaresInABox = Math.floor(Math.sqrt(size));
    const boxPerRow = size / squaresInABox;

    const renderSquare = (i: number, j: number) => {
        return (
            <Square
                key={`${i}-${j}`}
                value={squares[i]![j]}
                updateSquare={updateSquare}
                i={i}
                j={j}
            />
        );
    }

    const renderRow = (i: number) => {
        return (
            <div key={i} className="flex flex-row flex-wrap">
                {Array(size).fill(null).map((_, j) => renderSquare(i, j))}
            </div>
        );
    }


    return (<div className='relative'>
        <div className="flex flex-col flex-wrap">
            {Array(size).fill(null).map((_, i) => renderRow(i))}
        </div>

        <div className="absolute inset-0 fade-2 pointer-events-none">
            <div className="flex flex-row flex-wrap">
                {Array(boxPerRow).fill(null).map((_, i) => {
                    return (<div key={i} >
                        {Array(boxPerRow).fill(null).map((_, j) => {
                            return (
                                <div key={j} className={`h-36 w-36 border border-neutral-400`}/>
                            );
                        })}
                    </div>)
                })}
            </div>
        </div>

    </div>

    );
}