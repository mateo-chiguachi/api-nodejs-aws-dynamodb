const pdf = require("html-pdf");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const getConnection = require("../database/connection");
const PDFDocument = require("pdfkit-table");

exports.getPDF = async (req, res) => {
    const DynamoDB = await getConnection();
    const doc = new PDFDocument();

       DynamoDB.scan({ TableName: "User" }, (error, result) => {
           let arrayData = [];
           result.Items.forEach(item => {
               arrayData.push([item.name, item.alias, item.species, item.company.name, item.company.team])
           })
           const table = {
               title: "Report",
               headers: ['Name', 'Alias', 'Species', 'Company Name', 'Company Team'],
               rows: arrayData,
           };
           
           doc.table(table, {  width: 500, });
           const buffers = []
           doc.on("data", buffers.push.bind(buffers))
           doc.on("end", () => {
               const pdf = Buffer.concat(buffers)
               const response = {
                   statusCode: 200,
                   headers: { "Content-Type": "application/pdf" },
                   body: pdf.toString("base64"),
                   isBase64Encoded: true,
               }
               s3.upload({
                    Key: 'Data.pdf',
                    Body: pdf,
                    Bucket: 'pdfexcel',
                    ContentType: 'application/pdf',
                }, (err, res) => {
                    if (err) {
                        console.log(err, 'err');
                    }
                    console.log(res, 'res');
                }); 

           })
           doc.end();
       });

    return pdf;
}