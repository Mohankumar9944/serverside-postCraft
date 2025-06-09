import express from "express";
import { validateToken } from "../middlewares/AuthMiddleware.js";

export default function createCommentRouter(Comments){
    const router=express.Router();

    router.get('/:postId', async (req, res) => {
        const {postId}=req.params;
        const comments=await Comments.findAll({ where: {PostId: postId}});
        res.json(comments);
    })

    router.post('/', validateToken, async (req, res) => {
        const { commentBody, PostId }=req.body;
        const username=req.user.username;
        const createdComment = await Comments.create({ commentBody, PostId, username });
        res.json(createdComment);
    })

    router.delete("/:commentId", validateToken, async (req, res) => {
        const commentId=req.params.commentId;
        await Comments.destroy({
            where: {
                id: commentId,
                username: req.user.username,
            },
        });

        res.json("Deleted successfully");
    });
    return router;
}
