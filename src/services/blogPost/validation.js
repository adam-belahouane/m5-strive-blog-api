import { body } from "express-validator"

export const blogPostValidation = [
    body("category").exists().withMessage("Category is a Required Field!"),
    body("title").exists().withMessage("Title is a Required Field!"),
    body("cover").exists().withMessage("Cover is a Required Field!")
]