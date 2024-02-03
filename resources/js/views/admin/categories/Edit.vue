<template>
    <div class="row justify-content-center my-5">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <!-- Title -->
                        <div class="mb-3">
                            <label for="category-name" class="form-label">
                                Category Title *
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
const { category: postData, getCategory, updateCategory, validationErrors, isLoading } = useCategories();

const category = reactive({
    name,
    level: 0,
    parent_id: null,
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
});

// Watch for changes in the postData and update the category accordingly
watchEffect(() => {
    category.id = postData.value.id;
    category.name = postData.value.name;
});
</script>

