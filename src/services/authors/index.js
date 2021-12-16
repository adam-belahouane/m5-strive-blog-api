import express from "express";
import authorHandlers from "./handlers.js";
import { adminOnlyMiddleware } from "../../auth/admin.js"
import { JWTAuthMiddleware } from "../../auth/token.js";
import passport from "passport";

const authorsRouter = express.Router();

authorsRouter.route("/")
.get( JWTAuthMiddleware, authorHandlers.getAllAuthors)

authorsRouter.route("/me")
.get( JWTAuthMiddleware,authorHandlers.getMe)
.put( JWTAuthMiddleware, authorHandlers.editMe)
.delete( JWTAuthMiddleware, authorHandlers.deleteMe)

authorsRouter.route("/login")
.post(authorHandlers.loginAuthor)

authorsRouter.route("/register")
.post(authorHandlers.createNewAuthor)

authorsRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] }))

authorsRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
    try {
      console.log("TOKENS: ", req.user.tokens)
  
      res.redirect(`${process.env.FE_URL}?accessToken=${req.user.tokens}`)
    } catch (error) {
      next(error)
    }
  })

authorsRouter.route("/:id")
.get( JWTAuthMiddleware, adminOnlyMiddleware, authorHandlers.getOneAuthor)
.put( JWTAuthMiddleware, adminOnlyMiddleware, authorHandlers.editAuthor)
.delete( JWTAuthMiddleware, adminOnlyMiddleware, authorHandlers.deleteAuthor)



export default authorsRouter;

