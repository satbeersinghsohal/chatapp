import React from 'react';
import Searchitem from './searchitem';
import {Link} from 'react-router-dom'
import httpservice from '../../../service/http-service';

import './search.css';

const http = new httpservice();

class Search extends React.Component {
     constructor(props){
        super(props);
        this.state = {
            search:'',
            result:[],
            temp:'',
            showsearchbox:false,
            show:false
        }
        this.searchwhiletyping = this.searchwhiletyping.bind(this)
     }
    
     search(){
         if(this.state.search.length >= 2){
            http.search(this.state.search).then(data=>{
                if(data !== undefined && data.length !==0){
                    if(!data.error){    this.setState({result:data}); }
                }
            })
         }else{
             this.setState({username:'none'})
         }
    }
    searchwhiletyping(value){
        if(value.length >=2){
            this.setState({search:value,showsearchbox:true});
            this.search();
        }else{
            this.setState({showsearchbox:false})
        }
    }
    togglesearchbox(){
        if(this.state.showsearchbox===false && this.state.search.length >=2){
            this.setState({showsearchbox:true});
            this.search();
        }
        else{
            this.setState({showsearchbox:false})
        }
    }
    
    showlist(){
        const list = this.state.result.map(obj=> <Link key={obj._id} className="mysearchitmea" to={'/userdetails/'+obj.userid} target="_blank"><Searchitem photo={obj.photo} email={obj.email} username={obj.username} userid={obj.userid}></Searchitem></Link> )
        return (list)
    }
    
    render(){
        return(
            <div>
                <div className="adjustsize">
                    <input onChange={event=> this.searchwhiletyping(event.target.value)} className="search form-control d-inline-block" placeholder="Search Friends" />
                    <button onClick={()=> this.togglesearchbox()} className="search btn btn-primary d-inline-block fa fa-search fa-2x"></button>
                </div>
                <div className={"mysearchbox "+this.state.showsearchbox}>
                    {
                        this.showlist()
                    }
                </div>
            </div>
        );
    }
}

export default Search;