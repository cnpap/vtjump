<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="App">
    <h1>Hello Vue</h1>
    <div class="card">
      <button @click="count++">count is {{ count }}</button>
      <p>Edit <code>src/App.vue</code> and save to test HMR</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 2em;
}
</style>
