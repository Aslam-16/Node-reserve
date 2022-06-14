const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser')
const app=express();
const port=process.env.PORT || 4000;
var cors = require('cors');
DBURL=`mongodb+srv://aslam-16:aslam@node-reserve.oeiid.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(DBURL,()=>{console.log(`DB Connected`)})
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

// parse application/json
app.use(bodyParser.json())

app.use('/users',require('./routes/users'));
app.use('/profiles',require('./routes/profiles'));
app.use('/posts',require('./routes/post'));

app.listen(port,()=>console.log(`Sever Started at ${port}`))
app.get(`/`,(req,res)=>res.send({"server":"connected"}))