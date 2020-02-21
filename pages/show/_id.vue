<template>
  <div>
    <div id="content">
      <div class="showCol">
        <Show-card :show="show">
          <div class="btn-container">
            <select v-model="episodeType" class="type-select">
              <option value="all">Alle Episoden</option>
              <option value="downlaoded">Heruntergeladene Episoden</option>
            </select>
            <button
              class="btn-left"
              @click="subscribe"
              :class="[show.isSubscribed ? 'Unsubscribe' : '']"
            >
              {{ show.isSubscribed ? "Unsubscribe" : "Subscribe" }}
            </button>
          </div>
        </Show-card>
      </div>
      <Episode-card
        v-for="episode in episodes"
        :episode="episode"
        :key="episode.id"
      />
    </div>
    <Pagination
      :current-page="page"
      :totalPages="totalPages"
      v-on:changePage="page = $event"
    >
      <span>Keine Episoden gefunden</span>
    </Pagination>
  </div>
</template>

<script>
import Show from "~/models/Show";
import Epiosde from "~/models/Episode";

import ShowCard from "~/components/show-card";
import EpisodeCard from "~/components/episode-card";
import Pagination from "~/components/pagination";

export default {
  name: "show",
  components: { Pagination, ShowCard, EpisodeCard },
  data: function() {
    return {
      episodeType: "all",
      showID: this.$route.params.id,
      page: parseInt(this.$route.query.page) || 1,
      episodesPerPage: 10,
      totalPages: 0
    };
  },
  computed: {
    show: function() {
      return Show.find(this.showID);
    }
  },
  asyncComputed: {
    episodes: async function() {
      let episodes = Epiosde.query()
        .where("show_id", this.showID)
        .orderBy("published_at", "desc")
        .orderBy("created_at", "desc")
        .get();

        if(this.episodeType === "downlaoded") {
          const downloaded = await Promise.all(episodes.map(async episode => (await caches.match(episode.video_path)) !== undefined))
          episodes = episodes.filter((episodes, index) => downloaded[index]);
        }

        this.totalPages = Math.ceil(episodes.length / this.episodesPerPage);

        return episodes.slice(
          (this.page - 1) * this.episodesPerPage,
          this.page * this.episodesPerPage
        );
    }
  },
  methods: {
    subscribe: async function() {
      const state = !this.show.isSubscribed;
      try {
        const response = await this.$axios.put(
          `/api/shows/${this.showID}/subscribe`,
          {
            isSubscribed: state,
            show_id: this.showID
          }
        );
        Show.update({
          where: this.showID,
          data: { isSubscribed: state, synced: true }
        });
      } catch (e) {
        Show.update({
          where: this.showID,
          data: { isSubscribed: state, synced: false }
        });
      }
    }
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
  watchQuery(newQuery) {
    this.page = parseInt(newQuery.page) || 1;
  },
  validate({ params }) {
    return Show.find(params.id) !== null;
  }
};
</script>

<style scoped lang="scss">
@media only screen and (min-width: 992px) {
  #content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
    grid-gap: 10px;
    margin: 10px;
  }
}

@media only screen and (max-width: 992px) {
  .card {
    margin: 0.5rem;
  }
  .btn-container {
    height: 2.5rem;
  }
}

.showCol {
  grid-row: span 2;
}

.Unsubscribe {
  background-color: red;
}

.specials-btn {
  button {
    border-radius: 0 0 4px 4px;
  }

  margin-left: 0.5rem;
}

.btn-container {
  .btn-left {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }
  .type-select {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    border-radius: 4px;
    padding: 7px 14px;
    background: var(--background-color);
    border-color: var(--nav-background-color);
    color: var(--text-tertiary-color);
    option {
      background-color: white;
      color: #000;
    }
  }

  min-height: 3rem;
}
</style>
