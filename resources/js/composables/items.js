import { ref, inject } from "vue";
import { useRouter } from "vue-router";

export default function useItems() {
    const items = ref([]);
    const itemList = ref([]);
    const item = ref({
        name: "",
    });

    const router = useRouter();
    const validationErrors = ref({});
    const isLoading = ref(false);
    const swal = inject("$swal");

    const getItems = async (
        page = 1,
        search_id = "",
        search_title = "",
        search_global = "",
        order_column = "created_at",
        order_direction = "desc"
    ) => {
        axios
            .get(
                "/api/items?page=" +
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
                items.value = response.data;
            });
    };

    const getItem = async (id) => {
        axios.get("/api/items/" + id).then((response) => {
            item.value = response.data.data;
        });
    };

    const storeItem = async (item) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        axios
            .post("/api/items", item)
            .then((response) => {
                router.push({ name: "items.index" });
                swal({
                    icon: "success",
                    title: "Item saved successfully",
                });
            })
            .catch((error) => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const updateItem = async (item) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        axios
            .put("/api/items/" + item.id, item)
            .then((response) => {
                router.push({ name: "items.index" });
                swal({
                    icon: "success",
                    title: "Item updated successfully",
                });
            })
            .catch((error) => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const deleteItem = async (id) => {
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
                    .delete("/api/items/" + id)
                    .then((response) => {
                        getItems();
                        router.push({ name: "items.index" });
                        swal({
                            icon: "success",
                            title: "Item deleted successfully",
                        });
                    })
                    .catch((error) => {
                        swal({
                            icon: "error",
                            title: "Something went wrong",
                        });
                    });
            }
        });
    };

    const getLastChildrenList = async () => {
        axios.get("/api/item-list").then((response) => {
            itemList.value = response.data.data;
            console.log(response);
        });
    };

    return {
        itemList,
        items,
        item,
        getItems,
        getLastChildrenList,
        getItem,
        storeItem,
        updateItem,
        deleteItem,
        validationErrors,
        isLoading,
    };
}
