// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
 
// Your Google Cloud Platform project ID
const projectId = 'YOUR_PROJECT_ID';
 
// Creates a client
const storage = new Storage({
  projectId: projectId,
});
 
// The name for the new bucket
const bucketName = 'my-new-bucket';
 
// Creates the new bucket
storage
  .createBucket(bucketName)
  .then(() => {
    console.log(`Bucket ${bucketName} created.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });