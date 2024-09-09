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

const AGENT_ID = process.env.AGENT_ID;
const AGENT_ALIAS_ID = process.env.AGENT_ALIAS_ID;


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

    console.log("Response:", response);

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