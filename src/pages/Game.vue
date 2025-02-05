
<template>
  <GameBoard v-if="username && difficulty"/>
  <GameConfiguration v-else/>
</template>


<script setup>
import GameBoard from "../components/Game/GameBoard.vue";
import GameConfiguration from "@/components/GameConfiguration/GameConfiguration.vue";
import {useStore} from "vuex";
import {computed} from "vue";
const store = useStore();

// Computed properties
const username = computed(() => store.state.username);
const difficulty = computed(() => store.state.difficulty);

</script>
<style scoped>

.read-the-docs {
  color: #888;
}
</style>>