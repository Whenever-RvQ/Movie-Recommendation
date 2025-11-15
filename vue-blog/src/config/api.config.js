import { url } from "stylus";

export default {
  'register': {
    url: 'admin/register',
    method: 'POST',
    rsaKey: 'password',
    setToken: true,
  },
  'getUsers': {
    url: '/api/rest/users',
    method: 'GET'
  },
  'getUserInfo': {
    url: '/api/rest/users',
    method: 'GET',
  },
  'putUserInfo': {
    url: '/api/rest/users/:id',
    method: 'PUT',
  },
  'putMovieInfo': {
    url: '/api/rest/movies/:id',
    method: 'PUT',
  },
  'index': {
    url: '/index',
    method: 'GET',
    noMessage: true
  },
  'login': {
    url: 'admin/login',
    method: 'POST',
    rsaKey: 'password',
    setToken: true
  },
  'pubKey': {
    url: '/keys',
    method: 'GET'
  },
  'articles': {
    url: '/api/rest/articles',
    method: 'GET'
  },
  'columns': {
    url: '/api/rest/columns',
    method: 'GET'
  },
  'postColumn': {
    url: '/api/rest/columns',
    method: 'POST'
  },
  'postComment': {
    url: '/api/rest/comments',
    method: 'POST'
  },
  'postArticle': {
    url: '/api/rest/articles',
    method: 'POST'
  },
  'postMovie': {
    url: '/api/rest/movies',
    method: 'POST'
  },
  'getArticleById': {
    rest: true,
    url: '/api/rest/articles/:id',
    method: 'GET'
  },
  'getMovieById': {
    rest: true,
    url: '/api/rest/movies/:id',
    method: 'GET'
  },
  'uploadArticle': {
    url: '/upload/article',
    method: 'POST'
  },
  'search': {
    url: '/search',
    method: 'GET'
  },
  'uploadAvatar': {
    url: '/upload/user',
    method: 'POST'
  },
  'putArticleLikeNum': {
    url: '/api/rest/articles/:id',
    method: 'PUT'
  },
    'putMovieLikeNum': {
    url: '/api/rest/movies/:id',
    method: 'PUT'
  },
  'movies':{
    url: '/api/rest/movies',
    method: 'GET'
  },

  
}