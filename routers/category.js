const express = require("express");
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

//GetAll
router.get('/', categoryController.index);

//Post
router.post('/', categoryController.store);

//put
router.put("/:slug", categoryController.update);

//delete
router.delete('/:slug', categoryController.destroy);

module.exports = router

