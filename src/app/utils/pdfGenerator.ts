import { jsPDF } from 'jspdf';

export interface RecordItem {
  id: number;
  name: string;
  state: string;
  location: string;
  photos: string[];
  details: string;
  fullData?: any;
  aiCategory?: string;
  createdAt?: string;
}

export function createRecordPDF(record: RecordItem): {
  doc: jsPDF;
  fileName: string;
  blob: Blob;
  file: File;
} {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Cabeçalho Institucional TATU FAZ
  doc.setFillColor(180, 83, 9); // amber-700
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('TATU FAZ', 15, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Sistema de Registro Arqueológico - Relatório Técnico de Achado', 15, 20);

  doc.setFontSize(9);
  doc.text(`ID: #${record.id}`, pageWidth - 15, 13, { align: 'right' });
  doc.text(record.createdAt || new Date().toLocaleDateString('pt-BR'), pageWidth - 15, 20, { align: 'right' });

  y = 38;

  // Título do Achado
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(record.name, 15, y);
  y += 7;

  // Badges de Estado e Categoria IA
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(`Estado / Regionalização: ${record.state}`, 15, y);
  y += 6;

  if (record.aiCategory) {
    doc.setFillColor(243, 232, 255);
    doc.setDrawColor(192, 132, 252);
    doc.roundedRect(15, y, pageWidth - 30, 18, 2, 2, 'FD');

    doc.setTextColor(107, 33, 168);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Catalogação Sugerida por IA: ${record.aiCategory}`, 20, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(
      'Categorizado automaticamente com base em análise de achados similares no banco de dados.',
      20,
      y + 13
    );
    y += 24;
  } else {
    y += 4;
  }

  // Detalhes Técnicos
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  const detailLines = doc.splitTextToSize(record.details || 'Sem detalhes adicionais.', pageWidth - 40);
  const detailBoxHeight = Math.max(28, detailLines.length * 6 + 16);
  doc.roundedRect(15, y, pageWidth - 30, detailBoxHeight, 2, 2, 'FD');

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DETALHES TÉCNICOS', 20, y + 8);

  doc.setTextColor(55, 65, 81);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(detailLines, 20, y + 15);
  y += detailBoxHeight + 6;

  // Localização GPS
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(15, y, pageWidth - 30, 18, 2, 2, 'FD');

  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('LOCALIZAÇÃO GPS', 20, y + 7);

  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(record.location, 20, y + 13);
  y += 26;

  // Fotos Anexadas
  if (record.photos && record.photos.length > 0) {
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`FOTOS ANEXADAS (${record.photos.length})`, 15, y);
    y += 5;

    const imgWidth = (pageWidth - 36) / 2;
    const imgHeight = 60;

    for (let i = 0; i < record.photos.length; i++) {
      const col = i % 2;
      if (col === 0 && y + imgHeight > 275) {
        doc.addPage();
        y = 20;
      }
      const x = 15 + col * (imgWidth + 6);
      try {
        doc.addImage(record.photos[i], 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
        doc.setDrawColor(209, 213, 219);
        doc.rect(x, y, imgWidth, imgHeight);
      } catch {
        // Ignora imagem inválida
      }
      if (col === 1 || i === record.photos.length - 1) {
        y += imgHeight + 6;
      }
    }
  }

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Gerado pelo aplicativo TATU FAZ (Engenheiros do Açaí) • Página ${p} de ${pageCount}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  const safeName = record.name.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Achado';
  const fileName = `TATU_FAZ_${safeName}_${record.id}.pdf`;
  const blob = doc.output('blob');
  const file = new File([blob], fileName, { type: 'application/pdf' });

  return { doc, fileName, blob, file };
}
