import React,{Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

class  App extends Component{

  state={
    selectedFile:null
  };

  fileSelectHandler=(event)=>{
    this.setState({selectedFile:event.target.files[0]});
  };
  fileUploadHandler=()=>{
    axios.post('').then(res=>console.log(res)).catch(err=>console.log(err));
  };
 render(){
   return (
       <div className="App">
         <div className="container-fluid mt-5">
           <form>
             <div className="input-group">
               <input type="file" className="form-control" onChange={this.fileSelectHandler}/>
               <button className="btn btn-primary" onClick={this.fileUploadHandler}>Upload Image</button>
             </div>
           </form>
         </div>
       </div>
   );
 }
}

export default App;
