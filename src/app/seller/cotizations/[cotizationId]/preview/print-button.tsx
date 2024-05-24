"use client";

import { Button } from '@/components/ui/button';
import { completeWithZeros } from '@/lib/utils';
import { CotizationDAO } from '@/services/cotization-services';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ChevronLeft, FileTextIcon } from 'lucide-react';
import { useRef } from 'react';
import PrintableCotization from './printable-cotization';
import { useRouter } from 'next/navigation';

interface RequestEvaluationDocumentButtonProps {
  cotization: CotizationDAO;
}

const PrintButton2 = ({ cotization }: RequestEvaluationDocumentButtonProps) => {
  const contentRef = useRef<HTMLDivElement>(null)

  const router= useRouter()

  const generatePDF = async () => {
    const element = contentRef.current;
    if (element) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const paddingX = 10; // Padding horizontal en mm
      const paddingY = 4; // Padding vertical en mm
      let yPosition = paddingY;

      // Capturar y agregar Cabezal
      const cabezalElement = element.querySelector('.cabezal');
      if (cabezalElement) {
        const canvas = await html2canvas(cabezalElement as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - paddingX * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', paddingX, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + paddingY;
      }

      // Capturar y agregar DatosPresupuesto
      const datosPresupuestoElement = element.querySelector('.datos-presupuesto');
      if (datosPresupuestoElement) {
        const canvas = await html2canvas(datosPresupuestoElement as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - paddingX * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPosition + imgHeight > pageHeight - paddingY) {
          pdf.addPage();
          yPosition = paddingY;
        }

        pdf.addImage(imgData, 'PNG', paddingX, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + paddingY;
      }

      // Capturar y agregar cada trabajo
      const sections = Array.from(element.querySelectorAll('.work-section > .card'));
      for (const section of sections) {
        const canvas = await html2canvas(section as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - paddingX * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPosition + imgHeight > pageHeight - paddingY) {
          pdf.addPage();
          yPosition = paddingY;
        }

        pdf.addImage(imgData, 'PNG', paddingX, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + paddingY;
      }

      // Capturar y agregar Notas
      const notasElement = element.querySelector('.notas');
      if (notasElement) {
        const canvas = await html2canvas(notasElement as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - paddingX * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPosition + imgHeight > pageHeight - paddingY) {
          pdf.addPage();
          yPosition = paddingY;
        }

        pdf.addImage(imgData, 'PNG', paddingX, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + paddingY;
      }


      pdf.save(`Presupuesto-${"#" + completeWithZeros(cotization.number)}.pdf`);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="w-[1000px]">
        <Button variant="link" onClick={() => router.back()} className="px-0 place-self-start">
            <ChevronLeft className="w-5 h-5" /> Volver
        </Button>
      </div>

      <div className="px-10 py-0 border bg-white w-[1000px]">
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
