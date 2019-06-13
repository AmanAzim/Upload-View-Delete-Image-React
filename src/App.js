import React,{Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

class  App extends Component{

  state={
    filesToUpload:[],
    images:[]
  };

  upload_preview_handler=(event)=>{
      this.fileSelectHandler_uploader(event);
      this.fileSelectHandler_viewer(event);
  };

  fileSelectHandler_uploader=(event)=>{
      //this.setState({selectedFile:event.target.files[0]});
      const selectedFile=event.target.files[0];
      this.setState((prevState)=>{
          return {
              fileToUpload:[...prevState.filesToUpload, selectedFile]
          }
      });
      console.log('selectedFile',event.target.files[0]);
  };

  fileSelectHandler_viewer=(event)=>{
      event.preventDefault();
      console.log(event.target.files[0]);
      const imageFiles = event.target.files; //document.getElementById("image"); //It gives all the uploaded images
      const filesLength = imageFiles.length; // imageFiles.files.length;

      for(var i = 0; i < filesLength; i++) {
          let reader = new FileReader();
          let file = imageFiles[i];

          reader.onloadend = () => {
              this.setState({images: this.state.images.concat(reader.result)} );
          }

          reader.readAsDataURL(file);
      }
    //this.setState({selectedFile:event.target.files[0]});
  };

  fileUploadHandler=(event)=>{
      event.preventDefault();

    axios.post('').then(res=>console.log(res)).catch(err=>console.log(err));
  };

 render(){

   return (
       <div className="App">
         <div className="container-fluid mt-5">
             <div className="row p-5">
                 <form>
                     <div className="input-group">
                         <input type="file" className="form-control"  onChange={this.upload_preview_handler}/>
                         <button className="btn btn-primary" onClick={this.fileUploadHandler}>Upload Image</button>
                     </div>
                 </form>
             </div>
             <div className="row m-5 p-5">
                 {/*<img src={this.state.images[0]} width="100px" height="100px" />*/}
                 {this.state.images.map((img, index)=>{
                     return <img src={img} width="100px" height="100px" style={{margin: '20px'}} key={index}/>
                 })}
             </div>
         </div>
       </div>
   );
 }
}

export default App;
