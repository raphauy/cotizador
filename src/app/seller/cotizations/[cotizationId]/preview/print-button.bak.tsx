"use client";

import { Button } from '@/components/ui/button';
import { CotizationDAO } from '@/services/cotization-services';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FileTextIcon } from 'lucide-react';
import { useRef } from 'react';
import PrintableCotization from './printable-cotization';

interface RequestEvaluationDocumentButtonProps {
  cotization: CotizationDAO;
}

const PrintButton2 = ({ cotization }: RequestEvaluationDocumentButtonProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    const element = contentRef.current;
    if (element) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const padding = 8; // Padding en mm
      let yPosition = padding;

      // Capturar y agregar Cabezal
      const cabezalElement = element.querySelector('.cabezal');
      if (cabezalElement) {
        const canvas = await html2canvas(cabezalElement as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - padding * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', padding, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + padding;
      }

      // Capturar y agregar DatosPresupuesto
      const datosPresupuestoElement = element.querySelector('.datos-presupuesto');
      if (datosPresupuestoElement) {
        const canvas = await html2canvas(datosPresupuestoElement as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - padding * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPosition + imgHeight > pageHeight - padding) {
          pdf.addPage();
          yPosition = padding;
        }

        pdf.addImage(imgData, 'PNG', padding, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + padding;
      }

      // Capturar y agregar cada trabajo
      const sections = Array.from(element.querySelectorAll('.work-section > .card'));
      for (const section of sections) {
        const canvas = await html2canvas(section as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - padding * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPosition + imgHeight > pageHeight - padding) {
          pdf.addPage();
          yPosition = padding;
        }

        pdf.addImage(imgData, 'PNG', padding, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + padding;
      }

      pdf.save(`Presupuesto-${cotization.label}.pdf`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button onClick={generatePDF} className="mt-10 gap-2 mb-5">
        <FileTextIcon className="size-4" /> Generar PDF
      </Button>
      <div className="p-10 border bg-white w-[1000px]">
        <div ref={contentRef}>
          <PrintableCotization cotization={cotization} />
        </div>
      </div>
      <Button onClick={generatePDF} className="mt-10 gap-2">
        <FileTextIcon className="size-4" /> Generar PDF
      </Button>
    </div>
  );
};

export default PrintButton2;
