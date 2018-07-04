import React ,{Component} from 'react';
import {read_cookie} from 'sfcookies';
import Navbar from '../Components/navbar/navbar';
import httpservice from '../service/http-service'; 
import Menubar from '../Components/Menubar';
import Chat from '../Components/chat';


const http = new httpservice();

class Userpage extends Component {
    constructor(props){
        super(props);
        let user = read_cookie('user');
        this.state = {
            currentuserid: '',
            userid:user.uid,
            username:'',
            userphoto:'',
            userprofile:'',
            friend_userid: this.props.match.params.userid,
            friendlist:[],
            chatboxstatus:'chatboxhide',
            counter:0,
            buttonstatus:'',
            editmonde:'',
            confirmmsg:''
        }
        this.loaduserdata = this.loaduserdata.bind(this);
        this.loadfriendlist = this.loadfriendlist.bind(this);
        this.toggle = this.toggle.bind(this);
        this.msgcounter = this.msgcounter.bind(this)
        this.loaduserdata(this.state.friend_userid);
        this.loadfriendlist(this.state.userid);
        this.refresh = this.refresh.bind(this);
    }
    loaduserdata(userid){
        http.getuser(userid).then(data=>{
            if(data.length !== 0){
                
            this.setState({userprofile:data[0]});
            if(data[0].userid === this.state.currentuserid){
//                console.log('edit mode on');
                this.setState({editmode:'on'});
            }
            }
        })
    }
    
    loadfriendlist(userid){
        http.loadfriend(userid).then(data=>{
            if(data.error !=="could not fetch friendlist"){
                
            this.setState({friendlist: data.friends});
            console.log(data.friends)
            this.setbuttonstate();
            }
        })
    }
    
    componentDidMount(){
        let user = read_cookie('user');
        this.setState({currentuserid:user.uid,username:user.displayName,userphoto:user.photoURL});
    }
    
    
    setbuttonstate(){
        var flag =0;
        console.log(this.state.friendlist)
        if(this.state.friendlist.length !== 0){
        this.state.friendlist.map(obj=>{
            if(this.state.friend_userid === obj.userid){
                this.setState({buttonstatus:'Unfriend'})
                flag=1;
//                console.log('friendid',this.state.friend_userid )
//                console.log('user di',obj.userid )
            }else{
//                console.log('friendid',this.state.friend_userid )
//                console.log('user di',obj )
            }
            return null
        })
        }
        if(flag===0){
            this.setState({buttonstatus:'Add friend'})
        }
    }
    
    refresh(data){
//        console.log('sdfs',data);
        this.setState({friendlist:data});
        this.setbuttonstate();
    }
    
    sendfriendrequest(){
        let self = this;
        if(this.state.buttonstatus === 'Add friend'){
        http.friendrequest(this.state.currentuserid, this.state.friend_userid).then(data =>{
//            console.log(data)
            let msg = null;
            if(data.msg === 'ok'){
                    msg = 'request has been send';
            }else if(data.error === 'yourself'){
                    msg ='you can\'t send friend request to yourself';
            }else if(data.error === 'already'){
                    msg ='request is already in process'
            }
            self.setState({confirmmsg: msg});
        })
        }else{
            http.unfriendrequest(this.state.currentuserid, this.state.friend_userid).then(data =>{
                if(!data.error){
//                    console.log(data)
                    let confirmmsg = 'you are no longer friend with '+ this.state.userprofile.username;
                    self.setState({friendlist:data,confirmmsg})
                    self.setbuttonstate();
                }
            })
        }
//        console.log(this.state.userprofile)
    }
    
    toggle(friendlist){
        if(this.state.chatboxstatus === 'chatboxhide'){
            this.setState({chatboxstatus:'chatboxshow',friendlist})
        }else{
            this.setState({chatboxstatus:'chatboxhide'})
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
    
    render(){
        return (
            <div>
                <Navbar user={this.state} userid={this.state.userid} toggle={this.toggle} counter={this.state.counter} refresh={this.refresh}/>
                <div className='givetopmargin'>
                    <div className="d-none">
                        <Chat userid={this.state.userid} toggle={this.toggle} counter={this.state.counter}></Chat>
                    </div>
                    <div className='givetopmargin'>
                    </div>
                    {(this.state.userprofile)?(
                    <div className="">
                            
                            <div className="mx-2">
                                <div className="m-auto">       
                                    <div className="imgcontainer">
                                        <img src="https://png.pngtree.com/thumb_back/fh260/back_pic/00/02/40/3856176f6793187.jpg"  width="100%" className="pb-4" alt="background"></img>
                                    </div>
                                    <div className="card userdetailpage">
                                        <div className="card-body">
                                            <div className="usercontainer">
                                                <div className="userimagecontainer">
                                                    <img src={this.state.userprofile.photo} alt="userphoto" className="img-fluid d-block m-auto" width="100%"></img>
                                                </div>
                                                <span className="usernamecontainer">
                                                    <p>{this.state.userprofile.username}</p>
                                                </span>
                                                <span className="addfriendbutton">
                                                    <button className="btn btn-primary" data-toggle="modal" data-target="#exampleModal2" onClick={()=> this.sendfriendrequest()}>{this.state.buttonstatus}</button>
                                                </span>
                                            </div> 
                                            <p>Email: {this.state.userprofile.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                    </div>):(
                        
                        (this.state.userprofile ==='')?(<div></div>):(
                        <div className="">
                            <div className="myerrorsad">
                                {":( "}
                            </div>
                            <span className="myerormsg">
                                404 Not found
                            </span>
                        </div>
                        )
                    
                    )
                    }
                </div>
                 <Menubar userid={this.state.userid} chatboxstate={this.state.chatboxstatus} friendlist={this.state.friendlist} toggle={this.toggle} msgcounter={this.msgcounter}/>  
                
            <div class="modal fade" id="exampleModal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Confirm</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    {
                          this.state.confirmmsg
                      }
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" >Ok</button>
                  </div>
                </div>
              </div>
            </div>
                
            </div>
        );
    }
}

export default Userpage;