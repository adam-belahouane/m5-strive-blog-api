import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { join } from "path";
import blogPostsRouter from "./services/blogPost/index.js";
import authorsRouter from "./services/authors/index.js";

import {
  genericErrorHandler,
  badRequestHandler,
  notFoundHandler,
} from "./errorHandlers.js";

const server = express();

const publicFolderPath = join(process.cwd(), "./public");

server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());
server.use("/blogPosts", blogPostsRouter);
server.use("/authors", authorsRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

const port = process.env.PORT;

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("server on port:", port);
});
