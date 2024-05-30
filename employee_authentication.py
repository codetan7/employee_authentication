import boto3 
import json 


s3 = boto3.client('s3')
rekognition = boto3.client('rekognition', region_name = 'us-east-2')
dynamodbTableName = 'employee'
dynamodb = boto3.resource('dynamodb', region_name = 'us-east-2')
employeeTable = dynamodb.Table(dynamodbTableName)
bucketName = 'visitors-img'

def lambda_handler(event, context):
    print(event)
    objectKey = event['queryStringParameters']['objectKey']
    img_bytes = s3.get_object(Bucket = bucketName, Key = objectKey)['Body'].read()
    response = rekognition.search_faces_by_image(
        CollectionId = 'revisedemployees',
        Image = {'Bytes' : img_bytes}
    )


    for match in response['FaceMatches']:
        print(match['Face']['FaceId'], match['Face']['Confidence'])

        face = employeeTable.get_item(Key = {
            'recognitionID' : match['Face']['FaceId']
        }
        )

        if 'Item' in face: 
            print('Employee Authenticated :', face['Item'])
            return buildResponse(200, {
                                'Message' : 'Success',
                                'firstName' : face['Item']['firstName'],
                                'lastName' : face['Item']['lastName']
                                 })
        
    print("Not an authorized employee.")
    return buildResponse(403,
                         {
                             'Message' : 'Authentication Failed'
                         })

def buildResponse(statusCode, body=None):
    response = { 'statusCode' : statusCode,
                 'headers' :{
                     'Content-Type' : 'application/json',
                     'Access-Control-Allow-Origin' : '*',
                     'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                     'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                 } }
    if body is not None:
        response['body'] = json.dumps(body)
    return response