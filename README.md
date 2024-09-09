# AWS Bedrock Agent TypeScript Project

This project demonstrates how to build a TypeScript application that interacts with an AWS Bedrock agent configured with MongoDB integration. It includes a backend server built with Express.js and a frontend application built with Vue.js.

## Project Structure

```
bedrock-ts-agent/
├── src/
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
├── aws-conference-assistant/
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── components/
│   │       └── ChatInterface.vue
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- AWS account with Bedrock access
- MongoDB Atlas account

### AWS Bedrock Quick Setup

Before setting up the application, you need to configure AWS Bedrock. For full guide see the setup section in [MongoDB With Bedrock Agent: Quick Tutorial](https://www.mongodb.com/developer/products/atlas/mdb-aws-bedrock-agent-start/)

1. Log in to your [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to the AWS Bedrock console.
3. Enable the following models:
   - Amazon Titan Text Embedding model (amazon.titan-embed-text-v2:0)
   - Claude 3/3.5 Sonnet Model
4. Create a Knowledge Base:
   - Upload your data to an S3 bucket (e.g., AWS Summit agenda data).
   - In the Bedrock console, go to the Knowledge Base section.
   - Create a new Knowledge Base, selecting your S3 bucket as the data source.
   - Choose MongoDB Atlas as the Vector Database and configure the connection.
5. Create a Bedrock Agent:
   - Go to the Agents section in the Bedrock console.
   - Create a new agent, selecting the Claude 3.5 Sonnet model.
   - Add your Knowledge Base to the agent.
   - Set up a YouTube search action group (optional):
     - Create a new action group in your agent.
     - Set up a Lambda function for YouTube search (see project documentation for details).
6. Note down the Agent ID and Agent Alias ID for use in the application after you saved and prepared the agent.

For detailed instructions on setting up AWS Bedrock, refer to the [AWS Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html).

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd bedrock-ts-agent/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   AWS_REGION=your_aws_region
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AGENT_ID=your_agent_id
   AGENT_ALIAS_ID=your_agent_alias_id
   ```

4. Build the TypeScript code:
   ```
   npm run build
   ```

5. Start the server:
   ```
   npm start
   ```

The backend server should now be running on `http://localhost:3000`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd bedrock-ts-agent/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend application should now be running on `http://localhost:5173`.

## Usage

1. Open your web browser and go to `http://localhost:5173`.
2. You'll see a chat interface where you can interact with the AWS Bedrock agent.
3. Type your questions or prompts related to AWS services or the AWS Summit agenda.
4. The agent will respond with relevant information, and may also suggest YouTube videos when appropriate.

## Features

- Real-time chat interface with AWS Bedrock agent
- Integration with MongoDB Atlas for knowledge base storage
- YouTube video search capability for relevant AWS content
- TypeScript backend for robust server-side code
- Vue.js frontend for a responsive user interface

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- AWS Bedrock team for providing the AI capabilities
- MongoDB Atlas for flexible data storage
- Vue.js team for the frontend framework
