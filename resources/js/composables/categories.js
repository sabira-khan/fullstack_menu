import { ref, inject } from "vue";
import { useRouter } from "vue-router";

export default function useCategories() {
    const categories = ref([]);
    const categoryList = ref([]);
    const category = ref({
        name: "",
    });

    const router = useRouter();
    const validationErrors = ref({});
    const isLoading = ref(false);
    const swal = inject("$swal");

    const getCategories = async (
        page = 1,
        search_id = "",
        search_title = "",
        search_global = "",
        order_column = "created_at",
        order_direction = "desc"
    ) => {
        axios
            .get(
                "/api/categories?page=" +
                    page +
                    "&search_id=" +
                    search_id +
                    "&search_title=" +
                    search_title +
                    "&search_global=" +
                    search_global +
                    "&order_column=" +
                    order_column +
                    "&order_direction=" +
                    order_direction
            )
            .then((response) => {
                categories.value = response.data;
            });
    };

    const getCategory = async (id) => {
        axios.get("/api/categories/" + id).then((response) => {
            category.value = response.data.data;
            console.log(category.value);
        });
    };

    const storeCategory = async (category) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        axios
            .post("/api/categories", category)
            .then((response) => {
                router.push({ name: "categories.index" });
                swal({
                    icon: "success",
                    title: "Category Creation Successful!",
                });
            })
            .catch((error) => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const storeSubCategory = async (category) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        axios
            .post("/api/categories", category)
            .then((response) => {
                router.push({ name: "subcategories.index" });
                swal({
                    icon: "success",
                    title: "Subcategory Creation Successful!",
                });
            })
            .catch((error) => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const updateCategory = async (category) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        axios
            .put("/api/categories/" + category.id, category)
            .then((response) => {
                router.push({ name: "categories.index" });
                swal({
                    icon: "success",
                    title: "Category updated successfully",
                });
            })
            .catch((error) => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const updateSubCategory = async (category) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        axios
            .put("/api/categories/" + category.id, category)
            .then((response) => {
                router.push({ name: "subcategories.index" });
                swal({
                    icon: "success",
                    title: "Subcategory updated successfully!",
                });
            })
            .catch((error) => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const deleteCategory = async (id) => {
        swal({
            title: "Are you sure?",
            text: "You won't be able to revert this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#ef4444",
            timer: 20000,
            timerProgressBar: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete("/api/categories/" + id)
                    .then((response) => {
                        if (response.status === 204) {
                            getCategories();
                            router.push({ name: "categories.index" });
                            swal({
                                icon: "success",
                                title: "Category deleted successfully",
                            });
                        } else {
                            swal({
                                icon: "error",
                                title: "Something went wrong",
                            });
                        }
                    })
                    .catch((error) => {
                        // Handle specific error response from the server
                        if (error.response?.data?.error) {
                            swal({
                                icon: "error",
                                title: error.response.data.error,
                            });
                        } else {
                            // Handle other errors
                            swal({
                                icon: "error",
                                title: "Something went wrong",
                            });
                        }
                    });
            }
        });
    };

    const getCategoryList = async () => {
        axios.get("/api/category-list").then((response) => {
            categoryList.value = response.data.data;
        });
    };

    const getCategoryList2 = async () => {
        try {
            const response = await axios.get("/api/category-cleaned");
            categoryList.value = response.data.data;
        } catch (error) {
            console.error("Error fetching category list:", error);
            // Handle the error as needed
        }
    };

    return {
        categoryList,
        categories,
        category,
        getCategories,
        getCategoryList,
        getCategoryList2,
        getCategory,
        storeCategory,
        storeSubCategory,
        updateCategory,
        updateSubCategory,
        deleteCategory,
        validationErrors,
        isLoading,
    };
}
