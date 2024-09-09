<template>
  <div class="chat-interface">
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
        <div v-if="message.sender === 'user'">{{ message.text }}</div>
        <div v-else v-html="renderMarkdown(message.text)"></div>
      </div>
      <div v-if="isLoading" class="message ai loading">
        <div class="spinner"></div>
        <span>AI is thinking...</span>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Ask about AWS conferences..." :disabled="isLoading" />
      <button @click="sendMessage" :disabled="isLoading">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUpdated } from 'vue';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
}

export default defineComponent({
  name: 'ChatInterface',
  setup() {
    const messages = ref<ChatMessage[]>([]);
    const userInput = ref('');
    const chatMessages = ref<HTMLElement | null>(null);
    const isLoading = ref(false);
    

    

    
    const generateSession =  () => {
      try {
        // simple random session ID
        const id = Math.random().toString(36).substring(7);
        return id;
      
      } catch (error) {
        console.error('Error generating session:', error);
      }
    };
    const sessionId = ref(generateSession());
    const renderMarkdown = (text: string) => {
      const rawHtml = marked(text);
      return DOMPurify.sanitize(rawHtml);
    };

    const sendMessage = async () => {
      if (!userInput.value.trim() || isLoading.value) return;

      const userMessage: ChatMessage = { text: userInput.value, sender: 'user' };
      messages.value.push(userMessage);
      isLoading.value = true;

      try {
        const response = await axios.post('http://localhost:3000/chat', {
          message: userInput.value,
          sessionId: sessionId.value
        
        });

        const aiMessage: ChatMessage = { text: response.data.completion, sender: 'ai' };
        messages.value.push(aiMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        messages.value.push({ text: 'Sorry, there was an error processing your request.', sender: 'ai' });
      } finally {
        isLoading.value = false;
      }

      userInput.value = '';
    };

    onUpdated(() => {
      if (chatMessages.value) {
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
      }
    });

    return {
      messages,
      userInput,
      sendMessage,
      chatMessages,
      isLoading,
      renderMarkdown
    };
  }
});
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.user {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.ai {
  align-self: flex-start;
  background-color: #f1f0f0;
}

.chat-input {
  display: flex;
  padding: 20px;
}

input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  font-style: italic;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Add some basic styling for rendered markdown */
.ai :deep(p) {
  margin-bottom: 10px;
}

.ai :deep(ul), .ai :deep(ol) {
  margin-left: 20px;
  margin-bottom: 10px;
}

.ai :deep(h1), .ai :deep(h2), .ai :deep(h3), .ai :deep(h4), .ai :deep(h5), .ai :deep(h6) {
  margin-top: 15px;
  margin-bottom: 10px;
}

.ai :deep(code) {
  background-color: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
}

.ai :deep(pre) {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>