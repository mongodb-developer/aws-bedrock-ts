# tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

# package.json

```json
{
  "name": "bedrock-ts-agent",
  "version": "1.0.0",
  "description": "A TypeScript app that talks to a Bedrock agent",
  "main": "dist/app.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "ts-node src/app.ts"
  },
  "dependencies": {
    "@aws-sdk/client-bedrock-agent-runtime": "^3.0.0",
    "dotenv": "^16.0.0",
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.13",
    "@types/node": "^16.11.12",
    "ts-node": "^10.4.0",
    "typescript": "^4.5.4"
  }
}
```

# src/app.ts

```ts
import express from 'express';
import dotenv from 'dotenv';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import cors from 'cors';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only the frontend origin
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const bedrockAgentRuntime = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const AGENT_ID = "NX59ZEXWX3";
const AGENT_ALIAS_ID = "JXY5MXMK3D";


async function invokeBedrockAgent(prompt: string, sessionId: string): Promise<{ sessionId: string; completion: string }> {
  const command = new InvokeAgentCommand({
    agentId: AGENT_ID,
    agentAliasId: AGENT_ALIAS_ID,
    sessionId,
    inputText: prompt,
  });

  try {
    let completion = "";
    const response = await bedrockAgentRuntime.send(command);

    if (response.completion === undefined) {
      throw new Error("Completion is undefined");
    }

    for await (let chunkEvent of response.completion) {
      const chunk = chunkEvent.chunk;
      if (chunk && chunk.bytes) {
        const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
        completion += decodedResponse;
      }
    }

    return { sessionId, completion };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

app.options('/chat', cors(corsOptions)); // Enable pre-flight request for POST request
app.post('/chat', cors(corsOptions), async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required.' });
    }

    const response = await invokeBedrockAgent(message, sessionId);
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

# aws-conference-assistant/vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})

```

# aws-conference-assistant/tsconfig.node.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}

```

# aws-conference-assistant/tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

```

# aws-conference-assistant/tsconfig.app.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}

```

# aws-conference-assistant/package.json

```json
{
  "name": "aws-conference-assistant",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^0.27.2",
    "dompurify": "^2.3.8",
    "marked": "^4.0.18",
    "vue": "^3.2.37"
  },
  "devDependencies": {
    "@types/dompurify": "^2.3.3",
    "@types/marked": "^4.0.3",
    "@vitejs/plugin-vue": "^3.0.0",
    "typescript": "^4.6.4",
    "vite": "^3.0.0",
    "vue-tsc": "^0.38.4"
  }
}

```

# aws-conference-assistant/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

```

# aws-conference-assistant/README.md

```md
# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

```

# aws-conference-assistant/.gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

# aws-conference-assistant/src/vite-env.d.ts

```ts
/// <reference types="vite/client" />

```

# aws-conference-assistant/src/style.css

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.card {
  padding: 2em;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}

```

# aws-conference-assistant/src/main.ts

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

```

# aws-conference-assistant/src/App.vue

```vue
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

```

# aws-conference-assistant/.vscode/extensions.json

```json
{
  "recommendations": ["Vue.volar"]
}

```

# aws-conference-assistant/public/vite.svg

This is a file of the type: SVG Image

# aws-conference-assistant/src/components/HelloWorld.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

```

# aws-conference-assistant/src/components/ChatInterface.vue

```vue
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
```

# aws-conference-assistant/src/assets/vue.svg

This is a file of the type: SVG Image

