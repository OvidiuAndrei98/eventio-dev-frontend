import { Guest } from '@/core/types';
import { addGuestToEvent } from '@/service/guest/addGuestToEvent';
import React, { useState } from 'react';
import { toast } from 'sonner';

// Definește tipul pentru state-ul local al datelor formularului din interiorul acestui widget.
// Această interfață reprezintă structura datelor colectate din câmpurile de input ale formularului.
interface RsvpFormData {
  guestName: string;
  isAttending: 'yes' | 'no' | '';
  numberOfGuests: number | '';
  dietaryRestrictions: string;
}

// Define the props (properties) that the TemplateRenderer component will pass to this widget.
interface RsvpElementProps {
  /** Obiectul de configurare specific pentru acest element de widget RSVP din datele template-ului. */
  /** ID-ul unic al acestui element (instanță de widget) în cadrul structurii de date a template-ului. Folosit pentru chei React, ID-uri HTML, etc. */
  id: string;

  /** Alte date contextuale necesare widget-ului, de ex. ID-ul evenimentului pentru apelurile API de submitare. */
  eventId: string;

  /** Id of the user who owns the event, to make sure we are working on the right event */
  userId: string;
}

/**
 * Componentă de widget care randează o secțiune completă de formular RSVP.
 * Această componentă își gestionează propriul state intern al formularului, procesează schimbările din input-uri,
 * efectuează validare client-side și trimite datele colectate către un API backend.
 * Este concepută pentru a fi randată de componenta TemplateRenderer pe baza tipului de widget configurat în datele template-ului.
 */
