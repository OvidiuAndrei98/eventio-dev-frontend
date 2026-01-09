import Image from 'next/image';

const tableSeatingFeatures = [
  {
    name: 'Canvas Drag & Drop',
    description:
      'Organizează mesele și locurile invitaților cu ușurință folosind interfața intuitivă de tip drag & drop.',
  },
  {
    name: 'Exporturi avansate',
    description:
      'Descarcă listele de invitați în format Excel sau planul meselor în format PDF, gata pentru a fi trimise locației.',
  },
];

const TableSeating = () => {
  return (
    <div
      className="bg-white text-gray-900 font-sans lg:py-19"
      id="table-seating-section"
    >
      <div className="overflow-hidden bg-[var(--primary-color)]/5 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pt-4 lg:pr-8">
              <div className="lg:max-w-lg">
                <h2 className="small-header font-semibold text-indigo-400">
                  ASEZAREA LA MESE
                </h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-[var(--secondary-color)] sm:text-5xl">
                  Planifică cu ușurință așezarea invitaților la mese
                </p>
                <p className="mt-6 text-lg/8 text-gray-500">
                  Folosește interfața noastră intuitivă de tip drag & drop
                  pentru a organiza mesele și locurile invitaților. Exportă
                  listele de invitați în format Excel sau planul meselor în
                  format PDF, gata pentru a fi trimise locației.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-400 lg:max-w-none">
                  {tableSeatingFeatures.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        {feature.name}
                      </dt>{' '}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <Image
              alt="Product screenshot"
              src="/landing_images/table_seating_desktop.png"
              width={2432}
              height={1442}
              className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 md:-ml-4 lg:-ml-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSeating;
