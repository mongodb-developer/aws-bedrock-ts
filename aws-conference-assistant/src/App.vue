<template>
  <div class="app">
    <h1>AWS Conference Assistant</h1>
    <ChatInterface />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChatInterface from './components/ChatInterface.vue';

export default defineComponent({
  name: 'App',
  components: {
    ChatInterface
  }
});
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  color: #333;
}
</style>
