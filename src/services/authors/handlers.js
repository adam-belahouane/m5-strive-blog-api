import q2m from "query-to-mongo";
import AuthorModel from "./schema.js"

const createNewAuthor = async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel(req.body)
        await newAuthor.save()
        res.send({newAuthor})
    } catch (error) {
        next(error)
    }
}

const getAllAuthors = async (req, res, next) => {
    try {
        const authors = await AuthorModel.find()
        res.send({authors})
    } catch (error) {
        next(error)
    }
}

const getOneAuthor = async (req, res, next) => {
    try {
        const author = await AuthorModel.findById(req.params.id)
        res.send({author})
    } catch (error) {
        next(error)
    }
}

const editAuthor = async (req, res, next) => {
    try {
        const author = await AuthorModel.findByIdAndUpdate(req.params.id, req.body)
        res.send({author})
    } catch (error) {
        next(error)
    }
}

const deleteAuthor = async (req, res, next) => {
    try {
        await AuthorModel.findByIdAndDelete(req.params.id)
        res.send({message: `${req.params.id} deleted!!`})
    } catch (error) {
        next(error)
    }
}

const authorHandlers = {
    getAllAuthors,
    createNewAuthor,
    getOneAuthor,
    editAuthor,
    deleteAuthor
}

export default authorHandlers