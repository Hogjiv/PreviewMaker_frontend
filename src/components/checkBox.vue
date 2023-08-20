<script>
export default {
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  methods: {
    onClick() {
      const next = !this.modelValue
      this.$emit('update:modelValue', next)
    }
  }
};
</script>

<template>
  <div class="d-flex flex-row">
    <div
      class="checkbox d-flex mx-3"
      @click="onClick"
      :style="{ backgroundColor: modelValue ? '#5E5E5E' : '#F0EEF0' }"
      >
    </div>
    <label for="flexCheckDefault">
      <p class="">{{ value }}</p>
    </label>
  </div>
</template>
<style>
.checkbox {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  background-color: #5e5e5e;
  margin-bottom: 10px;
}
.rr {
  background-color: aqua;
  margin-left: 20px;
}
</style>
