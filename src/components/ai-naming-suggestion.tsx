'use client';

import type { EntityType } from '@/types';
import { suggestNamingConventions } from '@/ai/flows/suggest-naming-conventions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Wand2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface AiNamingSuggestionProps {
  entityType: EntityType;
  onSelectSuggestion: (suggestion: string) => void;
}

export function AiNamingSuggestion({ entityType, onSelectSuggestion }: AiNamingSuggestionProps) {
  const [exampleName, setExampleName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestNamingConventions({
        entityType: entityType,
        ...(exampleName && { exampleNames: [exampleName] }),
      });
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
      } else {
        toast({ title: 'Sugerencias IA', description: 'No se encontraron sugerencias.' });
      }
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      toast({
        title: 'Error de IA',
        description: 'No se pudieron obtener sugerencias. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (suggestion: string) => {
    onSelectSuggestion(suggestion);
    setPopoverOpen(false);
    setSuggestions([]);
    setExampleName('');
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" type="button" title="Obtener sugerencias IA">
          <Wand2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="font-medium leading-none text-sm">Sugerencias de Nombres IA</h4>
          <p className="text-xs text-muted-foreground">
            Obtén sugerencias para nombrar tu tipo de {entityType}.
          </p>
          <div>
            <Label htmlFor={`exampleName-${entityType}`} className="text-xs">Nombre de ejemplo (opcional)</Label>
            <Input
              id={`exampleName-${entityType}`}
              value={exampleName}
              onChange={(e) => setExampleName(e.target.value)}
              placeholder="Ej: Express, Premium"
              className="mt-1 h-8 text-xs"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full text-xs h-8">
            {isLoading ? 'Generando...' : 'Obtener Sugerencias'}
            <Sparkles className="ml-2 h-3 w-3" />
          </Button>
        </form>
        {suggestions.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Sugerencias:</p>
            <ul className="max-h-32 overflow-y-auto space-y-1">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={() => handleSelect(s)}
                  >
                    {s}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
