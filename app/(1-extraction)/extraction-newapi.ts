/**
 * Same extraction task as extraction.ts, but routed through a self-hosted
 * New API instance instead of the Vercel AI Gateway.
 *
 * Why this can't be done with an env var alone: @ai-sdk/gateway never reads
 * VERCEL_AI_GATEWAY_URL, and its endpoints (/language-model, /config) are a
 * Vercel-private protocol that New API does not implement. New API speaks the
 * OpenAI-compatible protocol, so we swap in the OpenAI provider instead.
 */
import dotenvFlow from 'dotenv-flow';
dotenvFlow.config(); // Load environment variables (API keys, etc.)
import fs from 'fs';
import { generateText } from 'ai'; // AI SDK's core text generation function
import { createOpenAI } from '@ai-sdk/openai';

// Point the OpenAI-compatible provider at our own host.
// NEWAPI_BASE_URL must include the /v1 suffix, e.g. https://my-host/v1
const newapi = createOpenAI({
  baseURL: process.env.NEWAPI_BASE_URL,
  apiKey: process.env.NEWAPI_API_KEY,
  name: 'newapi', // shows up in error messages and telemetry
});

// Model name as configured in the New API dashboard, not a gateway-style id
// (i.e. 'gpt-5.5', not 'openai/gpt-5.5'). Run `GET {baseURL}/models` to see
// which ones your token's group actually has channels for.
const MODEL = process.env.NEWAPI_MODEL ?? 'gpt-5.5';

// Read the essay file that we'll extract names from
const essay = fs.readFileSync('app/(1-extraction)/essay.txt', 'utf-8');

async function main() {
  // Call the LLM with our extraction prompt
  const result = await generateText({
    // .chat() targets /v1/chat/completions. Calling newapi(MODEL) directly
    // would target /v1/responses instead, which many New API deployments
    // don't expose.
    model: newapi.chat(MODEL),
    prompt: `Extract all the names mentioned in this essay. List them separated by commas.
Essay:
${essay}`, // Instruction + the actual essay content
  });

  // The AI's response is in result.text
  console.log('\n--- AI Response ---');
  console.log(result.text); // This will be something like: "John Smith, Jane Doe, ..."
  console.log('-------------------');
}

// Run the async function and catch any errors
main().catch((error) => {
  console.error('❌ Extraction failed:', error.message);
  console.log('\n💡 Common issues:');
  console.log('  - Check NEWAPI_BASE_URL ends with /v1 and NEWAPI_API_KEY is set in .env');
  console.log(`  - Verify the model "${MODEL}" is enabled for your New API token`);
  console.log('  - Verify essay.txt exists at app/(1-extraction)/essay.txt');
  process.exit(1);
});
