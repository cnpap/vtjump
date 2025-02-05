<template>
  <div class="container">
    <h1>VTJump Example</h1>
    <p>Press Ctrl/Cmd and hover over components to see the jump feature in action.</p>

    <DeepCard title="Test Card 1" button-label="Click Me 1" @action="handleAction(1)">
      <p>This is a test card with deep nested components.</p>
    </DeepCard>

    <DeepCard title="Test Card 2" button-label="Click Me 2" @action="handleAction(2)">
      <p>Try hovering over different parts of these cards!</p>
    </DeepCard>
  </div>
</template>

<script setup lang="ts">
import DeepCard from './components/deep/Card.vue';

function handleAction(id: number) {
  console.log(`Action clicked from card ${id}`);
}
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2d3748;
  margin-bottom: 16px;
}

p {
  color: #4a5568;
  margin-bottom: 24px;
}
</style>
