// src/helpers/sudokuHelpers.ts
import { type CellState } from "../types.ts";

export const getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const isValid = (grid: CellState[][], row: number, col: number, num: number): boolean => {
    const numStr = num.toString();

    // Check row
    for (let i = 0; i < 9; i++) {
        if (grid[row][i].value === numStr && i !== col) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
        if (grid[i][col].value === numStr && i !== row) return false;
    }

    // Check subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (grid[i][j].value === numStr && (i !== row || j !== col)) return false;
        }
    }

    return true;
};

export const solveSudoku = (grid: CellState[][]): boolean => {
    // Create a deep clone to avoid mutating original grid
    const workingGrid = grid.map(row =>
        row.map(cell => ({ ...cell }))
    );

    const backtrack = (): boolean => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (!workingGrid[row][col].value) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(workingGrid, row, col, num)) {
                            workingGrid[row][col] = {
                                ...workingGrid[row][col],
                                value: num.toString()
                            };

                            if (backtrack()) return true;

                            workingGrid[row][col] = {
                                ...workingGrid[row][col],
                                value: ''
                            };
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    const solved = backtrack();

    // Update original grid only if solved
    if (solved) {
        grid.splice(0, grid.length, ...workingGrid.map(row =>
            row.map(cell => ({ ...cell }))
        ));
    }

    return solved;
};