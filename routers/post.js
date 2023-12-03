const express = require("express");
const router = express.Router();
const postController = require('../controllers/PostController');
const { query, param, body } = require("express-validator");


//GetAll
router.get('/', postController.index);

//GetDetail
router.get('/:slug', postController.show);

//Post
router.post('/', body("title").notEmpty(), postController.store);

//put
router.put("/:slug", postController.update);

//delete
router.delete('/:slug', postController.destroy);

module.exports = router

