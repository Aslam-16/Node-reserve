const mongoose=require('mongoose')
const postchema= new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
    },
    name:{
        type:String
    },
    likes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId
            }
        }
    ],
    comments:[
        {
            text:{
                type:String
            },
            user:{
                
                    type:mongoose.Schema.Types.ObjectId
                },
                name:{
                    type:String
                },
                date:{
                    type:Date,
                    default:Date.now
                }
            }
        
    ],
   
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports= post=mongoose.model('post',postchema)