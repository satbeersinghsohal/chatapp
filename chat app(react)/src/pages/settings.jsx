import React,{Component} from 'react';
import Navbar from '../Components/navbar/navbar';
import Frindlistblock from '../Components/friendlistmenu';
import {read_cookie,bake_cookie} from 'sfcookies';
import './App.css';
import {firebaseApp,storage} from '../firebase.js';
import Chat from '../Components/chat';
import Menubar from '../Components/Menubar';
import Httpservice from '../service/http-service';

//import * as firebase from 'firebase';

const http = new Httpservice();

class App extends Component {
    constructor(props){
        super(props);
        let user = read_cookie('user');
        this.state ={
            username: user.displayName,
            useremail: user.email,
            userphoto: user.photoURL,
            newpassword:'password',
            userid: user.uid,
            image:'',
            imageurl: user.photoURL,
            x:'',
            friendlist:[],
            chatboxstatus:'chatboxhide',
            counter:0,
            zxh:''
        }
        this.toggle = this.toggle.bind(this)
        this.msgcounter = this.msgcounter.bind(this)
        this.refresh = this.refresh.bind(this)
        this.updatedata = this.updatedata.bind(this)
    }
    
    toggle(data){
        if(this.state.chatboxstatus === 'chatboxhide'){
            this.setState({chatboxstatus:'chatboxshow',friendlist:data})
        }else{
            this.setState({chatboxstatus:'chatboxhide'})
        }
    }
    refresh(data){
//        console.log('sdfs',data);
        this.setState({friendlist:data})
    }
    componentDidMount(){
        this.resetdata();
    }
    resetdata(){
        var name = document.getElementById("username");
        var email = document.getElementById("email");
        var password = document.getElementById("password");
        var photo = document.getElementById("photo");
        
        name.value = this.state.username;
        email.value = this.state.useremail;
        password.value = this.state.newpassword;
        photo.src = this.state.userphoto;
    }
    
    
    savedata(){
        var storageRef = storage.ref();
        var file = this.state.image;
        var metadata = {
          contentType: 'image/jpeg'
        };
        
        storageRef.child('images/'+this.state.userid +'/userimage.jpg' ).put(file, metadata);
        let self = this;
        storageRef.child('images/'+this.state.userid +'/userimage.jpg' ).getDownloadURL().then(function(url) {
          
            self.updatedata(url)
            console.log("url",url)
        }).catch(function(error) {
            if(this.state.image !==''){
                self.savedata();
            }
            self.updatedata(null)
        });
        
    }
    
    
    updatedata(url){
        var name = document.getElementById("username").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
       
        
            if(url){
                this.setState({imageurl: url})
                console.log(url)
            }
            let self = this;
            var user = firebaseApp.auth().currentUser;
            if(user){
                let imageurl = (this.state.imageurl === user.photoURL)? user.photoURL: this.state.imageurl;
                console.log(imageurl)
                http.updateprofile(this.state.userid, name, email,imageurl).then(data=>{
                    if(data.error === 'error'){

                    }else{
                        console.log(imageurl)
                        user.updateProfile({
                          displayName: name,
                          email: email,
                          photoURL: imageurl
                        }).then(function() {
                            if(password.value !== "password"){
                            user.updatePassword(password).then(function() {
//                                console.log('new user', user);
                                bake_cookie('user', user);
                                self.setState({username: user.displayName,useremail: user.email,userphoto: user.photoURL});
                            }).catch(function(error) {
                                bake_cookie('user', user);
                                self.setState({username: user.displayName,useremail: user.email,userphoto: user.photoURL});
                                console.log("100%")
                            });
                            }else{
                                
                            }

                        }).catch(function(error) {
                          // An error happened.
                        });
                }
            })  
            }else{
                setTimeout(self.updatedata(),1000);
            }
        
    }
    
    
    msgcounter(x){
        var count = this.state.counter;
        if(x.type==='inc'){
            count  =count +1;
        }
        else if(x.type==='dec'){
            count = count - x.val;
        }
        else if(x.type==='reset'){
            count = 0;
        }
        this.setState({counter:count})
//        console.log(count);
    }
    
    
    submitform(event){
        this.setState({image: event.target.files[0]})
        var src = URL.createObjectURL(event.target.files[0]);
        this.setState({imageurl: src});
    }
    
    render(){
        return(
            <div className="edgetoedge">
                <div>
                    <Navbar user={this.state} userid={this.state.userid} toggle={this.toggle} counter={this.state.counter} refresh={this.refresh}/>
                </div>  
                <div className="givetopmargin">
                    <div className="container-fluid row">
                        <div className="col-md-3 p-1 pl-0 pr-3">
                            <div className="lefttopfixedcol">
                                <div className="card hidden-sm-down bgdark">
                                    <Chat userid={this.state.userid} toggle={this.toggle} counter={this.state.counter}></Chat>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 row p-0 pl-1 pr-1 m-auto">
                            <div className="col-md-11 p-1 ml-1">
                                <div className="container-fluid m-auto p-0">
                                    <div className="mt-2">
                                       <div className="card pb-1">
                                                <h3>Settings</h3>
                                        </div>
                                        <div className="card bggraydark">
                                                <div class="">
                                                    <form className="row settingform" onSubmit={e=> e.preventDefault()}>
                                                        <div className="col-md-2 col-sm-3 col-5 mysettingcol">
                                                            <lable>Name</lable>
                                                            <lable>Email</lable>
                                                            <lable>New Password</lable>
                                                        </div>
                                                        <div className="col-md-6 col-sm-5 col-7 mysettingcol">
                                                            <input id="username" className="form-control disable" type="text" placeholder="Username" ></input>
                                                            <input id="email" className="form-control disable" type="text" placeholder="Email" ></input>
                                                            <input id="password" className="form-control" type="password" placeholder="Password" ></input>
                                                            
                                                        </div>
                                                        <div className="col-md-4 col-sm-4 mysettingcol">
                                                            <div className="imagecontainer">
                                                                <div className="myimguser">
                                                                    
                                                                        <img id="photo" src={this.state.imageurl} className="imgbox" alt="preview_photo" />
                                                                        <input name="sampleFile" className="fa fa-pencil-square-o mypencilicon" value={this.state.empty} type="file" 
                                                                             accept="image/gif, image/jpeg, image/png" onChange={event=> this.submitform(event)} ></input>
                                                                </div>
                                                                <a className="lablepreview">Preview</a>
                                                            </div>
                                                            <div className="ml-auto mt-4 d-block btngroup">
                                                                <button onClick={()=> this.resetdata()} className="btn btn-secondary d-inline-block">Reset</button>
                                                                <button type="submit" className="btn btn-primary d-inline-block ml-1" data-toggle="modal" data-target="#exampleModal">Save</button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-1 p-0 pr-1">
                                    <Frindlistblock userid={this.state.userid}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Menubar userid={this.state.userid} chatboxstate={this.state.chatboxstatus} friendlist={this.state.friendlist} toggle={this.toggle} msgcounter={this.msgcounter}/>

            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Confirm</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    Are You sure ?
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={()=> this.savedata()}>Save changes</button>
                  </div>
                </div>
              </div>
            </div>

            </div>
        );
    }
}

export default App;