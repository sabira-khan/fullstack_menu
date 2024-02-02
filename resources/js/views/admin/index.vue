<template>
    <div class="row justify-content-center my-3">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <h1>Welcome to Menu Dashboard!</h1>
                    <br>
                    <p>In today's dynamic (😜) menu, we have:</p>
                    <div id="menu" class="mt-2">
                        <MenuList :categories="menuData"></MenuList>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import MenuList from '@/components/MenuList.vue';

// Use the `ref` function to create a reactive variable
const menuData = ref([]);

// Use the `mounted` lifecycle hook to fetch data when the component is mounted
onMounted(async () => {
    try {
        const response = await axios.get("/api/menu");
        // Assuming the data structure returned is an array, you can assign it to the menuData
        menuData.value = response.data.data;
        console.log(menuData.value)
    } catch (error) {
        console.error("Error fetching menu data:", error);
    }
});
</script>

<style scoped></style>
