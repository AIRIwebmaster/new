'use client';

import { useState } from 'react';
import { Document, Page } from 'react-pdf';
// types/custom.d.ts



export default function SeniorsPdf() {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="pdf-container">
      <Document
        file="https://drive.google.com/uc?export=download&id=1uAru5zaJOybWDsgYsSSFnBU-fLRpWc8Y"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (_, i) => (
          <Page key={`page_${i + 1}`} pageNumber={i + 1} />
        ))}
      </Document>
    </div>
  );
}