'use client';

import '@/styles/globals.css';
import {
  ExclamationCircleOutlined,
  SendOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmationCard from './components/confirmationCard/ConfirmationCard';
import ActivityChart from './components/activityChart/ActivityChart';
import Image from 'next/image';
import { useEventContext } from '@/core/context/EventContext';
import { Guest } from '@/core/types';
import { queryLastGuestsByEventId } from '@/service/guest/queryLastGuestsByEventId';
import { toast } from 'sonner';
import { demoChartData } from '@/lib/demoStatsData';

// Varianta abonomant

const DashboardEventPage = () => {
  const router = useRouter();
  const [shrinkElement, setShrinkElement] = useState(false);
  const [guestList, setGuestList] = useState<Guest[]>([]);
  const { eventInstance } = useEventContext();
  const isPremiumOrAbove =
    eventInstance?.eventPlan === 'premium' ||
    eventInstance?.eventPlan === 'ultimate';

  useEffect(() => {
    const element = document.querySelector('.dashboard-content-container');
    if (element) {
      const observer = new ResizeObserver((entries) => {
        const e = entries[0]; // should be only one
        if (e.contentRect.width < 710) {
          setShrinkElement(true);
        } else {
          setShrinkElement(false);
        }
      });

      // start listening for size changes
      observer.observe(element);
    }
  }, []);

  useEffect(() => {
    if (eventInstance?.eventId) {
      try {
        queryGuestList(eventInstance.eventId);
      } catch (error) {
        toast.error('Eroare la incarcare date eveniment');
      }
    }
  }, [eventInstance]);

  const queryGuestList = async (eventId: string) => {
    const guests = await queryLastGuestsByEventId(eventId, 5);
    setGuestList(guests);
  };

  return (
    <div
      className={`dashboard-content-container ${shrinkElement ? 'shrink' : ''}`}
    >
      <div className="content-left flex flex-col gap-4">
        <div className="left-card">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2 className="font-semibold text-[#28282B] text-lg mb-2">
              {eventInstance?.eventName}
            </h2>
            <span className="text-gray-400 text-sm">
              {eventInstance?.eventType}
            </span>
            <span
              className={`text-sm ${
                eventInstance?.eventActive ? 'text-green' : 'text-red-500'
              }`}
            >
              {eventInstance?.eventActive ? (
                <Tag bordered={false} color="success">
                  Invitatie activa
                </Tag>
              ) : (
                <Tag bordered={false} color="error">
                  Invitatie inactiva
                </Tag>
              )}
            </span>
          </div>
          <Image
            className="object-cover w-[100px] h-[100px] rounded-lg shadow-md"
            alt="Event Thumbnail"
            src={eventInstance?.eventTemplateThumbnailUrl ?? ''}
            width={100}
            height={100}
          />
          <Button
            icon={<SendOutlined />}
            onClick={async () => {
              await navigator.clipboard.writeText(
                'https://planyvite.ro' + eventInstance?.eventInvitationLink
              );
              toast.success('Link copiat cu succes!');
            }}
            type="primary"
            disabled={!eventInstance?.eventActive}
          >
            Trimite Invitatia
          </Button>
          <Tag
            className="!text-wrap"
            bordered={false}
            icon={<ExclamationCircleOutlined />}
            color="warning"
          >
            Linkul o sa functioneze doar cand invitatia este activa
          </Tag>
        </div>
        <div className="left-card !p-2">
          <Tag
            className="!text-wrap !m-0"
            bordered={false}
            icon={<ExclamationCircleOutlined />}
            color="processing"
          >
            Pentru a importa o invitatie externa, se poate seta in format
            png/jpg intr-o sectiune goala.
          </Tag>
        </div>
      </div>
      <div className="content-right">
        <div className="dashboard-card confirmations">
          <div className="card-header">
            <div>
              <h3 className="font-semibold">Raspunsuri</h3>
              <span>Ultimele 5 rezultate</span>
            </div>
            <Button
              type="default"
              onClick={() =>
                router.push(`/dashboard/${eventInstance?.eventId}/response`)
              }
            >
              Vezi tot
            </Button>
          </div>
          {!guestList.length && (
            <span className="text-xl text-gray-500 text-center my-[auto]">
              Nu aveti niciun invitat.
            </span>
          )}
          {guestList.map((guest) => (
            <ConfirmationCard guest={guest} key={guest.guestId} />
          ))}
        </div>
        <ActivityChart
          showActionButton
          data={!isPremiumOrAbove ? demoChartData : undefined}
          isBasicPlan={!isPremiumOrAbove}
        />
        <div className="dashboard-card quick-actions pb-[6px]">
          <h3 className="font-semibold">Actiuni rapide</h3>
          <div className="quick-actions-container">
            <div className="dotted-card quick-card relative">
              <span>Planificator Excel</span>
              <Button
                disabled={eventInstance?.eventPlan !== 'ultimate'}
                icon={
                  eventInstance?.eventPlan !== 'ultimate' ? (
                    <span
                      style={{
                        color: '#FFB347',
                        fontSize: '16px',
                      }}
                    >
                      <StarOutlined />
                    </span>
                  ) : null
                }
              >
                Descarca
              </Button>
            </div>
          </div>
        </div>
        <div className="pb-[1px]"></div>
      </div>
    </div>
  );
};

export default DashboardEventPage;
