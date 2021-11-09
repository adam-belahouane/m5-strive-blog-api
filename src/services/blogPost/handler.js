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
        
    } catch (error) {
        next(error)
    }
}

const deleteOne = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
}

const blogPostHandlers = {
    getAll,
    createNew
}

export default blogPostHandlers