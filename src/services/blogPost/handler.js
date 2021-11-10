import q2m from "query-to-mongo";
import blogPost from "./schema.js";

const getAll = async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await blogPost.countDocuments(mongoQuery.criteria);
    const blogPosts = await blogPost
      .find(mongoQuery.criteria)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort);
    res.send({
      links: mongoQuery.links("/blogPosts", total),
      pageTotal: Math.ceil(total / mongoQuery.options.limit),
      total,
      blogPosts,
    });
  } catch (error) {
    next(error);
  }
};

const createNew = async (req, res, next) => {
  try {
    const newBlogPost = new blogPost(req.body);
    await newBlogPost.save();

    res.status(201).send({ newBlogPost });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const getBlogPost = await blogPost.findById(req.params.id);
    res.status(200).send({ getBlogPost });
  } catch (error) {
    next(error);
  }
};

const editOne = async (req, res, next) => {
  try {
    const editedBlogPost = await blogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send({ editedBlogPost });
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const deletedPost = await blogPost.findByIdAndDelete(req.params.id);
    res.status(204).send({ message: "Deleted!!" });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const post = await blogPost.findById(req.params.id);
    if (post) {
      res.send(post.comments);
    } else next(error);
  } catch (error) {
    next(error);
  }
};

const getSingleComment = async (req, res, next) => {
  try {
    const post = await blogPost.findById(req.params.id);
    if (post) {
      const postComment = post.comments.find(
        (p) => p._id.toString() === req.params.commentId
      );
      if (postComment) {
        res.send(postComment);
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const newComment = async (req, res, next) => {
  try {
    const post = await blogPost.findById(req.params.id, { _id: 0 });
    console.log(post)
    if (post) {
      const commentToInsert = { ...req.body, commentDate: new Date() };
      console.log(commentToInsert)
      const updatedPost = await blogPost.findByIdAndUpdate(
        req.params.id,
        { $push: { Comments: commentToInsert } },
        { new: true }
      );
      console.log(updatedPost)

      if (updatedPost) {
        res.send(updatedPost);
      } else {
        next(error);
      }
    } else { next(error)}
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
      const post = await blogPost.findById(req.params.id)
      const index = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId)
      post.comments[index] = {...post.comments[index].toObject(), ...req.body}
      await post.save()
      res.send(post.comments[index])
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
      const deleted = await blogPost.findByIdAndUpdate(
          req.params.id,
          {$pull: {Comments: {_id: req.params.commentId}}},
          {new: true}
      )
      if(deleted) {
          res.status(204).send()
      } else { next(error)}
  } catch (error) {
    next(error);
  }
};

const blogPostHandlers = {
  getAll,
  createNew,
  getOne,
  editOne,
  deleteOne,
  getComments,
  getSingleComment,
  newComment,
  updateComment,
  deleteComment
};

export default blogPostHandlers;
