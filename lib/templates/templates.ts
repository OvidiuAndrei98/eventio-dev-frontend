// lib/defaultTemplates.js
export const defaultTemplates = [
  {
    id: 'template-1',
    name: 'Nunta Model1',
    type: 'wedding',
    description: 'Layout nunta 1',
    thumbnailUrl: '/landing-image.svg',
    htmlContent: `
    <div class="bg-white/95 w-full overflow-hidden">

        <div class="bg-gradient-to-br from-pink-200 via-purple-100 to-purple-200 p-8 text-center relative">
            <p class="text-lg mb-2 text-purple-800 font-semibold tracking-wider">Cu inimile pline de bucurie,</p>
            <h1 class="font-serif text-6xl font-bold text-pink-600" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.1);">Ana & Mihai</h1>
            <p class="mt-4 text-xl text-purple-800 tracking-wide">vă invită să le fiți alături la celebrarea căsătoriei!</p>
        </div>

        <div class="p-6 md:p-8 space-y-6 relative bg-white">

            <div class="text-center text-gray-800">
                <h2 class="font-serif text-4xl font-semibold text-purple-700 mb-6">Programul Zilei</h2>

                <div class="mb-6">
                    <h3 class="text-2xl font-semibold text-pink-500 mb-2">Cununia Religioasă</h3>
                    <span class="text-2xl mb-2 block">⛪</span>
                    <p class="text-lg">Sâmbătă, 20 Septembrie 2025</p>
                    <p class="text-lg">Ora 15:00</p>
                    <p class="mt-1 text-gray-600">Biserica Sfântul Spiridon Nou, București</p>
                    <div class="w-20 h-1 bg-purple-200 mx-auto mt-3 rounded"></div>
                </div>

                <hr class="w-3/4 mx-auto my-6 border-t-2 border-dashed border-pink-200">

                <div>
                    <h3 class="text-2xl font-semibold text-pink-500 mb-2">Petrecerea Nupțială</h3>
                    <span class="text-2xl mb-2 block">🥂</span>
                    <p class="text-lg">De la ora 18:00</p>
                    <p class="mt-1 text-gray-600">Restaurant "Le Château", București</p>
                     <div class="w-20 h-1 bg-pink-100 mx-auto mt-3 rounded"></div>
                </div>
            </div>

            <hr class="w-3/4 mx-auto my-6 border-t-2 border-dashed border-purple-200">

            <div class="text-center text-gray-700 italic px-4">
                <p class="text-lg">"Două suflete, dar un singur gând; două inimi ce bat la unison."</p>
                <p class="mt-2 text-md">- Franz Joseph von Munch-Bellinghausen</p>
            </div>

            <hr class="w-3/4 mx-auto my-6 border-t-2 border-dashed border-pink-200">

            <div class="text-left max-w-md mx-auto">
                <h3 class="font-serif text-4xl font-semibold text-purple-700 mb-6 text-center">Confirmați Prezența</h3>
                <p class="text-gray-800 mb-6 text-center">Vă rugăm să completați formularul de mai jos până la data de <strong class="text-pink-500 font-semibold">1 Septembrie 2025</strong>.</p>

                <form action="#" method="POST" class="space-y-4">
                    <div>
                        <label for="name" class="block mb-2 font-semibold text-purple-800">Nume și Prenume:</label>
                        <input type="text" id="name" name="name" class="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-gray-50 placeholder-gray-400" placeholder="Numele dumneavoastră" required>
                    </div>

                    <div>
                        <label class="block mb-2 font-semibold text-purple-800">Veți fi alături de noi?</label>
                        <div class="flex flex-wrap items-center mt-2 gap-x-6 gap-y-2">
                            <label class="inline-flex items-center cursor-pointer">
                                <input type="radio" id="attend-yes" name="attendance" value="yes" class="mr-2 h-4 w-4 accent-pink-500" required>
                                <span class="text-gray-700">Da, voi participa</span>
                            </label>
                            <label class="inline-flex items-center cursor-pointer">
                                <input type="radio" id="attend-no" name="attendance" value="no" class="mr-2 h-4 w-4 accent-pink-500" required>
                                <span class="text-gray-700">Nu, din păcate nu pot ajunge</span>
                            </label>
                        </div>
                    </div>

                     <div id="guests-section" class="hidden">
                        <label for="guests" class="block mb-2 font-semibold text-purple-800">Număr persoane (inclusiv dvs.):</label>
                        <input type="number" id="guests" name="guests" class="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-gray-50" min="1" value="1" placeholder="1">
                    </div>

                    <div>
                        <label for="message" class="block mb-2 font-semibold text-purple-800">Mesaj (opțional):</label>
                        <textarea id="message" name="message" rows="3" class="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-gray-50 placeholder-gray-400" placeholder="Un gând bun pentru miri..."></textarea>
                    </div>

                    <div class="text-center pt-4">
                         <button type="submit" class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:opacity-90 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                            Trimite Răspunsul
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="bg-gradient-to-tr from-pink-200 via-purple-100 to-purple-200 p-5 text-center text-purple-800 font-semibold tracking-wider">
            Vă așteptăm cu drag și emoție!
        </div>
    </div>
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
