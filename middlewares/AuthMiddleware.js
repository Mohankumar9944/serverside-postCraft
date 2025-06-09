import pkg from 'jsonwebtoken';

const {verify}=pkg;

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if(!accessToken){
        return res.json({ error:"User not logged In"});
    }
    try{
        const validToken=verify(accessToken, "importantsecret");
        req.user = validToken;
        if(validToken){
            req.user = validToken;
            next();
        }
    }catch(error){
        return res.json({ error: error });
    }
}

export {validateToken};