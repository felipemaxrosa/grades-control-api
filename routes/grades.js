import express from 'express';
import { promises } from "fs";
import cors from "cors";

const router = express.Router();

const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.get("/", cors(), async (_, res) => {
  try {
    let data = await readFile(global.fileName, "utf8");
    let accounts = JSON.parse(data);
    //delete accounts.nextId;
    res.send(accounts);
    logger.info("GET /grades - successfully");
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grades - ${err.message}`);
  }
});

router.post("/", async (req, res) => {
  let grade = req.body;
  try {
    let data = await readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    grade = { id: json.nextId++, ...grade, timestamp: new Date() };
    json.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(json));
    res.end();
    
    logger.info(`POST /grades - ${JSON.stringify(grade)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /grades - ${err.message}`);
  }
});



export default router;