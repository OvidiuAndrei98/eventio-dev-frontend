import {
  ElementType,
  EventQuestions,
  Guest,
  RsvpTemplateElement,
  TemplateElement,
} from '@/core/types';
import { addGuestsToEventBatch } from '@/service/guest/addGuestsToEventBatch';
import { Button, Form, FormProps, Input, InputNumber, Select } from 'antd';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { BREAKPOINTS, mergeResponsiveProperties } from '../constants';
import { InfoCircleOutlined } from '@ant-design/icons';
import { addErrorLog } from '@/service/logs/addErrorLog';

interface RsvpFormData {
  primaryGuestFirstName: string;
  primaryGuestLastName: string;
  primaryDietaryRestrictions: string;
  isAttending: 'yes' | 'no' | '';
  totalGuests: number | '';
  additionalGuestsDetails: Array<{
    firstName: string;
    lastName: string;
    dietaryRestrictions: string;
  }>;
  primaryContactPhone?: string;
}

interface RsvpElementProps {
  id: string;
  eventId: string;
  userId: string;
  eventAditionalQuestions: EventQuestions[];
  activeBreakpoint: keyof typeof BREAKPOINTS | 'desktop';
  selectedElementId?: string;
  isSelected?: boolean;
  onSelect?: (element: TemplateElement) => void;
  editMode?: boolean;
}

/**
 * Componentă de widget care randează o secțiune completă de formular RSVP.
 * Colectează datele pentru persoana principală ȘI pentru invitații suplimentari.
 * La submit, creează documente separate în Firestore pentru FIECARE persoană.
 * Este concepută pentru a fi randată de componenta TemplateRenderer.
 */
