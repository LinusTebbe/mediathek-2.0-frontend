<template>
    <div>
        <div>
            <label for="email">E-Mail</label>
            <input id="email" v-model="email">
        </div>
        <div>
            <label for="password">Password</label>
            <input id="password" v-model="password">
        </div>
        <div>
            <button @click="login">Login</button>
        </div>
    </div>
</template>

<script>
    import Show from "~/models/Show";
    import Episode from "~/models/Episode";

    export default {
        name: "login",
        template: "login",
        data: function () {
            return {
                email: "",
                password: ""
            }
        },
        methods: {
            login() {
                this.$auth.loginWith('password_grant', {
                    data: {
                        grant_type: 'password',
                        client_id: process.env.PASSPORT_PASSWORD_GRANT_ID.toString(),
                        client_secret: process.env.PASSPORT_PASSWORD_GRANT_SECRET.toString(),
                        scope: '*',
                        username: this.email,
                        password: this.password
                    }
                }).then(async res => {
                    Show.create({data: await this.$axios.$get('/api/shows')});
                    Episode.create({data: await this.$axios.$get('/api/episodes')});
                })
                    .catch(err => console.log(err));
            }
        }
    }
</script>

<style scoped>

</style>