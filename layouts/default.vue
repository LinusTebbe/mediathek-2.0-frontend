<template>
  <div>
    <nav>
      <div>
        <font-awesome-icon v-if="canGoBack" @click="back()" class="back" icon="arrow-left" />
      </div>
      <span class="title">
        <b>Mediathek</b>.alieris.de
      </span>
      <font-awesome-icon style="cursor: pointer" @click="SidebarVisible = !SidebarVisible" icon="bars" />
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
    search : function () {
      this.$router.push({ name: "search", query: { s: this.searchTerm } });
    }
  },
  async mounted() {
    this.$store.commit("updateTimestamp");
  }
};
</script>

<style scoped lang="scss">
nav {
  display: grid;
  align-items: center;
  grid-template-columns: 3rem 1fr 3rem;

  position: sticky;
  top: 0;
  z-index: 5;
  height: 3rem;

  background: var(--nav-background-color);
  color: var(--text-secondry-color);
  font-size: 2rem;
}

.title {
  margin-top: 0.1rem;
}
.back {
  cursor: pointer;
}

.sidebar {
  width: 25rem;
  position: fixed;
  top: 3rem;
  left: -26rem;
  background: white;
  z-index: 5;
  padding: 1rem;
  height: 100vh;
  transition: all 0.5s;
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