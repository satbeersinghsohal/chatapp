import React,{Component} from 'react';
import httpservice from '../service/http-service';
import './friendlistmenu.css';
const http = new httpservice();


class Frindlistblock extends Component {
    constructor(props){
        super(props);
        this.state={
            show:false,
            friendlist : [],
            hidden:'hideme',
            hidden2:'righttopfixedcol-small',
            hidden3:'fa fa-angle-left fa-2x',
            hidden4:'hideme2'
        }
        this.list = this.list.bind(this);
        this.loaddata = this.loaddata.bind(this);
        this.loaddata();
    }
    loaddata =()=>{
        http.loadfriend(this.props.userid).then(data=>{
//            console.log('friends data',data.friends)
            if(data && data.length !== 0 && data.error !=='could not fetch friendlist'){
                
            this.setState({friendlist: data.friends});
            }
        });
    }
    togglehiddenstate = () =>{
        if(this.state.hidden === 'hideme'){
            this.setState({hidden: 'showme',hidden2:'righttopfixedcol',hidden3:'fa fa-angle-left myarrow fa-2x',hidden4:'showme2'})
        }else{
            this.setState({hidden: 'hideme',hidden2:'righttopfixedcol-small',hidden3:'fa fa-angle-left fa-2x',hidden4:'hideme2'})
        }
    }
    list = () => {
        const x =  this.state.friendlist.map(obj=>
            <div key={obj._id} className="d-block ml-1" style={{height:72+'px'}}><a href={'/userdetails/'+obj.userid} target="_blank"><img src={obj.photo} height="50px" width="50px" alt={obj.username} /></a><a className={this.state.hidden}>{obj.username}</a></div>
        )
        return (x);
    }
    showfriendlist(){
        this.setState({show:true});
    }
    
    render(){
        return(
            <div className={this.state.hidden2}>
                <div className="container p-0">
                    <div className="card friendmenu p-0 hidden-md-up">
                        <i onClick={()=>this.togglehiddenstate()} className={this.state.hidden3}></i>
                        <div className={this.state.hidden4}>
                            <div className="this.state.hidden">
                                {
                                    this.list()
                                }
                            </div>
                        </div>
                    </div>
                    <div className="card friendmenu p-0 hidden-sm-down" >
                        <i onClick={()=>this.togglehiddenstate()} className={this.state.hidden3}></i>
                        {
                            this.list()
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Frindlistblock;