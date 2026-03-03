
'use server';
/**
 * @fileOverview A Genkit flow for generating compelling and detailed descriptions for VPS and Minecraft server plans for AstraCloud.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePlanDescriptionInputSchema = z.object({
  planType: z.enum(['VPS', 'Minecraft']).describe('The type of hosting plan.'),
  planName: z.string().describe('The specific name of the plan.'),
  coreFeatures: z.array(z.string()).describe('A list of key features.'),
  targetAudience: z.string().describe('The primary audience.'),
  additionalDetails: z.string().optional().describe('Any additional specific selling points.'),
});
export type GeneratePlanDescriptionInput = z.infer<typeof GeneratePlanDescriptionInputSchema>;

const GeneratePlanDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling, engaging, and detailed description for the hosting plan.'),
});
export type GeneratePlanDescriptionOutput = z.infer<typeof GeneratePlanDescriptionOutputSchema>;

export async function generatePlanDescription(input: GeneratePlanDescriptionInput): Promise<GeneratePlanDescriptionOutput> {
  return generatePlanDescriptionFlow(input);
}

const generatePlanDescriptionPrompt = ai.definePrompt({
  name: 'generatePlanDescriptionPrompt',
  input: { schema: GeneratePlanDescriptionInputSchema },
  output: { schema: GeneratePlanDescriptionOutputSchema },
  prompt: `You are a professional marketing copywriter for AstraCloud Hosting. Your goal is to create highly compelling descriptions for our hosting plans.

The description should highlight the key benefits, hardware specs (Intel Platinum, AMD EPYC, NVMe SSD), and value proposition of AstraCloud.

Plan Type: {{{planType}}}
Plan Name: {{{planName}}}
Core Features:
{{#each coreFeatures}}
- {{{this}}}
{{/each}}
Target Audience: {{{targetAudience}}}
{{#if additionalDetails}}
Additional Details: {{{additionalDetails}}}
{{/if}}

Craft a description that is persuasive and speaks to the reliability and performance of AstraCloud.`,
});

const generatePlanDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePlanDescriptionFlow',
    inputSchema: GeneratePlanDescriptionInputSchema,
    outputSchema: GeneratePlanDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await generatePlanDescriptionPrompt(input);
    return output!;
  },
);
