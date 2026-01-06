import './style.css';

const WeddingInvitationsPage = () => {
  return (
    <div className="landing-wedding">
      <div className=" hero-section absolute inset-0">
        <div className="w-full h-[100dvh] grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto">
          <div className="flex flex-col justify-center items-center p-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center text-[var(--secondary-color)]">
              Invitatii Digitale de Nuntă - Moderne, Rapide și Eco-friendly
            </h1>
            <p className="text-lg lg:text-xl text-center mb-6 text-gray-500">
              Trimite invitația pe WhatsApp în 2 minute. Gestionează
              confirmările (RSVP) automat, fără tabele în Excel.
            </p>
            <a
              href="/create-invitation"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Creează-ți Invitația Acum
            </a>
          </div>
          <div className="flex items-center justify-center p-6">
            <img
              src="/templates_images/wedding/wedding_t_4/template_4_thumbnail.png"
              alt="Sample Wedding Invitation"
              className="max-w-full max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WeddingInvitationsPage;
