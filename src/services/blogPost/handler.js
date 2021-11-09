import express from "express"
import blogPost from "./schema.js"

const getAll = async (req, res, next) => {
    try {
        const blogPosts = await blogPost.find()
        res.send({blogPosts})
    } catch (error) {
        next(error)
    }
}

const createNew = async (req, res, next) => {
    try {
        const newBlogPost = new blogPost(req.body)
        await newBlogPost.save()

        res.status(201).send({newBlogPost})
    } catch (error) {
        next(error)
    }
}

const getOne = async (req, res, next) => {
    try {
        const getBlogPost = await blogPost.findById(req.params.id)
        res.status(200).send({getBlogPost})
    } catch (error) {
        next(error)
    }
}

const editOne = async (req, res, next) => {
    try {
        const editedBlogPost = await blogPost.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.send({editedBlogPost})
    } catch (error) {
        next(error)
    }
}

const deleteOne = async (req, res, next) => {
    try {
        const deletedPost = await blogPost.findByIdAndDelete(req.params.id)
        res.status(204).send({message: "Deleted!!"})
    } catch (error) {
        next(error)
    }
}

const blogPostHandlers = {
    getAll,
    createNew,
    getOne,
    editOne,
    deleteOne
}

export default blogPostHandlers