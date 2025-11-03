export function mapTemplateTypeToLabel(type: string): string {
  const typeToLabel: Record<string, string> = {
    wedding: 'Nunta',
    bapthism: 'Botez',
    anniversary: 'Petrecere aniversară',
    corporate: 'Corporate',
    religiousWedding: 'Cununie',
  };

  return typeToLabel[type];
}
