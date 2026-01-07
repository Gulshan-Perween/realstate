const PDFDocument = require("pdfkit");

exports.exportPDF = (res, title, data) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=analytics.pdf");

  doc.pipe(res);
  doc.fontSize(18).text(title);
  doc.moveDown();

  data.forEach(item => {
    doc.fontSize(12).text(JSON.stringify(item));
    doc.moveDown();
  });

  doc.end();
};
