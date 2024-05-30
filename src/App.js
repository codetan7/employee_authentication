import { useState } from 'react';
import AWS from 'aws-sdk'
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState(null); //react hook
  const [uploadResultMessage, setUploadResultMessage] = useState("For entering the premises, please upload the visitor's image for authentication.");
  const [visitorImgName, setVisitorImgName] = useState('placeholderImage.jpeg');
  const [isAuth, setAuth] = useState(false);
  const s3 = new AWS.S3();

  async function sendImage(e) {

  
    e.preventDefault();
    if (!image) {
      setUploadResultMessage('Please select an image to upload.');
      return;
    }

    const visitorImageName = uuid.v4(); // Use the image name without extension
    const params = {
      Bucket: 'visitors-img', // Replace with your actual bucket name
      Key: `${visitorImageName}.jpeg`, // The name of the file to be saved in S3
      Body: image, // The file object
      ContentType: 'image/jpeg' // The MIME type of the file
    };
    setVisitorImgName(image.name);

    try {

      try {
        const uploadResponse = await s3.upload(params).promise();
        console.log('Upload Success', uploadResponse);
        setUploadResultMessage('Image uploaded successfully.');
      } catch (err) {
        console.error('Image upload failed', err);
        setUploadResultMessage('Image upload failed.');
      }

      // Authenticate the visitor
      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Hello ${response.firstName} ${response.lastName}, welcome to work!`);
      } else {
        setAuth(false);
        setUploadResultMessage('Sorry, this person is not authorized to enter the premises.');
      }
    } catch (error) {
      console.error(error);
      setUploadResultMessage('An error occurred during the authentication process.');
    }
  }

  async function authenticate(visitorImageName) {
    const requestUrl = `https://nkkkbz8seg.execute-api.us-east-2.amazonaws.com/dev/employee?` + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
          }
      });

      if (!response.ok) {
        throw new Error('Authentication request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return { Message: 'Error' };
    }
  }

  return (
    <div className="App">
      <h4>Industry Employee Authentication System</h4>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])} />
        <button type='submit'>Verify</button>
      </form>
      <div className={isAuth ? 'Success' : 'Failure'}>{uploadResultMessage}</div>
      <img src={require(`./visitors/${visitorImgName}`)} alt="Visitor" height={250} width={250} />
    </div>
  );

}

export default App;