import express from 'express';
import {Likes} from '../index.js';
import { validateToken } from '../middlewares/AuthMiddleware.js';

export default function createPostsRouter(Posts) {
  const router = express.Router();

  router.get('/', async (_req, res) => {
    const allPosts = await Posts.findAll({ include:[Likes] });
    res.json(allPosts);
  });

  router.get('/byId/:id', async (req, res) => {
    const id=req.params.id;
    const post=await Posts.findByPk(id);
    res.json(post);
  })

  router.get('/byuserId/:id', async (req, res) => {
    const id=req.params.id;
    const listOfPosts=await Posts.findAll({where: {UserId: id}, include: [Likes]});
    res.json(listOfPosts);
  })

  router.post('/',validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.status(201).json(post);
  });

  router.put('/title',validateToken, async (req, res) => {
    const {newTitle, id} = req.body;
    await Posts.update({title: newTitle}, {where: {id: id}});
    
    res.status(201).json(newTitle);
  });

  router.put('/postText',validateToken, async (req, res) => {
    const {newText, id} = req.body;
    await Posts.update({postText: newText}, {where: {id: id}});
    
    res.status(201).json(newText);
  });

  router.delete("/:postId", validateToken, async (req, res) => {
    const postId=req.params.postId

    await Posts.destroy({
      where: {
        id: postId,
      },
    });

    res.json("Deleted Successfully");
  })

  return router;
}