const RsvpElement = ({
  id,
  position,
  style,
  name,
  disabled,
  responsive,
  activeBreakpoint,
  buttonStyle,
  title,
  eventId,
  userId,
  eventAditionalQuestions,
  isSelected,
  selectedElementId,
  onSelect,
  editMode,
}: RsvpTemplateElement & RsvpElementProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const finalElementProps = mergeResponsiveProperties<RsvpTemplateElement>(
    {
      id: id,
      type: ElementType.RSVP_ELEMENT,
      position: position,
      disabled: disabled,
      style: style,
      name: name,
      title: title,
      buttonStyle,
    },
    responsive,
    activeBreakpoint
  ) as RsvpTemplateElement;

  const [form] = Form.useForm();
  const [formData, setFormData] = useState<RsvpFormData>({
    primaryGuestFirstName: '',
    primaryGuestLastName: '',
    primaryContactPhone: '',
    primaryDietaryRestrictions: '',
    isAttending: '',
    totalGuests: '',
    additionalGuestsDetails: [],
  });

  const elementStyle: React.CSSProperties = {
    ...finalElementProps.style,
    margin: '48px auto',
  };

  const buttonElementStyle: React.CSSProperties = {
    color: `${finalElementProps.buttonStyle?.color}`,
    backgroundColor: `${finalElementProps.buttonStyle?.backgroundColor}`,
  };

  // --- Handler pentru Submitarea Formularului ---
  const handleSubmit: FormProps<RsvpFormData>['onFinish'] = async (
    values: RsvpFormData
  ) => {
    const guestsToSave: Guest[] = [];
    const submissionId = crypto.randomUUID();
    const submissionTime = new Date().getTime();

    if (
      values.isAttending === 'yes' &&
      values.primaryGuestFirstName?.trim() &&
      values.primaryGuestLastName?.trim()
    ) {
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
        firstName: values.primaryGuestFirstName.trim(),
        lastName: values.primaryGuestLastName.trim(),
        fullName: `${values.primaryGuestFirstName.trim()} ${values.primaryGuestLastName.trim()}`,
        dietaryRestrictions: values.primaryDietaryRestrictions?.trim() || '',
        isAttending: values.isAttending === 'yes',
        eventId: eventId,
        tableId: null,
        date: submissionTime,
        isPrimaryContact: true,
        primaryContactPhone: values.primaryContactPhone?.trim() || '',
        totalGuests:
          typeof values.totalGuests === 'number' ? values.totalGuests : 1,
        eventAditionalQuestions: additionalFields,
      });
    }

    if (
      values.isAttending === 'yes' &&
      typeof values.totalGuests === 'number' &&
      values.totalGuests > 1
    ) {
      for (const guestDetails of values.additionalGuestsDetails) {
        if (guestDetails.firstName.trim() && guestDetails.lastName.trim()) {
          guestsToSave.push({
            guestId: crypto.randomUUID(),
            submissionId: submissionId,
            firstName: guestDetails.firstName.trim(),
            lastName: guestDetails.lastName.trim(),
            fullName: `${guestDetails.firstName.trim()} ${guestDetails.lastName.trim()}`,
            dietaryRestrictions: guestDetails.dietaryRestrictions?.trim() || '',
            isAttending: true,
            eventId: eventId,
            tableId: null,
            date: submissionTime,
            isPrimaryContact: false,
          });
        }
      }
    }

    if (
      values.isAttending === 'no' &&
      values.primaryGuestFirstName?.trim() &&
      values.primaryGuestLastName?.trim()
    ) {
      guestsToSave.push({
        guestId: crypto.randomUUID(),
        submissionId: submissionId,
        firstName: values.primaryGuestFirstName.trim(),
        lastName: values.primaryGuestLastName.trim(),
        fullName: `${values.primaryGuestFirstName.trim()} ${values.primaryGuestLastName.trim()}`,
        dietaryRestrictions: values.primaryDietaryRestrictions?.trim() || '',
        isAttending: false,
        eventId: eventId,
        tableId: null,
        date: submissionTime, // Timestamp
        isPrimaryContact: true,
        primaryContactPhone: values.primaryContactPhone?.trim() || '',
      });
    }

    if (guestsToSave.length === 0) {
      console.warn('No valid guest data to save after processing form.');
      toast.info('No guest data to save.');
      return;
    }

    try {
      await addGuestsToEventBatch(eventId, userId, guestsToSave);

      toast.success(
        `Raspuns(uri) inregistrat(e) cu succes pentru ${guestsToSave.length} invitat(i)!`
      );

      // Resetăm state-ul local al formularului la valorile inițiale goale după submitarea cu succes
      setFormData({
        primaryGuestFirstName: '',
        primaryGuestLastName: '',
        primaryContactPhone: '', // Reseteaza si email-ul
        primaryDietaryRestrictions: '',
        isAttending: '',
        totalGuests: '',
        additionalGuestsDetails: [], // Reseteaza array-ul la gol
      });
      form.resetFields();
    } catch (error) {
      console.error('Error saving guests:', error);
      await addErrorLog(userId, {
        error: error instanceof Error ? error.message : String(error),
      });
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
      style={{ ...elementStyle }}
      className={`backdrop-blur-md rounded-sm p-4 bg-[#00000014] max-w-[450px] border-1 border-solid border-[#0000001a] w-full ${
        editMode && isSelected && selectedElementId === id
          ? 'ring-inset ring-2 ring-[#CB93D9]'
          : ''
      } 
    ${
      editMode && !isSelected && isHovered
        ? 'ring-inset ring-1 ring-[#CB93D9]'
        : ''
    } z-3 p-2 ${
        editMode
          ? disabled
            ? 'opacity-[0.5]'
            : 'opacity-[1]'
          : disabled
          ? 'hidden'
          : 'block'
      }`}
      id={id}
      onMouseEnter={editMode ? () => handleMouseEnter() : undefined}
      onMouseLeave={editMode ? () => handleMouseLeave() : undefined}
      onClick={
        editMode
          ? (e) => {
              if (id) {
                e.preventDefault();
                e.stopPropagation();
                onSelect && onSelect(finalElementProps);
              }
            }
          : undefined
      }
    >
      {editMode && (
        <>
          {isSelected && selectedElementId === id && (
            <div className="absolute top-[1px] right-[1px] bg-[#CB93D9] text-nowrap text-white p-[3px] rounded-[4px_4px_4px_0] z-10 text-xs">
              {name}
            </div>
          )}
          {!isSelected && isHovered && (
            <div className="absolute top-[-13px] left-[-2px] bg-[#CB93D9] text-nowrap text-white p-[3px] rounded-[4px_4px_4px_0] z-10 text-xs">
              {name}
            </div>
          )}
          {isHovered && (
            <div className="absolute top-0 left-0 bottom-0 right-0 !bg-purple-100/20 transition-colors duration-200"></div>
          )}
        </>
      )}

      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '24px',
        }}
      >
        {title}
      </h2>

      <Form
        className="rsvp-form"
        style={{ color: 'inherit' }}
        form={form}
        autoFocus={false}
        name="rsvp-form"
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <div className="flex flex-row gap-2 w-full">
          <Form.Item<RsvpFormData>
            style={{ color: 'inherit' }}
            label="Prenume"
            name="primaryGuestFirstName"
            rules={[
              {
                required: true,
                message: 'Prenumele este obligatorie.',
              },
            ]}
            className="!w-full"
          >
            <Input className="!w-full" />
          </Form.Item>
          <Form.Item<RsvpFormData>
            style={{ color: 'inherit' }}
            label="Nume"
            name="primaryGuestLastName"
            rules={[
              {
                required: true,
                message: 'Numele este obligatorie.',
              },
            ]}
            className="!w-full"
          >
            <Input className="!w-full" />
          </Form.Item>
        </div>
        <Form.Item<RsvpFormData>
          style={{ color: 'inherit' }}
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
          style={{ color: 'inherit' }}
          label="Restrictii dietetice:"
          name="primaryDietaryRestrictions"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item<RsvpFormData>
          style={{ color: 'inherit' }}
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
        {/* Randarea întrebărilor adiționale pentru RSVP */}
        {eventAditionalQuestions.map((q, index) => (
          <Form.Item
            style={{ color: 'inherit' }}
            rules={[
              {
                required: true,
                message: 'Aceasta intrebare este obligatorie',
              },
            ]}
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
            style={{ color: 'inherit' }}
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
                const list: {
                  firstName: string;
                  lastName: string;
                  dietaryRestrictions: string;
                }[] = [];

                if (value) {
                  for (let i = 0; i < value - 1; i++) {
                    list.push({
                      firstName: '',
                      lastName: '',
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
                color: 'inherit',
              }}
            >
              <h3
                style={{
                  marginBottom: '15px',
                  fontSize: '18px',
                  color: 'inherit',
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
                          color: 'inherit',
                        }}
                      >
                        Invitat #{index + 2}{' '}
                      </h4>
                      <div className="flex flex-row gap-2 w-full">
                        <Form.Item
                          style={{ color: 'inherit' }}
                          label="Prenume:"
                          name={[field.name, 'firstName']}
                          rules={[
                            {
                              required: true,
                              message: 'Prenumele este obligatoriu',
                            },
                          ]}
                          className="w-full"
                        >
                          <Input className="w-full" />
                        </Form.Item>
                        <Form.Item
                          style={{ color: 'inherit' }}
                          label="Nume:"
                          name={[field.name, 'lastName']}
                          rules={[
                            {
                              required: true,
                              message: 'Numele este obligatoriu',
                            },
                          ]}
                          className="w-full"
                        >
                          <Input className="w-full" />
                        </Form.Item>
                      </div>
                      <Form.Item
                        style={{ color: 'inherit' }}
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
            style={buttonElementStyle}
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full"
          >
            Trimite răspuns
          </Button>
        </Form.Item>
      </Form>
      <div
        className="flex flex-row items-start gap-2 text-gray-500 text-xs mt-4"
        style={{ color: 'inherit', fontSize: '12px' }}
      >
        <InfoCircleOutlined />
        <span>
          Pentru a actualiza un răspuns anterior, vă rugăm să folosiți același
          număr de telefon
        </span>
      </div>
    </div>
  );
};

export default RsvpElement;
