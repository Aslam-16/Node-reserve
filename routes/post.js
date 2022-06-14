const mongoose=require('mongoose');
const app=require('express');
const router=app.Router();
const post=require('../models/postmodel');
const user=require('../models/usersmodel');
const {check,validationResult}=require('express-validator');
const auth=require('./auth/verify')

router.get('/',auth,(req,res)=>res.json('from post'));

router.post(`/addpost`,[auth,check('text','text is required').not().isEmpty()],async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        res.json(error)
    }
    else{
        const users=await user.findById(req.userid);
        const name=await users.name;
        const text=req.body.text;
        let userid=req.userid;
        const postdata={
            text:text,
            name:name,
            user:userid
        }

        const posts=new post(postdata);
        await posts.save();
        res.status(200);
        res.json({data:posts});
 
    }
})
router.get('/allposts',auth,async(req,res)=>{
    const allposts=await post.find();
    if(allposts){
        res.status(200);
        res.json({data:allposts});
    }
    else{
        res.status(400);
        res.json({error:`no post found`})
    }
});
router.get('/getposts/:id',auth,async(req,res)=>{
    const allposts=await post.findOne({_id:req.params.id});
    if(allposts){
        res.status(200);
        res.json(allposts );

    }
    else{
        res.status(400);
        res.json({ error: `no post found` })
    }
});
router.delete('/deleteposts/:id',auth,async(req,res)=>{
    const allposts=await post.findOne({_id:req.params.id});
    if(allposts.user.toString()==req.userid){
        await allposts.remove();
        res.status(200);
        let posts=await post.find()
        //res.json({data:'deleted'});
        res.send(posts);
    }
    else{
        res.status(400);
        res.json({error:`not the post owner`})
    }
});
router.delete('/deletemyposts',auth,async(req,res)=>{
    const allposts=await post.find({user:req.userid});
    if(allposts.length!=0){
         await post.deleteMany({user:req.userid})
         
        res.status(200);
        res.json({data:'deleted all the posts'});
    }
    else{
        res.status(400);
        res.json({error:`no post exist`})
    }
});
router.get('/myposts',auth,async(req,res)=>{
    const allposts=await post.find({user:req.userid});
    if(allposts.length=0){
        res.status(200);
        res.json({data:allposts});
    }
    else{
        res.status(400);
        res.json({error:'no post found'})
    }
});
router.put('/addlikes/:id',auth,async(req,res)=>{
    const getpost=await post.findById(req.params.id);

    if(getpost.likes.filter(id=>id.user.toString()===req.userid).length>0){
        res.status(400);
        console.log(getpost);
        res.json('already liked by you')
    }
    else{
        getpost.likes.unshift({user:req.userid});
        
         getpost.save();
        console.log(getpost);

        res.status(200);
        res.json(getpost.likes)
    }

});
router.put('/removelikes/:id',auth,async(req,res)=>{
    const getpost=await post.findById(req.params.id);
    let indexes=null;
    getpost.likes.filter((id,index)=>{
        if(id.user.toString()===req.userid){
        indexes=index;
        }
    })

    if(indexes==null){
        res.status(400);
        res.json({error:'not liked by you yet'})
    }
    else{
        getpost.likes.splice(indexes,1);
        await getpost.save();
        res.status(200);
        res.json(getpost.likes)
    }

})
router.put('/addcmt/:id',auth,async(req,res)=>{
    const getpost=await post.findById(req.params.id);
    const getuser=await user.findById(req.userid);
    const data={
        text:req.body.text,
        name:getuser.name,
        user:req.userid
    }

    getpost.comments.unshift(data);
    getpost.save();
    res.status(200);
    res.json(getpost.comments)

   
});
router.delete('/removecmt/:id',auth,async(req,res)=>{
    const getpost=await post.findById(req.params.id);
    let indexes=null;
    getpost.comments.filter((id,index)=>{
        if(id.user.toString()===req.userid){
        indexes=index;
        }
    })

    if(indexes==null){
        res.status(400);
        res.json({error:'not commented by you yet'})
    }
    else{
        getpost.comments.splice(indexes,1);
        getpost.save();
        res.status(200);
        res.json({data:'uncommented'})
    }

})


module.exports=router;
