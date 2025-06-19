<script>
export default {
  name: "category-filter",
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  computed: {
    selectedCategoryIds: {
      get() {
        return this.modelValue;
      },
      set(val) {
        // Emitimos solo los IDs seleccionados
        this.$emit('update:modelValue', val);
      }
    }
  }
};
</script>

<template>
  <pv-card class="m-1 w-auto">
    <template #title>Categories</template>
    <template #content>
      <div class="card flex justify-center">
        <div class="flex flex-column gap-2 ">
          <div v-for="category in categories" :key="category.id"
               class="justify-content-start flex align-items-center">
            <pv-checkbox
              v-model="selectedCategoryIds"
              :input-id="'category-' + category.id"
              :value="category.id"
              name="category"
            />
            <label :for="'category-' + category.id"> {{category.name}}</label>
          </div>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
</style>
