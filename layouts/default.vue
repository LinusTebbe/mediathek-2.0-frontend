<template>
  <div>
    <nav>
      <font-awesome-icon class="left-icon" v-if="canGoBack" @click="back()" icon="arrow-left" />
      <span class="title">mediathek.alieris.dev</span>
      <font-awesome-icon class="right-icon" @click="logout()" icon="sign-out-alt" />
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
      window.location = "/login"
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
        Episode.query()
          .where("synced", false)
          .get()
          .forEach(episode => {
            this.$axios
              .put(`/api/episodes/${episode.id}/viewing_progress`, {
                progress: episode.progress
              })
              .then(() =>
                Episode.update({
                  where: episode.id,
                  data: { synced: true }
                })
              );
          });
        Show.query()
          .where("synced", false)
          .get()
          .forEach(show => {
            this.$axios
              .put(`/api/shows/${show.id}/subscribe`, {
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

        const update = await this.$axios.get(
          "api/getUpdates?lastUpdated=" + (lastUpdated - 180)
        );
        Episode.insert({ data: update.data.episodes });

        Show.insert({ data: update.data.shows });

        Show.update({
          where: show => show.isSubscribed,
          data: { isSubscribed: false }
        });
        Show.update({
          where: show => update.data.subscriptions.includes(show.id),
          data: { isSubscribed: true }
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
    height: 1.8rem;
  }
  .title {
    margin-left: 5px;
  }
  .right-icon {
    cursor: pointer;
    margin-left: auto;
    padding-right: 5px;
    height: 1.8rem;
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