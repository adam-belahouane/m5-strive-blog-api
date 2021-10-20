import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import blogPostsRouter from "./services/blogPost/index.js"
import { genericErrorHandler, badRequestHandler, notFoundHandler } from "./errorHandlers.js"

const server = express()


server.use(cors())
server.use(express.json())
server.use("/blogPosts", blogPostsRouter)

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

const port = 3001

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log("server on port:", port)
})