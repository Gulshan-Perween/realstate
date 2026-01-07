const { Parser } = require("json2csv");

exports.exportCSV = (res, data, fileName) => {
  const parser = new Parser();
  const csv = parser.parse(data);

  res.header("Content-Type", "text/csv");
  res.attachment(`${fileName}.csv`);
  return res.send(csv);
};
