<template>
    <nav class="bg-white sidebar mt-4" style="border-radius: 15px;">
        <div class="pt-3 sidebar-sticky">
            <ul id="menu" class="nav flex-column mb-2">
                <li class="nav-item">
                    <router-link to="/admin" class="nav-link">
                        <span class="fs-4">📜</span>
                        <span class="d-none d-sm-inline ps-2 text-black ">Dashboard</span>
                    </router-link>
                </li>
                <li v-if="can('user-list')" class="nav-item">
                    <a href="#submenu2" data-bs-toggle="collapse" class="nav-link">
                        👥
                        <span class="d-none d-sm-inline ps-2 text-black ">User Manager</span>
                    </a>
                    <ul class="collapse nav flex-column ms-1" id="submenu2" data-bs-parent="#menu">
                        <li v-if="can('permission-list')" class="nav-link w-100">
                            <router-link :to="{ name: 'permissions.index' }" class="nav-link px-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-square-fill" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z" />
                                </svg>
                                <span class="d-none d-sm-inline ps-2 text-black ">Permissions</span>
                            </router-link>
                        </li>
                        <li v-if="can('role-list')" class="nav-link">
                            <router-link :to="{ name: 'roles.index' }" class="nav-link px-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-square-fill" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z" />
                                </svg>
                                <span class="d-none d-sm-inline ps-2 text-black ">Roles</span>
                            </router-link>
                        </li>
                        <li v-if="can('user-list')" class="nav-link">
                            <router-link :to="{ name: 'users.index' }" class="nav-link px-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-square-fill" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z" />
                                </svg>
                                <span class="d-none d-sm-inline ps-2 text-black ">Users</span>
                            </router-link>
                        </li>
                    </ul>
                </li>

                <li v-if="can('category-list')" class="nav-item">
                    <router-link :to="{ name: 'categories.index' }" class="nav-link">
                        <span class="fs-4">📂</span>
                        <span class="d-none d-sm-inline ps-2 text-black ">Categories</span>
                    </router-link>
                </li>
                <li v-if="can('category-list')" class="nav-item">
                    <router-link :to="{ name: 'subcategories.index' }" class="pl-2 nav-link">
                        <span class="fs-4"> &nbsp; 📂</span>
                        <span class="d-none d-sm-inline ps-2 text-black ">Subcategories</span>
                    </router-link>
                </li>
                <li v-if="can('item-list')" class="nav-item">
                    <router-link :to="{ name: 'items.index' }" class="pl-6 nav-link">
                        <span class="fs-4"> &nbsp; &nbsp; &nbsp;🍽️</span>
                        <span class="d-none d-sm-inline ps-2 text-black ">Items</span>
                    </router-link>
                </li>
                <li v-if="can('item-list')" class="nav-item">
                    <router-link :to="{ name: 'discounts.index' }" class="nav-link">
                        <span class="fs-4">💲</span>
                        <span class="d-none d-sm-inline text-black ">Discount</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { useAbility } from '@casl/vue'
const { can } = useAbility();
</script>

<style scoped></style>
