import { useState } from "react";

const PdfViewer = () => {
  const [pdfFilename, setPdfFilename] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleInputChange = (event) => {
    const newFilename = event.target.value;
    setPdfFilename(newFilename);

    const newPdfUrl = `http://localhost:3000/pdf/${newFilename}`;
    setPdfUrl(newPdfUrl);
  };

  return (
    <div className="container text-center" style={{ width: "1200px" }}>
      <div>
        <label htmlFor="pdfFilename">Nombre del archivo PDF:</label>
        <input
          type="text"
          id="pdfFilename"
          value={pdfFilename}
          onChange={handleInputChange}
        />
      </div>
      {pdfUrl && (
        <div style={{ width: "1250px", height: "90vh" }}>
          {"200"}
          {""}
          <embed
            src={pdfUrl}
            width="100%"
            height="100%"
            type="application/pdf"
          />
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
