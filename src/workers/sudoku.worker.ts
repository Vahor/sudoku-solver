import { expose } from "comlink";
import { solveSudoku } from "../utils/sudoku";

const sudokuApi = {
    solveSudoku
};

export interface SudokuApi {
    solveSudoku: typeof solveSudoku;
}


expose(sudokuApi);
