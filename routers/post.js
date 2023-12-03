const express = require("express");
const router = express.Router();
const postController = require('../controllers/PostController');

//GetAll
router.get('/', postController.index);

//GetDetail
router.get('/:slug', postController.show);

//Post
router.post('/', postController.store);

//put
router.put("/:slug", postController.update);

//delete
router.delete('/:slug', postController.destroy);

module.exports = router

