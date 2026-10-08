import { findingsForReport } from '../domain/model/demo-sources.js';

export async function createReportPdf(report) {
  const {jsPDF} = await import('jspdf');
  const doc = new jsPDF();
  doc.setFillColor('#08254A'); doc.rect(0, 0, 210, 46, 'F');
  doc.setTextColor('#FFFFFF'); doc.setFont('helvetica', 'bold'); doc.setFontSize(23);
  doc.text('FleetProof', 18, 22);
  doc.setFontSize(10); doc.text('BLIP | REPORTE VEHICULAR', 18, 33);
  doc.setTextColor('#0B2447'); doc.setFontSize(20); doc.text(report.plate, 18, 64);
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.text(`Reporte: ${report.id} | Fecha: ${report.requestedAt?.slice(0, 10) || '-'}`, 18, 74);
  doc.setFillColor('#E8F2FF'); doc.rect(18, 83, 174, 17, 'F');
  doc.setTextColor('#435B78'); doc.text('DEMOSTRACION: datos ficticios. No acredita una consulta oficial.', 23, 93);
  let y = 114;
  for (const finding of findingsForReport(report)) {
    if (y > 240) { doc.addPage(); y = 24; }
    doc.setDrawColor('#0B6FE8'); doc.line(18, y, 192, y);
    doc.setTextColor('#0B2447'); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
    doc.text(finding.source, 18, y + 9);
    doc.setFontSize(10);
    y += 19;
    const writeLines = lines => {
      for (const line of lines) {
        if (y > 264) { doc.addPage(); y = 24; }
        doc.text(line, 18, y); y += 5;
      }
    };
    writeLines(doc.splitTextToSize(finding.result || '', 170));
    doc.setFont('helvetica', 'normal'); doc.setTextColor('#435B78');
    const lines = doc.splitTextToSize(finding.summary || '', 170);
    y += 4; writeLines(lines);
    y += 2; writeLines([`Fecha de revisión: ${finding.dateChecked || '-'}`]);
    y += 8;
  }
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page); doc.setFontSize(9); doc.setTextColor('#435B78');
    doc.text('FleetProof · Entorno académico de prueba', 18, 280);
    doc.text(`${page} / ${pages}`, 182, 280);
  }
  return doc;
}

export async function downloadReportPdf(report) {
  const doc = await createReportPdf(report);
  doc.save(`FleetProof-${report.plate}-reporte.pdf`);
}
