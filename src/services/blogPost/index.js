import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"
import uniqid from "uniqid"

const blogPostsRouter = express.Router()

const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json")

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const writeBlogPosts = (post) => (fs.writeFileSync(blogPostsJSONPath, JSON.stringify(post)))

blogPostsRouter.post("/", (req, res ,next) => {
    try {
        console.log(req.body)
        const newBlogPost = { ...req.body, createdAt: new Date(), id: uniqid()}
        console.log(newBlogPost)
        const blogPosts = getBlogPosts()
        blogPosts.push(newBlogPost)
        writeBlogPosts(blogPosts)

        res.status(201).send({ newBlogPost})
    } catch (error) {
        next(error)
    }

})

blogPostsRouter.get("/", (req, res ,next) => {
    try {
        const arrayOfBlogPosts = getBlogPosts()
        res.send(arrayOfBlogPosts)
    } catch (error) {
        next(error)
    }
    
})

blogPostsRouter.get("/:postid", (req, res ,next) => {
    try {
        const blogPosts = getBlogPosts()
        const blogPost = blogPosts.find((post) => post.id === req.params.postid)
        res.send(blogPost) 
        
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.put("/:postid", (req, res ,next) => {
    try {
        const blogPosts = getBlogPosts()
        const index = blogPosts.findIndex((post) => post.id === req.params.postid)
        const updatedBlogPost = { ...blogPosts[index], ...req.body}
        blogPosts[index] = updatedBlogPost
        writeBlogPosts(blogPosts)
        res.send(updatedBlogPost)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.delete("/:postid", (req, res ,next) => {
    
})



export default blogPostsRouter