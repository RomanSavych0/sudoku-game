// src/composables/useSudoku.ts
import { ref } from 'vue';
import type { CellState } from "../types";
import { DIFFICULTY } from "../const/difficulty";
import { solveSudoku } from "../helpers/sudokuHelpres";

export const useSudoku = () => {
    const grid = ref<CellState[][]>([]);

    const generateSudoku = (difficulty: 'beginner' | 'intermediate' | 'hard' | 'expert') => {
        // 1. Create a fresh grid with proper reactivity
        const newGrid: CellState[][] = Array.from({ length: 9 }, () =>
            Array.from({ length: 9 }, () => ({
                value: '', // Use empty string instead of null
                editable: true,
                error: false,
            }))
        );

        // 2. Solve the grid with proper cloning
        const gridToSolve = newGrid.map(row =>
            row.map(cell => ({ ...cell }))
        );
        solveSudoku(gridToSolve);

        // 3. Create a new reactive grid structure
        const solvedGrid = gridToSolve.map(row =>
            row.map(cell => ({
                ...cell,
                editable: cell.value === '', // Set editable based on value
            }))
        );
        console.log('difficulty' , difficulty)
        // 4. Remove cells based on difficulty
        const { min, max } = DIFFICULTY[difficulty];
        const totalFilledCells = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log('totalFilledCells' , totalFilledCells)
        let cellsToRemove = 81 - totalFilledCells;

        while (cellsToRemove > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (solvedGrid[row][col].value !== '') {
                solvedGrid[row][col] = {
                    ...solvedGrid[row][col],
                    value: '',
                    editable: true
                };
                cellsToRemove--;
            }
        }

        // 5. Update the reactive grid value
        grid.value = solvedGrid.map(row =>
            row.map(cell => ({ ...cell }))
        );

        return grid.value;
    };

    return {
        grid,
        generateSudoku,
    };
};