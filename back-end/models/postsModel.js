const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    
                {
                    commenterId: String,
                    commenterName: String,
                    commenterImage: String,
                    text: String,
                    timestamps: Number
                }
           
)

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
                commentSchema
            ],
            defautl: []
          }
    },
    { timestamps: true }
);