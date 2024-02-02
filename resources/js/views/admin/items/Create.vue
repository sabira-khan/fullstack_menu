<template>
    <div class="row justify-content-center my-5">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <form @submit.prevent="submitForm">

                        <!-- Parent Category Dropdown -->
                        <div class="mb-3">
                            <label for="parent-item" class="form-label">
                                Parent Category *
                            </label>
                            <select v-model="item.cat_id" id="parent-item" class="form-select">
                                <option value="" disabled>Select Parent Category</option>
                                <option v-for="parentCategory in itemList" :value="parentCategory.id"
                                    :key="parentCategory.id">
                                    {{ parentCategory.name }}
                                </option>
                            </select>
                            <div class="text-danger mt-1">
                                {{ errors.cat_id }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.cat_id">
                                    {{ message }}
                                </div>
                            </div>
                        </div>

                        <!-- Title -->
                        <div class="mb-3">
                            <label for="item-name" class="form-label">
                                Item Title *
                            </label>
                            <input v-model="item.name" id="item-name" type="text" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.name }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.name">
                                    {{ message }}
                                </div>
                            </div>
                        </div>

                        <!-- Amount -->
                        <div class="mb-3">
                            <label for="amount" class="form-label">
                                Amount (KD)
                            </label>
                            <input v-model="item.amount" id="amount" type="text" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.amount }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.amount">
                                    {{ message }}
                                </div>
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
import useItems from "../../../composables/items";
import { useForm, useField, defineRule } from "vee-validate";
import { required, min } from "@/validation/rules";

defineRule('required', required);
defineRule('min', min);

const { validate, errors } = useForm();

const { value: name, errorMessage: nameError } = useField('name', 'required');

const { value: discount, errorMessage: discountError } = useField('discount', 'min:0');

const { value: amount, errorMessage: amountError } = useField('amount', 'min:0');

const { storeItem, validationErrors, isLoading, getLastChildrenList, itemList } = useItems();

const item = ref({
    name: '',
    cat_id: null,
    discount: null,
    amount: 0
});

onMounted(() => {
    getLastChildrenList();
});
// Use ref for item.cat_id
const cat_id = ref(item.value.cat_id);

watchEffect(() => itemList, (newCategoryList) => {
    cat_id.rules = newCategoryList.length ? 'required' : '';
});

function submitForm() {
    nextTick(() => {
        console.log(item.value);
        // validate().then((isValid) => {
        //     if (isValid) {
        storeItem(item.value);
        //     }
        // });
    });
}

</script>