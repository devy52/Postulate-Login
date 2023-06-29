const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  file: String,
  Date:String,
  userId: String,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
