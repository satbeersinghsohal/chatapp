import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {firebaseApp} from '../firebase';
import {bake_cookie} from 'sfcookies';

import './Signin.css';

class Signin extends Component {
    constructor(props){
        super(props);
        this.state={
            email: '',
            password:'',
            errormsg:'',
            buttontext:'Login',
            showspinner:'d-none'
        }
        this.loaddata = this.loaddata.bind(this);
    }
    
    loaddata(){
        firebaseApp.auth().onAuthStateChanged(user=>{
            if(user){
                bake_cookie('user',user);
                this.props.history.replace('/');
            }else {
                let user = [];
                bake_cookie('user',user);
            }
        })
    }
    signin(){
        let {email,password} = this.state;
        this.setState({showspinner:'d-block',buttontext:''});
        firebaseApp.auth().signInWithEmailAndPassword(email,password)
        .then((user)=>{   
            bake_cookie('user',user);
            this.props.history.replace('/firsttimeuser');
        }).catch(error=>{
//            console.log(error)
            let errormsg=null;
            if(email ==='' ){
                errormsg = 'Email field is empty';
            }else if(password ===''){
                errormsg = "Password field is empty";
            }else{
                errormsg = 'Email/Password is wrong';
            }
            this.setState({showspinner:'d-none',buttontext:'Login',errormsg});
        })
    }
    componentDidMount(){
        this.loaddata();
    }
    render(){
        return(
            <div>
            <div className=" first">
                <div className="signin-container"></div>
                <div className="row">
                    <div className="col"></div>
                    <div className="col-sm-10 col-12">
                        <div className="mysignin-card">
                        <div className="card signin m-1 mysignincardmod">
                            <div className="resetopacity">
                                <div className="d-block mylogocontainer">
                                    <img className="d-block m-auto bordercircle" src="/logo.png" alt="logo"/>
                                    <h3 className="text-center">Log In</h3>
                                </div>
                                <div className={this.state.errormsg==='' ? "d-none" :"alert alert-danger"} role="alert">
                                  {
                                            this.state.errormsg
                                  }
                                </div>
                                <div className="card-body">
                                    <form className="form" onSubmit={event=>event.preventDefault()}>
                                        <div className="input-group my-3">
                                            <span className="input-group-addon signininput">
                                                <i className="fa fa-user"></i>
                                            </span>
                                            <input type="email" className="form-control signininput" placeholder="Email" onChange={event=> this.setState({email:event.target.value})} autoFocus required/>
                                        </div>
                                        <div className="input-group my-2">
                                            <span className="input-group-addon signininput">
                                                <i className="fa fa-lock"></i>
                                            </span>
                                            <input type="password" className="form-control signininput" placeholder="Password" onChange={event=> this.setState({password:event.target.value})} required/>

                                        </div>

                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input type="checkbox" className="form-check-input"/> Remember Me
                                            </label>
                                        <Link className="float-right text-right" to='/forgetpassword'>Forget password?</Link>
                                        </div>
                                        
                                        <button className="loginbtn btn btn-primary m-auto mt-5" onClick={()=> this.signin()} ><i className={"fa fa-circle-o-notch fa-spin text-white "+this.state.showspinner}></i>{this.state.buttontext}</button>
                                        
                                    </form>
                                </div>
                            </div>
                            <div className="cardfooter" onClick={()=> this.props.history.push('/signup')}>
                                <hr className="hrline"></hr>
                                <p className="footeroflogincard">New User? <span className="makeitlink">Sign Up</span></p>
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