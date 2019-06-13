import React,{Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import {storageRef} from './firebase/index';


class  App extends Component{

  state={
    filesToUpload:[],
    images:[],
    uploadedImagesUrl:[],
    progress:0,
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
              filesToUpload:[...prevState.filesToUpload, selectedFile]
          }
      }, ()=>{console.log('selectedFile',this.state.filesToUpload);});

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
          };

          reader.readAsDataURL(file);
      }
    //this.setState({selectedFile:event.target.files[0]});
  };

  fileUploadHandler=(event)=>{
      event.preventDefault();

    this.state.filesToUpload.forEach((file)=>{
      console.log('uploading',file.name)
        const uploadTask=storageRef.child('my_images/'+file.name).put(file);

        uploadTask.on('state_changed', (snapshot)=>{
            /*indicates Progress*/
            let uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.setState((prevState)=>{
                return {progress:prevState.progress+uploadProgress}
            })

        }, (error)=>{
            console.log(error)
        }, ()=>{
            /*Indicates task Completation*/
            //If successful then get the url of the uploaded image
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
                console.log('File available at', downloadURL);
                this.setState((prevState)=>{
                    return { uploadedImagesUrl:[...prevState.uploadedImagesUrl, downloadURL], progress:0 }
                });
            });
        });
    });

  };

  deleteFileHandler=(index)=>{
      let tempImages=[...this.state.images];
      tempImages.splice(index, 1);
      this.setState({images:tempImages});

      let tempfilesToUpload=[...this.state.filesToUpload];
      const imageName=tempfilesToUpload[index].name;
      tempfilesToUpload.splice(index, 1);
      this.setState({filesToUpload:tempfilesToUpload});



      var desertRef = storageRef.child('my_images/'+imageName);//// Create a reference to the file to delete

      // Delete the file
      desertRef.delete().then(()=>{

          let tempUploadedImagesUrl=[...this.state.uploadedImagesUrl];
          tempUploadedImagesUrl.splice(index, 1);
          this.setState({uploadedImagesUrl:tempUploadedImagesUrl});
          //alert(imageName+' is deleted');

      }).catch((error)=>console.log(error));
  };

 render(){

   return (
       <div className="App">
         <div className="container-fluid mt-5">

             <div className="row p-5">
                <div className="offset-md-3 col-md-6">
                    <form>
                        <div className="input-group text-center">
                            <input type="file" className="form-control"  onChange={this.upload_preview_handler}/>
                        </div>
                    </form>
                </div>
                 <div className="offset-md-3 col-md-6 mt-3">
                     <button className="btn btn-primary" onClick={this.fileUploadHandler}>Upload Image</button>
                 </div>
                 <div className="offset-md-3 col-md-6 mt-3">
                     <div className="progress">
                         <div className="progress-bar"  style={{width:this.state.progress+'%'}}></div>
                     </div>
                 </div>
             </div>

             <div className="row mt-5">
                 <h5 className="mt-2 mb-2 text-center col-sm-12">Your selected images:</h5>
             </div>
             <div className="row mt-2 mb-2">
                 <div className="offset-md-2 col-md-8 mt-3">
                     {/*<img src={this.state.images[0]} width="100px" height="100px" />*/}
                     {this.state.images.map((img, index)=>{
                         return (
                             <div style={{margin: '20px'}}>
                                 <img src={img} width="100px" height="100px"  key={index}/><br/>
                                 <button className="btn btn-danger" onClick={()=>this.deleteFileHandler(index)}>Delete</button>
                             </div>
                         )
                     })}
                 </div>
             </div>

             <div className="row mt-2">
                 <h5 className="offset-md-3 col-md-6 mt-3">Your uploaded images:</h5>
                 <div className="offset-md-3 col-md-6 mt-3">
                     <div className="offset-md-3 col-md-6 mt-3">
                         { this.state.uploadedImagesUrl.map((imgUrl,index)=>{
                             return <img src={imgUrl} key={imgUrl} width="100px" height="100px" style={{margin: '20px'}}/>
                           })
                         }
                     </div>
                 </div>
             </div>

         </div>
       </div>
   );
 }
}

export default App;
