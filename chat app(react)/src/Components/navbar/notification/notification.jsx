import React from 'react';
import {Link} from 'react-router-dom';
import '../search/search.css';

class Notification extends React.Component {
     constructor(props){
         super(props);
         this.state = {
            showsearchbox:false,
            notifications: [{_id:'sfdks',username:'None'}],
            confirmmsg:'',
            count:0
         }
         this.loadnotification = this.loadnotification.bind(this);
         this.loadnotification();
     }
    
    togglenotificaitonbox(){
        if(!this.state.showsearchbox){
            this.setState({showsearchbox:true});
        }
        else{
            this.setState({showsearchbox:false});
        }
    }
    
    loadnotification()  {
        this.props.http.getnotification(this.props.userid).then(data=>{
            if(data.length !==0 && data && data.error !== "could not fetch"){
                this.setState({notifications:data})
                this.setState({count:this.state.notifications.length})
            }else{
                this.setState({count:0})
            }
        })
    }
    
    showlist(){
        let self = this;
        const list = this.state.notifications.map(obj=>                                                                      
            (this.state.count !== 0)?(
            <div className="" key={obj._id}>
                <img src={obj.photo} width="30px" alt={obj.username+'_image'}></img><Link to="#" title={obj.email} className="notificationitem d-inline-block">{obj.username}</Link>
                <button title="accept friend request" data-toggle="modal" data-target="#exampleModal3"  onClick={()=> this.props.http.addfriend(this.props.userid, obj.userid,'accepted').then(data=> {self.loadnotification();self.props.confirmmsg("your are now friend with "+obj.username);this.setState({showsearchbox:false})}).catch(error => {})} className="d-inline-block btn btn-primary btn-sm" >Accept</button>
                <button data-toggle="modal" data-target="#exampleModal3"onClick={()=> this.props.http.addfriend(this.props.userid, obj.userid,'rejected').then(data=> {alert(data.msg);self.loadnotification();self.props.confirmmsg("request has been rejected");self.setState({showsearchbox:false})}).catch(error => {})} title="cancel friend request" className="btn btn-secondry btn-sm">Cancel</button>
            </div>):(<div key={obj._id}>None</div>)
        )
        return (list)
    }
    
    render(){
        return(
            <div className="d-inline-block">
                <div onClick={()=> this.togglenotificaitonbox()}><i className="fa fa-bell mycog"></i>{(this.state.count !==0)?(<sup className="mysuperscript">{this.state.count}</sup>):(null)}{(this.props.text)?(' '+this.props.text):(null)}</div>
                <div className={"list-group mysearchbox notification "+this.state.showsearchbox}>
                    {
                        this.showlist()
                    }
                </div>
                
           
                
                
            </div>
        );
    }
}

export default Notification;