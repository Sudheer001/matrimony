import React from 'react';

const PdfShareComponent = () => {
  const handleSharePdf = async () => {
    if (navigator.share) {
      try {
        // Replace with your actual PDF data or fetching logic
        const pdfBlob = new Blob(['%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj 4 0 obj<</Length 10>>stream\nBT/F1 12 Tf 72 720 Td (Hello World) TjET\nendstream\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000074 00000 n\n0000000160 00000 n\n0000000252 00000 n\ntrailer<</Size 5/Root 1 0 R>>startxref\n346\n%%EOF'], { type: 'application/pdf' });
        const pdfFile = new File([pdfBlob], 'sample.pdf', { type: 'application/pdf' });

        const shareData = {
          files: [pdfFile],
          title: 'Sample PDF',
          text: 'Here is a sample PDF document.',
        };

        await navigator.share(shareData);
        console.log('PDF shared successfully!');
      } catch (error) {
      }
    } else {
      alert('Web Share API is not supported in this browser/device.');
    }
  };

  return (
    <button onClick={handleSharePdf}>Share PDF via WhatsApp</button>
  );
};

export default PdfShareComponent;