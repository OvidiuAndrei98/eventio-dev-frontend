import { EventQuestions, Guest } from '@/core/types';
import { addGuestsToEventBatch } from '@/service/guest/addGuestsToEventBatch';
import { Button, Form, FormProps, Input, InputNumber, Select } from 'antd';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface RsvpFormData {
  primaryGuestName: string;
  primaryDietaryRestrictions: string;
  isAttending: 'yes' | 'no' | '';
  totalGuests: number | '';
  additionalGuestsDetails: Array<{
    name: string;
    dietaryRestrictions: string;
  }>;
  primaryContactPhone?: string;
}

interface RsvpElementProps {
  id: string;
  eventId: string;
  userId: string;
  eventAditionalQuestions: EventQuestions[];
}

/**
 * Componentă de widget care randează o secțiune completă de formular RSVP.
 * Colectează datele pentru persoana principală ȘI pentru invitații suplimentari.
 * La submit, creează documente separate în Firestore pentru FIECARE persoană.
 * Este concepută pentru a fi randată de componenta TemplateRenderer.
 */
const RsvpElement: React.FC<RsvpElementProps> = ({
  id,
  eventId,
  userId,
  eventAditionalQuestions,
}) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<RsvpFormData>({
    primaryGuestName: '',
    primaryContactPhone: '',
    primaryDietaryRestrictions: '',
    isAttending: '',
    totalGuests: '',
    additionalGuestsDetails: [],
  });

  // --- Handler pentru Submitarea Formularului ---
  const handleSubmit: FormProps<RsvpFormData>['onFinish'] = async (
    values: RsvpFormData
  ) => {
    // --- Pregatirea Datelor pentru Salvare (Crearea obiectelor IndividualGuest) ---
    const guestsToSave: Guest[] = [];
    const submissionId = crypto.randomUUID();
    const subbmisionTime = Date.now();

    if (values.isAttending === 'yes' && values.primaryGuestName?.trim()) {
      // Collect additional fields that are not part of RsvpFormData
      const additionalFields: { key: string; value: string }[] = [];
      Object.entries(values).forEach(([key, value]) => {
        if (!(key in formData)) {
          additionalFields.push({ key, value });
        }
      });

      guestsToSave.push({
        guestId: crypto.randomUUID(),
        submissionId: submissionId,
        name: values.primaryGuestName.trim(),
        dietaryRestrictions: values.primaryDietaryRestrictions?.trim() || '',
        isAttending: values.isAttending === 'yes',
        eventId: eventId,
        tableId: null,
        date: subbmisionTime,
        isPrimaryContact: true,
        primaryContactPhone: values.primaryContactPhone?.trim() || '',
        totalGuests:
          typeof values.totalGuests === 'number' ? values.totalGuests : 1,
        eventAditionalQuestions: additionalFields,
      });
    }

    // 2. Creeaza obiecte IndividualGuest pentru invitații suplimentari, DACA participa si numarul total e > 1
    if (
      values.isAttending === 'yes' &&
      typeof values.totalGuests === 'number' &&
      values.totalGuests > 1
    ) {
      for (const guestDetails of values.additionalGuestsDetails) {
        if (guestDetails.name.trim()) {
          guestsToSave.push({
            guestId: crypto.randomUUID(),
            submissionId: submissionId,
            name: guestDetails.name.trim(),
            dietaryRestrictions: guestDetails.dietaryRestrictions?.trim() || '',
            isAttending: true,
            eventId: eventId,
            tableId: null,
            date: subbmisionTime,
            isPrimaryContact: false,
          });
        }
      }
    }

    if (values.isAttending === 'no' && values.primaryGuestName?.trim()) {
      guestsToSave.push({
        guestId: crypto.randomUUID(),
        submissionId: submissionId,
        name: values.primaryGuestName.trim(),
        dietaryRestrictions: values.primaryDietaryRestrictions?.trim() || '',
        isAttending: false,
        eventId: eventId,
        tableId: null,
        date: subbmisionTime, // Timestamp
        isPrimaryContact: true,
        primaryContactPhone: values.primaryContactPhone?.trim() || '',
      });
    }

    // --- Apelul Serviciului pentru Salvarea Datelor ---
    if (guestsToSave.length === 0) {
      console.warn('No valid guest data to save after processing form.');
      toast.info('No guest data to save.');
      return;
    }

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
        primaryContactPhone: '', // Reseteaza si email-ul
        primaryDietaryRestrictions: '',
        isAttending: '',
        totalGuests: '',
        additionalGuestsDetails: [], // Reseteaza array-ul la gol
      });
      form.resetFields();
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
      className="backdrop-blur-sm rounded-sm p-4 bg-[#00000014] max-w-[450px] border-1 border-solid border-[#0000001a] w-full"
    >
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

      <Form
        form={form}
        autoFocus={false}
        name="table-edit"
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<RsvpFormData>
          label="Numele tau:"
          name="primaryGuestName"
          rules={[
            {
              required: true,
              message: 'Numele este obligatorie.',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<RsvpFormData>
          label="Numar de telefon:"
          name="primaryContactPhone"
          rules={[
            {
              required: true,
              message: 'Numarul de telefon este obligatoriu',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<RsvpFormData>
          label="Restrictii dietetice:"
          name="primaryDietaryRestrictions"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item<RsvpFormData>
          label="Vei participa?"
          name="isAttending"
          rules={[
            {
              required: true,
              message: 'Numarul de telefon este obligatoriu',
            },
          ]}
        >
          <Select
            placeholder={'--Alege--'}
            onChange={(value) => {
              setFormData((prevData) => {
                return {
                  ...prevData,
                  isAttending: value,
                };
              });
            }}
          >
            <Select.Option value="yes">Da</Select.Option>
            <Select.Option value="no">Nu</Select.Option>
          </Select>
        </Form.Item>
        {eventAditionalQuestions.map((q, index) => (
          <Form.Item
            label={q.qName}
            name={q.qName.replace(/\s+/g, '_')}
            key={q.qName + index}
          >
            <Select placeholder={'--Alege--'}>
              {q.qAnswers.map((qa, index) => (
                <Select.Option value={qa.value} key={index}>
                  {qa.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ))}
        {formData.isAttending === 'yes' && (
          <Form.Item<RsvpFormData>
            label="Număr total invitați (inclusiv tu):"
            name="totalGuests"
            rules={[
              {
                required: true,
                message: 'Numarul de invitati este obligatoriu',
              },
            ]}
          >
            <InputNumber
              required
              min={1}
              onChange={(value) => {
                const list: { name: string; dietaryRestrictions: string }[] =
                  [];

                if (value) {
                  for (let i = 0; i < value - 1; i++) {
                    list.push({
                      name: '',
                      dietaryRestrictions: '',
                    });
                  }
                }
                setFormData((prevData) => {
                  return {
                    ...prevData,
                    totalGuests: value ?? 1,
                    additionalGuestsDetails: list,
                  };
                });
                form.setFieldValue('additionalGuestsDetails', list);
              }}
            />
          </Form.Item>
        )}
        {form.getFieldValue('isAttending') === 'yes' &&
          typeof form.getFieldValue('totalGuests') === 'number' &&
          form.getFieldValue('totalGuests') > 1 && (
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
                Detalii Invitați Suplimentari (Persoana #{1 + 1} până la #
                {formData.totalGuests}
                ):
              </h3>
              <Form.List name="additionalGuestsDetails">
                {(fields) =>
                  fields.map((field, index) => (
                    <div
                      key={field.key}
                      style={{
                        marginBottom: '20px',
                        padding: '15px',
                        border: '1px solid #00000024',
                        borderRadius: '4px',
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
                      </h4>
                      <Form.Item
                        label="Nume:"
                        name={[field.name, 'name']}
                        rules={[
                          {
                            required: true,
                            message: 'Numele este obligatoriu',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Restricții Dietetice (opțional):"
                        name={[field.name, 'dietaryRestrictions']}
                      >
                        <Input.TextArea rows={3} />
                      </Form.Item>
                    </div>
                  ))
                }
              </Form.List>
            </div>
          )}
        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full"
          >
            Trimite raspuns
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RsvpElement;
