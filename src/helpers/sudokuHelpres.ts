// src/helpers/sudokuHelpers.ts
import { type CellState } from "../types";

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
    // Stochastic solver implementation
    const TEMPERATURE_START = 1.0;
    const COOLING_RATE = 0.999;
    const MAX_ITERATIONS = 100000;

    // Create working copy
    const workingGrid = grid.map(row =>
        row.map(cell => ({ ...cell }))
    );

    // Initialize valid subgrids
    const initializeSubgrids = () => {
        for (let gridRow = 0; gridRow < 3; gridRow++) {
            for (let gridCol = 0; gridCol < 3; gridCol++) {
                const numbers = ['1','2','3','4','5','6','7','8','9']
                    .sort(() => Math.random() - 0.5);

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const row = gridRow * 3 + i;
                        const col = gridCol * 3 + j;
                        workingGrid[row][col].value = numbers[i*3+j];
                    }
                }
            }
        }
    };

    // Calculate conflicts
    const calculateEnergy = (): number => {
        let conflicts = 0;
        for (let i = 0; i < 9; i++) {
            const row = new Set();
            const col = new Set();

            for (let j = 0; j < 9; j++) {
                // Row conflicts
                if (row.has(workingGrid[i][j].value)) conflicts++;
                else row.add(workingGrid[i][j].value);

                // Column conflicts
                if (col.has(workingGrid[j][i].value)) conflicts++;
                else col.add(workingGrid[j][i].value);
            }
        }
        return conflicts;
    };

    // Random swap within subgrid
    const randomSwap = () => {
        const subgridRow = Math.floor(Math.random() * 3) * 3;
        const subgridCol = Math.floor(Math.random() * 3) * 3;

        let cell1, cell2;
        do {
            const x1 = subgridRow + Math.floor(Math.random() * 3);
            const y1 = subgridCol + Math.floor(Math.random() * 3);
            const x2 = subgridRow + Math.floor(Math.random() * 3);
            const y2 = subgridCol + Math.floor(Math.random() * 3);

            cell1 = workingGrid[x1][y1];
            cell2 = workingGrid[x2][y2];
        } while (cell1.value === cell2.value);

        // Swap values
        [cell1.value, cell2.value] = [cell2.value, cell1.value];
    };

    // Main solving loop
    initializeSubgrids();
    let energy = calculateEnergy();
    let temp = TEMPERATURE_START;

    for (let i = 0; i < MAX_ITERATIONS && energy > 0; i++) {
        const prevEnergy = energy;
        const prevGrid = JSON.parse(JSON.stringify(workingGrid));

        randomSwap();
        energy = calculateEnergy();

        const delta = energy - prevEnergy;
        if (delta >= 0 && Math.random() >= Math.exp(-delta / temp)) {
            // Revert swap
            workingGrid.forEach((row, i) => row.forEach((cell, j) => {
                cell.value = prevGrid[i][j].value;
            }));
            energy = prevEnergy;
        }

        temp *= COOLING_RATE;
    }

    // Update original grid if solved
    if (energy === 0) {
        grid.splice(0, grid.length, ...workingGrid);
        return true;
    }

    return false;
};