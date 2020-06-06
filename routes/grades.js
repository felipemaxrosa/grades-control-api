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
    logger.info("GET /grades - successful");
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grades - ${err.message}`);
  }
});

router.get("/sum", async (req, res) => {
  let dataStudent = req.body;
  try {
    let data = await readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    
    const grades = json.grades.filter(grade => (grade.student === dataStudent.student && grade.subject === dataStudent.subject));
    if (grades) {
      let sum = grades.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0);
      res.send({sum});
      logger.info(`GET /grades/sum - sum values: ${sum} - ${JSON.stringify(grades)}`);
    } else {
      res.end();
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grades/sum - ${err.message}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let data = await readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    const grade = json.grades.find(grade => grade.id === parseInt(req.params.id, 10));
    if (grade) {
      res.send(grade);
      logger.info(`GET /grades/:id - ${JSON.stringify(grade)}`);
    } else {
      res.end();
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grades/:id - ${err.message}`);
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

router.put("/", async (req, res) => {
  let gradeToUpdate = req.body;
  
  try {
    let data = await readFile(global.fileName, "utf-8");

    let json = JSON.parse(data);
    let indexGrade = json.grades.findIndex(grade => grade.id === gradeToUpdate.id);

    json.grades[indexGrade].student = gradeToUpdate.student;
    json.grades[indexGrade].subject = gradeToUpdate.subject;
    json.grades[indexGrade].type = gradeToUpdate.type;
    json.grades[indexGrade].value = gradeToUpdate.value;

    await writeFile(global.fileName, JSON.stringify(json));

    res.end();
    logger.info(`PUT /grades - ${JSON.stringify(gradeToUpdate)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT /grades - id: ${req.params.id} - error: ${err.message}`);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let data = await readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    let grades = json.grades.filter(grade => grade.id != parseInt(req.params.id, 10));
    json.grades = grades;

    await writeFile(global.fileName, JSON.stringify(json));
    res.end();
    
    logger.info(`DELETE /grades/:id - ${req.params.id} - successful`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`DELETE /grades/:id - id: ${req.body.id} - error: ${err.message}`);
  }
});


export default router;