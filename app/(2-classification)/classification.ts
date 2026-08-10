import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

import supportRequests from './support_requests_multilanguage.json';
import { z } from 'zod';
import { generateText, Output } from 'ai';

async function main() {
  console.log("Asking AI to classify support requests...");

  // TODO: Define the schema for a single classified request
  // - Use z.object() to define the structure
  // - Include 'request' field (string) and 'category' field (enum)
  // - Categories: 'billing', 'product_issues', 'enterprise_sales', 'account_issues', 'product_feedback'

  // Define the schema for a single classified request
  const classificationSchema = z.object({
    request: z.string().describe('The original support request text.'),
    category: z
      .enum([
        'billing',
        'product_issues',
        'enterprise_sales',
        'account_issues',
        'product_feedback',
      ])
      .describe('The most relevant category for the support request.'),
    urgency: z
      .enum(['low', 'medium', 'high'])
      .describe('The probable urgency of the support request.'),
    // Inside classificationSchema
    language: z.string().describe("The full name of the language the support request is in (e.g., English, Spanish, German)."),
  });

  // ... rest of the main function remains the same ...


  // TODO: Use generateText with Output.object() to classify the requests
  // - Model: 'openai/gpt-4.1'
  // - Prompt: Instruct to classify based on categories
  // - Output: Output.object({ schema: yourSchema, mode: 'array' })
  // - Access results via the 'output' property

  // TODO: Display the classified results
  // - Access the results via output property
  // - Log as formatted JSON
  // import { generateText, Output } from 'ai';

  // Use generateText with Output.array() to get structured output
  const { output: classifiedRequests } = await generateText({
    model: 'openai/gpt-5-mini', // Fast model ideal for classification tasks (low cost, immediate response)
    // For nuanced edge cases, consider 'openai/gpt-5' (reasoning model)
    // Prompt combines instruction + stringified data
    prompt: `Classify the following support requests based on the defined categories.\n\n${JSON.stringify(supportRequests)}`,
    // Output.array() tells the SDK we expect an array of objects matching our schema
    output: Output.array({
      element: classificationSchema,
    }),
  });

  console.log('\n--- AI Response (Structured JSON) ---');
  // Output the validated, structured array
  console.log(JSON.stringify(classifiedRequests, null, 2));
  console.log('-----------------------------------');
}

main().catch(console.error);
