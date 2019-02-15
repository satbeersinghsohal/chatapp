import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom';
import {firebaseApp} from './firebase';

import App from './pages/App';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import Setting from './pages/settings';
import Userpage from './pages/userpage';
import {read_cookie} from 'sfcookies';


var userlog = read_cookie('user');

//firebaseApp.auth().onAuthStateChanged(user=>{
//    if(user){
//        bake_cookie('user',user);
//        userlog = user;
//    }else {
//        bake_cookie('user',[]);
//        userlog = [];
////        this.props.history.replace('/signin');
//    }
//})

const SignOut = () => {
    firebaseApp.auth().signOut();
//    bake_cookie('user',[]);
    document.location.reload();
    return (<Redirect to='/signin' />);
}
const ProtectedRouter = ({component: Component, ...rest}) => (
    <Route {...rest} render = {(props)=>(
            (userlog.length ===0||userlog.displayName === undefined) ? <Redirect to='/signin' /> : <Component {...props} />
    )}/>
)
const LoginRouter = ({component: Component, ...rest}) => (
    <Route {...rest} render = {(props)=>(
            userlog.length ===0 ? <Component {...props} />:<Redirect to='/' />
    )}/>
)

const SignoutRouter = ({component: Component, ...rest}) => (
    <Route {...rest} render = {(props)=>(
            userlog.length !==0 ? <Component {...props} />:<Redirect to='/' />
    )}/>
)

const Errorpage = () =>(
    <div className="jumbotron jumbotron-fluid display-2 text-center">404 Page Not Found</div>
)

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <ProtectedRouter exact  path='/'                        component={App} />
            <ProtectedRouter        path='/userdetails/:userid'     component={Userpage} />
            <ProtectedRouter        path='/setting'                 component={Setting} />
            <Route                  path='/errorpage'               component={Errorpage} />
            <LoginRouter            path='/signin'                  component={SignIn} />
            <LoginRouter            path='/signup'                  component={SignUp} />
            <SignoutRouter          path='/signout'                 component={SignOut} />
        </Switch>
        
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();
