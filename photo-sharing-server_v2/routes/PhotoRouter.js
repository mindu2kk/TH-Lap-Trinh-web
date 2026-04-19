const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

/**
 * GET /photosOfUser/:id
 * Returns all photos of user with _id of id.
 * Each photo: _id, user_id, file_name, date_time, comments[]
 * Each comment: _id, comment, date_time, user { _id, first_name, last_name }
 */
router.get("/:id", async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "Invalid user id" });
  }

  try {
    // Check user exists
    const userExists = await User.findById(id, "_id");
    if (!userExists) {
      return response.status(400).json({ error: "User not found" });
    }

    // Get all photos of this user
    const photos = await Photo.find({ user_id: id }, "_id user_id file_name date_time comments");

    // For each photo, populate user info for each comment concurrently
    const photosWithUsers = await Promise.all(
      photos.map(async (photo) => {
        const commentsWithUsers = await Promise.all(
          photo.comments.map(async (comment) => {
            const commentUser = await User.findById(
              comment.user_id,
              "_id first_name last_name"
            );
            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user: commentUser
                ? { _id: commentUser._id, first_name: commentUser.first_name, last_name: commentUser.last_name }
                : null,
            };
          })
        );

        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments: commentsWithUsers,
        };
      })
    );

    return response.json(photosWithUsers);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

module.exports = router;
