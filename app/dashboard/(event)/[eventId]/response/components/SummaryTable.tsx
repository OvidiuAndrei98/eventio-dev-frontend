'use client';

import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  MobileOutlined,
  SearchOutlined,
  SmileOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Button,
  Input,
  InputRef,
  Space,
  Table,
  TableColumnType,
  TableProps,
} from 'antd';
import './SummaryTable.css';
import SadFaceIcon from '@/public/sad-face.svg';
import Image from 'next/image';
import { useContext, useRef } from 'react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { useIsMobile } from '@/hooks/use-mobile';
import { Guest } from '@/core/types';
import { EventContext } from '@/core/context/EventContext';

type DataIndex = keyof Guest;

interface SummaryTableProps {
  guests: Guest[];
}

const SummaryTable = ({ guests }: SummaryTableProps) => {
  const searchInput = useRef<InputRef>(null);
  const { eventInstance } = useContext(EventContext);

  const isBasicPlan =
    !eventInstance?.eventPlan || eventInstance.eventPlan === 'basic';

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => {
    confirm();
  };

  const handleReset = (
    clearFilters: () => void,
    confirm: ({ closeDropdown }: { closeDropdown: boolean }) => void
  ) => {
    clearFilters();
    confirm({ closeDropdown: false });
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<Guest> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Cauta invitat`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      (record[dataIndex] ?? '')
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) => text,
  });

  const columns: TableProps<Guest>['columns'] = [
    {
      title: 'Invitat',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: useIsMobile() ? <MobileOutlined /> : 'Telefon',
      width: useIsMobile() ? '50px' : 'auto',
      align: 'center',
      dataIndex: 'primaryContactPhone',
      key: 'primaryContactPhone',
      render: (
        _: any, // eslint-disable-line
        record: Guest
      ) => (record.primaryContactPhone ? record.primaryContactPhone : '-'),
    },
    {
      title: <CheckCircleOutlined />,
      width: 50,
      align: 'center',
      dataIndex: 'confirmed',
      key: 'confirmed',
      render: (
        _: any, // eslint-disable-line
        record: Guest
      ) =>
        record.isAttending ? (
          <CheckOutlined style={{ color: 'green' }} />
        ) : (
          <CloseOutlined style={{ color: 'red' }} />
        ),
    },
    {
      width: useIsMobile() ? 100 : 'auto',
      key: 'action',
      align: 'center',
      render: (_: any, record: Guest) => <Button>Sterge</Button>, // eslint-disable-line
    },
  ];

  const data: Guest[] = guests;

  return (
    <div className="summary-container">
      <div className="table-container">
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
          <div className="statistics-container">
            <div className="statistic-card">
              <SmileOutlined
                style={{ color: 'green', fontSize: useIsMobile() ? 12 : 20 }}
              />
              Confirmate
              <span>{guests.filter((guest) => guest.isAttending).length}</span>
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
              <span>{guests.filter((guest) => !guest.isAttending).length}</span>
            </div>
          </div>
        </div>
        <Table<Guest>
          columns={
            useIsMobile()
              ? columns
              : [
                  ...columns.slice(0, 2),
                  {
                    title: 'Data',
                    width: 'auto',
                    align: 'center',
                    dataIndex: 'date',
                    key: 'date',
                    render: (
                      _: any, // eslint-disable-line
                      record: Guest
                    ) => (
                      <span>
                        {new Date(record.date).toLocaleString('RO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    ),
                  },
                  ...columns.slice(2),
                ]
          }
          dataSource={data}
        />
      </div>
    </div>
  );
};

export default SummaryTable;
