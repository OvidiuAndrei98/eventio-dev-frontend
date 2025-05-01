// lib/defaultTemplates.js
export const defaultTemplates = [
  {
    id: 'template-1', // Un ID unic pentru fiecare template
    name: 'Nunta Model1',
    type: 'wedding',
    description: 'Layout nunta 1',
    thumbnailUrl: '/landing-image.svg', // Opțional: Cale către o imagine preview
    htmlContent: `
        <!DOCTYPE html>
        <html>
        <head><title>Basic Landing</title></head>
        <body>
          <header><h1 class="text-2xl">Titlu</h1></header>
          <main><p>Conținut principal...</p></main>
          <footer><p>&copy; 2025</p></footer>
        </body>
        </html>
      `,
  },
  {
    id: 'template-2',
    type: 'wedding',
    name: 'Nunta Model2',
    description: 'Layout nunta 2',
    thumbnailUrl: '/no-data-illustration.svg',
    htmlContent: `
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 20px;">
              <h1>Subiect Newsletter</h1>
              <p>Dragă [Nume],</p>
              <p>Conținutul emailului...</p>
            </td>
          </tr>
        </table>
      `,
  },
  {
    id: 'template-3',
    type: 'wedding',
    name: 'Nunta Model2',
    description: 'Layout nunta 2',
    thumbnailUrl: '/no-data-illustration.svg',
    htmlContent: `
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 20px;">
              <h1>Subiect Newsletter</h1>
              <p>Dragă [Nume],</p>
              <p>Conținutul emailului...</p>
            </td>
          </tr>
        </table>
      `,
  },
];

// Opțional: O funcție helper pentru a găsi un template după ID
export const getDefaultTemplateById = (id: string) => {
  return defaultTemplates.find((template) => template.id === id);
};
