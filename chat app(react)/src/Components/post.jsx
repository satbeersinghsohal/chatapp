import React, {Component} from 'react' ;
import httpservice from '../service/http-service';
import Newpost from './newpost';
import Oldpost from './oldpost';
import './post.css'

const http = new httpservice();

class Post extends Component{
    constructor(props){
        super(props);
        this.state={
            postdata:[],
            scrollval:''
        }
        this.loaddata = this.loaddata.bind(this);
        this.getdata = this.getdata.bind(this);
        this.getdata();
    }
    
    getdata(){
        http.getposts(this.props.userid).then(data=>{
//            console.log(data)
            if(data.length !== 0 && data[0]){
                if(data[0].error !== 'nothing to fetch'){
    //                console.log(data)
                    console.log(data)
                    this.setState({postdata: data});
                }
            }
        })
    }
    
    loaddata(){
        const list = this.state.postdata.map(obj=>
            <Oldpost key={obj._id} postaddress={obj.postaddress} From={obj.From} Photo={obj.Photolink} postid={obj._id} Likes={obj.Likes} Shares={obj.Shares} Text={obj.Text} getdata={this.getdata} commentdata={obj.comments} userid={this.props.userid}/>
        ) 
        return (list)
    }
    empty(){
        if(this.state.postdata.length ===0 ){
            return (
                    <div>
                        <div className="nothingtoshow">
                        Nothing to Show
                        </div>
                    </div>
            );
        }
    }
    render(){
        return (
            <div className="mypostcol">
                <Newpost userid={this.props.userid} getdata={this.getdata}/>
                <div>
                    {
                        this.loaddata()
                    }
                </div>
                <div>
                    {
                        this.empty()
                    }
                </div>
                <div className="mb-4">
                </div>
            </div>
        )
    }
}

export default Post;