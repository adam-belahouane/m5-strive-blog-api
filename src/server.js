import express from "express"
import cors from "cors"
import blogPostsRouter from "./services/blogPost/index.js"

const server = express()


server.use(cors())
server.use(express.json())
server.use("/blogPosts", blogPostsRouter)

const port = 3001

server.listen(port, () => {
    console.log("server on port:", port)
})