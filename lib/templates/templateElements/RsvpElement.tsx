// editor/widgets/RsvpElement.tsx
import React, { useState } from 'react';

// Presupunem că EditorWidgetType și PropertyEditorConfig (sau un tip similar de bază pentru configurarea widget-urilor)
// sunt definite în fișierul tău de tipuri. Ajustează calea de import dacă este necesar.
import { EditorWidgetType, PropertyEditorConfig } from '@/core/types';

// Definește tipul pentru state-ul local al datelor formularului din interiorul acestui widget.
// Această interfață reprezintă structura datelor colectate din câmpurile de input ale formularului.
interface RsvpFormData {
  guestName: string; // Numele invitatului (input text)
  isAttending: 'yes' | 'no' | ''; // Starea de participare (dropdown select). '' pentru starea inițială "ne-selectat".
  numberOfGuests: number | ''; // Numărul de invitați (input number). Folosim '' pentru starea inițială goală. Va fi convertit la number pe input valid.
  dietaryRestrictions: string; // Restricții dietetice (input textarea, opțional).
}

// Definește prop-urile (proprietățile) pe care componenta TemplateRenderer le va pasa acestui widget.
// De obicei, TemplateRenderer pasează obiectul de configurare pentru elementul specific și ID-ul unic al acelui element din datele template-ului.
// Ai putea avea nevoie și de alte date contextuale, cum ar fi ID-ul evenimentului.
interface RsvpElementProps {
  /** Obiectul de configurare specific pentru acest element de widget RSVP din datele template-ului. */
  /** ID-ul unic al acestui element (instanță de widget) în cadrul structurii de date a template-ului. Folosit pentru chei React, ID-uri HTML, etc. */
  elementId: string; // TemplateRenderer ar trebui să paseze acest prop

  /** Alte date contextuale necesare widget-ului, de ex. ID-ul evenimentului pentru apelurile API de submitare. */
  eventId: string; // Presupunem că eventId este disponibil în scope-ul TemplateRenderer și este pasat ca prop

  // Notă: Acest widget este conceput să fie auto-gestionat pentru logica sa de formular.
  // NU folosește de obicei prop-urile generale `value` și `onChange`
  // care sunt utilizate de widget-urile de editare a proprietăților (cum ar fi NumberInput, TextInput),
  // care sunt gestionate de un state de nivel superior (cum ar fi în PropertyPanel).
}

/**
 * Componentă de widget care randează o secțiune completă de formular RSVP.
 * Această componentă își gestionează propriul state intern al formularului, procesează schimbările din input-uri,
 * efectuează validare client-side și trimite datele colectate către un API backend.
 * Este concepută pentru a fi randată de componenta TemplateRenderer pe baza tipului de widget configurat în datele template-ului.
 */
