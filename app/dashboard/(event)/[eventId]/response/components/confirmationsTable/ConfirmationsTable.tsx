import { Collapse } from 'antd'
import ConfirmationCardHeader from './ConfirmationCardHeader'
import { CloseOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons'
import './ConfirmationsTable.css'
import ConfirmationCardContent from './ConfirmationCardContent'

const ConfirmationsTable = () => {
  return (
    <div className="confirmations-container">
      <div className="statistics-container">
        <div className="statistic-card">
          <SendOutlined style={{ fontSize: '20px' }} /> Confirmari{' '}
          <span>30</span>
        </div>
        <div className="statistic-card">
          <SmileOutlined style={{ color: 'green', fontSize: '20px' }} />
          Nr adulti <span>28</span>
        </div>
        <div className="statistic-card">
          <CloseOutlined style={{ color: 'red' }} />
          Nr copii <span>2</span>
        </div>
      </div>
      <div className="confirmations-table-container">
        <div className="confirmations-table-header">
          <span>Invitat</span>
          <span>Data</span>
          <span>Vizualizari</span>
          <span>Detalii</span>
        </div>
        <div className="collapsible-table">
          <Collapse
            collapsible="icon"
            accordion
            expandIconPosition="end"
            items={[
              {
                key: '1',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '2',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '3',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '4',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '5',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '6',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '7',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '8',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '9',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '10',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '11',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '12',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '13',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '14',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
              {
                key: '15',
                label: <ConfirmationCardHeader />,
                children: <ConfirmationCardContent />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default ConfirmationsTable
