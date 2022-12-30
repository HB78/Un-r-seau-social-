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
        description: {
            type: String
        },
        pictureImage: {
            type: String
        },
        userPicturePath: {
            type: String
        },
        likes: {
            type: {
                type: Number,
                default: 0
            },
            required: false,
          },
        dislikes: {
            type:{
                type: Number,
                default: 0
            },
            required: false,
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
          },
        date : {type: Date, default: Date.now}
    },
    { timestamps: true }
);

module.exports = mongoose.model("Publications", postSchema);