const express = require("express");
const router = express.Router();
const tagController = require('../controllers/TagController');

//GetAll
router.get('/', tagController.index);

//Post
router.post('/', tagController.store);

//put
router.put("/:slug", tagController.update);

//delete
router.delete('/:slug', tagController.destroy);

module.exports = router

