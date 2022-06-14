const express=require('express');
const {check,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const router=express.Router()
const user=require('../models/usersmodel');
const auth=require('./auth/verify')

router.get(`/`,auth,(req,res)=>res.send(req.userid))
router.post(`/addusers`,[check(`name`,`name is required`).not().isEmpty(),
check('email','Need a valid email').isEmail()
,check('password','need a minimum of 6 letter').isLength({min:6})],
async (req,res)=>{
    const errors=validationResult(req);
    if(errors.isEmpty()){
        const data=await user.findOne({email:req.body.email})
        if(!data){
            const hash=await bcrypt.genSalt(10);
            const encrypt_pwd= await bcrypt.hash(req.body.password,hash)
            const record={
                name:req.body.name,
                email:req.body.email,
                password:encrypt_pwd
            }
            let users=new user(record);
           await users.save()
            const fromDb=await user.findOne({email:req.body.email})
            console.log(fromDb);
            await jwt.sign({id:fromDb._id},'secret',{expiresIn:`24h`},(err,token)=>{
                res.status(200).json({token:token})
            })
        }
        else{
            res.status(400).json({message:'user already available'})
        }
    }
    else{
        res.send({errors:errors.array()})
    }
})

router.post(`/login`,
async (req,res)=>{
        const data=await user.findOne({email:req.body.email})
        if(!data){
            res.status(400)
            res.send("e-invalid credentials")
            
        }
        else{

          const pwdmatch=await bcrypt.compare(req.body.password,data.password)
          if(!pwdmatch){
              res.status(400)
                          res.send("invalid credentials")

          }
          else{
              
              await jwt.sign({ id: data._id }, 'secret', { expiresIn: `24h` }, (err, token) => {res.status(200).json({data:{name:data.name,email:data.email},token:token})
            // res.send('loggedIn successfully')
        })
           
        }
    }
    
   
})
router.get('/getuser',auth,async(req,res)=>{
    try{
    const data=await user.findById(req.userid).select(`-password`);
    if(data){
        res.status(200)
        res.json({data:data})
        console.log(data);
    }else{
        res.status(400)
    }
}
    catch(err){res.status(400).send('server issue')}
    
})

module.exports=router