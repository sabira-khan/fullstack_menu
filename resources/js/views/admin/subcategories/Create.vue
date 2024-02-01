<template>
    <div class="row justify-content-center my-5">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <!-- Title -->
                        <div class="mb-3">
                            <label for="category-name" class="form-label">
                                SubCategory Title *
                            </label>
                            <input v-model="category.name" id="category-name" type="text" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.name }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.name">
                                    {{ message }}
                                </div>
                            </div>
                        </div>

                        <!-- Parent Category Dropdown -->
                        <div class="mb-3">
                            <label for="parent-category" class="form-label">
                                Parent Category *
                            </label>
                            <select v-model="category.parent_id" id="parent-category" class="form-select"
                                @change="logSelectedCategoryLevel(category.parent_id)">
                                <option value="" disabled>Select Parent Category</option>
                                <option v-for="parentCategory in categoryList" :value="parentCategory.id"
                                    :key="parentCategory.id">
                                    {{ parentCategory.name }}
                                </option>
                            </select>
                            <div class="text-danger mt-1">
                                {{ errors.parent_id }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.parent_id">
                                    {{ message }}
                                </div>
                            </div>
                        </div>

                        <!-- Level -->
                        <input type="hidden" :value="category.level">


                        <!-- Discount -->
                        <div class="mb-3">
                            <label for="discount" class="form-label">
                                Discount
                            </label>
                            <input v-model="category.discount" id="discount" type="text" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.discount }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.discount">
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
import useCategories from "../../../composables/categories";
import { useForm, useField, defineRule } from "vee-validate";
import { required, min } from "@/validation/rules";

defineRule('required', required);
defineRule('min', min);

const { validate, errors } = useForm();

const { value: name, errorMessage: nameError } = useField('name', 'required');

const { value: discount, errorMessage: discountError } = useField('discount', 'min:0');

const { storeCategory, validationErrors, isLoading, getCategoryList2, categoryList } = useCategories();

const category = ref({
    name: '',
    parent_id: null,
    discount: null,
    level: 0
});

onMounted(() => {
    getCategoryList2();
});
// Use ref for category.parent_id
const parent_id = ref(category.value.parent_id);

watchEffect(() => categoryList, (newCategoryList) => {
    parent_id.rules = newCategoryList.length ? 'required' : '';
});

watchEffect(() => {
    logSelectedCategoryLevel(parent_id.value);
});

function logSelectedCategoryLevel(selectedCategoryId) {
    const selectedCategory = categoryList.value.find(c => c.id === selectedCategoryId);

    if (selectedCategory) {
        category.value.level = selectedCategory.level + 1;
        console.log(`Selected Category Level: ${category.value.level}`);
    }
}

function submitForm() {
    nextTick(() => {
        console.log(category.value);
        // validate().then((isValid) => {
        //     if (isValid) {
        //         storeCategory(category.value);
        //     }
        // });
    });
}

</script>