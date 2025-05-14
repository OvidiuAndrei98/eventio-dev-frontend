import { Guest } from '@/core/types';
import { addGuestsToEventBatch } from '@/service/guest/addGuestsToEventBatch';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface RsvpFormData {
  primaryGuestName: string;
  primaryGuestEmail?: string;
  primaryDietaryRestrictions: string;
  isAttending: 'yes' | 'no' | '';
  totalGuests: number | '';
  additionalGuestsDetails: Array<{
    name: string;
    dietaryRestrictions: string;
  }>;
  primaryGuestPhone?: string;
}

interface RsvpElementProps {
  id: string;
  eventId: string;
  userId: string;
}

/**
 * Componentă de widget care randează o secțiune completă de formular RSVP.
 * Colectează datele pentru persoana principală ȘI pentru invitații suplimentari.
 * La submit, creează documente separate în Firestore pentru FIECARE persoană.
 * Este concepută pentru a fi randată de componenta TemplateRenderer.
 */
const RsvpElement: React.FC<RsvpElementProps> = ({ id, eventId, userId }) => {
  const [formData, setFormData] = useState<RsvpFormData>({
    primaryGuestName: '',
    primaryGuestEmail: '',
    primaryDietaryRestrictions: '',
    isAttending: '',
    totalGuests: '',
    additionalGuestsDetails: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (
      [
        'primaryGuestName',
        'primaryContactPhone',
        'primaryDietaryRestrictions',
        'isAttending',
      ].includes(name)
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    // Handler specific pentru input-ul "Număr total invitați"
    else if (name === 'totalGuests') {
      // Converteste valoarea string in numar, gestioneaza golul si NaN
      const newTotal = value === '' ? '' : parseFloat(value);
      // Valoarea valida trebuie sa fie un numar intreg >= 1, altfel ramane ''
      const validNewTotal =
        typeof newTotal === 'number' && !isNaN(newTotal) && newTotal >= 1
          ? Math.floor(newTotal)
          : '';

      setFormData((prevState) => {
        const prevAdditionalCount = prevState.additionalGuestsDetails.length; // Numarul actual de invitati suplimentari in state
        // Calculeaza numarul NOU necesar de invitati suplimentari (totalGuests - 1)
        const newAdditionalCount =
          validNewTotal !== '' && validNewTotal > 0 ? validNewTotal - 1 : 0;

        let newAdditionalGuestsDetails = [...prevState.additionalGuestsDetails]; // Copiaza array-ul existent

        if (newAdditionalCount > prevAdditionalCount) {
          // Daca noul numar necesar este mai mare, adauga obiecte goale pentru noii invitati
          const itemsToAdd = newAdditionalCount - prevAdditionalCount;
          for (let i = 0; i < itemsToAdd; i++) {
            newAdditionalGuestsDetails.push({
              name: '',
              dietaryRestrictions: '',
            }); // Adauga un obiect gol pentru fiecare invitat nou necesar
          }
        } else if (newAdditionalCount < prevAdditionalCount) {
          // Daca noul numar necesar este mai mic, taie array-ul la dimensiunea corecta
          newAdditionalGuestsDetails = newAdditionalGuestsDetails.slice(
            0,
            newAdditionalCount
          );
        }
        // Daca numarul ramane la fel, array-ul (copiat) ramane neschimbat

        return {
          ...prevState,
          totalGuests: validNewTotal, // Actualizeaza numarul total in state
          additionalGuestsDetails: newAdditionalGuestsDetails, // Actualizeaza array-ul cu detaliile suplimentare
        };
      });
    }
    // Handler specific pentru input-urile generate DINAMIC pentru invitații suplimentari
    // Numele input-urilor dinamice ar trebui să fie de forma "additionalGuest-{index}-{field}" (ex: "additionalGuest-0-name", "additionalGuest-1-dietaryRestrictions")
    else if (name.startsWith('additionalGuest-')) {
      const parts = name.split('-'); // Desparte numele in segmente (ex: ["additionalGuest", "0", "name"])
      const index = parseInt(parts[1], 10); // Extrage indexul (partea a doua, convertita la numar)
      const field =
        parts[2] as keyof (typeof formData.additionalGuestsDetails)[0]; // Extrage numele câmpului (partea a treia: "name" sau "dietaryRestrictions")

      // Verifica daca indexul este valid si se afla in limitele array-ului current
      if (
        !isNaN(index) &&
        index >= 0 &&
        index < formData.additionalGuestsDetails.length
      ) {
        setFormData((prevState) => {
          const newAdditionalGuestsDetails = [
            ...prevState.additionalGuestsDetails,
          ]; // Copiaza array-ul
          // Actualizeaza obiectul SPECIFIC la indexul gasit, creand un obiect NOU imutabil
          newAdditionalGuestsDetails[index] = {
            ...newAdditionalGuestsDetails[index], // Copiaza detaliile existente pentru acel invitat suplimentar
            [field]: value, // Actualizeaza campul specific (name sau dietaryRestrictions) cu noua valoare
          };
          return {
            ...prevState,
            additionalGuestsDetails: newAdditionalGuestsDetails, // Actualizeaza state-ul cu noul array modificat
          };
        });
      }
    }
    // Poti adauga aici logica pentru alte campuri specifice persoanei principale, daca le ai (ex: email, telefon)
  };

  // --- Handler pentru Submitarea Formularului ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne reincarcarea paginii la submit

    // --- Validare Client-Side ---
    // Efectueaza validari esentiale pe datele colectate in state-ul local
    if (!formData.primaryGuestName.trim()) {
      // Verifica daca numele principal este gol sau doar spatii albe
      toast.error('Please enter your name.');
      return; // Opreste submitarea
    }
    if (formData.isAttending === '') {
      // Verifica daca s-a selectat participarea
      toast.error('Please select whether you will be attending.');
      return; // Opreste submitarea
    }
    // Validare pentru numărul total de invitați, DACA participă
    if (formData.isAttending === 'yes') {
      if (
        formData.totalGuests === '' ||
        (typeof formData.totalGuests === 'number' &&
          (isNaN(formData.totalGuests) || formData.totalGuests < 1))
      ) {
        toast.error(
          'Please specify a valid number of guests if attending (at least 1).'
        );
        return; // Opreste submitarea
      }
      // Validare pentru numele invitaților suplimentari, DACA numărul total > 1
      if (
        typeof formData.totalGuests === 'number' &&
        formData.totalGuests > 1
      ) {
        // Rescris: Itereaza prin array-ul additionalGuestsDetails folosind un loop for clasic
        for (let i = 0; i < formData.additionalGuestsDetails.length; i++) {
          const guest = formData.additionalGuestsDetails[i]; // Accesam invitatul curent din array folosind indexul 'i'
          const guestNumber = i + 2; // Calculeaza numarul invitatului (index 0 este invitatul #2, index 1 este invitatul #3 etc.)

          if (!guest.name.trim()) {
            // Verifica daca numele invitatului suplimentar este gol sau doar spatii albe
            toast.error(`Please enter the name for guest #${guestNumber}.`); // Foloseste numarul invitatului calculat
            return; // Opreste submitarea imediat ce gasesti un nume lipsa
          }
        }
      }
    }

    // --- Pregatirea Datelor pentru Salvare (Crearea obiectelor IndividualGuest) ---
    const guestsToSave: Guest[] = []; // Array-ul care va contine toate obiectele IndividualGuest gata de salvare
    const submissionId = crypto.randomUUID(); // <--- Genereaza un ID unic pentru ACEASTA submitere a formularului
    const subbmisionTime = Date.now();

    // 1. Creeaza obiectul IndividualGuest pentru persoana principală (contactul)
    if (formData.primaryGuestName.trim()) {
      // Asigura-te ca numele principal nu este gol (desi validarea de sus ar trebui sa prinda asta)
      guestsToSave.push({
        guestId: crypto.randomUUID(), // <--- Genereaza un ID unic PENTRU DOCUMENTUL acestei persoane in Firestore
        submissionId: submissionId, // <--- Atribuie ID-ul unic al submitarii
        name: formData.primaryGuestName.trim(), // Numele persoanei principale (fara spatii la capete)
        dietaryRestrictions: formData.primaryDietaryRestrictions.trim() || '', // Restrictiile persoanei principale (string gol daca nu sunt)
        isAttending: formData.isAttending === 'yes', // Boolean pe baza selectiei
        eventId: eventId, // ID-ul evenimentului
        tableId: null, // Initial, invitatul nu are alocata o masa
        date: subbmisionTime, // Timestamp-ul submitarii
        isPrimaryContact: true, // <--- Marcheaza aceasta persoana ca fiind contactul principal al grupului
        primaryContactPhone: formData.primaryGuestPhone?.trim() || '',
        totalGuests:
          typeof formData.totalGuests === 'number' ? formData.totalGuests : 1,
      });
    }

    // 2. Creeaza obiecte IndividualGuest pentru invitații suplimentari, DACA participa si numarul total e > 1
    if (
      formData.isAttending === 'yes' &&
      typeof formData.totalGuests === 'number' &&
      formData.totalGuests > 1
    ) {
      // Itereaza prin array-ul cu detaliile invitatilor suplimentari
      for (const guestDetails of formData.additionalGuestsDetails) {
        if (guestDetails.name.trim()) {
          // Asigura-te ca numele invitatului suplimentar nu este gol (validarea de sus ar trebui sa prinda asta)
          guestsToSave.push({
            guestId: crypto.randomUUID(), // <--- Genereaza un ID unic PENTRU DOCUMENTUL acestei persoane in Firestore
            submissionId: submissionId, // <--- Atribuie ACELASI ID unic al submitarii pentru a lega grupul
            name: guestDetails.name.trim(), // Numele invitatului suplimentar (fara spatii la capete)
            dietaryRestrictions: guestDetails.dietaryRestrictions.trim() || '', // Restrictiile invitatului suplimentar (string gol daca nu sunt)
            isAttending: true, // Ei participa, fiind inclusi in numarul total > 1 si fiind validati
            eventId: eventId, // ID-ul evenimentului
            tableId: null, // Initial, nu au alocata o masa
            date: subbmisionTime, // Timestamp-ul submitarii (acelasi ca pentru principal)
            isPrimaryContact: false, // <--- Marcheaza aceasta persoana ca NU fiind contactul principal
          });
        }
      }
    }

    // 3. (Optional) Creeaza un obiect IndividualGuest pentru persoana principală dacă a răspuns "Nu"
    // Aceasta depinde dacă dorești să ții evidența celor care au refuzat, salvați ca documente individuale.
    // Dacă nu, poți sări acest pas.
    if (formData.isAttending === 'no' && formData.primaryGuestName.trim()) {
      guestsToSave.push({
        guestId: crypto.randomUUID(), // ID unic pentru documentul "nu participa"
        submissionId: submissionId, // ID-ul submitarii
        name: formData.primaryGuestName.trim(), // Numele celui care a raspuns "nu"
        dietaryRestrictions: formData.primaryDietaryRestrictions.trim() || '', // Restrictii (probabil irelevante, dar le poti salva)
        isAttending: false, // <--- Marcheaza explicit ca NU participa
        eventId: eventId,
        tableId: null, // Fara masa
        date: subbmisionTime, // Timestamp
        isPrimaryContact: true, // Inca contactul principal pentru acest raspuns "nu"
        primaryContactPhone: formData.primaryGuestPhone?.trim() || '',
      });
      // De obicei, daca raspunsul e "nu", nu sunt persoane suplimentare de salvat.
    }

    // --- Apelul Serviciului pentru Salvarea Datelor ---
    // Verifică dacă există cel puțin un invitat de salvat (ar trebui să fie cazul dacă validarea a trecut)
    if (guestsToSave.length === 0) {
      console.warn('No valid guest data to save after processing form.');
      toast.info('No guest data to save.'); // Poate ar trebui sa fie o eroare de validare aici
      return;
    }

    console.log('Saving guests (batch):', guestsToSave); // Logheaza array-ul de obiecte IndividualGuest gata de salvare

    try {
      // Apelăm funcția serviciului care ar trebui să folosească Batch Writes în Firestore
      // pentru a adăuga toate documentele din array-ul guestsToSave atomic.
      // Aceasta funcție ar trebui să primească eventId, userId și array-ul de obiecte IndividualGuest.
      await addGuestsToEventBatch(eventId, userId, guestsToSave);

      // --- Feedback Utilizator și Resetare Formular ---
      toast.success(
        `Raspuns(uri) inregistrat(e) cu succes pentru ${guestsToSave.length} invitat(i)!`
      ); // Notificare de succes

      // Resetăm state-ul local al formularului la valorile inițiale goale după submitarea cu succes
      setFormData({
        primaryGuestName: '',
        primaryGuestPhone: '', // Reseteaza si email-ul
        primaryDietaryRestrictions: '',
        isAttending: '',
        totalGuests: '',
        additionalGuestsDetails: [], // Reseteaza array-ul la gol
      });
    } catch (error) {
      console.error('Error saving guests:', error);
      toast.error(
        'A aparut o eroare la inregistrarea raspunsului. Te rugam incearca din nou.'
      );
    } finally {
      // Codul din acest bloc rulează indiferent dacă submitarea a avut succes sau a eșuat
      // (ex., resetează state-ul de "loading" dacă ai implementat așa ceva)
      // setIsSubmitting(false);
    }
  };

  // --- Randarea Interfeței Utilizator (UI) a Formularului ---
  return (
    // Containerul principal al widget-ului. Folosește prop-ul 'id' pentru un ID HTML unic.
    <div
      id={`rsvp-element-${id}`} // Utilizează un prefix + id-ul din props pentru un ID HTML unic al div-ului container
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '20px auto',
        backgroundColor: '#f9f9f9',
        fontFamily: 'sans-serif', // Adaugă un font generic pentru consistență vizuală
        boxSizing: 'border-box', // Include padding-ul și bordura în lățimea totală
      }}
    >
      {/* --- Titlul Secțiunii RSVP --- */}
      {/* Poți trece titlul ca prop sau folosi un text fix. Dacă ai config.label, folosește-l. */}
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#333',
          fontSize: '24px',
        }}
      >
        Confirmă Prezența (RSVP)
      </h2>

      {/* --- Elementul HTML Form --- */}
      {/* onSubmit leagă submitarea formularului de handler-ul nostru React (handleSubmit).
          noValidate dezactivează UI-ul implicit de validare al browser-ului, lăsând validarea complet în handler-ul handleSubmit. */}
      <form onSubmit={handleSubmit} noValidate>
        {/* --- Câmpurile pentru Persoana Principală --- */}
        {/* Câmp Input: Nume Persoană Principală (Tip="text") */}
        <div style={{ marginBottom: '15px' }}>
          {/* Eticheta, legată de input prin 'htmlFor' = 'id' */}
          <label
            htmlFor={`primaryGuestName-${id}`} // ID unic bazat pe id-ul din props
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#555',
            }}
          >
            Numele Tău:
            {/* Poți folosi o etichetă mai clară dacă este Persoana de Contact */}
            {/* Numele Persoanei de Contact: */}
          </label>
          {/* Input controlat de state-ul local */}
          <input
            type="text"
            id={`primaryGuestName-${id}`} // ID unic
            name="primaryGuestName" // Numele se potrivește cu cheia din state
            value={formData.primaryGuestName} // Valoarea din state
            onChange={handleInputChange} // Handler la schimbare
            required // Marcheaza ca obligatoriu (validarea noastră face și ea asta)
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
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor={`primaryGuestPhone-${id}`}
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#555',
            }}
          >
            Telefon:
          </label>
          <input
            type="text"
            id={`primaryGuestPhone-${id}`}
            name="primaryGuestPhone"
            value={formData.primaryGuestPhone}
            onChange={handleInputChange}
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
        {/* Câmp Textarea: Restricții Dietetice Persoană Principală (Opțional) */}
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor={`primaryDietaryRestrictions-${id}`} // ID unic
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#555',
            }}
          >
            Restricții Dietetice (Doar pentru Tine, opțional):
          </label>
          <textarea
            id={`primaryDietaryRestrictions-${id}`} // ID unic
            name="primaryDietaryRestrictions" // Numele se potrivește cu cheia din state
            value={formData.primaryDietaryRestrictions} // Valoarea din state
            onChange={handleInputChange} // Handler la schimbare
            rows={2} // Numărul de linii vizibile
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
        {/* --- Câmp Select: Confirmare Participare (Dropdown) --- */}
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor={`isAttending-${id}`} // ID unic
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#555',
            }}
          >
            Vei participa?
          </label>
          {/* Select controlat de state-ul local */}
          <select
            id={`isAttending-${id}`} // ID unic
            name="isAttending" // Numele se potrivește cu cheia din state
            value={formData.isAttending} // Valoarea din state
            onChange={handleInputChange} // Handler la schimbare
            required // Marcheaza ca obligatoriu
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
            <option value="yes">Da, voi participa</option>
            <option value="no">Nu voi participa</option>
          </select>
        </div>
        {/* --- Câmp Input: Număr Total Invitați (Condițional Randat) --- */}
        {/* Acest bloc apare DOAR dacă s-a selectat "Da, voi participa" */}
        {formData.isAttending === 'yes' && (
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor={`totalGuests-${id}`} // ID unic
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#555',
              }}
            >
              Număr total invitați (inclusiv tu):
            </label>
            {/* Input numeric controlat */}
            <input
              type="number"
              id={`totalGuests-${id}`} // ID unic
              name="totalGuests" // Numele se potrivește cu cheia din state
              value={formData.totalGuests} // Valoarea din state (number sau '')
              onChange={handleInputChange} // Handler la schimbare (actualizeaza si array-ul suplimentar)
              min="1" // Valoare minimă 1 (cel puțin persoana principală)
              required={formData.isAttending === 'yes'} // Obligatoriu doar daca participa
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
        {/* --- Secțiune Randată Dinamic pentru Invitații Suplimentari --- */}
        {/* Acest bloc apare DOAR dacă s-a selectat "Da" ȘI numărul total este > 1 */}
        {formData.isAttending === 'yes' &&
          typeof formData.totalGuests === 'number' &&
          formData.totalGuests > 1 && (
            <div
              style={{
                borderTop: '1px dashed #ccc',
                paddingTop: '15px',
                marginTop: '15px',
              }}
            >
              <h3
                style={{
                  marginBottom: '15px',
                  fontSize: '18px',
                  color: '#555',
                }}
              >
                Detalii Invitați Suplimentari (Persoana #{' '}
                {/* Calculeaza de la ce numar incepe primul invitat suplimentar */}
                {1 + 1}{' '}
                {/* Primul invitat suplimentar e invitatul #2 (principalul e #1) */}{' '}
                până la #{' '}
                {/* Numarul ultimului invitat suplimentar = Numar total */}
                {formData.totalGuests}
                ):
              </h3>
              {/* Mapează peste array-ul additionalGuestsDetails pentru a randa câmpuri pentru fiecare invitat suplimentar */}
              {formData.additionalGuestsDetails.map((guest, index) => (
                <div
                  key={index} // Foloseste indexul ca key (atentie cu reordonarea, dar ok pentru adaugare/stergere la final)
                  style={{
                    marginBottom: '20px',
                    padding: '15px',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                  }}
                >
                  {/* Titlu pentru fiecare invitat suplimentar */}
                  <h4
                    style={{
                      marginBottom: '10px',
                      fontSize: '16px',
                      color: '#333',
                    }}
                  >
                    Invitat #{index + 2}{' '}
                    {/* Index + 2 pentru că index începe de la 0, iar primul invitat suplimentar este al 2-lea din grup */}
                  </h4>
                  {/* Input: Nume Invitat Suplimentar */}
                  <div style={{ marginBottom: '15px' }}>
                    <label
                      htmlFor={`additionalGuest-${index}-name-${id}`} // ID unic bazat pe index si id-ul widget-ului
                      style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold',
                        color: '#555',
                      }}
                    >
                      Nume:
                    </label>
                    <input
                      type="text"
                      id={`additionalGuest-${index}-name-${id}`} // ID unic
                      name={`additionalGuest-${index}-name`} // Nume pentru handler (format: additionalGuest-index-name)
                      value={guest.name} // Valoarea din state (din array)
                      onChange={handleInputChange} // Handler (proceseaza numele special)
                      required // Numele invitatilor suplimentari este obligatoriu
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
                  {/* Textarea: Restricții Dietetice Invitat Suplimentar (Opțional) */}
                  <div style={{ marginBottom: '0' }}>
                    {' '}
                    {/* Nu adaugă margin-bottom la ultimul element din div */}
                    <label
                      htmlFor={`additionalGuest-${index}-dietary-${id}`} // ID unic
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
                      id={`additionalGuest-${index}-dietary-${id}`} // ID unic
                      name={`additionalGuest-${index}-dietaryRestrictions`} // Nume pentru handler (format: additionalGuest-index-dietaryRestrictions)
                      value={guest.dietaryRestrictions} // Valoarea din state (din array)
                      onChange={handleInputChange} // Handler (proceseaza numele special)
                      rows={1} // Randuri vizibile (doar 1 sau 2 ca default)
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
                </div>
              ))}
            </div>
          )}
        {/* --- Butonul de Submit --- */}
        <button
          type="submit" // Declanseaza onSubmit al formularului
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
            // Adauga margin-top daca sectiunea cu invitati suplimentari este vizibila
            marginTop:
              formData.isAttending === 'yes' &&
              typeof formData.totalGuests === 'number' &&
              formData.totalGuests > 1
                ? '20px'
                : '15px', // Margin-top standard daca nu sunt invitati suplimentari
          }}
        >
          Trimite Confirmarea {/* Textul butonului */}
        </button>
      </form>
    </div>
  );
};

export default RsvpElement;
