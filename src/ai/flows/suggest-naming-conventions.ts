
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for naming conventions for
 * various entity types, ensuring configurations adhere to
 * industry best practices. Updated for Spanish entity types.
 *
 * - suggestNamingConventions - A function that suggests naming conventions.
 * - SuggestNamingConventionsInput - The input type for the suggestNamingConventions function.
 * - SuggestNamingConventionsOutput - The return type for the suggestNamingConventions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { EntityType } from '@/types';

const entityTypeValues: [EntityType, ...EntityType[]] = ['cliente', 'paquete', 'servicio', 'reparto', 'envio', 'empresa', 'repartidor', 'parada', 'capacidad', 'tarifa'];


const SuggestNamingConventionsInputSchema = z.object({
  entityType: z
    .enum(entityTypeValues)
    .describe('El tipo de entidad para el cual sugerir convenciones de nombres.'),
  exampleNames: z
    .array(z.string())
    .optional()
    .describe('Nombres de ejemplo para usar como inspiración.'),
});
export type SuggestNamingConventionsInput = z.infer<
  typeof SuggestNamingConventionsInputSchema
>;

const SuggestNamingConventionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('Sugerencias de convenciones de nombres para el tipo de entidad.'),
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
  prompt: `Eres un experto en convenciones de nombres para diversas entidades de negocio en español.

  Basado en el tipo de entidad proporcionado ({{{entityType}}}), sugiere varias convenciones de nombres que sigan las mejores prácticas de la industria.

  Tipo de Entidad: {{{entityType}}}

  {% if exampleNames %}
  Considera estos nombres de ejemplo como inspiración:
  {{#each exampleNames}}
  - {{{this}}}
  {{/each}}
  {% endif %}

  Proporciona al menos 3 sugerencias.
  No devuelvas ningún comentario introductorio o final, solo la lista de sugerencias.
  La respuesta debe ser un array JSON de strings.
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
