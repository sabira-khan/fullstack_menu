import { ref, inject } from "vue";
import { useRouter } from "vue-router";

export default function useDiscounts() {
    const discounts = ref([]);
    const discountList = ref([]);

    const discount = ref({
        name: "",
    });

    const items = ref([]);
    const itemList = ref([]);

    const item = ref({
        name: "",
    });

    const router = useRouter();
    const validationErrors = ref({});
    const isLoading = ref(false);
    const swal = inject("$swal");

    const getDiscounts = async (
        page = 1,
        search_id = "",
        search_title = "",
        search_global = "",
        order_column = "created_at",
        order_direction = "desc"
    ) => {
        axios
            .get(
                "/api/discounts?page=" +
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
                discounts.value = response.data;
            });
    };

    const getDiscount = async (id) => {
        axios.get("/api/discounts/" + id).then((response) => {
            discount.value = response.data.data;
            console.log("test" + discount.value);
        });
    };

    const storeDiscount = async (discount) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        axios
            .post("/api/discounts", discount)
            .then((response) => {
                router.push({ name: "discounts.index" });
                swal({
                    icon: "success",
                    title: "Discount saved successfully",
                });
            })
            .catch((error) => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const updateDiscount = async (discount) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        axios
            .put("/api/discounts/" + discount.id, discount)
            .then((response) => {
                router.push({ name: "discounts.index" });
                swal({
                    icon: "success",
                    title: "Discount updated successfully",
                });
            })
            .catch((error) => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const deleteDiscount = async (id) => {
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
                    .delete("/api/discounts/" + id)
                    .then((response) => {
                        if (response.data && response.data.message) {
                            // Success: Discount deleted successfully
                            getDiscounts();
                            router.push({ name: "discounts.index" });
                            swal({
                                icon: "success",
                                title: response.data.message,
                            });
                        } else {
                            // Unexpected response structure
                            swal({
                                icon: "error",
                                title: "Unexpected response from the server",
                            });
                        }
                    })
                    .catch((error) => {
                        if (
                            error.response &&
                            error.response.data &&
                            error.response.data.error
                        ) {
                            // Error: Something went wrong
                            swal({
                                icon: "error",
                                title: error.response.data.error,
                            });
                        } else {
                            // Generic error handling
                            swal({
                                icon: "error",
                                title: "Something went wrong",
                            });
                        }
                    });
            }
        });
    };

    const getList = async () => {
        axios.get("/api/item-list").then((response) => {
            itemList.value = response.data.data;
            console.log(itemList);
        });
    };
    const getCategoryList = async () => {
        axios.get("/api/category-list").then((response) => {
            discountList.value = response.data.data;
        });
    };

    return {
        discountList,
        discounts,
        discount,
        itemList,
        items,
        item,
        getDiscounts,
        getCategoryList,
        getList,
        getDiscount,
        storeDiscount,
        updateDiscount,
        deleteDiscount,
        validationErrors,
        isLoading,
    };
}
