'use client';

import '@/styles/globals.css';
import {
  FileExcelFilled,
  SendOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmationCard from './components/confirmationCard/ConfirmationCard';
import ActivityChart from './components/activityChart/ActivityChart';
import Image from 'next/image';
import TodoModal from '@/components/todoList/TodoModal';
import { useEventContext } from '@/core/context/EventContext';

// Varianta abonomant

const DashboardEventPage = () => {
  const router = useRouter();
  const [todoOpen, setTodoOpen] = useState(false);
  const [shrinkElement, setShrinkElement] = useState(false);
  const { eventInstance } = useEventContext();

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

  const onModalOk = () => {
    setTodoOpen(false);
  };

  const onModalClose = () => {
    setTodoOpen(false);
  };

  return (
    <div
      className={`dashboard-content-container ${shrinkElement ? 'shrink' : ''}`}
    >
      <div className="content-left">
        <div className="left-card">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2>{eventInstance?.eventName}</h2>
          </div>
          <Image
            alt="Event Thumbnail"
            src={eventInstance?.eventTemplateThumbnailUrl ?? ''}
            width={150}
            height={150}
          />
          <Button icon={<SendOutlined />} type="primary">
            Trimite Invitatia
          </Button>
          <div className="confirmations-left">
            <div className="accepted dotted-card">
              <span className="number">3</span>
              <span className="text secondary-text-color-light">
                Confirmari
              </span>
            </div>
            <div className="declined dotted-card">
              <span className="number">1</span>
              <span className="text secondary-text-color-light">Refuzuri</span>
            </div>
          </div>
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
          <ConfirmationCard />
          <ConfirmationCard />
          <ConfirmationCard />
          <ConfirmationCard />
          <ConfirmationCard />
        </div>
        <ActivityChart showActionButton />
        <div className="dashboard-card quick-actions">
          <h3 className="font-semibold">Actiuni rapide</h3>
          <div className="quick-actions-container">
            <div className="dotted-card quick-card">
              <span>Planificator Excel</span>
              <Button icon={<FileExcelFilled />} />
            </div>
            <div className="dotted-card quick-card">
              <span>Todo list</span>
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() => setTodoOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <TodoModal onClose={onModalClose} onOk={onModalOk} open={todoOpen} />
    </div>
  );
};

export default DashboardEventPage;
