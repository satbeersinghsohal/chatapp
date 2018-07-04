import React,{Component} from 'react';
import httpservice from '../service/http-service';

const http = new httpservice();

class Oldpost extends Component {
    constructor(props){
        super(props);
        this.state={
            commentbox:"d-none",
            counter:0,
            comment:'',
            commentdata:'',
            commentvalue:undefined
        }
    }
    
    commented(){
//        console.log(this.state.comment)
        if(this.state.comment !== ''){
         let address = (this.props.postaddress)?this.props.postaddress:this.props.Photo;
         http.likeup(address,this.props.userid,this.state.comment).then(data=>{
                console.log(data)
                this.setState({commentvalue:''})
                this.setState({commentvalue:undefined})
                this.props.getdata();
            })
        }
    }
    commentlist(){
        var i =0;
        const list = this.props.commentdata.map(obj=>
            <div key={obj.userid+obj.text+i++}>
                 <div className="d-inline-block">
                    <img className="img-fluid" height="50px" width="50px" src={obj.photo} alt={obj.username} />
                     <a href={"/userdetails/"+obj.userid} target="_blank">{obj.username}</a>
                 </div>
                <div className="d-inline-block ml-2">
                    {
                        obj.text
                    }
                </div>
            </div>
        );
        return (list);
    }
    toggle(){
        if(this.state.commentbox === "d-none")
        {
            this.setState({commentbox:"d-block"})
        }
        else
        {
            this.setState({commentbox:"d-none"})
        }
    }
    likeup(){
//        console.log('postid',this.props.Photo)
            let address = (this.props.postaddress)?this.props.postaddress:this.props.Photo;
            http.likeup(address,this.props.userid,"empty").then(data=>{
                if(data){
                this.props.getdata();
                }
            })
    }
    render(){
        return (
            <div>
                <div className="container-fluid mx-0 px-1">
                    <div className="card post mt-3">
                        <div className="card-block my-1 p-0">
                            <div>
                                <img className="b-round d-inline-block" alt="image1" src={this.props.From[1]} width="50px" height="50px"/>
                                <h4 className="card-title d-inline-block ml-2">{this.props.From[0]}</h4>
                            </div>
                            <div className="container">
                                {
                                    (this.props.Photo)?(<img className="img-fluid d-block m-auto" alt="postimage" src={this.props.Photo} />):(null)
                                }
                                <pre>{this.props.Text}</pre>
                            </div>
                        </div>
                        <div>
                            <div className="d-inline-block ml-2">{this.props.Likes} Likes</div>
                            <div className="d-inline-block ml-2">{this.props.commentdata.length} Comments</div>
                            <div className="d-inline-block ml-2">{this.props.Shares} Shares</div>
                        </div>
                        <div className="post footer">
                            <hr className="hrline"></hr>
                            <div className="giveleftmargin">
                                <div className="drawline">
                                    <button id="thumbsupicon" className="commentbox d-inline-block mr-1"><i className="fa fa-thumbs-up" onClick={()=> this.likeup()}> Likes</i></button>
                                    <button className="commentbox d-inline-block mr-1"><i className="fa fa-comment" onClick={()=> this.toggle()}> Comments</i></button>
                                    <div className="commentbox d-inline-block mr-1"><i className="fa fa-share"> Share</i></div>
                                </div>
                                <div className={this.state.commentbox}>
                                    <hr className="hrline my-1"></hr>
                                    <div>{
                                        this.commentlist()
                                        }
                                    </div>
                                    <div className="row container-fluid">
                                    <input className="form-control col-9 d-block mr-0 commentinput" placeholder="comment something..." value={this.state.commentvalue} onChange={event=> this.setState({comment:event.target.value})}>
                                    </input>
                                    <button className="btn btn-primary col-2 d-block post mycommentbutton" onClick={()=> this.commented()}>Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Oldpost;