import React,{Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {storageRef} from './firebase/index';


class  App extends Component{

  state={
    filesToUpload:[],
    images:[],
    uploadedImagesUrl:[],
    progress:0,
    uploaded:false,
    uploadStart:false
  };


  fileSelectHandler=(event)=>{
      event.preventDefault();

      const imageFiles = event.target.files; //document.getElementById("image"); //It gives all the uploaded images
      const filesLength = imageFiles.length; // imageFiles.files.length;

      for(var i = 0; i < filesLength; i++) {

          let imgId=Math.random();

          //processing the raw image for viewing withing component
          let reader = new FileReader();
          let file = imageFiles[i];
          reader.onloadend = () => {
              this.setState((prevState)=> {
                  return { images:[...prevState.images, {id:imgId, img:reader.result}] }
              });
          };
          reader.readAsDataURL(file);


          //Storing the raw image for upload
          let imgName=imageFiles[i].name;
          this.setState((prevState)=>{
              return {
                  filesToUpload:[...prevState.filesToUpload, {id:imgId, img:file, name:imgName}]
              }
          });
      }
  };

  fileUploadHandler=(event)=>{
      event.preventDefault();

    this.setState({uploadedImagesUrl:[], uploadStart:true},()=>{//inside callback function after setState

        this.state.filesToUpload.forEach((file, index)=>{

            //Storing the image to firebase under "my_images" folder
            const uploadTask=storageRef.child('my_images/'+file.name).put(file.img);
            //Three call back functions upon each upload operation 1.indicates progress, 2.shows error, 3. if successful gives the uploaded images URL
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
                        return { uploadedImagesUrl:[...prevState.uploadedImagesUrl, {id:file.id ,downloadURL:downloadURL}], progress:0 }
                    });
                });

            });

        });
        this.setState({uploaded:true});//Indicates the file is uploaded

    })//inside callback function after setState

  };

  deleteFileHandler=(id)=>{
      //removing the image from the "images" array that we use for viewing the image
      let tempImages=[...this.state.images];
      tempImages=tempImages.filter(img=>img.id!==id);
      this.setState({images:tempImages});


      let tempfilesToUpload=[...this.state.filesToUpload];


      //Getting the exact file to delete from the array of raw images from where we uploaded the images
      const file=tempfilesToUpload.find(file=>file.id===id);

      //Deleting the raw image from the array for uploading images(already been uploaded)
      tempfilesToUpload=tempfilesToUpload.filter(file=>file.id!==id);
      this.setState({filesToUpload:tempfilesToUpload});

      //Safety check so that we only try to delete from firebase if the image is uploaded
      if(this.state.uploaded){
          var desertRef = storageRef.child('my_images/'+file.img.name);//// Create a reference to the file to delete
          // Delete the file
          desertRef.delete().then(()=>{

              //After deleting removing the URL of the deleted image fro the list of uploaded images URL so it that it cannot be rendered
              let tempUploadedImagesUrl=[...this.state.uploadedImagesUrl];
              tempUploadedImagesUrl=tempUploadedImagesUrl.filter(item=>item.id!==id);
              this.setState({uploadedImagesUrl:tempUploadedImagesUrl}, ()=>{
                  if(this.state.uploadedImagesUrl.length<=0){
                      this.setState({uploadStart:false})
                  }
              });

          }).catch((error)=>console.log(error));
      }
  };

  render(){
      return (
          <div className="App">
              <div className="container-fluid mt-5">
                  <h2 className="text-info text-center">Upload Images to Firebase</h2>
                  <h5 className="text-danger text-center"><b>React</b></h5>
                  <div className="row p-2">
                      <div className="offset-md-3 col-md-6">
                          <form>
                              <div className="input-group text-center">
                                  <input type="file" multiple className="form-control"  onChange={this.fileSelectHandler}/>
                              </div>
                          </form>
                      </div>
                      <div className="offset-md-3 col-md-6 mt-3">
                          <button className="btn btn-primary" disabled={this.state.uploadStart||this.state.images.length<=0} onClick={this.fileUploadHandler}>
                              {this.state.uploadStart? 'Delete all items to upload again':'Upload Image'}
                          </button>
                      </div>
                      <div className="offset-md-3 col-md-6 mt-3">
                          <div className="progress">
                              <div className="progress-bar"  style={{width:this.state.progress+'%'}}>{this.state.progress}</div>
                          </div>
                      </div>
                  </div>
                  <hr></hr>
                  <div className="row mt-2">
                      <h5 className="mb-2 text-center col-sm-12">Your selected images:</h5>
                  </div>
                  <div className="row mt-2 mb-2">
                      <div className="offset-md-3 col-md-7 mt-3 text-center">
                          {/*<img src={this.state.images[0]} width="100px" height="100px" />*/}
                          {this.state.images.map((file, index)=>{
                              return (
                                  <span  className="mx-2 my-5">
                                 <img src={file.img} width="100px" height="100px"  key={file.id}/>
                                 <button className="btn btn-danger" onClick={()=>this.deleteFileHandler(file.id)}>Delete</button>
                             </span>
                              )
                          })}
                      </div>
                  </div>
                  <hr></hr>
                  <div className="row mt-2">
                      <h5 className="offset-md-3 col-md-6">Your uploaded images:</h5>
                      <div className="offset-md-2 col-md-8 mt-1">
                          { this.state.uploadedImagesUrl.map((img,index)=>{
                              return <img src={img.downloadURL} key={img.id} width="100px" height="100px" style={{margin: '20px'}}/>
                          })
                          }
                      </div>
                  </div>
                  <hr></hr>
              </div>
          </div>
      );
  }
}

export default App;
