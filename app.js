require("dotenv").config();
const express = require("express");
const { exec } = require('child_process');
const path = require('path');
const { logger } = require("./utils/logger");
const bodyParser = require("body-parser");
const contentType = require("content-type");
const cors = require("cors");
const uuid = require("uuid");
const app = express();
const db = require("./configs/db/dataBase");
const PORT = process.env.APP_PORT;

const corsOptions = {
  // Specify the allowed origin
  origin: "*",
  methods: "GET,PUT,POST,DELETE", // Specify allowed HTTP methods
  headers: "*",
};

app.use(bodyParser.json());

//to avoid cross origin from web interface
app.use(cors(corsOptions));

// Middleware to log incoming requests
app.use((req, res, next) => {
  // Log the incoming request details
  req.correlationId = uuid.v4();
  logger.info(
    `${req.correlationId} ==> Incoming Request ==> ${req.method} ${req.originalUrl}`
  );
  const contentTypeHeader = req.headers["content-type"];

  if (contentTypeHeader) {
    const contentTypeObj = contentType.parse(contentTypeHeader);
    const contentTypeValue = contentTypeObj.type.toLowerCase();

    // Check if the content type is JSON
    if (contentTypeValue === "application/json") {
      try {
        const bodyJson = JSON.stringify(req.body);
        logger.info(
          req.correlationId + " ==> Request Body (JSON) ==>  " + bodyJson
        );
      } catch (error) {
        logger.error(
          req.correlationId +
            " ==> Error parsing JSON request body ==>  " +
            error
        );
      }
    }
    // Add conditions for other content types if needed
    else {
      // Log as raw data
      logger.info(
        req.correlationId +
          " ==> Request Body (Raw) ==> " +
          JSON.stringify(req.body)
      );
    }
  } else {
    logger.info(
      req.correlationId +
        " ==> Request Body ==>  No Content-Type header provided"
    );
  }
  // Proceed to the next middleware
  next();
});

// Middleware to log outgoing responses
app.use((req, res, next) => {
  // Log the response details
  const originalSend = res.send;
  res.send = function (data) {
    // Log the outgoing response details
    logger.info(
      `${req.correlationId} ==> Outgoing Response: ${res.statusCode}`
    );
    // Log the response body
    if (data) {
      logger.info(req.correlationId + " ==> Response Body ==> " + data);
    }
    // Call the original send function to send the response
    originalSend.apply(res, arguments);
  };
  // Proceed to the next middleware
  next();
});

// Define a route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", async(req, res) => {
  let conn;
  try {
    conn = await db.dBase.getConnection();
    const rows = await conn.query(`SELECT username FROM users WHERE id = (SELECT MAX(id) FROM users)`);
    // console.log(rows);
    const jsons = JSON.stringify(rows);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`Connected to DB ::: ${jsons}`);
    logger.info(
      `dBaseApi started successfully. Server is running on port ${PORT} and Connect to the DB`
    )
  } catch (e) {
    res.send("Not connect to DB");
    logger.error(
      `dBaseApi started successfully. Server is running on port ${PORT} and not Connect to the DB, ${e}`
    )
  }
  // res.send("Hello World!");
});

app.listen(PORT, () =>
  logger.info(
    `dBaseApi started successfully. Server is running on port ${PORT}`
  )
);

require("./routes/userRoutes")(app);
// require("./routes/modelRoute")(app);
require("./routes/clientRoute")(app);
require("./routes/fournisseurRoute")(app);
require("./routes/produitRoute")(app);
require("./routes/mouvementEntreeRoute")(app);
require("./routes/factureRoute")(app);
require("./routes/reglementRoute")(app);


// export of db reguraly
app.get('/export-db', (req, res) => {
  const dbHost = process.env.FA_HOST; // Hôte MySQL
  const dbUser = process.env.FA_USER; // Utilisateur MySQL
  const dbPassword = process.env.FA_PASSWORD; // Mot de passe MySQL
  const dbName = process.env.DB_NAME; // Nom de la base de données

  // Nom du fichier exporté
  const fileName = `backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.sql`;
  const filePath = path.join(__dirname, fileName);

  // Commande mysqldump
  const dumpCommand = `/usr/bin/mysqldump -h ${dbHost} -u ${dbUser} -p${dbPassword} ${dbName} > ${filePath}`;

  // Exécution de la commande
  exec(dumpCommand, (error) => {
      if (error) {
          console.error('Erreur lors de l\'exportation de la base de données :', error);
          return res.status(500).send('Erreur lors de l\'exportation de la base de données.');
      }

      // Envoi du fichier au client
      res.download(filePath, fileName, (err) => {
          if (err) {
              console.error('Erreur lors de l\'envoi du fichier :', err);
          }

          // Supprimez le fichier après téléchargement pour éviter l'accumulation
          exec(`rm ${filePath}`);
      });
  });
});

process.on("exit", () => {
  logger.error("Process exit");
  process.exit(1);
});

process.on("uncaughtException", function (err) {
  logger.error("An error occurred ==>  " + err);
  logger.error("An error occurred stack ==>  " + err.stack);
});
