import React,{Component} from 'react';
import {firebaseApp} from '../firebase';
import {bake_cookie} from 'sfcookies';
import httpservice from '../service/http-service';

const http = new httpservice();

class Signin extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            email: '',
            password:'',
            repassword:'',
            errormsg:'',
            buttontext:'Sign Up',
            showspinner:'d-none'
        }
    }
    signup(){
        let self = this;
        if(this.state.password === this.state.repassword){    
        let {email,password} = this.state;
        this.setState({showspinner:'d-block',buttontext:''})
        firebaseApp.auth().createUserWithEmailAndPassword(email,password)
        .then((user)=>{
            user.updateProfile({
                displayName: self.state.username,
                photoURL:'https://openclipart.org/download/247320/abstract-user-flat-4.svg'
            }).then(()=>{
                http.createuser(user.email,this.state.username,user.uid,'https://openclipart.org/download/247320/abstract-user-flat-4.svg').then(data=>{
                            bake_cookie('user',user); 
//                            console.log('user',user)
//                            console.log(data);
                            document.location.reload();
                })
            })
        }
        ).catch(
        error =>{
              this.setState({errormsg:error.message,showspinner:'d-none',buttontext:'Sign Up'})}
        )
    }else{
        this.setState({errormsg: "password doesn't match with confirm password"})
    }
    }
    render(){
        return(
            <div>
            <div className="container first">
                <div className="signup-container"></div>
                <div className="row">
                    <div className="col"></div>
                    <div className="col-sm-10 col-12">
                        <div className="mysignin-card">
                        <div className="card signin m-1 mysignincardmod">
                            <div className="d-block mylogocontainer">
                                <img className="d-block m-auto bordercircle" src="/logo.png" alt="logo"/>
                                <h3 className="text-center">Create Account</h3>
                            </div>
                             <div className={this.state.errormsg==='' ? "d-none" :"alert alert-danger"} role="alert">
                                  {
                                            this.state.errormsg
                                  }
                            </div>
                            <div className="card-body">
                                <form className="form card-body" onSubmit={event=>event.preventDefault()}>
                                    <div className="my-3">
                                        <input type="test" className="form-control signininput" placeholder = "Username" onChange={event=>this.setState({username: event.target.value})} />
                                    </div>
                                    <div className="my-3">
                                        <input type="email" className="form-control signininput my-2" placeholder="Email" onChange={event=> this.setState({email:event.target.value})} required/>
                                    </div>
                                    <div className="my-3">
                                        <input type="password" className="form-control signininput my-3" placeholder="Password" onChange={event=> this.setState({password:event.target.value})} required/>
                                    </div>
                                    <div className="my-3">
                                        <input type="password" className="form-control signininput my-2" placeholder="Confirm Password" onChange={event=> this.setState({repassword:event.target.value})} required/>
                                    </div>
                                    
                                    <button className="loginbtn btn btn-primary m-auto" onClick={()=> this.signup()} ><i className={"fa fa-circle-o-notch fa-spin text-white " + this.state.showspinner}></i>{this.state.buttontext}</button>
                                </form>
                            </div>
                            <div className="cardfooter" onClick={()=> this.props.history.push('/signin')}>
                                <hr className="hrline"></hr>
                                <p className="footeroflogincard">Already have Account? <span className="makeitlink">Sign In</span> </p>
                            </div>
                        </div>
                        
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
            </div>
        );
    }
}

export default Signin;