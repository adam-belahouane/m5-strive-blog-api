import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { blogPostValidation } from "./validation.js"
import { getBlogPosts, writeBlogPosts } from "../../lib/fs-tools.js"

const blogPostsRouter = express.Router()




blogPostsRouter.post("/", blogPostValidation, async (req, res ,next) => {
    try {
        const errorsList = validationResult(req)
        if(!errorsList.isEmpty()){
            next(createHttpError(400, { errorsList }))
        } else {
            console.log(req.body)
            const newBlogPost = { ...req.body, createdAt: new Date(), id: uniqid(), content: "HTML"}
            console.log(newBlogPost)
            const blogPosts = await getBlogPosts()
            blogPosts.push(newBlogPost)
            await writeBlogPosts(blogPosts)
    
            res.status(201).send({ newBlogPost})
        }
    } catch (error) {
        next(error)
    }

})

blogPostsRouter.get("/", async (req, res ,next) => {
    try {
        const arrayOfBlogPosts = await getBlogPosts()
        res.send(arrayOfBlogPosts)
    } catch (error) {
        next(error)
    }
    
})

blogPostsRouter.get("/:postid", async (req, res ,next) => {
    try {
        const blogPosts = await getBlogPosts()
        const blogPost = blogPosts.find((post) => post.id === req.params.postid)
        if(blogPost){
            res.send(blogPost) 
        } else {
            next(createHttpError(404, `blogPost with ${req.params.postid} id does not exist`))
        }
        
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.put("/:postid", async (req, res ,next) => {
    try {
        const blogPosts =  await getBlogPosts()
        const index = blogPosts.findIndex((post) => post.id === req.params.postid)
        const updatedBlogPost = { ...blogPosts[index], ...req.body}
        blogPosts[index] = updatedBlogPost
        await writeBlogPosts(blogPosts)
        res.send(updatedBlogPost)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.delete("/:postid", async (req, res ,next) => {
    try {
        const blogPosts = await getBlogPosts()
        const remainingBlogPosts = blogPosts.filter((post) => post.id !== req.params.postid)
        await writeBlogPosts(remainingBlogPosts)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})



export default blogPostsRouter