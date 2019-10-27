<template>
    <div>
        <nuxt/>
    </div>
</template>

<script>
    export default {
        name: "default",
        mounted() {
            this.$axios.$get()
        }
    }
</script>

<style scoped>

</style>