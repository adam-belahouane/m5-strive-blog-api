import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = express.Router();

// const currentFilePath = fileURLToPath(import.meta.url);

// const parentFolderPath = dirname(currentFilePath);
// const authorsJSONPath = join(parentFolderPath, "authors.json");

const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "authors.json")

const getAuthors = () => JSON.parse(fs.readFileSync(authorsJSONPath))
const writeAuthors = (content) => (fs.writeFileSync(authorsJSONPath, JSON.stringify(content)))

authorsRouter.post("/", (req, res, next) => {
  try {
    console.log(req.body);
  
    const newauthor = { ...req.body, createdAt: new Date(), id: uniqid() };
    console.log(newauthor);
  
    // const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
    const authors = getAuthors()
  
    authors.push(newauthor);
  
    // fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));
    writeAuthors(authors)
  
    res.status(201).send({ newauthor });
    
  } catch (error) {
    next(error)
  }
});

authorsRouter.post("/checkemail", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

  if(authors.filter(author => author.email === req.body.email).length > 0){
    res.status(403).send({succes: false, data: "User already exist"})
  } else {
    res.status(201).send({succes:true})
  }
})

authorsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);

  console.log(JSON.parse(fileContent));

  const arrayOfauthors = JSON.parse(fileContent);
  res.send(arrayOfauthors);
});

authorsRouter.get("/:authorId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

  const author = authors.find((s) => s.id === req.params.authorId);

  res.send(author);
});

authorsRouter.put("/:authorId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

  const index = authors.findIndex(
    (author) => author.id === req.params.authorId
  );

  const updatedauthor = { ...authors[index], ...req.body };

  authors[index] = updatedauthor;

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

  res.send(updatedauthor);
});

authorsRouter.delete("/:authorId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

  const remainingauthors = authors.filter(
    (author) => author.id !== req.params.authorId
  ); // ! = =

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingauthors));

  res.status(204).send();
});

export default authorsRouter;