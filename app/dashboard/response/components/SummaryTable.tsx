'use client'

import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  SearchOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import {
  Button,
  Input,
  InputRef,
  Space,
  Table,
  TableColumnType,
  TableProps,
} from 'antd'
import './SummaryTable.css'
import SadFaceIcon from '../../../../public/sad-face.svg'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FilterDropdownProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import { useIsMobile } from '@/hooks/use-mobile'

interface DataType {
  key: string
  guest: string
  sent: boolean
  seen: boolean
  confirmed: boolean
}

type DataIndex = keyof DataType

const SummaryTable = () => {
  const [windowHeight, setWindowHeight] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  // Update window height on resize
  useEffect(() => {
    if (typeof window == 'undefined') {
      return
    }

    setWindowHeight(window.innerHeight)
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: ({ closeDropdown }: { closeDropdown: boolean }) => void
  ) => {
    clearFilters()
    setSearchText('')
    confirm({ closeDropdown: false })
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
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
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
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
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
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
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100)
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Invitat',
      dataIndex: 'guest',
      key: 'guest',
      ...getColumnSearchProps('guest'),
    },
    {
      title: useIsMobile() ? <SendOutlined /> : 'Trimisa',
      width: useIsMobile() ? '50px' : 'auto',
      align: 'center',
      dataIndex: 'sent',
      key: 'sent',
      render: (
        _: any, // eslint-disable-line
        record: DataType
      ) =>
        record.sent ? (
          <CheckOutlined style={{ color: 'green' }} />
        ) : (
          <CloseOutlined style={{ color: 'red' }} />
        ),
    },
    {
      title: useIsMobile() ? <EyeOutlined /> : 'Vizualizata',
      width: useIsMobile() ? '50px' : 'auto',
      align: 'center',
      dataIndex: 'seen',
      key: 'seen',
      render: (
        _: any, // eslint-disable-line
        record: DataType
      ) =>
        record.seen ? (
          <CheckOutlined style={{ color: 'green' }} />
        ) : (
          <CloseOutlined style={{ color: 'red' }} />
        ),
    },
    {
      title: useIsMobile() ? <CheckCircleOutlined /> : 'Confirmata',
      width: useIsMobile() ? '50px' : 'auto',
      align: 'center',
      dataIndex: 'confirmed',
      key: 'condfirmed',
      render: (
        _: any, // eslint-disable-line
        record: DataType
      ) =>
        record.confirmed ? (
          <CheckOutlined style={{ color: 'green' }} />
        ) : (
          <CloseOutlined style={{ color: 'red' }} />
        ),
    },
    {
      width: useIsMobile() ? 100 : 'auto',
      key: 'action',
      align: 'center',
      render: (_: any, record: DataType) => <Button>Sterge</Button>, // eslint-disable-line
    },
  ]

  const data: DataType[] = [
    {
      key: '1',
      guest: 'John Brown',
      sent: true,
      seen: true,
      confirmed: true,
    },
    {
      key: '2',
      guest: 'Jim Green',
      sent: true,
      seen: true,
      confirmed: false,
    },
    {
      key: '3',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
    {
      key: '4',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
    {
      key: '5',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
    {
      key: '6',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
    {
      key: '7',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
    {
      key: '8',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
    {
      key: '9',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
    {
      key: '10',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
    {
      key: '11',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
  ]

  return (
    <div className="summary-container">
      <div className="statistics-container">
        <div className="statistic-card">
          <SendOutlined style={{ fontSize: useIsMobile() ? 12 : 20 }} /> Trimise{' '}
          <span>180</span>
        </div>
        <div className="statistic-card">
          <SmileOutlined
            style={{ color: 'green', fontSize: useIsMobile() ? 12 : 20 }}
          />
          Confirmate <span>120</span>
        </div>
        <div className="statistic-card">
          <Image
            src={SadFaceIcon}
            alt="sad-face"
            width={useIsMobile() ? 12 : 20}
            height={useIsMobile() ? 12 : 20}
            style={{ color: 'rebeccapurple' }}
          />
          Refuzate <span>31</span>
        </div>
      </div>
      <div className="table-container">
        <div className="table-header">
          <div className="info-container">
            <span className="secondary-title">Sumar raspunsuri</span>
            <span className="secondary-text-color-light ">
              Invitatii si statusul lor
            </span>
          </div>
        </div>
        <Table<DataType>
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 20 }}
          scroll={{ y: windowHeight / 3 }}
        />
      </div>
    </div>
  )
}

export default SummaryTable
