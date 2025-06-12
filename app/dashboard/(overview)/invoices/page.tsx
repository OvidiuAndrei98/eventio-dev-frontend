'use client';

import { PlanyviteInvoice } from '@/core/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { listDocuments } from '@/lib/oblioApi/oblioApi';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Table, TableProps } from 'antd';
import { ViewIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<PlanyviteInvoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns: TableProps<PlanyviteInvoice>['columns'] = [
    {
      title: 'Factura #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Client',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Data',
      dataIndex: 'issueDate',
      key: 'issueDate',
    },
    {
      title: 'Suma',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => {
        return new Intl.NumberFormat('ro-RO', {
          style: 'currency',
          currency: 'RON',
        }).format(amount);
      },
    },
    {
      title: useIsMobile() ? <ViewIcon /> : 'Vezi factura',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: useIsMobile() ? 20 : 'atuo',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars @typescript-eslint/no-explicit-any
      render: (_: any, record: PlanyviteInvoice) => (
        <Button
          className="!bg-gray-100 hover:!bg-[#f8e5fd]"
          icon={<EyeOutlined />}
          type="text"
          onClick={() => {
            if (record.invoiceLink) {
              window.open(record.invoiceLink, '_blank');
            } else {
              console.error('Invoice link is not available');
            }
          }}
        ></Button>
      ),
    },
  ];

  const getInvoices = async () => {
    setLoading(true);
    try {
      const response = listDocuments('invoice', {
        'client[email]': 'andrei.penica@gmail.com',
      });
      const data = await response;
      const mapedInvoices = mapInvoicesToInternalFormat(data.data);
      setInvoices(mapedInvoices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
      setLoading(false);
    }
  };

  const mapInvoicesToInternalFormat = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invoices: Record<string, any>[]
  ): PlanyviteInvoice[] => {
    return invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.seriesName + invoice.number,
      customerName: invoice.client?.name || '',
      amount: Number(invoice.total) || 0,
      cancelled: invoice.cancelled || '',
      colected: invoice.colected || '',
      invoiceLink: invoice.link || '',
      storned: invoice.storned || '',
      issueDate: invoice.issueDate,
    }));
  };

  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <div className="bg-[#F6F6F6] min-h-screen p-6">
      <div className="container min-h-[300px] my-4 mx-auto p-4 bg-white rounded-md shadow-sm relative">
        <h1 className="text-2xl font-bold mb-6">Facturi</h1>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <span className="loader"></span>
          </div>
        ) : (
          <Table<PlanyviteInvoice>
            scroll={{ x: 'max-content', y: 'calc(84vh - 300px)' }}
            columns={columns}
            dataSource={invoices}
          />
        )}
      </div>
    </div>
  );
}
