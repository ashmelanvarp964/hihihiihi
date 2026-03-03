
'use server';
/**
 * @fileOverview A support assistant for AstraCloud Hosting.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SupportChatbotInputSchema = z.object({
  question: z.string().describe('The user\'s question regarding AstraCloud hosting.'),
});
export type SupportChatbotInput = z.infer<typeof SupportChatbotInputSchema>;

const SupportChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user\'s question.'),
});
export type SupportChatbotOutput = z.infer<typeof SupportChatbotOutputSchema>;

const supportChatbotPrompt = ai.definePrompt({
  name: 'supportChatbotPrompt',
  input: { schema: SupportChatbotInputSchema },
  output: { schema: SupportChatbotOutputSchema },
  prompt: `You are a helpful customer support agent for AstraCloud Hosting. 
We offer Intel Platinum and AMD EPYC VPS and high-performance Minecraft servers.
Always be polite and technical when needed.

Question: {{{question}}}`,
});

const supportChatbotFlow = ai.defineFlow(
  {
    name: 'supportChatbotFlow',
    inputSchema: SupportChatbotInputSchema,
    outputSchema: SupportChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await supportChatbotPrompt(input);
    if (!output) {
      throw new Error('Failed to get a response.');
    }
    return output;
  }
);

export async function supportChatbot(input: SupportChatbotInput): Promise<SupportChatbotOutput> {
  return supportChatbotFlow(input);
}
