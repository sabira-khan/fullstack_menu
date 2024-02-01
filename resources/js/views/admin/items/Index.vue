<template>
    <div class="row justify-content-center my-2">
        <div class="col-md-12">
            <div class="card border-0">
                <div class="card-header bg-transparent">
                    <h5 class="float-start">Items</h5>
                    <router-link v-if="can('category-create')" :to="{ name: 'items.create' }"
                        class="btn btn-primary btn-sm float-end">
                        Create Item
                    </router-link>
                </div>
                <div class="card-body shadow-sm">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th class="px-2 py-3 bg-gray-50 text-left">
                                        <input v-model="search_global" type="text" placeholder="Search..."
                                            class="form-control">
                                    </th>
                                    <th class="px-2 py-3 bg-gray-50 text-left">
                                        <input v-model="search_id" type="text" class="inline-block mt-1 form-control"
                                            placeholder="Filter by ID">
                                    </th>
                                    <th class="px-2 py-3 bg-gray-50 text-left">
                                        <input v-model="search_title" type="text" class="inline-block mt-1 form-control"
                                            placeholder="Filter by Title">
                                    </th>
                                    <th class="px-6 py-3 text-start"></th>
                                    <th class="px-6 py-3 text-start"></th>
                                </tr>
                                <tr>
                                    <th class="px-6 py-3 text-start">
                                        <div class="flex flex-row" @click="updateOrdering('id')" style="display: flex;">
                                            <div class="font-medium text-uppercase"
                                                :class="{ 'font-bold text-blue-600': orderColumn === 'id' }">
                                                ID
                                            </div>
                                            &nbsp;
                                            <div class="select-none">
                                                <span :class="{
                                                    'text-blue-600': orderDirection === 'asc' && orderColumn === 'id',
                                                    'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'id',
                                                }">&uarr;</span>
                                                <span :class="{
                                                    'text-blue-600': orderDirection === 'desc' && orderColumn === 'id',
                                                    'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'id',
                                                }">&darr;</span>
                                            </div>
                                        </div>
                                    </th>
                                    <th class="px-6 py-3 text-left">
                                        <div class="flex flex-row" @click="updateOrdering('title')" style="display: flex;">
                                            <div class="font-medium"
                                                :class="{ 'font-bold text-blue-600': orderColumn === 'title' }">
                                                Title
                                            </div>
                                            &nbsp;
                                            <div class="select-none">
                                                <span :class="{
                                                    'text-blue-600': orderDirection === 'asc' && orderColumn === 'title',
                                                    'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'title',
                                                }">&uarr;</span>
                                                <span :class="{
                                                    'text-blue-600': orderDirection === 'desc' && orderColumn === 'title',
                                                    'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'title',
                                                }">&darr;</span>
                                            </div>
                                        </div>
                                    </th>
                                    <th class="px-6 py-3 bg-gray-50 text-left">
                                        <div class="flex flex-row items-center justify-between cursor-pointer"
                                            style="display: flex;" @click="updateOrdering('created_at')">
                                            <div class="leading-4 font-medium text-gray-500 uppercase tracking-wider"
                                                :class="{ 'font-bold text-blue-600': orderColumn === 'created_at' }">
                                                Created at
                                            </div>
                                            &nbsp;
                                            <div class="select-none">
                                                <span :class="{
                                                    'text-blue-600': orderDirection === 'asc' && orderColumn === 'created_at',
                                                    'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'created_at',
                                                }">&uarr;</span>
                                                <span :class="{
                                                    'text-blue-600': orderDirection === 'desc' && orderColumn === 'created_at',
                                                    'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'created_at',
                                                }">&darr;</span>
                                            </div>
                                        </div>
                                    </th>
                                    <th class="px-6 py-3 bg-gray-50 text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="post in items.data" :key="post.id">
                                    <td class="px-6 py-4 text-sm">
                                        {{ post.id }}
                                    </td>
                                    <td class="px-6 py-4 text-sm">
                                        {{ post.name }}
                                    </td>
                                    <td class="px-6 py-4 text-sm">
                                        {{ post.created_at }}
                                    </td>
                                    <td class="px-6 py-4 text-sm">
                                        <router-link v-if="can('category-edit')"
                                            :to="{ name: 'items.edit', params: { id: post.id } }"
                                            class="badge bg-primary">Edit
                                        </router-link>
                                        <a href="#" v-if="can('category-delete')" @click.prevent="deleteItem(post.id)"
                                            class="ms-2 badge bg-danger">Delete</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer">
                    <Pagination :data="items" :limit="3"
                        @pagination-change-page="page => getItems(page, search_id, search_title, search_global, orderColumn, orderDirection)"
                        class="mt-4" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import useItems from "../../../composables/items";
import { useAbility } from '@casl/vue'

const search_id = ref('')
const search_title = ref('')
const search_global = ref('')
const orderColumn = ref('created_at')
const orderDirection = ref('desc')
const { items, getItems, deleteItem } = useItems()
const { can } = useAbility()
onMounted(() => {
    getItems()
})
const updateOrdering = (column) => {
    orderColumn.value = column;
    orderDirection.value = (orderDirection.value === 'asc') ? 'desc' : 'asc';
    getItems(
        1,
        search_id.value,
        search_title.value,
        search_global.value,
        orderColumn.value,
        orderDirection.value
    );
}
watch(search_id, (current, previous) => {
    getItems(
        1,
        current,
        search_title.value,
        search_global.value
    )
})
watch(search_title, (current, previous) => {
    getItems(
        1,
        search_id.value,
        current,
        search_global.value
    )
})
watch(search_global, _.debounce((current, previous) => {
    getItems(
        1,
        search_id.value,
        search_title.value,
        current
    )
}, 200))
</script>
