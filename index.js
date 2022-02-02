let AWS = require('aws-sdk');

let S3 = new AWS.S3();

exports.handler = async (event) => {
    console.log(event.Records[0].s3.object);
    const fileName = event.Records[0].s3.object.key;
    const fileSize = event.Records[0].s3.object.size;
    const bucketName = event.Records[0].s3.bucket.name;
    
    console.log("BUCKET IS " + bucketName);
    
    let metaData = {
        name: fileName,
        size: fileSize,
        type: "image"
    };
    
    
    try {
        
        let manifestBody = await S3.getObject({ 
            Bucket: bucketName,
            Key: 'images.json' 
            
        }).promise();
    
        console.log('this is the manifestBody', manifestBody);
    
        let manifestJSON = JSON.parse(manifestBody.Body.toString());
    
        manifestJSON.push(metaData);
    
        let newManifest = S3.putObject({ 
            Bucket: bucketName, 
            Key: 'images.json', 
            Body: JSON.stringify(manifestJSON) 
        
        }).promise();
        
        console.log('this is the manifstJSON', manifestJSON);
        
    
        const response = {
        statusCode: 200,
        body: JSON.stringify({message: 'itsa me Matt'}),
    };
    return response;
    } catch (e){
        console.log(e);
        
        let manifest = [metaData];
        
        let newManifest = await S3.putObject({ 
            Bucket: bucketName, 
            Key: 'images.json', 
            Body: JSON.stringify(manifest) 
            
        }).promise();
        return{
            message: 'New manifest generated.',
        }
    }

};
