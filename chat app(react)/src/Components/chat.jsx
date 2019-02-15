import React,{Component} from 'react'
import Httpservice from '../service/http-service';
import {Link} from 'react-router-dom'
import './chat.css'
const http = new Httpservice();

class Chat extends Component {
    constructor(props){
        super(props);
        this.state= {
            friendlist:[]
        }
        this.loadfriends = this.loadfriends.bind(this);
        this.loadfriends();
    }
    loadfriends(){
        http.loadfriend(this.props.userid).then(data=>{
            this.setState({friendlist: data.friends});
        });
    }
    
    calltogglefunction(){
        
    }
    
    render(){
        return(
        <div className="">
                <div>
                    <h3>chat app</h3>
                    <hr className='hr'/>
                    <ul className="ul">
                        <li className="li chattinglist-item" onClick={() => this.props.toggle(this.state.friendlist)}>Chatting{(this.props.counter ===0)? null:(<sup className="mysuperscript">{this.props.counter}</sup>)}</li>
                        <li className="li">News</li>
                        <li className="li">Games</li>
                        <li className="li"><Link className="li" to="/setting">Setting</Link></li>
                    </ul>
                </div>           
        </div>
        );
    }
}

export default Chat;