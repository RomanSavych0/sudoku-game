<template>
<!--  <div class="game-controls">-->
<!--    <div class="timer-display">-->
<!--      ⏱ {{ formattedTime }}-->
<!--      <span v-if="gameCompleted" class="game-status">COMPLETED!</span>-->
<!--    </div>-->
<!--    <v-btn-->
<!--        icon-->
<!--        :disabled="hintCount >= MAX_AVAILABLE_HINTS || hasErrors || gameCompleted"-->
<!--        @click="getHint"-->
<!--    >-->
<!--      <v-icon>mdi-lightbulb-on</v-icon>-->
<!--      <span class="hint-counter">{{ MAX_AVAILABLE_HINTS - hintCount }}</span>-->
<!--    </v-btn>-->
<!--  </div>-->
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
// import { MAX_AVAILABLE_HINTS } from "../../const/difficulty.js";

const store = useStore();

// Computed properties
const formattedTime = computed(() => store.getters.formattedTime);
const gameCompleted = computed(() => store.state.gameCompleted);
const hasErrors = computed(() => store.getters.isAnyErrors);
const hintCount = computed(() => store.state.hintsUsed);
</script>