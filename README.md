# Employee Authentication System

## Overview

The Employee Authentication System is a web application that allows users to upload an image for authentication purposes. The application uses AWS S3 for storing images and an AWS Lambda function (accessed via API Gateway) for authenticating the uploaded images. The system provides feedback on whether the uploaded image corresponds to an authorized employee.

## Features

- Upload an image for authentication.
- Store the uploaded image in an AWS S3 bucket.
- Authenticate the uploaded image using an AWS Lambda function.
- Display a success or failure message based on the authentication result.
- Display the uploaded image on the interface.

## Technologies Used

- React
- AWS S3
- AWS Lambda
- AWS API Gateway
- AWS Rekognition
- AWS DynamoDB

## Prerequisites

- Node.js and npm installed
- AWS account with S3 and Lambda configured
- AWS SDK for JavaScript

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codetan7/employee_authentication.git
   cd employee-authentication-system
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure AWS credentials in `App.js`:
   ```javascript
   AWS.config.update({
     accessKeyId: 'YOUR_ACCESS_KEY_ID', 
     secretAccessKey: 'YOUR_SECRET_ACCESS_KEY', 
     region: 'YOUR_AWS_REGION'
   });
   ```

4. Update the S3 bucket name in `App.js`:
   ```javascript
   const params = {
     Bucket: 'YOUR_BUCKET_NAME',
     Key: `${visitorImageName}.jpeg`,
     Body: image,
     ContentType: 'image/jpeg'
   };
   ```

5. Update the API Gateway URL in `App.js`:
   ```javascript
   const requestUrl = `https://YOUR_API_GATEWAY_URL/employee?` + new URLSearchParams({
     objectKey: `${visitorImageName}.jpeg`
   });
   ```

## Usage

1. Start the application:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Use the "Choose File" button to select an image for upload.

4. Click the "Verify" button to upload the image and authenticate.

5. The application will display a message indicating whether the authentication was successful or not.


## Customization

- **Styling**: Modify `App.css` to change the appearance of the application.
- **AWS Configuration**: Update the AWS credentials and S3 bucket name in `App.js`.
- **API Gateway**: Ensure the API Gateway URL is correctly set in `App.js`.

## Security

- **Credentials**: Do not hardcode AWS credentials in the source code for production. Use environment variables or AWS IAM roles.
- **HTTPS**: Ensure that the API Gateway URL uses HTTPS for secure communication.

