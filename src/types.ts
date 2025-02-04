export interface CellState {
    value: string | null;  // The value of the cell, could be a number or null if empty
    editable: boolean;     // Whether the cell is editable or not
    error: boolean;        // If the cell has an error (for styling, validation, etc.)
}