<template>
  <div class="game-controls">
    <div>
      Level : {{difficulty}}
    </div>
    <div>
      Score: {{score}}
    </div>
    <div class="timer-display">
      ⏱ {{ formattedTime }}
      <span v-if="gameCompleted" class="game-status">COMPLETED!</span>
    </div>
    <div class="timer-display">
     Hint({{ MAX_AVAILABLE_HINTS - hintCount }})
    </div>

    <v-btn
        icon
        :disabled="hintCount >= MAX_AVAILABLE_HINTS || hasErrors || gameCompleted"
        @click="getHint"
        class="hint-btn"
    >
      <v-icon icon="mdi-lightbulb-on"></v-icon>
    </v-btn>
    <div>
      <v-btn @click="undo" :disabled="!canUndo">Undo</v-btn>
      <v-btn @click="redo" :disabled="!canRedo">Redo</v-btn>
    </div>
  </div>

</template>

<script>
import {computed, defineComponent} from "vue";
import { useStore } from "vuex";
import {MAX_AVAILABLE_HINTS} from "../../const/difficulty";
import {VBtn, VIcon} from "vuetify/components";
export default defineComponent({
  emits:[],
  components:{
    VBtn,
    VIcon
  },
  setup(){
    const store = useStore();
    const canUndo = computed(() => store.state.currentStep > 0);
    const canRedo = computed(() =>
        store.state.currentStep < store.state.history.length - 1
    );
    const undo = () => store.dispatch('undo');
    const redo = () => store.dispatch('redo');
// Computed properties
    const formattedTime = computed(() => store.getters.formattedTime);
    const gameCompleted = computed(() => store.state.gameCompleted);
    const hasErrors = computed(() => store.getters.isAnyErrors);
    const hintCount = computed(() => store.state.hintsUsed);
    const difficulty = computed(() => store.state.difficulty);
    const score =computed(() => store.state.score);
    const getHint = () => {
      store.dispatch('provideHint'); // Dispatch the action to provide a hint
    };

    return {
      formattedTime,
      gameCompleted,
      hasErrors,
      hintCount,
      MAX_AVAILABLE_HINTS,
      getHint,
      difficulty,
      score,
      canUndo,
      canRedo,
      undo,
      redo


    }

  }
})


</script>
<style scoped >
.game-controls{
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 19px;
  padding: 10px 0;
  border-top :1px solid grey;
  border-bottom: 1px solid grey;
}
.hint-btn{
  width: 30px;
  height: 30px;

}
</style>