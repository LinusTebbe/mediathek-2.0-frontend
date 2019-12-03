<template>
  <div class="main-container">
    <div>
      <h1>Suche</h1>
      <div class="search">
        <div>
          <input v-model="searchTerm" />
          <button @click="search()">Suchen</button>
        </div>
        <div>Dropdown</div>
      </div>
    </div>
    <div>
      <div v-for="result of results" :key="result.title">
        <h2>{{result.title}}</h2>
        <div class="card-container">
          <Episode-card v-for="episode in result.episodes" :episode="episode" :key="episode.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Show from "~/models/Show";
import EpisodeCard from "~/components/episode-card";

export default {
  name: "search",
  components: { EpisodeCard },
  data: function() {
    return {
      searchTerm: this.$route.query.s || ""
    };
  },
  computed: {
    results: function() {
      const result = Show.query()
        .with("episodes", query => {
          query.search(this.searchTerm, {
            keys: ["title", "description"]
          });
        })
        .get();
      console.log(result);
      return result.filter(show => show.episodes.length > 1);
    }
  },
  methods: {
    subscribe: function() {}
  },
  watch: {
    page: async function() {
      this.$router.replace({
        name: "show-id",
        query: { page: this.page },
        params: { id: this.showID }
      });
    }
  },
  search() {},
  watchQuery(newQuery) {
    this.searchTerm = newQuery.s || "";
  }
};
</script>

<style scoped lang="scss">
.main-container {
  padding: 1rem;
}
input {
  padding: 0.3rem;
  border-radius: 3px;
  border-color: grey;
}

.search {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.card-container {
  .card {
    min-width: 30%;
    margin: 1rem;
    margin-bottom: auto;
    height: auto;
  }
  height: 100%;
  display: flex;
  align-items: stretch;
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
}
</style>
