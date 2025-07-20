const cloudinary = require("cloudinary").v2;
require("dotenv").config();


cloudinary.config({
  cloud_name: "dtu39yhqs",
  api_key: "955981741586777",
  api_secret: "j9jiWerEYiysGu3bwv-ufkJu2Mc"
});

module.exports = cloudinary;