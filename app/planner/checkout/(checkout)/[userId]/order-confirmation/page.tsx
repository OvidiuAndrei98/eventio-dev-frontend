export default function OrderConfirmationPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-xl w-full py-16 px-4 text-center bg-white rounded-2xl shadow-lg">
          <div className="flex flex-col items-center">
            <div className="bg-[#b46acb]/10 rounded-full p-4 mb-6">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#b46acb" opacity="0.1" />
                <path
                  d="M7 13l3 3 7-7"
                  stroke="#b46acb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3 text-[var(--primary-color)]/80">
              Mulțumim pentru comanda dumneavoastră!
            </h1>
            <p className="mb-6 text-lg text-gray-600">
              Comanda dumneavoastră a fost plasată cu succes. Vă mulțumim pentru
              încrederea acordată{' '}
              <span className="font-semibold text-[var(--primary-color)]/60">
                Planyvite
              </span>
              .
            </p>
            <div className="mb-8 bg-primary-50 rounded-lg p-4"></div>
            <p className="font-semibold mb-1">
              Vrei să vezi istoricul comenzilor și multe altele?
            </p>
            <p className="text-gray-600 mb-6">
              Creează-ți un cont gratuit pentru a debloca funcționalități precum
              istoricul facturilor, platforma Planyvite pentru organizarea
              evenimentelor și multe altele!
            </p>
          </div>
          <a href="/login">
            <button className="px-8 py-3 bg-[var(--primary-color)] text-white rounded-lg font-medium shadow hover:bg-[var(--primary-color-hover,#A80050)]/90 transition text-lg cursor-pointer mt-6">
              Intră în cont
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
