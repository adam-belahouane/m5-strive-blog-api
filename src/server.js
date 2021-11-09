import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { join } from "path";
import blogPostsRouter from "./services/blogPost/index.js";
import authorsRouter from "./services/authors/index.js";
import mongoose from "mongoose"

import {
  genericErrorHandler,
  badRequestHandler,
  notFoundHandler,
} from "./errorHandlers.js";


const server = express();

const publicFolderPath = join(process.cwd(), "./public");

server.use(express.static(publicFolderPath));

const whitelist = [process.env.FE_URL , process.env.FE_DEV_URL]
const corsOptions = {
    origin : function (origin, next) { 
        if (whitelist.includes(origin)) {
            next(null , true)
        } else {
            next(new Error("CROSS ORIGIN ERROR"))
        }
    }
}

server.use(cors());
server.use(express.json());
server.use("/blogPosts", blogPostsRouter);
server.use("/authors", authorsRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Mongo Connected!")

  server.listen(port, () => {
    console.table(listEndpoints(server))

    console.log(`Server running on port ${port}`)
  })
})

mongoose.connection.on("error", err => {
  console.log(err)
})
