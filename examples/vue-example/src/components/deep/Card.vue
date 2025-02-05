<template>
  <div class="card">
    <h3 class="card-title">{{ title }}</h3>
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="card-footer">
      <NestedButton :label="buttonLabel" @click="handleButtonClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import NestedButton from './nested/Button.vue';

const props = defineProps<{
  title: string;
  buttonLabel: string;
}>();

const emit = defineEmits<{
  (e: 'action'): void;
}>();

function handleButtonClick() {
  emit('action');
}
</script>

<style scoped>
.card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  max-width: 400px;
}

.card-title {
  margin: 0 0 16px;
  color: #2d3748;
}

.card-content {
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
