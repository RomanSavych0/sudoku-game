import { describe, it, expect } from 'vitest';
import {CellState} from "../../src/types";
import {useSudoku} from "../../src/hooks/useSudoku";
import {DIFFICULTY} from "../../src/const/difficulty";
import {solveSudoku} from "../../src/helpers/sudokuHelpres";


// Helper function to validate grid structure
const validateGridStructure = (grid: CellState[][]) => {
    expect(grid).toHaveLength(9);
    grid.forEach(row => {
        expect(row).toHaveLength(9);
        row.forEach(cell => {
            expect(cell).toEqual({
                value: expect.any(String),
                editable: expect.any(Boolean),
                error: expect.any(Boolean)
            });
        });
    });
};

// Helper function to count filled cells
const countFilledCells = (grid: CellState[][]) => {
    return grid.flat().filter(cell => cell.value !== '').length;
};

// Helper function to check grid validity
const isValidGrid = (grid: CellState[][]) => {
    // Check rows
    for (const row of grid) {
        const values = row.map(cell => cell.value).filter(v => v !== '');
        if (new Set(values).size !== values.length) return false;
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
        const values = [];
        for (let row = 0; row < 9; row++) {
            const val = grid[row][col].value;
            if (val !== '') values.push(val);
        }
        if (new Set(values).size !== values.length) return false;
    }

    // Check subgrids
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            const values = [];
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    const val = grid[i + x][j + y].value;
                    if (val !== '') values.push(val);
                }
            }
            if (new Set(values).size !== values.length) return false;
        }
    }

    return true;
};
// npm test -- -t "generates valid grid structure"

describe('useSudoku', () => {
    it('generates valid grid structure', () => {
        const { generateSudoku } = useSudoku();
        const grid = generateSudoku('beginner');
        validateGridStructure(grid);
    });

    it('generates solvable puzzles', () => {
        const { generateSudoku } = useSudoku();
        const difficulties = Object.keys(DIFFICULTY) as Array<keyof typeof DIFFICULTY>;

        difficulties.forEach(difficulty => {
            const grid = generateSudoku(difficulty);
            const gridCopy = JSON.parse(JSON.stringify(grid));
            const solved = solveSudoku(gridCopy);

            expect(solved).toBe(true);
            expect(isValidGrid(gridCopy)).toBe(true);
        });
    });

    it('respects difficulty levels', () => {
        const { generateSudoku } = useSudoku();
        const difficulties = Object.entries(DIFFICULTY) as Array<
            [keyof typeof DIFFICULTY, { min: number; max: number }]
        >;

        difficulties.forEach(([difficulty, { min, max }]) => {
            const grid = generateSudoku(difficulty);
            const filled = countFilledCells(grid);

            expect(filled).toBeGreaterThanOrEqual(min);
            expect(filled).toBeLessThanOrEqual(max);
        });
    });

    it('marks pre-filled cells as non-editable', () => {
        const { generateSudoku } = useSudoku();
        const grid = generateSudoku('intermediate');

        grid.flat().forEach(cell => {
            if (cell.value !== '') {
                expect(cell.editable).toBe(false);
            } else {
                expect(cell.editable).toBe(true);
            }
        });
    });

    it('generates valid initial puzzle', () => {
        const { generateSudoku } = useSudoku();
        const grid = generateSudoku('hard');
        expect(isValidGrid(grid)).toBe(true);
    });

    it('generates unique puzzles', () => {
        const { generateSudoku } = useSudoku();
        const grid1 = generateSudoku('expert');
        const grid2 = generateSudoku('expert');

        // Check if at least one cell is different
        let differences = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid1[i][j].value !== grid2[i][j].value) differences++;
            }
        }

        expect(differences).toBeGreaterThan(0);
    });
});