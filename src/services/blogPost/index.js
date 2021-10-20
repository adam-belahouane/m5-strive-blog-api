import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"
import uniqid from "uniqid"

const blogPostsRouter = express.Router()

const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json")

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const writeBlogPosts = (post) => (fs.writeFileSync(blogPostsJSONPath, JSON.stringify(post)))


export default blogPostsRouter