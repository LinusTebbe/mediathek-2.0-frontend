<template>
    <div class="card">
        <div class="imageContainer">
            <img :src="show.thumbnail_path" alt="">
            <span>{{ show.title }}</span>
        </div>
        <div class="showDescription">{{ show.description }}</div>
        <slot/>
    </div>
</template>

<script>
    export default {
        name: "show-card",
        props: ['show'],
    }
</script>

<style scoped lang="scss">
    .imageContainer {
        span {
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            color: white;
            font-size: 1.5rem;
        }

        img {
            border-radius: 4px 4px 0 0;
            width: 100%;
        }

        position: relative;
    }

    .showDescription {
        padding: 0 1rem 1rem 1rem;
        text-decoration: none !important;
        color: var(--text-color);
    }

</style>
