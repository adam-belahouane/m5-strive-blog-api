import express from "express"
import multer from "multer"

import { saveAuthorsAvatars } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

// filesRouter.post("/:authorId/uploadAvatar", multer().single("Avatar"), async (req, res, next) => {
//     try {
//         console.log(req.file)
//         await saveAuthorsAvatars(req.file.originalname, req.file.buffer)
//         res.send("ok")
//     } catch (error) {
//         next(error)
//     }
// })

filesRouter.post(
    "/",
    multer().single("authorAvatar"),
    async (req, res, next) => {
      try {
        console.log(req.file);
        await saveAuthorsAvatars(req.file.originalname, req.file.buffer);
        res.send(200);
      } catch (error) {
        next(error);
      }
    }
  );
  

export default filesRouter