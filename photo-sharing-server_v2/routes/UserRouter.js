const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

/**
 * GET /user/list
 * Returns array of users with only _id, first_name, last_name
 */
router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    response.json(users);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

/**
 * GET /user/counts
 * Returns photo count and comment count for all users (Extra Credit)
 */
router.get("/counts", async (request, response) => {
  try {
    const users = await User.find({}, "_id");
    const counts = await Promise.all(
      users.map(async (user) => {
        const photos = await Photo.find({ user_id: user._id }, "comments");
        const photoCount = photos.length;
        const commentCount = photos.reduce((total, photo) => {
          return total + photo.comments.filter(
            (c) => c.user_id && c.user_id.toString() === user._id.toString()
          ).length;
        }, 0);
        return { _id: user._id, photoCount, commentCount };
      })
    );
    response.json(counts);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

/**
 * GET /user/comments/:id
 * Returns all comments made by user with _id of id (Extra Credit)
 * Each item: { comment, date_time, photo { _id, file_name } }
 */
router.get("/comments/:id", async (request, response) => {
  const { id } = request.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "Invalid user id" });
  }
  try {
    const userExists = await User.findById(id, "_id");
    if (!userExists) {
      return response.status(400).json({ error: "User not found" });
    }
    const photos = await Photo.find({}, "_id file_name comments");
    const result = [];
    photos.forEach((photo) => {
      photo.comments.forEach((comment) => {
        if (comment.user_id && comment.user_id.toString() === id) {
          result.push({
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            photo: { _id: photo._id, file_name: photo.file_name },
          });
        }
      });
    });
    return response.json(result);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

/**
 * GET /user/:id
 * Returns detailed info of user: _id, first_name, last_name, location, description, occupation
 */
router.get("/:id", async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "Invalid user id" });
  }

  try {
    const user = await User.findById(id, "_id first_name last_name location description occupation");
    if (!user) {
      return response.status(400).json({ error: "User not found" });
    }
    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

module.exports = router;
