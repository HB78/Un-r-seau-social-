const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        descritpion: {
            type: String
        },
        pictureImage: {
            type: String
        },
        userPicturePath: {
            type: String
        },
        likes: {
            type: Number,
            required: false,
            default: 0
          },
          dislikes: {
            type: Number,
            required: false,
            default: 0
          },
          usersLiked: {
              type: [String]
          },
          usersDisliked: {
              type: [String]
          },
          comments: {
            type: [
                {
                    commenterId: String,
                    commenterName: String,
                    text: String,
                    timestamps: Number
                }
            ],
            defautl: []
          }
    },
    { timestamps: true }
);