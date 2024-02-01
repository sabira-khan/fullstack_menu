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
                                <div v-for="message in validationErrors?.name" :key="message">
                                    {{ message }}
                                </div>
                            </div>
                        </div>

                        <!-- Parent Category Dropdown -->
                        <div class="mb-3">
                            <label for="parent-category" class="form-label">
                                Parent Category *
                            </label>
                            <select v-model="category.parent_id" id="parent-category" class="form-select">
                                <option value="" disabled>Select Parent Category</option>
                                <option v-for="parentCategory in categoryList" :value="parentCategory.id"
                                    :data-level="parentCategory.level" :key="parentCategory.id">
                                    {{ parentCategory.name }}
                                </option>
                            </select>
                            <div class="text-danger mt-1">
                                {{ errors.parent_id }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.parent_id" :key="message">
                                    {{ message }}
                                </div>
                            </div>
                        </div>

                        <!-- Level -->
                        <input type="hidden"
                            :value="category.parent_id ? (categoryList.find(c => c.id === category.parent_id)?.level || 0) + 1 : 0">

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
                                <div v-for="message in validationErrors?.discount" :key="message">
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
import { onMounted, reactive, watchEffect } from "vue";
import { useRoute } from "vue-router";
import useCategories from "../../../composables/categories";
import { useForm, useField, defineRule } from "vee-validate";
import { required, min } from "@/validation/rules";

defineRule('required', required);
defineRule('min', min);

const schema = {
    name: 'required|min:3',
    discount: 'min:0'
};

const { validate, errors, resetForm } = useForm({ validationSchema: schema });

const { value: name } = useField('name', null, { initialValue: '' });
const { value: discount } = useField('discount', null, { initialValue: null });
const { category: postData, getCategory, updateCategory, getCategoryList2, validationErrors, isLoading } = useCategories();

const category = reactive({
    name,
    discount
});

const route = useRoute();

function submitForm() {
    validate().then(form => {
        if (form.valid) {
            updateCategory(category);
        }
    });
}

onMounted(() => {
    getCategory(route.params.id);
    getCategoryList2();
});

// Watch for changes in the postData and update the category accordingly
watchEffect(() => {
    category.id = postData.value.id;
    category.name = postData.value.name;
    category.discount = postData.value.discount;
    category.parent_id = postData.value.parent_id;
});
</script>