const RsvpElement: React.FC<RsvpElementProps> = ({ elementId, eventId }) => {
  // --- State Local pentru Datele Formularului ---
  // Gestionează valorile curente ale câmpurilor formularului pe măsură ce utilizatorul interacționează cu ele.
  const [formData, setFormData] = useState<RsvpFormData>({
    guestName: '',
    isAttending: '', // Stare inițială goală pentru dropdown
    numberOfGuests: '', // Stare inițială goală pentru input-ul numeric
    dietaryRestrictions: '', // Stare inițială goală pentru textarea
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

    // Dacă toate validările client-side trec, continuă cu trimiterea datelor către backend.
    // setIsSubmitting(true); // Setează state-ul pentru a indica că submitarea este în curs
    // setSubmissionStatus('loading'); // Setează state-ul UI la "loading"
    // setSubmissionError(null); // Resetează mesajul de eroare anterior

    // --- Logica de Trimitere a Datelor către Backend ---
    // Aceasta este partea principală unde datele colectate din formular sunt trimise către API-ul tău backend pentru procesare (salvare în baza de date etc.).
    // URL-ul specific al endpoint-ului API poate fi hardcodat aici, pasat ca prop componentului, sau obținut din obiectul de configurare (config).
    // Utilizarea eventId și elementId în calea URL-ului endpoint-ului sau în corpul cererii (body) este o practică comună pentru a oferi context serverului.
    const submitEndpoint = `/api/events/${eventId}/rsvp`; // Exemplu de cale URL pentru endpoint-ul API, bazată pe eventId

    console.log(
      `Submitting RSVP for element ${elementId}, event ${eventId} to ${submitEndpoint}:`,
      formData
    );

    try {
      // Exemplu de apel API folosind API-ul fetch încorporat în browser (înlocuiește cu logica ta reală, de ex. folosind librăria axios)
      const response = await fetch(submitEndpoint, {
        method: 'POST', // Utilizează metoda HTTP POST pentru a trimite date noi către server
        headers: {
          'Content-Type': 'application/json', // Indică serverului că corpul cererii este în format JSON
          // Adaugă orice alte headere necesare pentru autentificare, autorizare, etc.
          // 'Authorization': `Bearer ${yourAuthToken}`, // Exemplu de header de autorizare
        },
        // Convertește obiectul formData colectat într-un șir de caractere JSON pentru a fi trimis în corpul cererii
        body: JSON.stringify({
          // Include orice identificatori necesari pe care backend-ul tău îi folosește pentru a lega răspunsul RSVP de un eveniment specific sau element de template
          elementId: elementId, // Pasează ID-ul elementului de widget RSVP din template
          eventId: eventId, // Pasează ID-ul evenimentului (dacă nu este deja în URL)
          ...formData, // Expandază toate câmpurile colectate din state-ul formularului (guestName, isAttending, dietaryRestrictions) direct în obiectul trimis
          // Curăță sau ajustează formatul datelor pentru backend dacă este necesar (de ex. convertește șirul vid '' pentru numărul de invitați la null dacă nu participă)
          numberOfGuests:
            formData.isAttending === 'yes' ? formData.numberOfGuests : null, // Trimite null dacă nu participă
        }),
      });

      // Verifică dacă codul de status HTTP al răspunsului indică succes (fetch singur nu aruncă eroare pentru coduri 4xx sau 5xx, doar pentru erori de rețea)
      if (response.ok) {
        // proprietatea `response.ok` este true pentru coduri de status în intervalul 200-299 (Succes)
        const result = await response.json(); // Parsează corpul răspunsului de la backend ca JSON
        console.log('RSVP Submission Successful:', result);
        alert('RSVP submitted successfully!'); // Oferă feedback simplu de succes utilizatorului
        // setSubmissionStatus('success'); // Actualizează state-ul UI pentru feedback
        // Opțional, resetează state-ul formularului la starea inițială goală după o submitare reușită
        setFormData({
          guestName: '',
          isAttending: '',
          numberOfGuests: '',
          dietaryRestrictions: '',
        });
      } else {
        // Gestionează răspunsurile HTTP care indică o eroare (de ex. 400 Bad Request, 500 Internal Server Error)
        // Presupunem că backend-ul trimite detalii despre eroare într-un format JSON în corpul răspunsului
        const errorData = await response.json(); // Parsează detaliile erorii din corpul răspunsului
        console.error('RSVP Submission Failed:', response.status, errorData);
        alert(
          `Failed to submit RSVP: ${
            errorData.message || 'Unknown server error'
          }`
        ); // Arată un mesaj de eroare informativ utilizatorului
        // setSubmissionStatus('error'); setSubmissionError(errorData.message || 'Unknown server error'); // Actualizează state-ul UI pentru feedback de eroare
      }
    } catch (error: any) {
      // Prinde erorile de rețea sau erorile care apar în timpul procesului fetch în sine (ex: server inaccesibil)
      console.error('An error occurred during submission:', error);
      alert(
        `An error occurred during submission: ${
          error.message || 'Network error'
        }`
      ); // Arată un mesaj de eroare generic pentru probleme de rețea sau alte erori neașteptate
      // setSubmissionStatus('error'); setSubmissionError(error.message || 'Network error'); // Actualizează state-ul UI
    } finally {
      // Codul din acest bloc rulează indiferent dacă submitarea a avut succes sau a eșuat (de ex., resetează starea de "loading")
      // setIsSubmitting(false);
    }
  };

  return (
    // Utilizează un div sau un element semantic <section> ca și container principal pentru widget.
    // Aplică stilurile aici (stiluri inline) sau prin clase CSS. Utilizarea elementId în ID-ul containerului permite țintirea specifică cu CSS.
    <div
      id={`element-${elementId}`}
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
            htmlFor={`guestName-${elementId}`}
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
            id={`guestName-${elementId}`} // ID unic pentru a asocia eticheta și input-ul
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
            htmlFor={`isAttending-${elementId}`}
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
            id={`isAttending-${elementId}`} // ID unic pentru a lega eticheta și select-ul
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
              htmlFor={`numberOfGuests-${elementId}`}
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
              id={`numberOfGuests-${elementId}`} // ID unic
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
            htmlFor={`dietaryRestrictions-${elementId}`}
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
            id={`dietaryRestrictions-${elementId}`} // ID unic
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
