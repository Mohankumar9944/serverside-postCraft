import bcrypt from 'bcrypt';
import express from 'express';
import pkg from 'jsonwebtoken';
import {validateToken} from '../middlewares/AuthMiddleware.js';

const {sign} =pkg;
export default function createUserRouter (Users) {
    const router=express.Router();
    
    router.post('/', async (req, res) => {
        const {username, password} = req.body;
        const hash= await bcrypt.hash(password, 10);
        await Users.create({
            username: username,
            password: hash,
        })
        res.json("SUCCESS");
    });

    router.post('/login', async (req, res) =>{
        const {username, password}=req.body;
        const user=await Users.findOne({ where: {username: username} });
        if(!user) {
           return res.json({error: "User doesn't exist"});
        }
        bcrypt.compare(password, user.password).then((match) => {
            if(!match){
                return res.json({ error: "Wrong Username and Password Combination"});
            }
            const accessToken=sign(
                { username : user.username, id: user.id },
                "importantsecret" 
            );
            return res.json({token:accessToken, username: username, id: user.id});
        })
    })

    router.get("/auth", validateToken, (req, res) =>{
        res.json(req.user);
    })

    router.get("/basicInfo/:id", async (req, res) =>{
        const id=req.params.id;
        const basicInfo=await Users.findByPk(id, 
            {attributes: {excludes: ["password"]}
        });
        res.json(basicInfo);

    })

    router.put('/changepassword', validateToken, async (req, res) => {
        const {oldPassword, newPassword}=req.body;
        const user=await Users.findOne({ where: {username: req.user.username} });
        bcrypt.compare(oldPassword, user.password).then(async (match) => {
            if(!match){
                return res.json({ error: "Incorrect Password"});
            }
            const hash= await bcrypt.hash(newPassword, 10);
            await Users.update({
                password: hash,
            }, 
            {
                where: {
                    username: req.user.username,
                }
            })
            return res.json("SUCCESS");
        })
    })

    return router;
}