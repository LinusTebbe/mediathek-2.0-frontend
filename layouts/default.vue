<template>
  <div>
    <nav>
      <font-awesome-icon class="back-icon" v-if="canGoBack" @click="back()" icon="arrow-left" />
      <span class="title">
        <b>Mediathek</b>.alieris.de
      </span>
      <font-awesome-icon
        class="sidebar-toggle"
        @click="SidebarVisible = !SidebarVisible"
        icon="bars"
      />
    </nav>
    <div class="sidebar" v-bind:class="{ show: SidebarVisible   }">
      <div class="sidebar-element">
        <div>Folgen suchen:</div>
        <input v-model="searchTerm" />
        <button @click="search()">Suchen</button>
      </div>
      <div class="sidebar-element">
        <div>Eingelogt als: {{this.$auth.user.name}}</div>
        <button @click="logout()">Logout</button>
      </div>
    </div>
    <nuxt />
  </div>
</template>

<script>
import Episode from "~/models/Episode";
import Show from "~/models/Show";

export default {
  name: "default",
  data: function() {
    return {
      searchTerm: "",
      SidebarVisible: false
    };
  },
  computed: {
    canGoBack: function() {
      return this.$route.name !== "index";
    }
  },
  methods: {
    back: () => window.history.back(),
    logout: async function() {
      await this.$auth.logout();
      this.$router.go({ name: "login" });
    },
    search: function() {
      this.$router.push({ name: "search", query: { s: this.searchTerm } });
    }
  },
  async mounted() {
    window.requestIdleCallback(async () => {
      const lastUpdated = this.$store.getters.lastUpdated;
      const timeSinceLastUpdate = Math.floor(Date.now() / 1000) - lastUpdated;
      if (timeSinceLastUpdate < 60) {
        console.info(`last update was ${timeSinceLastUpdate}sec ago`);
        return 0;
      }
      try {
        const update = await this.$axios.get(
          "api/getUpdates?lastUpdated=" + (lastUpdated - 180)
        );
        Episode.insert({ data: update.data.episodes });
        
        Show.update({
          where: show => show.isSubscribed,
          data: { isSubscribed: false }
        });
        Show.update({where: update.data.sucribtions, data: {isSubscribed: true}})

        Show.insert({ data: update.data.shows });
        this.$store.commit("updateTimestamp");

        Episode.query().where("newProgress", 1).get().forEach(episode => {
            this.$axios.put(`/api/episodes/${episode.videoId}/viewing_progress`, {
                progress: episode.progress
              });
            Episode.update({
              where: episode.videoId,
              data: { newProgress: false }
            });
          });
      } catch (error) {
        console.error("could not sync viewing progress: " + error);
      }
    });
  }
};
</script>

<style scoped lang="scss">
nav {
  .back-icon {
    margin-left: 5px;
    cursor: pointer;
  }
  .title {
    margin-left: 5px;
  }
  .sidebar-toggle {
    cursor: pointer;
    position: absolute;
    top: 13px;
    right: 5px;
  }

  align-items: center;

  position: sticky;
  top: 0;
  z-index: 5;
  padding: 5px 0;

  background: var(--nav-background-color);
  color: var(--text-secondry-color);
  font-size: 2rem;
}

.sidebar {
  width: 25rem;
  position: fixed;
  top: 54px;
  left: -25rem;
  background: white;
  z-index: 5;
  padding: 1rem;
  height: 100vh;
  transition: all 0.5s;
  box-sizing: border-box;
}
.sidebar.show {
  left: 0;
  transition: all 0.5s;
}

.sidebar-element {
  div {
    margin: 0.2rem 0;
  }
  input {
    margin: 0.2rem 0;
    width: 100%;
    box-sizing: border-box;
  }
  button {
    width: 100%;
  }
  padding: 0.5rem 0;
  border-bottom: 1px solid black;
}
</style>