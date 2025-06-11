'use client';

import Image from 'next/image';
import NoDataIllustration from '@/public/no-data-illustration.svg';
import { Guest } from '@/core/types';
import { useContext, useEffect, useRef, useState } from 'react';
import SadFaceIcon from '@/public/sad-face.svg';
import {
  Button,
  Input,
  InputRef,
  Space,
  Table,
  TableColumnType,
  TableProps,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined, StarOutlined } from '@ant-design/icons';
import { EventContext } from '@/core/context/EventContext';

type DataIndex = keyof Guest;

interface RefusalsTableProps {
  guests: Guest[];
}

const RefusalsTable = ({ guests }: RefusalsTableProps) => {
  const [declinedGuests, setDeclinedGuests] = useState<Guest[]>([]);
  const searchInput = useRef<InputRef>(null);
  const [windowSize, setWindowSize] = useState<number>(0);
  const { eventInstance } = useContext(EventContext);

  const isBasicPlan =
    !eventInstance?.eventPlan || eventInstance.eventPlan === 'basic';

  useEffect(() => {
    if (typeof window != 'undefined') {
      // Set initial value of window witth
      setWindowSize(window.innerWidth);

      window.addEventListener('resize', () => {
        setWindowSize(window.innerWidth);
      });
    }
  }, []);

  useEffect(() => {
    const declinedGuestsList = guests.filter((guest) => !guest.isAttending);
    setDeclinedGuests(declinedGuestsList);
  }, [guests]);

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
      title: 'Telefon',
      width: 'auto',
      align: 'center',
      dataIndex: 'primaryContactPhone',
      key: 'primaryContactPhone',
      render: (
        _: any, // eslint-disable-line
        record: Guest
      ) => (record.primaryContactPhone ? record.primaryContactPhone : '-'),
    },
  ];

  const data: Guest[] = declinedGuests;

  if (declinedGuests.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <h1 className="primary-title text-center">
          Din fericire, nu exista niciun refuz
        </h1>
        <Image src={NoDataIllustration} alt="No-data" />
      </div>
    );
  }

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
        <div className="flex justify-between mb-2 items-center">
          <span className="secondary-title !text-lg md:!text-2xl">
            Raspunsuri refuzate
            {isBasicPlan && (
              <span style={{ color: '#FFB347', marginLeft: 6 }}>
                <StarOutlined />
              </span>
            )}
          </span>
          <div className="bg-[#FFEBEB] p-2 md:py-3 md:px-3 flex gap-2 items-center rounded-md border-1 border-dotted border-[#FF001B]">
            <Image
              src={SadFaceIcon}
              alt="sad-face"
              width={windowSize < 780 ? 14 : 20}
              height={windowSize < 780 ? 14 : 20}
              style={{ color: 'rebeccapurple' }}
            />
            Refuzuri
            <span>{declinedGuests.length}</span>
          </div>
        </div>
        <Table<Guest>
          columns={
            windowSize < 780
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

export default RefusalsTable;
