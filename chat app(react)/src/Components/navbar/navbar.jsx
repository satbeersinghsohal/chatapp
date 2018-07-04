import React from 'react';
import './navbar.css';
import Search from './search/search';
import httpservice from '../../service/http-service';
import Notification from './notification/notification';
import {Link}  from 'react-router-dom';
const http = new httpservice();

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menuiconstate:'',
            notifications: [{_id:'sfdks',username:'None'}],
            showsearchbox:false,
            confirmmsg:'',
            friendlist:[]
        }
        this.loadfriends = this.loadfriends.bind(this);
        this.refresh2 = this.refresh2.bind(this);
        this.loadfriends();
    }
    
    changeiconstate(){
        if(this.state.menuiconstate === ''){
            this.setState({menuiconstate:'change'});
        }
        else{
            this.setState({menuiconstate:''});
        }
    }
    
    clickcommentbutton(){
        http.loadfriend(this.props.userid).then(data=>{
            this.props.toggle(data.friends)
            this.props.refresh(data.friends);
        });
    }
    
    loadfriends(){
        http.loadfriend(this.props.userid).then(data=>{
            this.setState({friendlist: data.friends});
            console.log(this.state.friendlist)
        });
    }
    
    confirmmsg(data){
        console.log(data)
        document.getElementById("confirmsg").innerHTML = data;
        this.clickcommentbutton();
    }
    
    refresh2(){
        this.clickcommentbutton();
    }
    
    render(){
        return(
            <div>
                <nav className="mycontainer">
                    <ul className="ul-list">
                        <li className="list-item homebutton"><Link className="menu-item" to="/">Home</Link></li>
                        <li className="searchbar hidden-sm-down"><Search /></li>
                        <li className="li chattinglist-item d-inline-block hidden-md-up" onClick={()=> this.clickcommentbutton()}><i className="fa fa-comments commentresize" title="chat"></i>{(this.props.counter ===0)? null:(<sup className="mysuperscript">{this.props.counter}</sup>)}</li>
                        
                        <li className="list-item showinmobile" onClick={()=>this.changeiconstate()}>
                            <div className={"bar1 "+this.state.menuiconstate}></div>
                            <div className={"bar2 "+this.state.menuiconstate}></div>
                            <div className={"bar3 "+this.state.menuiconstate}></div>
                        </li>
                    </ul>
                    
                    <ul  className="ul-list hidden-sm-down d-inline-block">
                        <li className="mylistitem" title="notification"><Notification confirmmsg={this.confirmmsg} http={http} userid={this.props.user.userid}/></li>
                        <li className="mylistitem"><a><img width="35px" src={this.props.user.userphoto} alt={this.props.user.username}/> {'Hi, '+this.props.user.username}</a></li>
                        <li className="mylistitem">
                        <div className="dropdown">
                          <a className="dropdown-toggle menu-item" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">   
                          </a>
                          <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                              <Link to='/setting' className="menu-item d-block"><i className="fa fa-cog mycog"></i> Setting</Link>
                              <Link to='/signout' className="menu-item sign-out"><i className="fa fa-sign-out mycog"></i> Log out</Link>
                          </div>
                        </div>
                        </li>
                    </ul>
                    
                    <div className="showinmobile">
                        <div className={"sidenavbar "+this.state.menuiconstate}>
                            
                            <div className="img-containerforuser">
                                <p><img className="img-fluid userphotoinsidenavbar" width="60px" src={this.props.user.userphoto} alt={this.props.user.username}/> {'Hi, '+this.props.user.username}
                                </p>
                            </div>
                            <ul className="ul-list">
                                <div className="sidenavbar-container">
                                    <li className="menu-item"><Search /></li>
                                    <li className="menu-item"><Link className="menu-item" to="/setting"><i className="fa fa-cog mycog"></i> Setting</Link></li>
                                    <li className="menu-item exception"><Notification http={http} userid={this.props.user.userid} text="Notification"/> </li>
                                    <li className="menu-item sign-out"><Link className="menu-item sign-out" to="/signout"><i className="fa fa-sign-out mycog"></i> Log out</Link></li>
                                </div>
                            </ul>
                        </div>
                    </div>
                </nav>
                 <div className="modal fade" id="exampleModal3" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Confirm</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p id="confirmsg"></p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" data-dismiss="modal" >Ok</button>
                  </div>
                </div>
              </div>
            </div>
            </div>
        );
    }
}


export default Navbar;