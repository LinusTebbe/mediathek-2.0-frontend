<template>
    <div class="pagination-container">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            <font-awesome-icon icon="chevron-left"/>
        </button>
        <button v-for="(button, index) in buttons" @click="changePage(button)"
                :class="{active: button === currentPage}"
                :key="index">{{button}}
        </button>
        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            <font-awesome-icon icon="chevron-right"/>
        </button>
    </div>
</template>
<script>
    export default {
        props: {
            maxVisibleButtons: {
                type: Number,
                required: false,
                default: 3
            },
            currentPage: {
                type: Number,
                required: true
            },
            totalPages: {
                type: Number,
                required: true
            }
        },
        computed: {
            buttons() {
                let buttons = [];

                const currentPage = this.currentPage;
                const totalPages = this.totalPages;
                const maxVisibleButtons = Math.min(this.totalPages, this.maxVisibleButtons);


                if (currentPage === 1 || totalPages <= maxVisibleButtons) {
                    for (let i = 1; i <= maxVisibleButtons; i++) {
                        buttons.push(i);
                    }
                    return buttons;
                }

                const visiblePagesThreshold = (maxVisibleButtons - 1) / 2;

                if (totalPages <= currentPage + visiblePagesThreshold) {
                    for (let i = totalPages - visiblePagesThreshold - 1; i <= totalPages; i++) {
                        buttons.push(i);
                    }
                    return buttons;
                }

                for (let i = -visiblePagesThreshold; i <= visiblePagesThreshold; i++) {
                    buttons.push(i + currentPage);
                }
                return buttons;
            }
        },
        methods: {
            changePage: function (page) {
                this.$emit('changePage', page);
            }
        }
    }
</script>
<style scoped lang="scss">
    .pagination-container {
        button {
            margin: .1rem;
        }

        display: flex;
        justify-content: center;
    }

    .active {
        background-color: #ff4100;
    }
</style>
