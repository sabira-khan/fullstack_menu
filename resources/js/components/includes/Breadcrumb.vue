<template>
  <nav class="mx-1">
    <ol class="breadcrumb border-radius-2 p-2">
      <li v-for="(crumb, ci) in crumbs" :key="ci" class="breadcrumb-item align-items-center">
        <router-link :to="crumb.href" class="btn btn-link" :class="{ disabled: isLast(ci) }" @click="selected(crumb)">
          {{ crumb.text }}
        </router-link>
      </li>
    </ol>
  </nav>
</template>
  
<script>
export default {
  props: {
    crumbs: {
      type: Array,
      required: true,
    },
  },
  methods: {
    isLast(index) {
      return index === this.crumbs.length - 1;
    },
    selected(crumb) {
      this.$emit('selected', crumb);
    },
  },
};
</script>
   
<style scoped>
.breadcrumb {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.37rem;
}

.breadcrumb-item+.breadcrumb-item::before {
  float: none;
}

.border-radius-0 {
  border-radius: 0
}

.border-radius-2 {
  border-radius: 0.66rem;
}
</style>