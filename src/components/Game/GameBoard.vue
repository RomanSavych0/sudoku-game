<template>
  <div class="mt-3">
    <GameControls/>
    <div class="game-board">
      <div class="row" v-for="(row, rowIndex) in grid" :key="rowIndex">
        <Cell
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :value="cell.value"
            :editable="cell.editable"
            :error="cell.error"
            @update="updateCell(rowIndex, colIndex, $event)"
            :class="getCellClass(rowIndex, colIndex)"
        />
      </div>
    </div>
    <div class="digit-picker">
      <div
          v-for="d in availableDigits"
          :key="d.digit"
          :class="{ 'digit-disabled': !d.available }"
          class="digit"
      >
        {{ d.digit }}
        <div class="digit-progress">{{ d.count }}/{{ d.max }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, onMounted, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import Cell from './Cell.vue';
import { useSudoku } from "../../hooks/useSudoku.ts";
import { VBtn } from 'vuetify/components';
import { VIcon } from 'vuetify/components';
import { MAX_AVAILABLE_HINTS } from "../../const/difficulty.ts";
import GameControls from "./GameControls.vue";



export default defineComponent({
  emits:[],

  components: {
    GameControls,

    Cell,
    VBtn,
    VIcon
  },
  setup() {
    const store = useStore();
    const availableDigits = computed(() => store.getters.availableDigits);
    const gameCompleted = computed(() => store.state.gameCompleted);
    const score = computed(() => store.state.score);
    // Access the grid from Vuex
    const grid = computed(() => store.state.grid);
    let timerInterval: number;

    // Access the completed subgrids from Vuex
    const completedSubgrids = computed(() => store.getters.completedSubGrids);

    // Function to get the class for a cell based on its subgrid completion
    const getCellClass = (rowIndex, colIndex) => {
      const subgridIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3); // Calculate subgrid index (0-8)
      return completedSubgrids.value.includes(subgridIndex) ? 'completed-row-animation' : '';
    };


    // Function to generate Sudoku puzzle and set grid in Vuex
    const generateAndSetGrid = () => {
      const { generateSudoku } = useSudoku();
      const generatedGrid = generateSudoku("beginner");

      store.commit("setGrid", generatedGrid); // Commit the generated grid to Vuex
    };


    // Generate the Sudoku puzzle when component is mounted
    onMounted(() => {
      store.commit('setTime', 0);
      store.commit('resetHints');
      store.commit('updateScore', 0);
      store.dispatch("startGameTimer")
      store.commit("startTimer")
      generateAndSetGrid(); // Initialize the grid when the component mounts

    });

    // Function to request a hint
    const getHint = () => {
      store.dispatch('provideHint'); // Dispatch the action to provide a hint
    };

    // Function to handle cell update
    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
      // Check if the cell is editable before updating
      const cell = grid.value[rowIndex][colIndex];
      if (cell.editable) {
        // Commit the mutation to update the store with new cell value
        store.commit('updateCell', {
          row: rowIndex,
          col: colIndex,
          value: {
            value,
            editable: true,
            error: false
          }
        });
      }
    };

    return {
      grid,
      getHint,
      updateCell,
      getCellClass,
      availableDigits,
      gameCompleted,
    };
  }
});
</script>

<style scoped>

.digit-picker {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 20px 0;
}

.digit {
  width: 40px;
  height: 40px;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.digit:hover {
  background-color: #f0f0f0;
}

.digit-disabled {
  opacity: 0.4;
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.digit-progress {
  font-size: 0.6rem;
  color: #666;
}


  .game-board {
  display: grid;
  grid-template-rows: repeat(9, 1fr);    /* 9 equal rows */
  gap: 0px;
  width: 450px; /* Set the width of the grid */
  height: 360px; /* Set the height of the grid */
  margin: 0 auto;
}

.row {
  display: flex;
  width: 100%;
}

.game-board > .row > .cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}



.game-board > .row:nth-child(3n) > .cell {
  border-bottom: 2px solid #333;
}
.game-board > .row.cell:nth-child(3n) > .cell {
  border-bottom: 2px solid #333;
}
.game-board > .row > .cell:nth-child(3n) {
  border-right: 2px solid #000; /* Add border to every 3rd child */
}
.row{
  border-left: 2px solid #000; /* Add border to every 3rd child */
}
game-board > .row:nth-child(1){
  border-top: 2px solid #000; /* Add border to every 3rd child */
}
.game-board > .row:first-child {
  border-top: 2px solid #000; /* Add border to the top of the first row */
}
.v-btn[disabled] {
  opacity: 0.5; /* Disabled state */
}

.v-icon {
  font-size: 30px; /* Size of the bulb icon */
}
</style>
