'use client';

import {
  CheckCircleOutlined,
  MobileOutlined,
  PlusOutlined,
  SearchOutlined,
  SmileOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Button, Input, InputRef } from 'antd';
import './SummaryTable.css';
import SadFaceIcon from '@/public/sad-face.svg';
import Image from 'next/image';
import { useContext, useRef } from 'react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { useIsMobile } from '@/hooks/use-mobile';
import { Guest } from '@/core/types';
import { EventContext } from '@/core/context/EventContext';
import { deleteGuestById } from '@/service/guest/deleteGuestById';
import SummaryRow from './SummaryRow';

interface SummaryTableProps {
  guests: Guest[];
  updateGuests?: (guests: Guest[]) => void;
}

const SummaryTable = ({ guests, updateGuests }: SummaryTableProps) => {
  const searchInput = useRef<InputRef>(null);
  const { eventInstance } = useContext(EventContext);

  const isBasicPlan =
    !eventInstance?.eventPlan || eventInstance.eventPlan === 'basic';

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => {
    confirm();
  };

  const deleteGuest = async (
    guestId: string,
    eventId: string,
    guestSubmissionsTime: string,
    attending: boolean
  ) => {
    await deleteGuestById(guestId, eventId, guestSubmissionsTime, attending);
    if (typeof guests !== 'undefined' && updateGuests) {
      const updatedGuests = guests.filter((guest) => guest.guestId !== guestId);
      updateGuests(updatedGuests);
    }
  };

  return (
    <div className="summary-container-outer">
      <div className="summary-container">
        {isBasicPlan && (
          <div className="text-[var(--primary-color)] text-center font-medium response-alert">
            Pentru a vedea toate răspunsurile, ai nevoie de planul{' '}
            <span className="font-bold text-[var(--premium-color)]">
              Premium
            </span>{' '}
            sau <span className="font-bold">Ultimate</span>.
          </div>
        )}
        <div className="table-header">
          <div className="flex row items-center justify-between">
            <div className="info-container">
              <span className="secondary-title">
                Sumar raspunsuri
                {isBasicPlan && (
                  <span style={{ color: '#FFB347', marginLeft: 6 }}>
                    <StarOutlined />
                  </span>
                )}
              </span>
              <span className="secondary-text-color-light ">
                Invitatii si statusul lor
              </span>
            </div>
            <Button type="primary" icon={<PlusOutlined />}>
              Invitat
            </Button>
          </div>
          <div className="flex row items-center justify-between border p-[8px] gap-[16px]">
            <Input
              placeholder="Cauta invitat"
              suffix={<SearchOutlined />}
              className="max-w-[200px]"
            />
            <div className="statistics-container">
              <div className="statistic-card">
                <SmileOutlined
                  style={{ color: 'green', fontSize: useIsMobile() ? 12 : 20 }}
                />
                Confirmate
                <span>
                  {guests.filter((guest) => guest.isAttending).length}
                </span>
              </div>
              <div className="statistic-card">
                <Image
                  src={SadFaceIcon}
                  alt="sad-face"
                  width={useIsMobile() ? 12 : 20}
                  height={useIsMobile() ? 12 : 20}
                  style={{ color: 'rebeccapurple' }}
                />
                Refuzate
                <span>
                  {guests.filter((guest) => !guest.isAttending).length}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="table-container">
          <section className="summary-header item">
            <span className="guest-name">Nume Invitat</span>
            <span className="guest-phone">
              {useIsMobile() ? <MobileOutlined /> : 'Telefon'}
            </span>
            <span className="guest-date">Data</span>
            <span className="guest-status">{<CheckCircleOutlined />}</span>
            <span className="guest-action">Acțiune</span>
          </section>
          {guests
            .filter((g) => g)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((guest) => (
              <SummaryRow
                key={guest.guestId}
                guest={guest}
                deleteGuest={deleteGuest}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryTable;
