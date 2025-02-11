import {
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { Button, Table, TableProps } from 'antd'
import './SummaryTable.css'
import SadFaceIcon from '../../../../public/sad-face.svg'
import Image from 'next/image'

interface DataType {
  key: string
  guest: string
  sent: boolean
  seen: boolean
  confirmed: boolean
}

const SummaryTable = () => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Invitat',
      dataIndex: 'guest',
      key: 'guest',
    },
    {
      title: 'Trimisa',
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
      title: 'Vizualizata',
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
      title: 'Confirmata',
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
      key: 'action',
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
      key: '3',
      guest: 'Joe Black',
      sent: true,
      seen: false,
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
      key: '3',
      guest: 'Joe Black',
      sent: true,
      seen: false,
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
      key: '3',
      guest: 'Joe Black',
      sent: true,
      seen: false,
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
      key: '3',
      guest: 'Joe Black',
      sent: true,
      seen: false,
      confirmed: false,
    },
    {
      key: '3',
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
          <SendOutlined style={{ fontSize: '20px' }} /> Trimise <span>180</span>
        </div>
        <div className="statistic-card">
          <SmileOutlined style={{ color: 'green', fontSize: '20px' }} />
          Confirmate <span>120</span>
        </div>
        <div className="statistic-card">
          <Image
            src={SadFaceIcon}
            alt="sad-face"
            width={20}
            height={20}
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
        <Table<DataType> columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default SummaryTable
