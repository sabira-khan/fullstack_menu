import Cookies from "js-cookie";
import store from "../store";

const AuthenticatedLayout = () => import("../layouts/Authenticated.vue");
const GuestLayout = () => import("../layouts/Guest.vue");

function requireLogin(to, from, next) {
    let isLogin = false;
    isLogin = !!store.state.auth.authenticated;

    if (isLogin) {
        next();
    } else {
        next("/login");
    }
}

function guest(to, from, next) {
    let isLogin;
    isLogin = !!store.state.auth.authenticated;

    if (isLogin) {
        next("/");
    } else {
        next();
    }
}

export default [
    {
        path: "/",
        // redirect: { name: 'login' },
        component: GuestLayout,
        children: [
            {
                path: "/",
                name: "home",
                component: () => import("../views/home/index.vue"),
            },

            {
                path: "login",
                name: "auth.login",
                component: () => import("../views/login/Login.vue"),
                beforeEnter: guest,
            },
            {
                path: "register",
                name: "auth.register",
                component: () => import("../views/register/index.vue"),
                beforeEnter: guest,
            },
            {
                path: "forgot-password",
                name: "auth.forgot-password",
                component: () => import("../views/auth/passwords/Email.vue"),
                beforeEnter: guest,
            },
            {
                path: "reset-password/:token",
                name: "auth.reset-password",
                component: () => import("../views/auth/passwords/Reset.vue"),
                beforeEnter: guest,
            },
        ],
    },
    {
        path: "/admin",
        component: AuthenticatedLayout,
        // redirect: {
        //     name: 'admin.index'
        // },
        beforeEnter: requireLogin,
        children: [
            {
                name: "admin.index",
                path: "",
                component: () => import("../views/admin/index.vue"),
                meta: { breadCrumb: "Admin" },
            },
            {
                name: "profile.index",
                path: "profile",
                component: () => import("../views/admin/profile/index.vue"),
                meta: { breadCrumb: "Profile" },
            },

            {
                name: "categories.index",
                path: "categories",
                component: () => import("../views/admin/categories/Index.vue"),
                meta: { breadCrumb: "Categories" },
            },
            {
                name: "categories.create",
                path: "categories/create",
                component: () => import("../views/admin/categories/Create.vue"),
                meta: { breadCrumb: "Add new category" },
            },
            {
                name: "categories.edit",
                path: "categories/edit/:id",
                component: () => import("../views/admin/categories/Edit.vue"),
                meta: { breadCrumb: "Edit Category" },
            },

            {
                name: "subcategories.index",
                path: "subcategories",
                component: () =>
                    import("../views/admin/subcategories/Index.vue"),
                meta: { breadCrumb: "Subcategories" },
            },
            {
                name: "subcategories.create",
                path: "subcategories/create",
                component: () =>
                    import("../views/admin/subcategories/Create.vue"),
                meta: { breadCrumb: "Add New Subcategory" },
            },
            {
                name: "subcategories.edit",
                path: "subcategories/edit/:id",
                component: () =>
                    import("../views/admin/subcategories/Edit.vue"),
                meta: { breadCrumb: "Edit Subcategory" },
            },
            {
                name: "items.index",
                path: "items",
                component: () => import("../views/admin/items/Index.vue"),
                meta: { breadCrumb: "Items" },
            },
            {
                name: "items.create",
                path: "items/create",
                component: () => import("../views/admin/items/Create.vue"),
                meta: { breadCrumb: "Add New Item" },
            },
            {
                name: "items.edit",
                path: "items/edit/:id",
                component: () => import("../views/admin/items/Edit.vue"),
                meta: { breadCrumb: "Edit Item" },
            },

            {
                name: "discounts.index",
                path: "discounts",
                component: () => import("../views/admin/discounts/Index.vue"),
                meta: { breadCrumb: "Discounts" },
            },
            {
                name: "discounts.create",
                path: "discounts/create",
                component: () => import("../views/admin/discounts/Create.vue"),
                meta: { breadCrumb: "Add New Discount" },
            },
            {
                name: "discounts.edit",
                path: "discounts/edit/:id",
                component: () => import("../views/admin/discounts/Edit.vue"),
                meta: { breadCrumb: "Edit Discount" },
            },
            {
                name: "permissions.index",
                path: "permissions",
                component: () => import("../views/admin/permissions/Index.vue"),
                meta: { breadCrumb: "Permissions" },
            },
            {
                name: "permissions.create",
                path: "permissions/create",
                component: () =>
                    import("../views/admin/permissions/Create.vue"),
                meta: { breadCrumb: "Create Permission" },
            },
            {
                name: "permissions.edit",
                path: "permissions/edit/:id",
                component: () => import("../views/admin/permissions/Edit.vue"),
                meta: { breadCrumb: "Permission Edit" },
            },
            {
                name: "roles.index",
                path: "roles",
                component: () => import("../views/admin/roles/Index.vue"),
                meta: { breadCrumb: "Roles" },
            },
            {
                name: "roles.create",
                path: "roles/create",
                component: () => import("../views/admin/roles/Create.vue"),
                meta: { breadCrumb: "Create Role" },
            },
            {
                name: "roles.edit",
                path: "roles/edit/:id",
                component: () => import("../views/admin/roles/Edit.vue"),
                meta: { breadCrumb: "Role Edit" },
            },
            {
                name: "users.index",
                path: "users",
                component: () => import("../views/admin/users/Index.vue"),
                meta: { breadCrumb: "Users" },
            },
            {
                name: "users.create",
                path: "users/create",
                component: () => import("../views/admin/users/Create.vue"),
                meta: { breadCrumb: "Add New" },
            },
            {
                name: "users.edit",
                path: "users/edit/:id",
                component: () => import("../views/admin/users/Edit.vue"),
                meta: { breadCrumb: "User Edit" },
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../views/errors/404.vue"),
    },
];
