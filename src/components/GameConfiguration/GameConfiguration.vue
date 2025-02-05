<template>
  <div class="form-wrapper">
    <v-select
        label="Select difficulty"
        :items="difficultyItems"
        v-model="difficulty"
        messages=""
        hide-details
    ></v-select>
    <v-text-field
        :rules="rules"
        hide-details="auto"
        label="Username"
        v-model="username"
    ></v-text-field>
  <v-btn @click="onSubmit">
    Start
  </v-btn>
  </div>
</template>
<script>
import {defineComponent, ref} from "vue";
import {VBtn, VTextField, VSelect} from "vuetify/components";
import {DIFFICULTY} from "@/const/difficulty";
import {useStore} from "vuex";

export default defineComponent({
  components:{
    VSelect,
    VBtn,
    VTextField
  },

  setup(){
    const store = useStore()
    const username = ref("")
    const difficulty = ref("")
  const onSubmit = ()=>{
    store.commit("setDifficulty" , difficulty.value)
    store.commit("setUsername" , username.value)
  }

return {
  difficultyItems: Object.keys(DIFFICULTY),
  username,
  difficulty,
  onSubmit

}
  }
})

</script>
<style scoped>
.form-wrapper{
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  margin-top: 20px;
  row-gap: 10px;
}
</style>