const {Router} = require('express')
const router = Router()
const postController = require('../controllers/postController')

//POST for create table in db by name
router.post('/post/:name/init', postController.createPost)

//POST for add post to table by name
router.post('/post/:name', postController.addPost)

//GEt for get rows in table by name
router.get('/post/:name', postController.getPosts)

//DELETE for delete post in table by id(in request query)
router.delete('/post/:name', postController.deletePost)

module.exports = router