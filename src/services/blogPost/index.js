import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { extname } from "path"
import { validationResult } from "express-validator";
import { blogPostValidation } from "./validation.js";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import {
  getBlogPosts,
  writeBlogPosts,
  saveBlogCover,
} from "../../lib/fs-tools.js";
import multer from "multer";
import { pipeline } from "stream";

const blogPostsRouter = express.Router();

blogPostsRouter.get("/downloadPDF/:postid", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    const blogPost = blogPosts.find((post) => post.id === req.params.postid);
    if(!blogPost) {
      res.status(404).send({ message: `blogPost with ${req.params.postid} not found!`})
    }

    res.setHeader("Content-Disposition", `attachment; filename=${blogPost.title}.pdf`)

    const source = await getPDFReadableStream(blogPost) 
    const destination = res

    pipeline(source, destination, err => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
})


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
      const remainingblogPosts = blogPosts.filter(
        (blogPosts) => blogPosts.id !== req.params.blogPostId
      );
      remainingblogPosts.push(blogPostWithCover);
      await writeBlogPosts(remainingblogPosts);
      res.send({ blogPostWithCover });
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
        comments: [],
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

blogPostsRouter.post("/:blogPostId/comments", async (req, res, next) => {
    try {
      const blogs = await getBlogPosts();
      const index = blogs.findIndex((blog) => blog.id === req.params.blogPostId);
      if (index !== -1) {
        blogs[index].comments.push({
          ...req.body,
          id: uniqid(),
          createdAt: new Date(),
        });
        await writeBlogPosts(blogs);
        res.send(blogs[index].comments);
      } else {
        res.status(404).send("not found");
      }
    } catch (error) {
      console.log(error);
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
