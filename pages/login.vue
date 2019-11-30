<template>
  <div class="center">
    <main class="form-container">
      <h3>Log in to your account</h3>
      <div class="form-group">
        <font-awesome-icon icon="user" />
        <label for="email">E-Mail</label>
        <input
          id="email"
          class="form-control"
          placeholder="Email Adress"
          type="email"
          v-model="email"
          v-on:keyup.enter="login"
          tabindex="0"
        />
      </div>
      <div class="form-group">
        <font-awesome-icon icon="lock" />
        <label for="password">Password</label>
        <input
          id="password"
          class="form-control"
          placeholder="Password"
          type="password"
          v-model="password"
          v-on:keyup.enter="login"
          tabindex="0"
        />
      </div>
      <div v-if="loginError">{{loginError}}</div>
      <div>
        <button @click="login" tabindex="0">Login In</button>
      </div>
    </main>
  </div>
</template>

<script>
import Show from "~/models/Show";
import Episode from "~/models/Episode";

export default {
  name: "login",
  layout: "login",
  data: function() {
    return {
      email: "",
      password: "",
      loginError: undefined
    };
  },
  head() {
    return {
      title: "Login"
    };
  },
  methods: {
    async login() {
      const validationMsg = document.getElementById("email").validationMessage;
      if (validationMsg !== "") {
        this.loginError = validationMsg;
        return;
      }
      if (this.password === "") {
        this.loginError = "Password is requierd";
        return;
      }
      try {
        const response = await this.$auth.loginWith("password_grant", {
          data: {
            grant_type: "password",
            client_id: process.env.PASSPORT_PASSWORD_GRANT_ID,
            client_secret: process.env.PASSPORT_PASSWORD_GRANT_SECRET,
            scope: "*",
            username: this.email,
            password: this.password
          }
        });
      } catch (err) {
        this.loginError = err.response.data.error_description;
        return;
      }

      const [shows, episodes] = await Promise.all([
        this.$axios.$get("/api/shows"),
        this.$axios.$get("/api/episodes")
      ]);
      Show.create({ data: shows });
      Episode.create({ data: episodes });
      this.$router.go({name: "index"})
    }
  }
};
</script>

<style scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--btn-background);
}

h3 {
  text-align: center;
  line-height: 1.5;
  font-size: 24px;
  font-weight: 200;
  color: var(--btn-background);
}

.form-container {
  background: white;
  padding: 40px;
  border-radius: 8px;
  width: 25vw;
}

.form-group {
  display: flex;
  align-items: baseline;
  font-size: 14px;
  border: 1px solid #cbcbd2;
  padding: 8px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}
.form-control {
  height: 2rem;
  border: none;
  width: auto;
  margin-left: 6px;
  flex-grow: 1;
}

button {
  width: 100%;
}
label {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
}
</style>