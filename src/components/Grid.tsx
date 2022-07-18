import React from 'react'
import { Sudoku } from '../utils/sudoku';
import { Square } from './Square';

export interface GridProps {
    squares: number[][];
    updateSquare: (i: number, j: number, value: number) => void;
    sudoku: Sudoku;
    initial: [number, number][];
}

export const Grid = ({ squares, updateSquare,sudoku,initial }: GridProps) => {

    const size = squares.length;
    const squaresInABox = Math.floor(Math.sqrt(size));
    const boxPerRow = size / squaresInABox;

    const renderSquare = (i: number, j: number) => {
        const value = squares[i]![j];
        return (
            <Square
                key={`${i}-${j}`}
                value={value}
                updateSquare={updateSquare}
                i={i}
                j={j}
                isValid={!value || sudoku.isValid(i, j, value)}
                isInitial={initial.some(([i2, j2]) => i2 === i && j2 === j)}
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
                                <div key={j} className={`h-24 w-24 md:h-36 md:w-36 border border-neutral-400`}/>
                            );
                        })}
                    </div>)
                })}
            </div>
        </div>

    </div>

    );
}