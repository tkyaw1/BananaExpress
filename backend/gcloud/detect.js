// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
var gCloud = require('./gCloudDetection')

const fs = require('fs');

// require method
let jsonData = require('./studentDemo.json');
console.log(jsonData);  


let rawdata = fs.readFileSync('studentDemo.json');  
let student = JSON.parse(rawdata);  
console.log(student);  
console.log(student.car);  

let student2 = {
    name: 'Mike',
    age: 23, 
    gender: 'Male',
    department: 'English',
    car: 'Honda' 
};

let data = JSON.stringify(student2);  
// fs.writeFileSync('student-2.json', data); 


// fs.readFile('studentDemo.json', (err, data) => {  
//     if (err) throw err;
//     let student = JSON.parse(data);
//     console.log(student);
// });




gCloud.faceDetection('../resources/sadEiffel.jpg');
gCloud.labelDetection('../resources/sadEiffel.jpg');
gCloud.landmarkDetection('../resources/sadEiffel.jpg');