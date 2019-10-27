<template>
    <div>
        <div class="shows" >
            <nuxt-link v-for="show in allShows" :key="show.id" :to="'/show/'+ show.id">
                <show-card :show="show"/>
            </nuxt-link>
        </div>
    </div>
</template>


<script>
    import ShowCard from "~/components/show-card";
    import Show from "~/models/Show";

    export default {
        name: "index",
        components: {ShowCard},
        computed: {
            allShows: function () {
                return Show.all()
            }
        }
    }
</script>

<style>
    @media only screen and (min-width: 992px) {
        .shows {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 10px;
            margin: 10px;
        }
    }

    @media only screen and (max-width: 992px) {
        .shows {
            margin: .5rem;
        }
    }
</style>
