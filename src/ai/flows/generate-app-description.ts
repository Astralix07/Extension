'use server';
/**
 * @fileOverview A Genkit flow for generating application descriptions using AI.
 *
 * - generateAppDescription - A function that handles the AI-powered generation of application descriptions.
 * - GenerateAppDescriptionInput - The input type for the generateAppDescription function.
 * - GenerateAppDescriptionOutput - The return type for the generateAppDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppDescriptionInputSchema = z.object({
  appName: z.string().describe('The name of the application.'),
  appUrl: z.string().optional().describe('The official URL of the application, if available.'),
});
export type GenerateAppDescriptionInput = z.infer<typeof GenerateAppDescriptionInputSchema>;

const GenerateAppDescriptionOutputSchema = z.object({
  description: z.string().describe('A concise and informative description for the application.'),
});
export type GenerateAppDescriptionOutput = z.infer<typeof GenerateAppDescriptionOutputSchema>;

export async function generateAppDescription(input: GenerateAppDescriptionInput): Promise<GenerateAppDescriptionOutput> {
  return generateAppDescriptionFlow(input);
}

const generateAppDescriptionPrompt = ai.definePrompt({
  name: 'generateAppDescriptionPrompt',
  input: { schema: GenerateAppDescriptionInputSchema },
  output: { schema: GenerateAppDescriptionOutputSchema },
  prompt: `You are an AI assistant specialized in writing concise and informative descriptions for software applications for a modern download website called SynthVault.
Your goal is to create a compelling and accurate description that highlights the application's purpose and key features.
Keep the description to a maximum of 3-4 sentences.

Application Name: {{{appName}}}

{{#if appUrl}}
Official Website URL: {{{appUrl}}}
(Please refer to this URL for information about the application, if necessary.)
{{/if}}

Generate a description for the application named "{{{appName}}}":`,
});

const generateAppDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAppDescriptionFlow',
    inputSchema: GenerateAppDescriptionInputSchema,
    outputSchema: GenerateAppDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await generateAppDescriptionPrompt(input);
    return output!;
  }
);
