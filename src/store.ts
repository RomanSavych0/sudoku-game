// src/store.ts
import { createStore } from 'vuex'
import {type CellState} from "./types";
import createPersistedState from 'vuex-persistedstate';

export interface GameState {
    grid: CellState[][],
    score: number,
    hintsUsed: number,
    timeElapsed: number,
    leaderboard: { rank: string, score: number  , username:string}[],
    difficulty: 'beginner' | 'intermediate' | 'hard' | 'expert',
    isTimerRunning: boolean,
    gameCompleted: boolean,
    errorsCount: number,
    lastHintPenalty: number,
    scoredCells: Set<string>,
    timerInterval: number | null;
    username:string
}

import {isValid, solveSudoku} from './helpers/sudokuHelpres';
import {MAX_AVAILABLE_HINTS} from "./const/difficulty";

const store = createStore<GameState>({
    state: {
        grid: Array.from({ length: 9 }, () =>
            Array.from({ length: 9 }, () => ({
                value: '',
                editable: true,
                error: false
            }))
        ),
        score: 0,
        hintsUsed: 0,
        timeElapsed: 0,
        leaderboard: [],
        difficulty: 'beginner',
        isTimerRunning: false,
        gameCompleted: false,
        errorsCount: 0,
        lastHintPenalty: 3,
        scoredCells: new Set(),
        timerInterval:null,
        username:""
    },
    mutations: {
        setCellError(state, { row, col, error }) {
            state.grid[row][col].error = error;
        },
        setUsername(state , username:string){
        state.username = username;
        },

        checkForCompletion(state) {
            const isComplete = state.grid.flat()
                .every(cell => cell.value && !cell.error);
            if (isComplete && !state.gameCompleted) {
                state.gameCompleted = true;
                state.isTimerRunning = false;
                const timeBonus = 500 - state.timeElapsed;

                state.score += Math.max(timeBonus, 0);

                state.leaderboard.push({
                    username:state.username,
                    score:state.score,
                    rank:state.difficulty
                })
                // Clear the interval
                if (state.timerInterval) {
                    clearInterval(state.timerInterval);
                    state.timerInterval = null;
                }

                // Add time bonus
            }
        },
        incrementHintsUsed(state) {
            if (state.hintsUsed < MAX_AVAILABLE_HINTS) {
                // Calculate penalty: 3, 4, 5... sequence
                const penalty = 2 + state.hintsUsed;
                state.hintsUsed++;
                console.log('penalty' , penalty)
                console.log('state.score' , state.score - penalty)
                state.score = state.score  -  penalty;
                state.lastHintPenalty = penalty;
            }
        },
        resetHints(state) {
            state.hintsUsed = 0;
            state.lastHintPenalty = 3;
        },
        updateCell(state, { row, col, value , updateScore = true  }) {
            const valid = value.value ?
                isValid(state.grid, row, col, value.value) : true;

            // Track cell scoring
            const cellKey = `${row}-${col}`;
            if (value.value && !state.scoredCells.has(cellKey)) {
                state.scoredCells.add(cellKey);
                if(updateScore && valid){
                    state.score += 5;

                }
            }

            // Track errors
            if (!valid && value.value) {
                state.errorsCount++;
                state.score -= 1;
            }

            state.grid = state.grid.map((r, rIdx) => {
                if (rIdx !== row) return r;
                return r.map((c, cIdx) => {
                    if (cIdx !== col) return { ...c };
                    return {
                        ...c,
                        ...value,
                        error: !valid
                    };
                });
            });
            store.commit('checkForCompletion');

        },
        updateScore(state, points: number) {
            state.score += points;
        },
        setGrid(state, newGrid) {
            state.grid = newGrid.map(row =>
                row.map(cell => ({ ...cell }))
            );
        },
        setTime(state, time: number) {
            state.timeElapsed = time;
        },
        setDifficulty(state, difficulty) {
            state.difficulty = difficulty;
        },
        updateLeaderboard(state, newRecord) {
            state.leaderboard.push(newRecord);
            state.leaderboard.sort((a, b) => b.score - a.score);
            if (state.leaderboard.length > 3) {
                state.leaderboard.pop();
            }
        },
        startTimer(state) {
            state.isTimerRunning = true;
        },
        pauseTimer(state) {
            state.isTimerRunning = false;
        },
        incrementTime(state) {
            if (!state.gameCompleted && state.isTimerRunning) {
                state.timeElapsed++;
            }
        },
    },
    actions: {
        async submitScore({ commit, state }, score: number) {
            const newRecord = { rank: state.difficulty, score };
            commit('updateLeaderboard', newRecord);
        },

        async provideHint({ commit, state, dispatch }) {
            if (state.hintsUsed >= MAX_AVAILABLE_HINTS || state.gameCompleted) return;

            commit('incrementHintsUsed');

            const clonedGrid = JSON.parse(JSON.stringify(state.grid));
            solveSudoku(clonedGrid);

            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (!state.grid[row][col].value) {
                        commit('updateCell', {
                            row,
                            col,
                            value: {
                                value: clonedGrid[row][col].value.toString(),
                                editable: true,
                                error: false
                            },
                            updateScore:false

                        });
                        return;
                    }
                }
            }

        },

        startGameTimer({ commit, state }) {
            if (state.timerInterval) {
                clearInterval(state.timerInterval);
            }

            const timer = setInterval(() => {
                if (!state.gameCompleted) {
                    commit('incrementTime');
                }
            }, 1000);

            state.timerInterval = timer;

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    commit('pauseTimer');
                } else if (!state.gameCompleted) {
                    commit('startTimer');
                }
            });
        },
    },
    getters: {
        topLeaderboard(state) {
            return state.leaderboard;
        },
        isAnyErrors: (state) => {
            return state.grid.some(row =>
                row.some(cell => cell.error)
            );
        },
        completedSubGrids(state) {
            const completedSubgrids = [];
            for (let gridRow = 0; gridRow < 3; gridRow++) {
                for (let gridCol = 0; gridCol < 3; gridCol++) {
                    const startRow = gridRow * 3;
                    const startCol = gridCol * 3;
                    let isComplete = true;

                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            const cell = state.grid[startRow + i][startCol + j];
                            if (!cell.value || cell.error) {
                                isComplete = false;
                                break;
                            }
                        }
                        if (!isComplete) break;
                    }

                    if (isComplete) {
                        completedSubgrids.push(gridRow * 3 + gridCol);
                    }
                }
            }
            return completedSubgrids;
        },
        availableDigits: (state) => {
            const digitCounts = new Array(9).fill(0);
            const maxPossible = new Array(9).fill(9);

            state.grid.forEach(row => {
                row.forEach(cell => {
                    const num = parseInt(cell.value, 10);
                    if (!isNaN(num) && num >= 1 && num <= 9) {
                        digitCounts[num - 1]++;
                    }
                });
            });

            return Array.from({ length: 9 }, (_, i) => ({
                digit: i + 1,
                available: digitCounts[i] < maxPossible[i],
                count: digitCounts[i],
                max: maxPossible[i]
            }));
        },
        formattedTime: (state) => {
            const minutes = Math.floor(state.timeElapsed / 60);
            const seconds = state.timeElapsed % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    },
    plugins: [
        createPersistedState({
            key: 'sudoku-game',
            paths: ['leaderboard'],
        }),
    ],
});

export default store;