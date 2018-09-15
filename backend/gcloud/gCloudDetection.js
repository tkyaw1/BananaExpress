// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// create SHARED client
const client = new vision.ImageAnnotatorClient();

exports.faceDetection = (fileName) => {
    // Creates a client
    // const client = new vision.ImageAnnotatorClient();

    client
    .faceDetection(fileName)
    .then(results => {
        const faces = results[0].faceAnnotations;

        console.log('Faces:');
        faces.forEach((face, i) => {
        console.log(`  Face #${i + 1}:`);
        console.log(`    Joy: ${face.joyLikelihood}`);
        console.log(`    Anger: ${face.angerLikelihood}`);
        console.log(`    Sorrow: ${face.sorrowLikelihood}`);
        console.log(`    Surprise: ${face.surpriseLikelihood}`);
        });
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
};

// Performs label detection on the local file
exports.labelDetection = (fileName) => {
    client
    .labelDetection(fileName)
    .then(results => {
        const labels = results[0].labelAnnotations;
        console.log('Labels:');
        labels.forEach(label => console.log("    " + label.description));
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
};

exports.landmarkDetection = (fileName) => {
    client
    .landmarkDetection(fileName)
    .then(results => {
        const landmarks = results[0].landmarkAnnotations;
        console.log('Landmarks:');
        landmarks.forEach(landmark => console.log(landmark.description + " " + landmark.score));
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
};