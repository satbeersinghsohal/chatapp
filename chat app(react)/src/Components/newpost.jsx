import React, {Component} from 'react' ;
import httpservice from '../service/http-service';
import {storage} from '../firebase.js';

const http = new httpservice();

class Newpost extends Component{
    constructor(props){
        super(props);
        this.state={
            text: '',
            image:'',
            status:'',
            empty:undefined
        }
        this.uploadfile = this.uploadfile.bind(this)
    }
    reset(){
        this.setState({empty:''})
        this.setState({empty:undefined});
    }
 
    uploadfile(){
            if(this.state.image !== ''){
                var storageRef = storage.ref();
                var file = this.state.image;
                var d = new Date().getTime().toString();
                var metadata = {
                  contentType: 'image/jpeg'
                };
// eslint-disable-next-line
                var storeurl = 'images/'+this.props.userid +'/'+d+'/'+'postimage.jpg';
                storageRef.child(storeurl).put(file, metadata);
                let self = this;
                storageRef.child(storeurl).getDownloadURL().then(function(url) {

                    self.savefile(url)
                    console.log("url",url)
                }).catch(function(error) {
                    self.uploadfile()
                });

            }else{
                console.log("no image");
                this.savefile(null)
            }
        }

    savefile(url){
            let {text,image,type} = this.state;
            if(image === ''){
                type = 'text';
            }else{
                type = 'photo';
            }
        
            if(type === 'photo'){
                console.log("url ==>",url)
                let self = this;
                http.postthis(text,url,type,this.props.userid).then(data=>{
                    if(data){
                        self.setState({status: 'ok',text:'',image:''});
                        self.reset();
                        self.props.getdata();
                    }else{
                        self.setState({status: 'error'})
                    }
                })
            }else if(text !==''){
                let self = this;
                    http.postthis(text,url,type,this.props.userid).then(data=>{
                        if(data){
                            self.setState({status: 'ok',text:'',image:''});
                            self.reset();
                            self.props.getdata();
                        }else{
                            self.setState({status: 'error'})
                        }
                })
            }
    }
    render(){
        return (
            <div>
                <div className="container-fluid mx-0 px-1">
                    <div className="card mt-2">
                        <div className="card-block my-1 p-0">
                            <h4 className="card-title">Post</h4>
                            <ul className="nav nav-tabs" role="tablist">
                              <li className="nav-item">
                                <a className="nav-link active" data-toggle="tab" href="#home" role="tab">Home</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#profile" role="tab">Media</a>
                              </li>
                           
                            </ul>
                                <div className="tab-content">
                                  <div className="tab-pane active" id="home" role="tabpanel">
                                        <textarea className="form-control" value={this.state.empty} onChange={event=>
                                       this.setState({text: event.target.value})} required></textarea>
                                        <button className="btn btn-primary d-block mt-1 ml-auto" onClick={() => this.uploadfile()}>Post</button>
                                    </div>
                                  <div className="tab-pane" id="profile" role="tabpanel">
                                    <form className="form" encType="multipart/form-data" onSubmit={event => event.preventDefault()}>
                                        <textarea className="form-control" value={this.state.empty} onChange={event=>
                                       this.setState({text: event.target.value})} required></textarea>
                                        <input name="sampleFile" value={this.state.empty} type="file" onChange={event=> this.setState({image: event.target.files[0]})} ></input>
                                        <button className="btn btn-primary d-block mt-1 ml-auto" onClick={() => this.uploadfile()}>Post</button>
                                      </form>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Newpost;