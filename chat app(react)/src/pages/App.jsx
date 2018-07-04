import React,{Component} from 'react';
import Navbar from '../Components/navbar/navbar';
import Frindlistblock from '../Components/friendlistmenu';
import {read_cookie} from 'sfcookies';
import './App.css';

import Post from '../Components/post';
import Chat from '../Components/chat';
import Menubar from '../Components/Menubar';


class App extends Component {
    constructor(props){
        super(props);
        let user = read_cookie('user');
        this.state ={
            username: user.displayName,
            userphoto: user.photoURL,
            userid: user.uid,
            x:'',
            friendlist:[],
            chatboxstatus:'chatboxhide',
            counter:0,
            zxh:''
        }
        this.toggle = this.toggle.bind(this)
        this.msgcounter = this.msgcounter.bind(this)
        this.refresh = this.refresh.bind(this)
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
        return(
            <div className="edgetoedge">
               <Navbar user={this.state} userid={this.state.userid} toggle={this.toggle} counter={this.state.counter} refresh={this.refresh} />
                <div className="givetopmargin">
                    <div className="row">
                        <div className="col-md-3 col-0">
                            <div className="lefttopfixedcol">
                                <div className="card leftborderzero hidden-sm-down bgdark">
                                    <Chat userid={this.state.userid} toggle={this.toggle} counter={this.state.counter}></Chat>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 col-12">
                            <div className="row">
                                <div className="col-md-11 col-12 mypostcol2">
                                    <Post userid={this.state.userid}/>
                                </div>
                                <div className="col-md-1 col-0">
                                <Frindlistblock userid={this.state.userid}/>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <Menubar userid={this.state.userid} chatboxstate={this.state.chatboxstatus} friendlist={this.state.friendlist} toggle={this.toggle} msgcounter={this.msgcounter}/>
            </div>
        );
    }
}

export default App;