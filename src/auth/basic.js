import createHttpError from "http-errors"
import atob from "atob"
import authorModel from "../services/authors/schema.js"

export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provide credentials in the Authorization header!"))
  } else {
    const base64Credentials = req.headers.authorization.split(" ")[1]
    const decodedCredentials = atob(base64Credentials)

    const [email, password] = decodedCredentials.split(":")

    const author = await authorModel.checkCredentials(email, password)

    if (author) {
      req.author = author
      next()
    } else {
      next(createHttpError(401, "Credentials are not correct!"))
    }
  }
}