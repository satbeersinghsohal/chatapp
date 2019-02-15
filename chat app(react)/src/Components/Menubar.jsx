import React from 'react';
import io from 'socket.io-client';
import {read_cookie,bake_cookie} from 'sfcookies';
const socket = io();

class Menubar extends React.Component {
    constructor(props){
        super(props);
        this.state={
            togglechattingscreen:false,
            currentfriend:{
                userid:'',
                username:'',
                photo:''
            },
            msg:'',
            messages:[],
            counter:[]
        }
        this.scrolltobottom = this.scrolltobottom.bind(this);
        setInterval(this.getmsg(),2000);
        console.log("test");
    }
    
    togglechattingscreen(user){
        if(this.state.togglechattingscreen === true){
            this.setState({togglechattingscreen:false});
        }
        else{
            this.setState({togglechattingscreen:true});
             var {userid,username,photo} = user;
            this.setState({currentfriend:{userid,username,photo}})
            
            var y =this.state.counter;
            //eslint-disable-next-line
            y.map(obj=>{
                if(obj.userid === userid){
                        this.props.msgcounter({type:'dec',val:obj.counter})
                        obj.counter = 0;
                    }
                })
            this.setState({counter:y})
        }
    }
    componentDidMount(){
        console.log("test");

        var messages = read_cookie('messages');
        this.setState({messages})
        
        
    }
    componentDidUpdate(){
        bake_cookie('messages',this.state.messages);
//        console.log('from menu', this.props)
        this.scrolltobottom();
        
    }
    getdate(t){
        var d = new Date();
        var time = new Date(t)
        var currentday = d.getDay()+d.getMonth()+d.getFullYear();
        var msgday     = time.getDay()+time.getMonth()+time.getFullYear();
        var minutes    = time.getMinutes();
        if(minutes < 10){
            minutes = '0' + minutes;
        }
        if(currentday === msgday){
            return time.getHours()+":"+minutes;
        }
        else{
            return time.getDate()+" "+time.getMonth()+" "+ time.getHours()+":"+time.getMinutes();
        }
    }
    
    msglist(){
//        console.log(this.state.messages)
        var x = this.state.messages.filter(user=>{
            return ((this.state.currentfriend.userid === user.for&&this.props.userid === user.from)||(this.state.currentfriend.userid === user.from&&this.props.userid === user.for))
        })
        
        // message counter for individual friend
        
        const list = x.map(obj=>
            (obj.type === 'send')? (<p className="text sendtext">{obj.msg+' '+this.getdate(obj.time)}{this.scrolltobottom()}</p>):(<p className="text">{obj.msg+' '+this.getdate(obj.time)}{this.scrolltobottom()}</p>)
        );
        return (list);
    }
    
    sendmsg(){
        if(this.state.msg !==''){
            
        var n = new Date();
        var msg =  {for:this.state.currentfriend.userid,from:this.props.userid,msg:this.state.msg,type:'send',time:n}
        socket.emit('chat message',msg);
        var y = this.state.messages;
        y.push(msg);
        this.setState({messages:y});
        document.getElementById("inputmsg").value = '';
        this.setState({msg:''})
//        console.log(this);
        }
    }
    
    getmsg(){
        
        socket.on(this.props.userid,msg=>{
            msg.type = 'recieved';
            var n = new Date();
            msg.time = n;
            var y = this.state.messages;
            y.push(msg);
            this.setState({messages:y});
            var x = {type:'inc'}
            this.props.msgcounter(x);
            x = this.state.counter;
            var t =0;
            if(x.length === 0){
                x.push({userid:msg.from,counter:1})
            }
            else{
                  //eslint-disable-next-line
                x.map(obj=>{
                    if(obj.userid === msg.from){
                        var count = obj.counter;
                        count = count +1;
                        obj.counter = count;
                        t=1;
                    }
                })
                if(t===0){
                    x.push({userid:msg.from,counter:1})
                }
            }
            this.setState({counter:x})
        })
    }
    
    scrolltobottom() {
        if(this.state.messages.length > 0){
        var objDiv = document.getElementById("myscrollbar1234");
            if(objDiv !== null){
                objDiv.scrollTop = objDiv.scrollHeight;
                let abc = window.innerHeight*0.6;
                console.log(abc)
                objDiv.style.height = abc+"px";
                
        }
//        console.log('fgg');
        }
    }
    
    getfriendmsgcounter(id){
//        console.log(this.state.counter)
        if(id !== undefined && this.state.counter.length !== 0){
           const list = this.state.counter.map(obj=>
                (obj.userid === id && obj.counter !== 0)?(<sup className="mysuperscript">{obj.counter}</sup>):null)
           return (list);
        }else{
            return null;
        }
    }
    friendlist2 =() =>{
        if(this.props.friendlist){
            const list = this.props.friendlist.map(obj=>
            <div key={obj.userid}>
                <div style={{height:60+'px'}} onClick={() =>this.togglechattingscreen(obj)}>
                    <img src={obj.photo} width="50px" alt={obj.username} ></img>
                    <a>{obj.username}</a>
                    {this.getfriendmsgcounter(obj.userid)}
                </div>
            </div>
             );
          return (list);
        }else{
            return (null)
        }
    }
    render(){
        return(
            <div className={this.props.chatboxstate}>
                {
                    (!this.state.togglechattingscreen)?(<div className={"card bgdark "+!this.state.togglechattingscreen}>
                    <i className="fa fa-thin-cross fa-2x d-block ml-auto" onClick={() =>this.props.toggle()}></i>
                    <div className="mt-2">
                        {
                            this.friendlist2()
                        }
                    </div>
                </div>
                )
                :  
                (
                <div className={"card bgdark "+this.state.togglechattingscreen}>
                    <i className="fa fa-thin-cross fa-2x d-block ml-auto" onClick={() =>this.props.toggle()}></i>
                    <i className="fa fa-arrow-left d-block mr-auto" onClick={() =>this.togglechattingscreen('sdfsdf')}></i>
                    <div className="chatuserphoto">
                        <img src={this.state.currentfriend.photo} width="50px" height="50px" className="d-inline" alt="friendphoto"></img>
                        <p className="d-inline">{this.state.currentfriend.username}</p>
                    </div>
                    <div className="adjustchatscreen">
                        <hr className="menubar hrline"/>
                        <div id="myscrollbar1234" className="chatscreen">   
                                {
                                    this.msglist()
                                }{
                                
                            }
                            <div>
                            <input id="inputmsg" className="form-control myinputfield msg" onChange={event=>this.setState({msg:event.target.value})}/>
                            <button className="btn btn-primary mysendbtn" onClick={() => this.sendmsg()}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>)
                }
                
                
            </div>
        );
    }
}

export default Menubar;