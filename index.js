import express from "express";
import { promises } from "fs";
import winston from "winston";

import gradesRouter from "./routes/grades.js"

const app = express();
const port = 3000;

global.fileName = "grades.json"
const readFile = promises.readFile;
const writeFile = promises.writeFile;

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: "my-bank.api.log"})
  ],
  format: combine(
    label({ label: "my-bank-api"}),
    timestamp(),
    myFormat
  )
});

app.use(express.json());
app.use("/grades", gradesRouter);

app.listen(port, async () => {
  try {
    await readFile(global.fileName, "utf8");
    logger.info('API started!');
  } catch (err) {
    logger.error(err.message);
  }
});
