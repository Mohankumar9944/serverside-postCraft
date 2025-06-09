import express from "express";
import { validateToken } from "../middlewares/AuthMiddleware.js";

export default function createLikesRouter(Likes){
    const router=express.Router();

    router.post("/", validateToken, async (req, res) => {
        const {PostId}=req.body;
        const UserId=req.user.id;
        const existingLike = await Likes.findOne({ 
            where: { PostId: PostId, UserId: UserId } 
        });
        if (!existingLike) {
            await Likes.create({PostId: PostId, UserId: UserId});
            res.json({liked: true});
        }
        else{
            await Likes.destroy({
                where: { PostId: PostId, UserId: UserId } 
            });
            res.json({liked: false});
        }
        

    })

    return router;
}
