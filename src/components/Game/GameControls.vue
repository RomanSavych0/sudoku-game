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
      score


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