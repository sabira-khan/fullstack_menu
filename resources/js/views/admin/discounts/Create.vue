<template>
    <div class="row justify-content-center my-5">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <!-- Type Radio Group -->
                        <div class="mb-3">
                            <label class="form-label">Discount Type *</label>
                            <div class="form-check">
                                <input type="radio" id="full-menu" v-model="discount.type" value="Menu"
                                    class="form-check-input" @change="handleTypeChange" />
                                <label for="full-menu" class="form-check-label">Full Menu</label>
                            </div>
                            <div class="form-check">
                                <input type="radio" id="category" v-model="discount.type" value="Category"
                                    class="form-check-input" @change="handleTypeChange" />
                                <label for="category" class="form-check-label">Category</label>
                            </div>
                            <div class="form-check">
                                <input type="radio" id="item" v-model="discount.type" value="Item" class="form-check-input"
                                    @change="handleTypeChange" />
                                <label for="item" class="form-check-label">Item</label>
                            </div>
                        </div>

                        <!-- Category Dropdown -->
                        <div v-if="discount.type === 'Category'" class="mb-3">
                            <label for="parent-category" class="form-label">Category *</label>
                            <select v-model="discount.category_id" id="parent-category" class="form-select">
                                <option value="" disabled>Select Category</option>
                                <option v-for="category in discountList" :value="category.id" :key="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                            <div class="text-danger mt-1">{{ errors.category_id }}</div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.category_id">{{ message }}</div>
                            </div>
                        </div>

                        <!-- Item Dropdown -->
                        <div v-if="discount.type === 'Item'" class="mb-3">
                            <label for="parent-item" class="form-label">Item</label>
                            <select v-model="discount.item_id" id="parent-item" class="form-select">
                                <option value="" disabled>Select Discount</option>
                                <option v-for="item in itemList" :value="item.id" :key="item.id">
                                    {{ item.name }}
                                </option>
                            </select>
                            <div class="text-danger mt-1">{{ errors.item_id }}</div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.item_id">{{ message }}</div>
                            </div>
                        </div>

                        <!-- Discount -->
                        <div v-if="discount.type" class="mb-3">
                            <label for="discount_value" class="form-label">Discount %</label>
                            <input v-model="discount.discount_value" id="discount_value" type="number" min="0" max="100"
                                class="form-control" />
                            <div class="text-danger mt-1">{{ errors.discount_value }}</div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.discount_value">{{ message }}</div>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="mt-4">
                            <button :disabled="isLoading" class="btn btn-primary">
                                <div v-show="isLoading" class=""></div>
                                <span v-if="isLoading">Processing...</span>
                                <span v-else>Save</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, nextTick, watchEffect } from "vue";
import useDiscounts from "../../../composables/discounts";
import { useForm, useField, defineRule } from "vee-validate";
import { required, min } from "@/validation/rules";

defineRule('required', required);
defineRule('min', min);

const { validate, errors } = useForm();

const { storeDiscount, validationErrors, isLoading, getList, discountList, itemList, getCategoryList } = useDiscounts();

const discount = ref({
    item_id: null,
    discount_value: 0,
    category_id: null,
    type: null,
});

onMounted(() => {
    getCategoryList();
    getList();
});

// Use ref for discount.item_id
const item_id = ref(discount.value.item_id);
const category_id = ref(discount.value.category_id);

watchEffect(() => {
    // Update rules based on the length of discountList
    item_id.rules = itemList.length ? 'required' : '';
    category_id.rules = discountList.length ? 'required' : '';
});

function handleTypeChange() {
    // Fetch the appropriate list when the discount type changes
    if (discount.value.type === 'Item') {
        getList();
    } else if (discount.value.type === 'Category') {
        getCategoryList();
    }
}

function submitForm() {
    nextTick(() => {
        console.log(discount.value);
        // validate().then((isValid) => {
        //     if (isValid) {
        storeDiscount(discount.value);
        //     }
        // });

        // Check the discount type and call the appropriate function when the form is submitted
        handleTypeChange();
    });
}
</script>
  