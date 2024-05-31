import { useState } from 'react';
import AWS from 'aws-sdk';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState(null);
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

    const visitorImageName = uuid.v4();
    const params = {
      Bucket: 'visitors-img',
      Key: `${visitorImageName}.jpeg`,
      Body: image,
      ContentType: 'image/jpeg'
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
      <h4 className="title">Employee Authentication System</h4>
      <form className="upload-form" onSubmit={sendImage}>
        <div className="file-input-wrapper">
          <button className="file-input">Choose File</button>
          <input
            type="file"
            name="image"
            className="file-input-hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <br>
        </br>
        <button type="submit" className="verify-button">Verify</button>
      </form>
      <div className={isAuth ? 'result-message success' : 'result-message failure'}>
        {uploadResultMessage}
      </div>
      <br>
      </br>
      <img
        src={require(`./visitors/${visitorImgName}`)}
        alt="Visitor"
        className="visitor-image"
      />
    </div>
  );
}

export default App;