<template>
    <div class="row justify-content-center my-5">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <form @submit.prevent="submitForm">

                        <!-- Parent Item Dropdown -->
                        <div class="mb-3">
                            <label for="parent-item" class="form-label">
                                Parent Item *
                            </label>
                            <select v-model="item.cat_id" id="parent-item" class="form-select" disabled>
                                <option value="" disabled>Select Parent Item</option>
                                <option v-for="parentItem in itemList" :value="parentItem.id" :key="parentItem.id">
                                    {{ parentItem.name }}
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
import { onMounted, reactive, watchEffect } from "vue";
import { useRoute } from "vue-router";
import useItems from "../../../composables/items";
import { useForm, useField, defineRule } from "vee-validate";
import { required, min } from "@/validation/rules";

defineRule('required', required);
defineRule('min', min);

const schema = {
    name: 'required|min:3',
    discount: 'min:0',
    amount: 'min:0'
};

const { validate, errors, resetForm } = useForm({ validationSchema: schema });

const { value: name } = useField('name', null, { initialValue: '' });
const { value: discount } = useField('discount', null, { initialValue: null });
const { value: amount } = useField('amount', null, { initialValue: null });
const { value: cat_id } = useField('cat_id', null, { initialValue: null });
const { item: postData, getItem, updateItem, validationErrors, isLoading, getLastChildrenList, itemList } = useItems();

const item = reactive({
    name,
    discount,
    amount,
    cat_id
});

const route = useRoute();

function submitForm() {
    validate().then(form => {
        if (form.valid) {
            updateItem(item);
        }
    });
}

onMounted(() => {
    getItem(route.params.id);
    getLastChildrenList();
});

// Watch for changes in the postData and update the item accordingly
watchEffect(() => {
    item.id = postData.value.id;
    item.name = postData.value.name;
    item.discount = postData.value.discount;
    item.amount = postData.value.amount;
    item.cat_id = postData.value.cat_id;
});
</script>

