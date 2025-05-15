import { Guest } from '@/core/types';
import { clsx, type ClassValue } from 'clsx';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { twMerge } from 'tailwind-merge';
import XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleSideMenuNavigation = (
  info: { title: string; url: string },
  router: AppRouterInstance
) => {
  router.push(info.url);
};

export const createXlsxWorkbook = (
  guests: {
    tableName: string;
    guests: Guest[];
  }[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sheetData: any[][] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles: Record<string, any> = {};
  let currentRow = 0;
  let tableStartRow = 0;

  guests.forEach((item) => {
    const tableName = item.tableName;
    const guests = item.guests;

    // Adaugă header-ul tabelului pentru masa curentă
    sheetData.push([`Masa: ${tableName}`]);
    const tableNameRow = currentRow;
    currentRow++;

    // Adaugă header-ul coloanei cu stil
    sheetData.push(['Nume']);
    const headerRow = currentRow;
    currentRow++;

    // Adaugă invitații pentru masa curentă
    guests.forEach((guest) => {
      sheetData.push([guest.name]);
      currentRow++;
    });

    const tableEndRow = currentRow - 1;

    // Definește stilurile pentru header-ul tabelului (numele mesei)
    for (let col = 0; col < 1; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: tableNameRow, c: col });
      styles[cellAddress] = { font: { bold: true, sz: 14 } };
    }

    // Definește stilurile pentru header-ul coloanei ("Nume")
    for (let col = 0; col < 1; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
      styles[cellAddress] = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'D3D3D3' } },
        border: { bottom: { style: 'thin', color: { auto: 1 } } },
      };
    }

    // Definește stilurile pentru bordura tabelului
    for (let row = tableStartRow + 1; row <= tableEndRow; row++) {
      for (let col = 0; col < 1; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!styles[cellAddress]) styles[cellAddress] = {};
        styles[cellAddress].border = {
          top: { style: 'thin', color: { auto: 1 } },
          bottom: { style: 'thin', color: { auto: 1 } },
          left: { style: 'thin', color: { auto: 1 } },
          right: { style: 'thin', color: { auto: 1 } },
        };
      }
    }

    // Actualizează rândul de început pentru următorul tabel
    tableStartRow = currentRow;

    // Adaugă un rând gol pentru a separa tabelele
    sheetData.push([]);
    currentRow++;
  });

  // Creează worksheet-ul
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet['!style'] = styles; // Aplică stilurile

  // Adaugă worksheet-ul la workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invitați');
  XLSX.writeFile(workbook, 'Lista_Invitati.xlsx', { compression: true });
};
