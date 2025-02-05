// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import store from './store'; // Import the Vuex store


const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});
import { aliases, mdi } from 'vuetify/iconsets/mdi'

createApp(App)
    .use(vuetify)      // Use Vuetify for UI components
    .use(store)        // Use Vuex store for state management
    .mount('#app');    // Mount the app to the DOM
