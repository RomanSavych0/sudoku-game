<template>
  <div class="mt-3">
    <GameControls/>
    <div class="game-board-wrapper">
      <div>
        <div class="game-board mt-3">
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
    <Leaderboard/>
    </div>


  </div>
</template>

<script lang="ts" >
import {defineComponent, computed, onMounted, onUnmounted} from 'vue';
import {useStore} from 'vuex';
import Cell from './Cell.vue';
import {useSudoku} from "@/hooks/useSudoku.js";
import {VBtn} from 'vuetify/components';
import {VIcon} from 'vuetify/components';

import GameControls from "@/components/Game/GameControls.vue";
import Leaderboard from "../Leaderboard/Leaderboard.vue";


export default defineComponent({
  emits: [],

  components: {
    Leaderboard,
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

    const grid = computed(() => store.state.grid);


    const completedSubgrids = computed(() => store.getters.completedSubGrids);

    const getCellClass = (rowIndex :number, colIndex :number) => {
      const subgridIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3); // Calculate subgrid index (0-8)
      return completedSubgrids.value.includes(subgridIndex) ? 'completed-row-animation' : '';
    };


    const generateAndSetGrid = () => {
      const {generateSudoku} = useSudoku();
      const generatedGrid = generateSudoku("beginner");

      store.commit("setGrid", generatedGrid);
    };


    onMounted(() => {
      store.commit('setTime', 0);
      store.commit('resetHints');
      store.commit('updateScore', 0);
      store.dispatch("startGameTimer")
      store.commit("startTimer")
      generateAndSetGrid();

    });


    const getHint = () => {
      store.dispatch('provideHint');
    };


    const updateCell = (rowIndex:number, colIndex:number, value:string) => {
      // Check if the cell is editable before updating
      const cell = grid.value[rowIndex][colIndex];
      if (cell.editable) {

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
.game-board-wrapper{
  display: flex;
  justify-content: center;
  column-gap: 10px;
}
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
  grid-template-rows: repeat(9, 1fr);
  gap: 0px;
  width: 450px;
  height: 360px;
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

.row {
  border-left: 2px solid #000; /* Add border to every 3rd child */
}

game-board > .row:nth-child(1) {
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
