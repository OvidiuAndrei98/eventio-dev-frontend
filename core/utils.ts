export function mapTemplateTypeToLabel(type: string): string {
  const typeToLabel: Record<string, string> = {
    wedding: 'Nunta',
    bapthism: 'Botez',
    aniversary: 'Petrecere aniversară',
    corporate: 'Corporate',
  };

  return typeToLabel[type];
}
