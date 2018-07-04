import 'whatwg-fetch';
//import {BASE_URL} from '../constants';

const BASE_URL = "https://chatapp-3.herokuapp.com/api"
//const BASE_URL = "http://localhost:5000/api" ;

class httpservice {
    createuser = (email,username,userid,photo) => {
        var promise = new Promise((resolve, reject) => {                       
            fetch(BASE_URL+'/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    username,
                    userid,
                    photo
                })
            }).then(response => {
                resolve(response);
            })
        });
        return promise;
    }
    
    friendrequest = (userid, friendid) =>   {
        var promise = new Promise((res, rej) => {                       
            fetch(BASE_URL+'/friends', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    friendid,
                    userid
                })
            }).then(response => {
                res(response.json());
            });
        });
        return promise;
    }
    
    
    unfriendrequest =  (userid, friendid) =>   {
        var promise = new Promise((res, rej) => {                       
            fetch(BASE_URL+'/unfriends', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    friendid,
                    userid
                })
            }).then(response => {
                res(response.json());
            });
        });
        return promise;
    }
    
//    updateprofile = (userid, username, email) =>{
//        var promise = new Promise((resolve, reject) =>{
//            var data = new FormData()
//            data.append('userid', userid)
//            data.append('username',username);
//            data.append('email', email);
//            
//            fetch(BASE_URL+'/updateprofile', {
//                method: 'POST',
//                body: data
//                }).then(response => {
//                resolve(response.json());
//            });
//            })
//        return promise;
//    }
    
    
    updateprofile =  (userid, username, email,imageurl) =>   {
        var promise = new Promise((res, rej) => {                       
            fetch(BASE_URL+'/updateprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid,
                    username, 
                    email,
                    imageurl
                })
            }).then(response => {
                res(response.json());
            });
        });
        return promise;
    }
    
    
    
    
    getnotification = (userid) =>   {
        var promise = new Promise((resolve, reject) =>{
            fetch(BASE_URL+'/notification/?userid='+userid).then(response =>{
                resolve(response.json());
            })
        })
        return promise;
    }
    
    addfriend =(userid, friendid,type) =>    {
            var promise = new Promise((resolve, reject) => {
                if(friendid){
                    
                fetch(BASE_URL+'/notification/?userid='+userid+'&friendid='+friendid+'&type='+type).then(response=>{
                    resolve(response.json());
                })
                }else{
                    reject({error:'null'})
                }
            })
             return promise;
    }
    
    
    getuser = (userid) => {
        var promise = new Promise((resolve, reject) =>{
            fetch(BASE_URL+'/user/?userid='+userid).then(response =>{
            resolve(response.json());
        })
        });
        return promise;
    }
    
    loadfriend = (userid) =>    {
            var promise = new Promise((resolve,reject) =>{
                fetch(BASE_URL+'/friends/?userid='+userid).then(response =>{
//                    console.log(response.json())
                    resolve(response.json());
                })
            })
            return promise;
    }
    
    search = (somedata) => {
        var promise = new Promise((resolve, reject) =>{
            fetch(BASE_URL+'/search/?username='+somedata).then(response=>{
                resolve(response.json());
            }
            )
        })
        return promise;
    }
    // file upload section in test 
    getposts = (userid) => {
        var promise = new Promise((resolve,reject) =>{
            fetch(BASE_URL+'/posts/?userid='+userid).then(response=>{
//                console.log(response)
                resolve(response.json());
            })
        })
        return promise;
    }
//    postthis = (text, image,type,userid) => {
//        
//        var data = new FormData()
//        data.append('imageurl',image);
//        data.append('userid', userid)
//        data.append('text', text);
//        var promise = new Promise((resolve, reject)=>{
//            fetch(BASE_URL+'/posts', {
//                method: 'POST',
//                body: data
//                
//            }).then(response => {
//                resolve(response.json());
//            });
//        })
//        return promise;
//    }
//    
    
    postthis = (text, image,type,userid) => {
        var promise = new Promise((resolve, reject) => {                       
            fetch(BASE_URL+'/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image,
                    userid,
                    text
                })
            }).then(response => {
                resolve(response);
            })
        });
        return promise;
    }
    
    
    
    likeup = (postadd,userid,comment) => {
        console.log('sdfsdf')
        var promise = new Promise((resolve,reject)=>{
            fetch(BASE_URL+'/posts/?postaddress='+postadd+'&userid='+userid+'&comment='+comment).then(response=>{
                resolve(response.json());
            })
        })
        return promise;
    }
}

export default httpservice;