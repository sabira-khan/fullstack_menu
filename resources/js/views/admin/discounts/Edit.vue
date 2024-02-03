<template>
    <div class="row justify-content-center my-5">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <!-- type -->
                        <div class="mb-3">
                            <label for="discount-type" class="form-label">
                                Discount type *
                            </label>
                            <input v-model="discount.type" id="discount-type" type="text" class="form-control" disabled>
                            <div class="text-danger mt-1">
                                {{ errors.type }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.type">
                                    {{ message }}
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="discount-discount_value" class="form-label">
                                Discount Amount *
                            </label>
                            <input v-model="discount.discount_value" id="discount-discount_value" type="number"
                                class="form-control" disabled>
                            <div class="text-danger mt-1">
                                {{ errors.discount_value }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.type">
                                    {{ message }}
                                </div>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="mt-4">
                            <button :disabled="isLoading" class="btn btn-primary me-2 d-none">
                                <div v-show="isLoading" class=""></div>
                                <span v-if="isLoading">Processing...</span>
                                <span v-else>Save</span>
                            </button>
                            <button :disabled="isLoading" class="btn btn-primary" @click="goBack">
                                <div v-show="isLoading" class=""></div>
                                <span v-if="isLoading">Processing...</span>
                                <span v-else>Back</span>
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
import { useRoute, useRouter } from "vue-router";
import useDiscounts from "../../../composables/discounts";
import { useForm, useField, defineRule } from "vee-validate";
import { required, min } from "@/validation/rules";

defineRule('required', required);
defineRule('min', min);

const schema = {
    type: 'required|min:3',
    discount: 'min:0'
};

const { validate, errors, resetForm } = useForm({ validationSchema: schema });

const { value: type } = useField('type', null, { initialValue: '' });
const { value: discount_value } = useField('discount', null, { initialValue: null });
const { discount: postData, getDiscount, updateDiscount, validationErrors, isLoading } = useDiscounts();

const discount = reactive({
    type,
    discount_value
});

const route = useRoute();
const router = useRouter();

function submitForm() {
    validate().then(form => {
        if (form.valid) {
            updateDiscount(discount_value);
        }
    });
}

function goBack() {
    router.go(-1);
}

onMounted(() => {
    getDiscount(route.params.id);
});

// Watch for changes in the postData and update the discount accordingly
watchEffect(() => {
    discount.id = postData.value.id;
    discount.type = postData.value.type;
    discount.discount_value = postData.value.discount_value;
});
</script>

