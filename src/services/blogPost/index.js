import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { blogPostValidation } from "./validation.js";
import {
  getBlogPosts,
  writeBlogPosts,
  saveBlogCover,
} from "../../lib/fs-tools.js";
import multer from "multer";

const blogPostsRouter = express.Router();

blogPostsRouter.post(
  "/:blogPostId/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      await saveBlogCover(
        req.params.blogPostId + "OfTheBlogPost.jpg",
        req.file.buffer
      );
      const blogPosts = await getBlogPosts();
      const blogPost = blogPosts.find(
        (blogPost) => blogPost.id === req.params.blogPostId
      );
      const coverUrl = `http://localhost:3001/img/blogPosts/${req.params.blogPostId}OfTheBlogPost.jpg`;
      const blogPostWithCover = { ...blogPost, cover: coverUrl };
      const blogPostsArray = blogPosts.filter(
        (blogs) => blogs.id !== req.params.blogPostsId
      );
      blogPostsArray.push(blogPostWithCover);
      await writeBlogPosts(blogPostsArray);
      res.send(200);
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.post("/", blogPostValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, { errorsList }));
    } else {
      console.log(req.body);
      const newBlogPost = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid(),
        content: "HTML",
      };
      console.log(newBlogPost);
      const blogPosts = await getBlogPosts();
      blogPosts.push(newBlogPost);
      await writeBlogPosts(blogPosts);

      res.status(201).send({ newBlogPost });
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const arrayOfBlogPosts = await getBlogPosts();
    res.send(arrayOfBlogPosts);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:postid", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    const blogPost = blogPosts.find((post) => post.id === req.params.postid);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(
        createHttpError(
          404,
          `blogPost with ${req.params.postid} id does not exist`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:postid", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    const index = blogPosts.findIndex((post) => post.id === req.params.postid);
    const updatedBlogPost = { ...blogPosts[index], ...req.body };
    blogPosts[index] = updatedBlogPost;
    await writeBlogPosts(blogPosts);
    res.send(updatedBlogPost);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:postid", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    const remainingBlogPosts = blogPosts.filter(
      (post) => post.id !== req.params.postid
    );
    await writeBlogPosts(remainingBlogPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
