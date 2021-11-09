const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const getConnection = require("../database/connection");
const PDFDocument = require("pdfkit-table");

const getPDF = async (data) => {
    const DynamoDB = await getConnection();
    const doc = new PDFDocument();

       DynamoDB.scan({ TableName: "User" }, (error, result) => {
           let arrayData = [];
           result.Items.forEach(item => {
               arrayData.push([item.name, item.alias, item.species, item.company.team])
           })
           const table = {
               title: "Export PDF Users",
               headers: ['name', 'alias', 'species', 'company_team'],
               rows: arrayData,
           };
           
           doc.table(table, {  width: 400,  });
           const buffers = []
           doc.on("data", buffers.push.bind(buffers))
           doc.on("end", () => {
               const pdf = Buffer.concat(buffers)

               function processPDF() {
                return new Promise(resolve => {
                  setTimeout(() => {
                    s3.upload({
                        Key: 'Data.pdf',
                        Body: pdf,
                        Bucket: 'pdfexcel',
                        ContentType: 'application/pdf',
                    }, (err, res) => {
                        if (err) {
                            console.log(err, 'err');
                        }
                    }); 
                  }, 2000);
                });
              }
              
              async function downloadPDF() {
                await processPDF();
              }
              
              downloadPDF();

           })
           doc.end();
       });
}

module.exports = getPDF;