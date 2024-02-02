<template>
    <ul>
        <li v-for="category in categories" :key="category.id">
            {{ category.name }}
            <ul v-if="category.children && category.children.length > 0">
                <MenuList :categories="category.children"></MenuList>
            </ul>
            <ul v-if="category.items && category.items.length > 0">
                <li v-for="item in category.items" :key="item.id">{{ item.name }} - KD {{ item.amount }}</li>
            </ul>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        categories: {
            type: Array,
            required: true
        }
    }
};
</script>

<style scoped>
/* Add your styling here */
</style>
