const mongoose = require('mongoose')
const {uploadURL, uploadPath}=require('../config')
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "默认标题" + Date.now
  },
  //封面图
  cover: {
    type: String, //URL
    default: `${uploadURL}article/article-cover.jpg`
  },
  //电影介绍
  body: {
    type: String, // URIencode(HTMLCode)
    set(val){
      try{
        return decodeURIComponent(val).replace("\"","\'")
      }catch(err){
        return val
      }
    },
    required: true,
  },
  //更新日期
  date: {
    type: Number,
    default: 2025
  },
  score:{
    type: Number,
    default: 0.0
  },
  //点击量
  hit_num: {
    type: Number,
    default: 0
  },
  //评论数量
  comment_num: {
    type: Number,
    default: 0
  },
  //喜欢 点赞
  like_num: {
    type: Number,
    default: 0
  },
  //作者
  director: {
    required: true,
    type: String,
  },
  //评论集合
  comments: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment"
    }
  ],
  //分类
  column: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'Column',
  },
  // isCollected:{
  //   type: Boolean,
  //   default: false
  // }
})

module.exports = mongoose.model('Movie', schema)