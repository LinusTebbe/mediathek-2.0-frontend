//import VuexORMisDirtyPlugin from '@vuex-orm/plugin-change-flags';
import VuexORM from '@vuex-orm/core'
import database from '~/database'

//VuexORM.use(VuexORMisDirtyPlugin);

export const plugins = [
    VuexORM.install(database)
];

import Show from "~/models/Show";
import Episode from "~/models/Episode";

export const actions = {
    async nuxtServerInit(store, {$auth}) {
        if ($auth.loggedIn) {
            Show.create({data: await this.$axios.$get('/api/shows')});
            Episode.create({data: await this.$axios.$get('/api/episodes')});
        }
    }
};