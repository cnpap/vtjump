<template>
  <button class="deep-button" @click="handleClick">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.deep-button {
  padding: 8px 16px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.deep-button:hover {
  background-color: #3182ce;
}
</style>
