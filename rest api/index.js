var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('');
var fs = require('fs');
var fileUpload = require('express-fileupload')
const mypath = require('path');

var Users = require('./model/User');
var Posts = require('./model/post');


app.all('/*', function(req, res, next) {
    console.log(process.env.HOST+':'+process.env.PORT)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(fileUpload());

//############## static server ######################
//############## static server ######################
//############## static server ######################

app.use(express.static(mypath.join(__dirname, 'images')));
app.use(express.static(mypath.join(__dirname, 'build')));





//################ it end here ######################
//################ it end here ######################
//################ it end here ######################




app.get('/api/search', function(req,res)    {
    var username = req.query.username;
    var email    = req.query.email;
    var q        = ".*"+username+".*";
    if(username !== null){
        Users.find({"username": {$regex: q}},function(err,user)    {
            if(user){
                res.send(user);
            }else{
                res.send({error:"nothing found"})
            }
        })
    }
    else if(email !== null){
        Users.find({email},function(err,user)    {
            if(user){
                res.send(user);
            }else{
                res.send({error:"nothing found"})
            }
        })
    }
    else
    {
            res.status(404).send({error:'nothing to search'})       
        }
})


app.post('/api/user', function(req,res){
    var user = new Users();
    user.userid   = req.body.userid;
    user.username = req.body.username;
    user.email    = req.body.email;
    user.tel      = req.body.tel;
    user.photo    = req.body.photo;
    user.save(function(err, saveduser){
        if(err){
            res.status(404).send({error:"could not saved"})
        }else {
            res.send('saved');
        }
    })
})

app.get('/api/user', function(req, res){
    var userid = req.query.userid;
    Users.find({userid}, function(err, user){
        if(user){
            res.status(200).send(user);
        }else{
            res.status(404).send(err);
        }
    })
})

app.post('/api/friends',function(req,res){
    var userid = req.body.userid;
    var friendid = req.body.friendid;
    if(userid === friendid){
        res.status(500).send({error: 'yourself'})
    }else{
    Users.findOne({userid}, function(err, user){
        if(err){
            res.status(500).send({error: "User id does not exist"});
        }else if(user){
            let isalreadyfriend = false;
            Users.findOne({userid:friendid}, function(err, friend){
                if(friend){
                    const x = friend.notification.length;
                    for(var i=0; i<x;i++)
                    {
                        if(friend.notification[i].toString() === user._id.toString())
                        {
                            isalreadyfriend = true;
                        }
                    }
                    if(isalreadyfriend == true)
                    {
                        res.status(500).send({error:'already'})
                    }
                    else if(isalreadyfriend == false)
                    {
                        Users.update({userid:friendid},{$addToSet:{notification: user._id}}, function(err, list){
                        if(err)
                        {
                            res.status(500).send({error: "could not add to friendlist"})
                        }else
                        {
                            res.send({msg:'ok'});
                        }
                    })
                    }   
                }
            })
        }else{
            res.status(500).send({error:'could not find user'})
        }
    })
    }
})

app.post('/api/unfriends', function(req,res){
    var userid = req.body.userid;
    var friendid = req.body.friendid;
    Users.findOne({userid}, function(err,user){
        if(user){
            Users.findOne({userid:friendid},function(err,friend){
                if(friend){
                    ///
                    Users.update({userid},{$pull:{friendlist:friend._id}},function(err,ok){
                        if(err){
                            res.status(404).send({error:'something wrong'});
                        }
                        else{
                            Users.update({userid:friendid},{$pull:{friendlist:user._id}},function(err,ok){
                                if(err){
                                    res.status(404).send({error:'something wrong'});
                                }else{
                                    Users.findOne({userid}).populate({path:'friendlist',model:'Users'}).exec(function(err,user1){
                                        if(err || !user1){
                                            res.status(500).send({error: 'could not fetch'});
                                        }else {
                                            res.status(200).send(user1.friendlist);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }else{
                    res.status(500).send({error:'error'});
                }
            })
        }else{
            res.status(500).send({error:'error'})
        }
    })
})



app.get('/api/notification', function(req,res)  {
    var userid = req.query.userid;
    var friendid = req.query.friendid;
    var type = req.query.type;
    if(friendid== undefined){
        if(userid == undefined)
        {
            res.status(500).send({error:'nothing found'})
        }
        else
        {
            Users.findOne({userid}).populate({path:'notification', model: 'Users'}).exec(function(err, user){
                if(err || !user){
                    res.status(500).send({error: 'could not fetch'});
                }else {
                    res.status(200).send(user.notification);
                }
            })
        }
    }else if(type==='accepted'){
        Users.findOne({userid: friendid}, function(err, friend){
            if(friend){
                Users.update({userid},{$addToSet:{friendlist: friend._id}},function(err, data){
                    if(err){
                        res.status(500).send({error:'could not update your request'})
                    }else{
                        Users.update({userid},{$pull:{notification:friend._id}},function(err, ok){
                            if(err){
                                res.status(500).send({error:"something is wrong"});
                            }else{
                                Users.findOne({userid}, function(err, user){
                                    if(user)
                                    {
                                        Users.update({userid:friendid},{$addToSet:{friendlist: user._id}}, function(err, data){
                                        if(err){
                                            res.status(500).send({error:'something wrong'});
                                        }else{
                                            res.status(200).send({msg:'ok'});
                                        }
                                    })
                                    }
                                    else
                                    {
                                        res.status(500).send({error:'error'})
                                    }
                                })
                                
                            }
                        })
                    }
                })
            }else {
                res.status(500).send({error: 'could not fetch'});
            }
        })
    }else if(type ==='rejected'){
        Users.findOne({userid:friendid},function(err, friend){
            if(friend){
                Users.update({userid},{$pull:{notification:friend._id}},function(err,data){
                    if(err){
                        res.status(500).send({error:'something wrong'});
                    }else{
                        res.status(200).send({msg:'ok'});
                    }
                })
            }else{
                res.status(500).send({error:'could not fetch'})
            }
        })
    }
})

app.get('/api/friends', function(req, res){
    var userid = req.query.userid;
    console.log(userid)
    Users.find({userid}).populate({path:'friendlist', model: 'Users'}).exec(function(err, user) {
        if(err) {
            res.status(500).send({error: "could not fetch friendlist"})
        }else{
            if(user[0]){
//                console.log(user[0].friendlist)
                res.status(200).send({friends:user[0].friendlist});
//                res.status(200).send({error: "could not fetch friendlist"})
            }else{
                res.status(500).send({error: "could not fetch friendlist"})
            }
        }    
    })
})


app.get('/api/posts',function(req, res){
    var userid = req.query.userid;
    var postaddress = req.query.postaddress;
    var comment = req.query.comment;
    
    if(comment != "empty" && postaddress !== undefined && userid!== undefined && comment !== undefined){
        
        Users.findOne({userid},function(err,userdata){
            if(userdata){
                var data = {username: userdata.username, userid: userdata.userid, photo: userdata.photo,'text':comment};
                
                Posts.update({postaddress},{$push : {comments: data}},function(err,result){
                    if(err){
                        console.log('noooooo')
                        res.status(500).send({500:'error'})
                    }else{
                        
                        console.log(result)
                        res.send({ok:result})
                    }
                })
            }else{
                res.status(500).send({error:'error'})
            }
        })
    }
    else if(postaddress)
    {
        
        Users.findOne({userid},function(err,user){
            if(user){
          Posts.findOne({postaddress},function(err, post){
                    if(post){
                        var likes =0,skip=0;
                        console.log(post.Likes)
                        if(!post.Likes){
                            likes = 1;
                        }else{
                            likes = post.Likes+1;
                            var x = post.userlikes.indexOf(userid);
                            if(x== -1){
                                skip=0;
                                 
                            }else{
                                
                                skip = 1;
                            }
                        }
                        if(skip ==0){
                            Posts.update({postaddress},{Likes:likes,$addToSet:{userlikes : userid}},function(err, result){
                                         if(err){
                                res.status(500).send({error:'error'})
                            }else{
                                res.send({ok:'result'})
                            }
                            })
                        }else{
                            res.send({error:'hjkhjk'})
                        }
                    }else{
                        res.status(500).send({error:'error'})
                    }
                })
            }else{
                res.status(500).send({error:'error'});
            }
        })
    }
    else if(userid)
    {
        Users.find({userid}).populate({path:'posts', model:'Posts'}).exec(function(err, data){
//            console.log(data)
            if(err || !data[0]){
                res.status(500).send({error:'nothing to fetch'})
            }else{
                res.status(200).send(data[0].posts.reverse())
            }
        })
    }
})


app.post('/api/updateprofile', function(req,res){
    
    let userid = req.body.userid;
    let email  = req.body.email;
    let username = req.body.username;
    let imageurl = req.body.imageurl;
    Users.update({userid},{email, username},function(err,ok){
        if(err){
            res.status(404).send({error:'error'});
        }else{
                    
            let photo = imageurl;
            console.log("photo link",photo);
            Users.update({userid},{photo},function(err,ok){
                if(err){
                    res.status(500).send({error:'error'});
                }else{
                    console.log(photo);
                    res.status(200).send({url: photo})
                }
            })
         }
    })   
})





app.post('/api/posts', function(req, res){
    
        let userid   = req.body.userid;
        let image    = req.body.image;
        let date = new Date();
        let d = date.getTime();
        console.log(image)
        Users.findOne({userid}, function(err, user){
                if(user)
                {
                   let newpost = new Posts();
                    newpost.Text        = req.body.text;
                    newpost.postaddress = d+ userid;
                    newpost.Photolink   = image;
                    newpost.From[0]           = user.username;
                    newpost.From[1]              = user.photo;
                    newpost.From[2]             = user.userid;
                    newpost.save(function(err,saved){
                        if(err){
                            res.status(500).send({error:'could not save'})
                        }else{
                            Posts.findOne
                            Users.find({userid},function(err, user){
                                if(user){
                                    
                                Users.update({userid},{$addToSet:{posts: saved._id}},function(err, ok){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log(ok)
                                    }
                                })
                                    
                                user[0].friendlist.map(obj=>{
                                    
                                    Users.update({_id:obj},{$addToSet:{posts: saved._id}},function(err, ok){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log(ok)
                                    }
                                })
                                })
                                
                                res.send({ok:'ok'})
                                }else{
                                    res.send({error:'skdf'})
                                }
                            })
                        }
                    }) 
                }else{
                    res.status(500).send({error:'something wrong'});
                }
            })  
})


app.get('/*', function (req, res) {
   res.sendFile(mypath.join(__dirname, 'build', 'index.html'));
 });


var server = app.listen(process.env.PORT || 5000, function() {
    console.log("Server is running on 3004" + process.env.PORT);
})

var io = require('socket.io')(server);


io.on('connection', function(socket){
    socket.on('chat message', function(event){
        console.log(event)
        io.emit(event.for,event);
    })
});







