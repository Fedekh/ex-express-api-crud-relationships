const express = require("express");
const router = express.Router();
const postController = require('../controllers/PostController');
const { query, param, body,checkSchema } = require("express-validator");
const postCreate = require("../validations/post.js")


//GetAll
router.get('/', postController.index);

//GetDetail
router.get('/:slug', postController.show);

//Post
router.post('/', checkSchema(postCreate), postController.store);

//put
router.put("/:slug", postController.update);

//delete
router.delete('/:slug', postController.destroy);

module.exports = router

