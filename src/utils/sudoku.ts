
export const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const size = 9;

export const findUnassignedLocation = (squares: number[][]): [number | null, number | null] => {
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares.length; j++) { // it's a square
            if (!squares[i]![j]) {
                return [i, j];
            }
        }
    }
    return [null, null];
}

const isValid = (squares: number[][], i: number, j: number, value: number): boolean => {
    // check row
    for (let j2 = 0; j2 < squares[i]!.length; j2++) {
        if (squares[i]![j2] === value && j !== j2) {
            return false;
        }
    }
    // check column
    for (let i2 = 0; i2 < squares.length; i2++) {
        if (squares[i2]![j] === value && i !== i2) {
            return false;
        }
    }
    // check box
    const boxSize = Math.floor(Math.sqrt(squares.length));
    const boxI = Math.floor(i / boxSize);
    const boxJ = Math.floor(j / boxSize);
    for (let i2 = boxI * boxSize; i2 < boxI * boxSize + boxSize; i2++) {
        for (let j2 = boxJ * boxSize; j2 < boxJ * boxSize + boxSize; j2++) {
            if (squares[i2]![j2] === value && !(i === i2 && j === j2)) {
                return false;
            }
        }
    }
    return true;
}

export const solveSudoku = (squares: number[][]): number[][] | null => {
    const solve = (squares: number[][]): number[][] | null => {
        const [i, j] = findUnassignedLocation(squares);
        if (i === null || j === null) {
            return squares;
        }
        for (let value = 1; value <= 9; value++) {
            if (isValid(squares, i, j, value)) {
                const newSquares = squares.map(row => [...row]);
                newSquares[i]![j] = value;
                const result = solve(newSquares);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    return solve(squares);
}