import mongoose from "mongoose";
import bcrypt from "bcrypt"

const { Schema, model } = mongoose;

const authorSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true},
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true},
        avatar: { type: String, required: false },
        role: { type: String, default: "User", enum: ["User", "Admin"] },
    },
    {timestamps: true}
)

authorSchema.pre("save", async function (next) {
    const newAuthor = this
    const plainPw = newAuthor.password
    if( newAuthor.isModified("password")) {
        const hash = await bcrypt.hash(plainPw, 10)
        newAuthor.password = hash
    }
})

authorSchema.methods.toJSON = function () {
    const authorDoc = this
    const authorObj = authorDoc.toObject()
    delete authorObj.password
    delete authorObj.__v

    return authorObj
}

authorSchema.statics.checkCredentials = async function (email, plainPw) {
    const author = await this.findOne({email})
    if(author) {
        const isMatch = await bcrypt.compare(plainPw, author.password)
        if(isMatch) {
            return author
        } else {
            return null
        }
    } else {
        return null
    }
}

export default model("Author", authorSchema)