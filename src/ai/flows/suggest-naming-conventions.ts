
// use server'
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for naming conventions for
 * client, package, service, delivery or shipment types, ensuring configurations adhere to
 * industry best practices.
 *
 * - suggestNamingConventions - A function that suggests naming conventions.
 * - SuggestNamingConventionsInput - The input type for the suggestNamingConventions function.
 * - SuggestNamingConventionsOutput - The return type for the suggestNamingConventions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNamingConventionsInputSchema = z.object({
  entityType: z
    .enum(['client', 'package', 'service', 'delivery', 'shipment'])
    .describe('The type of entity to suggest naming conventions for.'),
  exampleNames: z
    .array(z.string())
    .optional()
    .describe('Example names to use as inspiration.'),
});
export type SuggestNamingConventionsInput = z.infer<
  typeof SuggestNamingConventionsInputSchema
>;

const SuggestNamingConventionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('Suggested naming conventions for the entity type.'),
});
export type SuggestNamingConventionsOutput = z.infer<
  typeof SuggestNamingConventionsOutputSchema
>;

export async function suggestNamingConventions(
  input: SuggestNamingConventionsInput
): Promise<SuggestNamingConventionsOutput> {
  return suggestNamingConventionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNamingConventionsPrompt',
  input: {schema: SuggestNamingConventionsInputSchema},
  output: {schema: SuggestNamingConventionsOutputSchema},
  prompt: `You are an expert in naming conventions for various business entities.

  Based on the entity type provided, suggest several naming conventions that adhere to industry best practices.

  Entity Type: {{{entityType}}}

  {% if exampleNames %}
  Consider these example names as inspiration:
  {{#each exampleNames}}
  - {{{this}}}
  {{/each}}
  {% endif %}

  Provide at least 3 suggestions.
  Do not return any introductory or concluding remarks, only the list of suggestions.
  Response should be a JSON array of strings.
  `,
});

const suggestNamingConventionsFlow = ai.defineFlow(
  {
    name: 'suggestNamingConventionsFlow',
    inputSchema: SuggestNamingConventionsInputSchema,
    outputSchema: SuggestNamingConventionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
