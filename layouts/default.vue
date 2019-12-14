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
    const episodes = await this.$axios.get("api/episodes?lastUpdated=" + this.$store.getters.timestamp);
    Episode.insert({data: episodes.data});
    this.$store.commit("updateTimestamp");
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