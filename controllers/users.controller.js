const getConnection = require("../database/connection");
const getExcel = require("../export/excel");
const getPDF = require("../export/pdf");
const { v4: uuidv4 } = require('uuid');
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.getUsers = async (req, res) => {

   try {
    const DynamoDB = await getConnection();

    var params = {
      TableName: "User",
      ProjectionExpression: "#id, #name, #alias, #species, #company, #createAt",
      ExpressionAttributeNames: {
          "#id": "id",
          "#name": "name",
          "#alias": "alias",
          "#species": "species",
          "#company": "company",
          "#createAt": "createAt",
      }
    };
    DynamoDB.scan(params, onScan);

    function onScan(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          res.send(data['Items']);
          console.log("GetUsers succeeded:", JSON.stringify(data, null, 2));
      }

    }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  } 
};

exports.createNewUser = async (req, res) => {
  try {
      const DynamoDB = await getConnection();
      var now = new Date();

      var params = {
        TableName: "User",
        Item: {
            "id": uuidv4(),
            "name": req.body.name,
            "alias": req.body.alias,
            "species": req.body.species,
            "company":{
              "name": req.body.company.name,
              "team": req.body.company.team
            },
            "createAt": now.getTime()
        }
      };
      DynamoDB.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            res.json({ "Added": "Added user" });
            console.log("Added user:", JSON.stringify(data, null, 2));
        }
    });
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }

};

exports.updateUserById = async (req, res) => {
  try {
    const DynamoDB = await getConnection();

    var params = {
      TableName: "User",
      Key:{
         "id": req.params.id
      },
      UpdateExpression: "set alias=:a, species=:s, company.team=:t",
      ExpressionAttributeValues:{
          ":a": req.body.alias,
          ":s": req.body.species,
          ":t": req.body.company.team
      },
      ReturnValues:"UPDATED_NEW"
    };

    DynamoDB.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          res.json({ "Update": "Updated user" });
          console.log("Updated user:", JSON.stringify(data, null, 2));
      }
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

exports.deleteUserById = async (req, res) => {
  try {
        const DynamoDB = await getConnection();

        var params = {
          TableName:"User",
          Key:{
              "id": req.params.id
          }
      };
      DynamoDB.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete user. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            res.json({ "Delete": "Deleted user" });
            console.log("DeleteUser succeeded:", JSON.stringify(data, null, 2));
        }
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

exports.excel = async (req, res) => {
  //try {
    const DynamoDB = await getConnection();

    var params = {
      TableName: "User",
      ProjectionExpression: "#name, #alias, #species, #company",
      ExpressionAttributeNames: {
          "#name": "name",
          "#alias": "alias",
          "#species": "species",
          "#company": "company"
      }
    };
    DynamoDB.scan(params, onScan);

    async function onScan(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          await getExcel(data);
          console.log("GetUsers succeeded:", JSON.stringify(data, null, 2));
      }

    }

    //if(fs.existsSync("./Excel.xlsx")){
    //  fs.unlinkSync('./Excel.xlsx');
    //}

    function processExcel() {
      return new Promise(resolve => {
        setTimeout(() => {
          var file = './Excel.xlsx';
          return res.download(file);
        }, 2000);
      });
    }
    
    async function downloadExcel() {
      await processExcel();
    }
    
    downloadExcel();
  //} catch (error) {
  //  res.status(500);
  //  res.send(error.message);
  //}
};

exports.pdf = async (req, res) => {
  //try {
    const DynamoDB = await getConnection();

    var params = {
      TableName: "User",
      ProjectionExpression: "#name, #alias, #species, #company",
      ExpressionAttributeNames: {
          "#name": "name",
          "#alias": "alias",
          "#species": "species",
          "#company": "company"
      }
    };
    DynamoDB.scan(params, onScan);

    async function onScan(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          await getPDF(data);
      }

      function processPDF() {
        return new Promise(resolve => {
          setTimeout(() => {
            s3.getSignedUrl('getObject', {
              Bucket: 'pdfexcel',
              Key: 'Data.pdf',
              Expires: 300 
            }, (err, url) => {
              res.json({ "Link PDF: ": url });
            }); 
          }, 4000);
        });
      }
      
      async function downloadPDF() {
        await processPDF();
      }
      
      downloadPDF();
  }
  //} catch (error) {
  //  res.status(500);
  //  res.send(error.message);
  //}
};