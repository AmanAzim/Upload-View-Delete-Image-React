/*const functions = require('firebase-functions');
const {Storage} = require('@google-cloud/storage');//have the Google firebase bucket functions

const gccconfig={
    projectId:'vue-axios-practise-2',
    keyFilename:'firebase-adminsdk-iob8d@vue-axios-practise-2.iam.gserviceaccount.com'
};
const gsc = new Storage(gccconfig);
const osTmpdir = require('os-tmpdir');//provides the operating system specific functions that we need to find out the path of the temporal path to store the file for edit;
const path=require('path');//to constract the temporal path;
const spawn=require('child-process-promise').spawn; //npm install --save child-process-promise

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//Visit this address to know the  updated firebase event listners
//https://firebase.google.com/docs/functions/beta-v1-diff

exports.imageEditor = functions.storage.object().onFinalize((object, context) => {
  console.log(object.bucket);
  const bucket=object.bucket;
  const filePath = object.name; // Path of the File
  const contentType = object.contentType; // Mime type of the file

    if(!object){
        console.log('We deleted the file , exit..');
        return;
    }
    if(path.basename(filePath).startsWith('resized-')){ //to check if the file already has beed renamed
        console.log('Already renamed');
        return;
    }
    console.log('File changed detected, Function execution started');

  const destBucket=gsc.createBucket(bucket); //new Bucket which contain the location of old bucket; Means we did change the bucket we just renamed it
  const tempFilePath=path.join(osTmpdir(), path.basename(filePath)); //to temporarily download the file to work with it ; Firebase provide us with this temporal storage which will be clean up after the function finishes execution;
                                            //path.basename() gives the name of the file path.
  const metaDeta={contentType:contentType};

    return destBucket.file(filePath).download({
        destination:tempFilePath, //download the file from bucket to the temporaraly folder

    }).then(()=>{
        return spawn('convert', [tempFilePath, '-resize', '500x500', tempFilePath]);

    }).then(()=>{
        return destBucket.upload(tempFilePath, {destination:'resized-'+path.basename(filePath), metadata:metaDeta});
    });

});

exports.fileDeleted = functions.storage.object().onDelete((object, context) => {
    console.log('This file was deleted.');
});

exports.metadataUpdated = functions.storage.object().onMetadataUpdate((object, context) => {
    console.log('This is a metadata change event.');
});





//to create a file uploading API end point(url)
const cors=require('cors')({origin:true});
const Busboy=require('busboy');
const fs=require('fs');//a node file package
exports.uploadFile=functions.https.onRequest((req, res)=>{

    cors(req, res, ()=>{

        //For POST request only
        //if(req.method !=='POST'){
          //  return res.status(500).json({message:'Not allowed'})
        //}

        const busboy=new Busboy({headers:req.headers});//so that Busboy identifies if incoming request data is form data or not in the server;
        let uploadData=null;
        busboy.on('file', (fieldname, file, filename, encoding, mimetype)=>{
            const filepath=path.join(osTmpdir, filename)//getting the path of the file from the form data that the Busboy extraxted and kept in the temp directory

            uploadData={file:filepath, type:mimetype};
            file.pipe(fs.createWriteStream(filepath));//this will write the file to firebase storage

        }); //it will be triggered whenever Busboy successfully parses a file from the incoming request

        //When the Busboy finish parsing the data from the incoming request and gets the temporary address of the file. Now it need to save the file in the google cloud storage of Firebase
        busboy.on('finish', ()=>{
           const bucket=gsc.createBucket('vue-axios-practise-2.appspot.com')//it this bucket the images will be stored;
           bucket.upload(uploadData.file, { uploadType:'media', metadata:{ metadata:{ contentType:uploadData.type } } } );
        }).then(()=>{

                //It handles any type of request. Returns the message if the request is successfull
                return res.status(200).json({
                    message:'it worked'
                });
        }).catch(err=>{
            return res.status(500).json({error:err})
        });

        busboy.end(req.rawBody);
    })

});


*/
