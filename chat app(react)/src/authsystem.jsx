import React,{Component} from 'react';
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom';
import {bake_cookie, read_cookie} from 'sfcookies';
import {firebaseApp} from './firebase';

import App from './pages/App';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import Firsttimeuser from './pages/firsttimeuser';

const SignOut = () => {
    let user = [];
    bake_cookie('user',user)
    console.log('sfksnfdksnnnsdfon')
    firebaseApp.auth().signOut();
    return (<Redirect to='/signin' />);
}
const ProtectedRouter = ({component: Component,user, ...rest}) => (
    <Route {...rest} render = {(props)=>(
            user.length ===0 ? <Redirect to='/signin' /> : (!user.displayName ? <Redirect to='/firsttimeuser' /> : <Component {...props} /> )
    )}/>
)
const LoginRouter = ({component: Component,user, ...rest}) => (
    <Route {...rest} render = {(props)=>(
            user.length ===0 ? <Component {...props} />:<Redirect to='/' />
    )}/>
)

const SignoutRouter = ({component: Component,user, ...rest}) => (
    <Route {...rest} render = {(props)=>(
            !user.length !==0 ? <Component {...props} />:<Redirect to='/' />
    )}/>
)

const Firsttime = ({component: Component,user, ...rest}) => (
    <Route {...rest} render = {(props)=>(
            (user == null||user.length == 0) ?<Redirect to ='/signin' /> :(!user.displayName ?  <Component {...props} />:<Redirect to='/' />)
    )}/>
)
class AuthSystem extends Component {
    constructor(props){
        super(props);
        this.state={
            user: []
        }
        this.loadauthstatus = this.loadauthstatus.bind(this);
    }
    loadauthstatus(){
        let user = read_cookie('user');
        console.log('load auth status',user);
        this.setState({user})
    }
    componentDidMount(){
        let user = read_cookie('user');
        this.loadauthstatus();
    }
    render(){
        return(
            <Switch>
                <ProtectedRouter exact path='/' user={this.state.user} component={App} />
                <LoginRouter path='/signin' user={this.state.user} component={SignIn} />
                <LoginRouter path='/signup' user={this.state.user} component={SignUp} />
                <SignoutRouter path='/signout' user={this.state.user} component={SignOut} />
                <Firsttime path='/firsttimeuser' user={this.state.user} component={Firsttimeuser} />
            </Switch>
        );
    }
}

export default AuthSystem;