const RsvpElement: React.FC<RsvpElementProps> = ({ id, eventId, userId }) => {
  const [formData, setFormData] = useState<RsvpFormData>({
    guestName: '',
    isAttending: '',
    numberOfGuests: '',
    dietaryRestrictions: '',
  });

  // --- State-uri Opționale pentru Feedback UI la Submitare ---
  // (Pot fi adăugate pentru a arăta utilizatorului că se trimit datele sau că a avut succes/eșec)
  // const [isSubmitting, setIsSubmitting] = useState(false); // true cât timp datele se trimit
  // const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle'); // Starea submitării
  // const [submissionError, setSubmissionError] = useState<string | null>(null); // Mesajul de eroare în caz de eșec

  // --- Handler pentru Schimbarea Valorilor din Input-uri ---
  // Handler generic folosit pentru toate tipurile standard de input HTML (text, number, select, textarea).
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target; // Extrage atributul 'name', valoarea curentă și tipul elementului (<input>, <select>, <textarea>)

    // Actualizează state-ul formularului imutabil.
    // Creează un obiect nou bazat pe state-ul anterior și actualizează câmpul specific care s-a schimbat.
    setFormData((prevState) => ({
      ...prevState, // Copiază toate câmpurile și valorile existente din state-ul anterior (prevState)
      // Actualizează câmpul specific identificat prin atributul său 'name'.
      // Tratare specială pentru input-urile de tip "number": convertim șirurile de caractere non-goale la numere flotante.
      // Un șir vid ('') din input-ul numeric va fi stocat tot ca șir vid în state.
      [name]: type === 'number' && value !== '' ? parseFloat(value) : value,
      // Notă: `parseFloat(value)` pentru un input invalid (ex: "abc") va returna `NaN`.
      // Ai putea dori o validare mai robustă sau gestionarea `NaN` înainte de a seta state-ul dacă este necesar.
    }));
  };

  // --- Handler pentru Submitarea Formularului ---
  // Gestionează evenimentul care are loc atunci când formularul este submitat (ex: utilizatorul apasă butonul de submit).
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne comportamentul implicit al browserului la submitarea formularului (care reîncarcă pagina)
    console.log('RSVP Submit attempt:', formData);

    // --- Validare Client-Side Basică ---
    // Efectuează verificări de validare pe datele din state-ul formularului înainte de a încerca să le trimiți către backend.
    // Aceasta oferă feedback imediat utilizatorului fără a aștepta răspunsul de la server.
    if (!formData.guestName.trim()) {
      // Verifică dacă numele invitatului este gol sau conține doar spații albe
      alert('Please enter your name.'); // Mesaj simplu de alertă pentru un câmp obligatoriu
      // setSubmissionStatus('error'); setSubmissionError('Please enter your name.'); // Actualizează state-ul UI pentru feedback
      return; // Oprește procesul de submitare dacă validarea eșuează
    }
    if (formData.isAttending === '') {
      // Verifică dacă participarea a fost selectată din dropdown
      alert('Please select whether you will be attending.'); // Mesaj de alertă
      // setSubmissionStatus('error'); setSubmissionError('Please select attendance.'); // Actualizează state-ul UI
      return; // Oprește dacă nu este selectată
    }
    // Validare condițională: dacă utilizatorul confirmă participarea ('yes'), verifică numărul de invitați.
    // Acesta nu trebuie să fie un șir vid (''), trebuie să fie un număr valid (!isNaN), și să fie cel puțin 1.
    if (
      formData.isAttending === 'yes' &&
      (formData.numberOfGuests === '' ||
        (typeof formData.numberOfGuests === 'number' &&
          (isNaN(formData.numberOfGuests) || formData.numberOfGuests < 1)))
    ) {
      alert(
        'Please specify a valid number of guests if attending (at least 1).'
      ); // Mesaj de alertă
      // setSubmissionStatus('error'); setSubmissionError('Invalid number of guests.'); // Actualizează state-ul UI
      return; // Oprește dacă validarea eșuează
    }

    try {
      const guest: Guest = {
        eventId: eventId,
        guestId: crypto.randomUUID(),
        guestInfo: {
          name: formData.guestName,
          numberOfGuests:
            formData.isAttending === 'yes'
              ? Number(formData.numberOfGuests)
              : null,
          dietaryRestrictions: formData.dietaryRestrictions,
        },
        isAttending: formData.isAttending === 'yes' ? true : false,
        tableId: null,
        date: Date.now(),
      };
      await addGuestToEvent(eventId, userId, guest);
      setFormData({
        guestName: '',
        isAttending: '',
        numberOfGuests: '',
        dietaryRestrictions: '',
      });
      toast.success('Raspuns inregistrat cu succes');
    } catch (error: any) {
      toast.error('A aparut o eroare la inregistrarea raspunsului');
    } finally {
      // Codul din acest bloc rulează indiferent dacă submitarea a avut succes sau a eșuat (de ex., resetează starea de "loading")
      // setIsSubmitting(false);
    }
  };

  return (
    // Utilizează un div sau un element semantic <section> ca și container principal pentru widget.
    // Aplică stilurile aici (stiluri inline) sau prin clase CSS. Utilizarea elementId în ID-ul containerului permite țintirea specifică cu CSS.
    <div
      id={id}
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '20px auto',
        backgroundColor: '#f9f9f9',
        fontFamily: 'sans-serif',
      }}
    >
      {' '}
      {/* Adaugă și un font generic */}
      {/* --- Titlul Secțiunii RSVP --- */}
      {/* Afișează un titlu pentru secțiunea RSVP. Utilizează textul din config.label dacă este furnizat, altfel un titlu implicit. */}
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#333',
          fontSize: '24px',
        }}
      >
        {/* {config.label || 'Confirmă Prezența (RSVP)'} */}
      </h2>
      {/* --- Elementul HTML Form --- */}
      {/* onSubmit leagă submitarea formularului de handler-ul nostru React (handleSubmit).
                noValidate dezactivează UI-ul implicit de validare al browser-ului, astfel încât să putem gestiona validarea complet manual în handleSubmit. */}
      <form onSubmit={handleSubmit} noValidate>
        {/* --- Câmpurile Formularului, mapate la state-ul RsvpFormData --- */}

        {/* Câmp Input: Nume Invitat (Tip="text") */}
        <div style={{ marginBottom: '15px' }}>
          {/* Eticheta pentru accesibilitate, legată de elementul <input> prin atributul 'htmlFor' care se potrivește cu atributul 'id' al input-ului */}
          <label
            htmlFor={`guestName-${id}`}
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#555',
            }}
          >
            Numele Tău:
          </label>
          <input
            type="text"
            id={`guestName-${id}`} // ID unic pentru a asocia eticheta și input-ul
            name="guestName" // Atributul 'name', se potrivește cu cheia din state-ul formData pentru a fi preluat corect în handleInputChange
            value={formData.guestName} // Input controlat: valoarea sa curentă este citită din state-ul componentei
            onChange={handleInputChange} // Handler: actualizează state-ul când valoarea input-ului se schimbă
            required // Atribut de validare HTML5 (oferă o verificare de bază în browser, dar handler-ul nostru o face și el)
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '16px',
            }}
          />
        </div>

        {/* Câmp Select: Confirmare Participare (Dropdown) */}
        <div style={{ marginBottom: '15px' }}>
          {/* Eticheta pentru dropdown-ul select */}
          <label
            htmlFor={`isAttending-${id}`}
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#555',
            }}
          >
            Vei participa?
          </label>
          {/* Elementul <select>, controlat de state-ul local React */}
          <select
            id={`isAttending-${id}`} // ID unic pentru a lega eticheta și select-ul
            name="isAttending" // Atributul 'name', se potrivește cu cheia din state
            value={formData.isAttending} // Select controlat: valoarea sa curentă este citită din state
            onChange={handleInputChange} // Handler: actualizează state-ul când opțiunea selectată se schimbă
            required // Validare HTML5
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '16px',
            }}
          >
            <option value="">-- Alege --</option>{' '}
            {/* Opțiune goală implicită pentru a forța selecția */}
            <option value="yes">Da, voi participa</option>
            <option value="no">Nu voi participa</option>
          </select>
        </div>

        {/* Câmp Input: Număr de Invitați (Tip="number") */}
        {/* Acest div este randat condițional. El apare în UI DOAR dacă state-ul 'isAttending' este 'yes'. */}
        {formData.isAttending === 'yes' && (
          <div style={{ marginBottom: '15px' }}>
            {/* Eticheta pentru input-ul numeric */}
            <label
              htmlFor={`numberOfGuests-${id}`}
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#555',
              }}
            >
              Număr de invitați (inclusiv tu):
            </label>
            <input
              type="number"
              id={`numberOfGuests-${id}`} // ID unic
              name="numberOfGuests" // Se potrivește cu cheia din state
              value={formData.numberOfGuests} // Input controlat
              onChange={handleInputChange} // Handler
              min="1" // Validare HTML5: valoarea minimă permisă
              required={formData.isAttending === 'yes'} // Marchează ca obligatoriu DOAR dacă 'isAttending' este 'yes'
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '16px',
              }}
            />
          </div>
        )}

        {/* Câmp Textarea: Restricții Dietetice (Opțional) */}
        <div style={{ marginBottom: '15px' }}>
          {/* Eticheta pentru textarea */}
          <label
            htmlFor={`dietaryRestrictions-${id}`}
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#555',
            }}
          >
            Restricții Dietetice (opțional):
          </label>
          <textarea
            id={`dietaryRestrictions-${id}`} // ID unic
            name="dietaryRestrictions" // Se potrivește cu cheia din state
            value={formData.dietaryRestrictions} // Textarea controlată
            onChange={handleInputChange} // Handler
            rows={4} // Setează numărul vizibil de linii în textarea
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '16px',
            }}
          />
        </div>

        {/* --- Butonul de Submit --- */}
        <button
          type="submit"
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease-in-out',
          }}
        >
          Trimite Confirmarea {/* Textul butonului */}
        </button>
      </form>
    </div>
  );
};

export default RsvpElement;
