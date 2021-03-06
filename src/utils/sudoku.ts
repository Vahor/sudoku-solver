

export const difficulties = {
    easy: {
        empty: 45,
    },
    medium: {
        empty: 50,
    },
    hard: {
        empty: 60,
    },
    extreme: {
        empty: 65,
    }
}


export type Difficulty = keyof typeof difficulties;
export const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const getAllEmptySquares = (squares: number[][]): [number, number][] => {
    const emptySquares: [number, number][] = [];
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares.length; j++) {
            if (!squares[i]![j]) {
                emptySquares.push([i, j]);
            }
        }
    }
    return emptySquares;
}


export const generateEmptySquares = (size: number = 9): number[][] => {
    const squares: number[][] = [];
    for (let i = 0; i < size; i++) {
        squares.push([]);
        for (let j = 0; j < size; j++) {
            squares[i]!.push(0);
        }
    }
    return squares;
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export class Sudoku {

    private squares: number[][] = [];
    private emptySquares: [number, number][] = []
    private existInRow: Map<number, Map<number, boolean>> = new Map();
    private existInColumn: Map<number, Map<number, boolean>> = new Map();
    private existInBox: Map<number, Map<number, boolean>> = new Map();
    private boxSize: number = 0;

    constructor(squares: number[][]) {
        this.setSquares(squares);
    }

    public setSquares(squares: number[][]): void {
        this.squares = [...squares.map(row => [...row])];
        this.boxSize = Math.floor(Math.sqrt(squares.length));

        this.emptySquares = getAllEmptySquares(squares);
        this.existInRow = new Map(
            this.squares.map((_, i) => [i, new Map(values.map(value => [value, false]))])
        );
        this.existInColumn = new Map(
            this.squares.map((_, j) => [j, new Map(values.map(value => [value, false]))])  // it's a square
        );
        this.existInBox = new Map(
            values.map((_, i) => [i, new Map(values.map(value => [value, false]))])
        );
        // For values in squares, check if it exists in row, column, box. If it does, set to true.
        for (let i = 0; i < squares.length; i++) {
            for (let j = 0; j < squares.length; j++) {
                const value = squares[i]![j]!;
                this.updateExists(i, j, value, value !== 0);
            }
        }
    }


    public getBoxIndex(i: number, j: number): number {
        return Math.floor(i / this.boxSize) * this.boxSize + Math.floor(j / this.boxSize);
    }

    public isValid(i: number, j: number, value: number): boolean {
        return !this.existInRow.get(i)!.get(value) && !this.existInColumn.get(j)!.get(value) && !this.existInBox.get(this.getBoxIndex(i, j))!.get(value);
    }

    public updateExists(i: number, j: number, value: number, status: boolean): void {
        this.existInRow.get(i)!.set(value, status);
        this.existInColumn.get(j)!.set(value, status);
        this.existInBox.get(this.getBoxIndex(i, j))!.set(value, status);
        if (status) {
            this.emptySquares = this.emptySquares.filter(([x, y]) => x !== i || y !== j);
        } else {
            // add in front
            this.emptySquares.unshift([i, j]);
        }
    }

    public getNextEmptySquare(): [number, number] | undefined {
        return this.emptySquares[0];
    }

    public getRandomEmptySquare(): [number, number] | undefined {
        const index = Math.floor(Math.random() * this.emptySquares.length);
        return this.emptySquares[index];
    }

    public async fillOneSquare(test_solution: boolean = true, force_value?: number, _count: number = 0): Promise<[number, number, number]> {
        if (_count > this.squares.length * this.squares.length) {
            throw new Error('No possible value for empty square');
        }

        const [i, j] = this.getRandomEmptySquare()!;

        if (force_value) {
            if (this.isValid(i, j, force_value)) {
                this.setSquare(i, j, force_value);
                return [i, j, force_value];
            }
            return await this.fillOneSquare(test_solution, force_value, _count + 1);
        }

        for (const value of values) {
            if (this.isValid(i, j, value)) {
                this.squares[i]![j] = value;
                this.updateExists(i, j, value, true);

                if (test_solution) {
                    const solution = await this.fake_solve();
                    if (!solution) {
                        // If solution is not found, set value back to 0 and try again.
                        this.squares[i]![j] = 0;
                        this.updateExists(i, j, value, false);
                        continue;
                    }
                }
                return [i, j, value];
            }
        }

        return await this.fillOneSquare(test_solution,force_value, _count + 1);
    }


    public async fake_solve(): Promise<number[][] | null> {
        const fakeSudoku = new Sudoku(this.getSquares());
        const solution = await fakeSudoku.solve();
        if (solution) {
            return solution;
        }
        return null;
    }


    public async solve(updateSquare?: (i: number, j: number, value: number) => void, startIndex: number = 0, _start_date?: number): Promise<number[][] | null> {
        if (!_start_date) 
            _start_date = Date.now();
        
        const time_limit = updateSquare ? 25_000 : 5000; // 5 seconds
        if (Date.now() - _start_date > time_limit) {
            return null;
        }

        if (updateSquare)
            await sleep(1);

        const nextEmptySquare = this.getNextEmptySquare();
        if (!nextEmptySquare) {
            return this.squares;
        }

        const [i, j] = nextEmptySquare;
        const possibleValues = [...values];
        // Move every values before startIndex to the end.
        // If we just place 1,2,3..; it's better to test 4 first.
        for (let k = 0; k < startIndex; k++) {
            possibleValues.push(possibleValues.shift()!);
        }

        for (const value of possibleValues) {
            if (this.isValid(i, j, value)) {
                this.squares[i]![j] = value;
                this.updateExists(i, j, value, true);
                if (updateSquare)
                    updateSquare(i, j, value);

                const result = await this.solve(updateSquare, value, _start_date); // offset by 1
                if (result) {
                    return result;
                }

                // backtrack
                this.squares[i]![j] = 0;
                this.updateExists(i, j, value, false);

                if (updateSquare)
                    updateSquare(i, j, 0);
            }
        }
        return null;
    }

    public getErrorsPositions(): [number, number][] {
        // Find all errors, there is an error if a value is present more than once in a row, column or box.
        const errors:[number, number][] = [];
        
        // Count how many times each value appears in a row, column or box.
        const countInRow = new Map(
            this.squares.map((_, i) => [i, new Map(values.map(value => [value, 0]))])
        );
        const countInColumn = new Map(
            this.squares.map((_, j) => [j, new Map(values.map(value => [value, 0]))])
        );
        const countInBox = new Map(
            values.map((_, i) => [i, new Map(values.map(value => [value, 0]))])
        );

        // For values in squares, check if it exists in row, column, box. If it does, set to true.
        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares.length; j++) {
                const value = this.squares[i]![j]!;
                if (value !== 0) {
                    countInRow.get(i)!.set(value, countInRow.get(i)!.get(value)! + 1);
                    countInColumn.get(j)!.set(value, countInColumn.get(j)!.get(value)! + 1);
                    countInBox.get(this.getBoxIndex(i, j))!.set(value, countInBox.get(this.getBoxIndex(i, j))!.get(value)! + 1);
                }
            }
        }
        // Find all errors
        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares.length; j++) {
                const value = this.squares[i]![j]!;
                if (value !== 0) {
                    if (countInRow.get(i)!.get(value)! > 1 || countInColumn.get(j)!.get(value)! > 1 || countInBox.get(this.getBoxIndex(i, j))!.get(value)! > 1) {
                        errors.push([i, j]);
                    }
                }
            }
        }
        return errors;
    }



    public getSquares(): number[][] {
        return this.squares;
    }

    public setSquare(i: number, j: number, value: number): void {
        // If value is not in values, set to 0.
        if (!value || !values.includes(value)) {
            value = 0;
        }
        this.squares[i]![j] = value;
        this.updateExists(i, j, value, value !== 0);
    }

    public async generate(difficulty: Difficulty, _start_date?: number): Promise<void> {
        if (!_start_date) 
            _start_date = Date.now();
        
        const time_limit = 5000; // 5 seconds
        if (Date.now() - _start_date > time_limit) {
            this.setSquares(generateEmptySquares(this.squares.length));
            throw new Error('Time limit exceeded');
        }

        try {
            const totalSquares = this.squares.length * this.squares.length;
            const toAdd = totalSquares - difficulties[difficulty].empty;
            // Reset all squares to 0
            this.setSquares(generateEmptySquares(this.squares.length));
            const neededValues = [...values];
            // Fill empty squares
            for (let i = 0; i < toAdd; i++) {
                const value = neededValues.pop();
                await this.fillOneSquare(false, value);
            }

            const squaresCopy = this.squares.map(row => [...row]);

            const solution = await this.solve();
            if (!solution) {
                return await this.generate(difficulty, _start_date);
            }

            // If everything is ok, set the solution to the squares
            this.setSquares(squaresCopy);

        } catch (e) {
            return await this.generate(difficulty, _start_date);
        }
    }


}
