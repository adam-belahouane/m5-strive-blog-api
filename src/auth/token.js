import createHttpError from "http-errors"
import authorModal from "../services/authors/schema.js"
import { verifyJWT } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provide token in Authorization header!"))
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "") 

      const decodedToken = await verifyJWT(token)

      const user = await authorModal.findById(decodedToken._id)
      if (user) {
        req.user = user
        next()
      } else {
        next(createHttpError(404, "User not found"))
      }
    } catch (error) {
      next(createHttpError(401, "Token not valid!"))
    }
  }
}