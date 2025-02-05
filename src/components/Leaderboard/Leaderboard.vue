<template>
  <div class="leaderboard">
    <div class="leaderboard-header">
      🏆 <span>Leaderboard:</span>
    </div>
    <div v-for="section in formattedLeaderboard" :key="section.rank" class="leaderboard-section">
      <h3>{{ section.rank }}</h3>
      <ul>
        <li v-for="player in section.players" :key="player">
          {{ player }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent} from "vue";
import {useStore} from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();

    const formattedLeaderboard = computed(() => {
      const leaderboard = store.state.leaderboard;

      const groupedLeaderboard = leaderboard.reduce((acc, entry) => {
        if (!acc[entry.rank]) {
          acc[entry.rank] = [];
        }
        acc[entry.rank].push(entry);
        return acc;
      }, {});

      return Object.entries(groupedLeaderboard).map(([rank, players]) => ({
        rank: rank.toUpperCase(),
        players: players
            .sort((a, b) => b.score - a.score)
            .map((p, index) => `${index + 1}. ${p.score} - ${p.username}`)
      }));
    });

    return {
      formattedLeaderboard
    };
  }
});
</script>

<style scoped>
.leaderboard {
  max-width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  font-family: Arial, sans-serif;
}

.leaderboard-header {
  background: black;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.leaderboard-header span {
  margin-left: 5px;
}

.leaderboard-section {
  margin-top: 15px;
}

h3 {
  font-size: 1rem;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
}

ul {
  list-style: none;
  padding-left: 10px;
}

li {
  font-size: 0.9rem;
  color: #555;
  padding: 4px 0;
}
</style>
