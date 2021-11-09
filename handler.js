const serverless = require("serverless-http");
const express = require("express");
const Routes = require("./routes/users.routes");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');

app.use(bodyParser.json({ strict: false }));

// Routes
app.use('/api', Routes);

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Settings
//module.exports.handler = serverless(app);
app.listen(3000, () => { console.log("El servidor está inicializado en el puerto 3000"); });