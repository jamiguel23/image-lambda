let AWS = require('aws-sdk');
let s3 = new AWS.S3();


exports.handler = async (event) => {
    
    // console.log(event);
    // console.log('this should be bucketname', event.Records[0].s3.bucket.name)
    let bucketName = event.Records[0].s3.bucket.name;
    let fileName = event.Records[0].s3.object.key;
    let size = event.Records[0].s3.object.size;
    console.log(fileName, bucketName, size);
    
    const params = {
        Bucket: bucketName,
        Key: 'images.json',
        
    }
  
  
  try{
      
    const manifest = await s3.getObject(params).promise();
    let manifestData = JSON.parse(manifest.Body.toString());

    // add the name/ size/ type to our json file
    manifestData.push({
      name: fileName,
      size: size,
      type: 'image',
    })


    //not getting this console log
    console.log('current manifest:', manifestData);
    // let manifestBody = JSON.stringify(manifestData);

    // // write the file back to the bucket
    // const newManifest = await s3.putObject({ ...params, Body: manifestBody, ContentType: 'application/json' }).promise();
    // console.log('new manifest:', newManifest);
      
  } catch(e){
      console.log(e);
      
    //   const newMani = {
    //       Bucket: bucketName,
    //   Key: 'images.json',
    //   Body: JSON.stringify([{ name: fileName, size: size, type: 'image' }]),
    //   ContentType: 'application/json',
    //   }
    //   const manifest = await s3.putObject(newMani).promise();
    // console.log('JSON file created from bucket:', manifest);
  }
    const response = {
    statusCode: 200,
    body: JSON.stringify('Hello? Itsa me, Matt'),
  };
  return response;
};
