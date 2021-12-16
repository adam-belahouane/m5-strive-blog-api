import passport from "passport"
import GoogleStrategy from "passport-google-oauth20"
import AuthorModel from "../services/authors/schema.js"
import { JWTAuthenticate } from "./tools.js"

const googleCloudStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/authors/googleRedirect`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {

      console.log("GOOGLE PROFILE: ", profile)

      const author = await AuthorModel.findOne({ googleId: profile.id })

      if (author) {
        const tokens = await JWTAuthenticate(author)
        passportNext(null, { tokens })
      } else {

        const newUser = new AuthorModel({
          name: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
        })

        const savedUser = await newUser.save()

        const tokens = await JWTAuthenticate(savedUser)

        passportNext(null, { tokens })
      }
    } catch (error) {
      passportNext(error)
    }
  }
)

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data)
})

export default googleCloudStrategy