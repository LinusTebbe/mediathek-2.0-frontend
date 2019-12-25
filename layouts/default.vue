<template>
  <div>
    <nav>
      <font-awesome-icon class="left-icon" v-if="canGoBack" @click="back()" icon="arrow-left" />
      <font-awesome-icon class="left-icon" v-else @click="search()" icon="search"/>
      <span class="title">
        <b>Mediathek</b>.alieris.de
      </span>
      <font-awesome-icon
        class="right-icon"
        @click="logout()"
        icon="sign-out-alt"
      />
    </nav>
    <nuxt />
  </div>
</template>

<script>
import Episode from "~/models/Episode";
import Show from "~/models/Show";

export default {
  name: "default",
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
      this.$router.push({ name: "search" });
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
        Show.update({
          where: update.data.sucribtions,
          data: { isSubscribed: true }
        });

        Show.insert({ data: update.data.shows });

        Episode.query().where("newProgress", 1).get().forEach(episode => {
            this.$axios.put(`/api/episodes/${episode.videoId}/viewing_progress`, {
                progress: episode.progress
              }).then(() =>
                Episode.update({
                  where: episode.videoId,
                  data: { newProgress: false }
                })
              );
          });
        Show.query().where("synced", false).get().forEach(show => {
            this.$axios.put(`/api/shows/${show.id}/subscribe`, {
                isSubscribed: show.isSubscribed,
                show_id: show.id
              })
              .then(() =>
                Show.update({
                  where: show.id,
                  data: { synced: true }
                })
              );
          });

        this.$store.commit("updateTimestamp");

      } catch (error) {
        console.error("could not sync offline data: " + error);
      }
    });
  }
};
</script>

<style scoped lang="scss">
nav {
  display: flex;
  .left-icon {
    margin-left: 5px;
    cursor: pointer;
    height: 1.5rem;
  }
  .title {
    margin-left: 5px;
  }
  .right-icon {
    cursor: pointer;
    margin-left: auto;
    padding-left: 5px;
    height: 1.5rem;
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
</style>