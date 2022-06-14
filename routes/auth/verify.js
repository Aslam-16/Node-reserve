
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    const token=req.header('auth');
    if(!token){
        return res.status(400).send(`no token available`);
    }
    else{
    try{
   id= jwt.verify(token,'secret',{complete:true});
   console.log(id);
   req.userid=id.payload.id;
    }
    catch{
        res.send('incorrect token')
    }
   next();
}
}