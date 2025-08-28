
import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import MyResume from './MyResume'; 
import { Download, Loader2 } from 'lucide-react';

export default function DownloadResume() {
  const resumeRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadPdf = async () => {
    const input = resumeRef.current;
    if (!input) {
      return;
    }

    setLoading(true);

    try {
      const canvas = await html2canvas(input, {
        scale: 2, 
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasAspectRatio = canvasHeight / canvasWidth;

      const imgHeight = pdfWidth * canvasAspectRatio;

      const pdf = new jsPDF('p', 'mm', 'a4');

      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save('My-Resume.pdf');

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-[794px] flex justify-end mb-4">
      </div>

      <div ref={resumeRef}>
        <MyResume />
      </div>
    </div>
  );
}