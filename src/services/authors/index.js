import express from "express";
import uniqid from "uniqid";
import {
  getAuthors,
  writeAuthors,
  saveAuthorsAvatars,
} from "../../lib/fs-tools.js";
import multer from "multer";

const authorsRouter = express.Router();



authorsRouter.post("/:authorId/uploadAvatar", multer().single("authorAvatar"), async (req, res, next) => {
  try {
    console.log(req.file);
    await saveAuthorsAvatars( "idOfTheAuthor.jpg", req.file.buffer);
    const authors = await getAuthors()
    const author = authors.find((author) => author.id === req.params.authorId);
    res.send(200);
  } catch (error) {
    next(error);
  }
});


authorsRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const newauthor = { ...req.body, createdAt: new Date(), id: uniqid() };
    console.log(newauthor);
    const authors = await getAuthors();
    authors.push(newauthor);
    await writeAuthors(authors);
    res.status(201).send({ newauthor });
  } catch (error) {
    next(error);
  }
});

authorsRouter.post("/checkemail", async (req, res, next) => {
  try {
    if (
      authors.filter((author) => author.email === req.body.email).length > 0
    ) {
      res.status(403).send({ succes: false, data: "User already exist" });
    } else {
      res.status(201).send({ succes: true });
    }
  } catch (error) {
    next(error);
  }
  const authors = await getAuthors();
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const arrayOfAuthors = await getAuthors();
    res.send(arrayOfAuthors);
  } catch (error) {
    next(error);
  }
});

// authorsRouter.get("/", async (req, res) => {
//   const fileContent = fs.readFileSync(authorsJSONPath);

//   console.log(JSON.parse(fileContent));

//   const arrayOfauthors = JSON.parse(fileContent);
//   res.send(arrayOfauthors);
// });

authorsRouter.get("/:authorId", async (req, res) => {
  try {
    const authors = await getAuthors();

    const author = authors.find((s) => s.id === req.params.authorId);

    res.send(author);
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res) => {
  try {
    const authors = await getAuthors();

    const index = authors.findIndex(
      (author) => author.id === req.params.authorId
    );

    const updatedauthor = { ...authors[index], ...req.body };

    authors[index] = updatedauthor;

    await writeAuthors(authors);

    res.send(updatedauthor);
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res) => {
  try {
    const authors = await getAuthors();

    const remainingauthors = authors.filter(
      (author) => author.id !== req.params.authorId
    );

    await writeAuthors(remainingauthors);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
