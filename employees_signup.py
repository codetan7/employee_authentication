import boto3  
#to call the aws services

s3 = boto3.client('s3')
#define s3 to call the s3 bucket
rekognition = boto3.client('rekognition', region_name = 'us-east-2')
dynamodbTableName = 'employee'
#name of the table we created in dynamoDB to store employees
dynamodb = boto3.resource('dynamodb', region_name = 'us-east-2')
employeeTable = dynamodb.Table(dynamodbTableName)
#instantiating employee table(employee) so that we can use this method name directly


def lambda_handler(event, context):
    print(event)
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    try:
        response = employeeImage_indexing(bucket, key)
        print(response)
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            faceId = response['FaceRecords'][0]['Face']['FaceId']
            name = key.split('.')[0].split('_')
            firstName = name[0]
            lastName = name[1]
            signup_employee(faceId, firstName, lastName)
        return response
    except Exception as e:
        print(e)
        print('Sorry, could not process employee image {} from bucket {}.'.format(key, bucket))
        raise e
    

def employeeImage_indexing(bucket, key):
    response = rekognition.index_faces(
        Image = {'S3Object':
                 {
                     'Bucket' : bucket,
                     'Name' : key
                 }},
                 CollectionId = 'revisedemployees'
    )
    return response

def signup_employee(faceId, firstName, lastName):
    employeeTable.put_item(
        Item = {
            'recognitionID' : faceId,
            'firstName' : firstName,
            'lastName' : lastName
        }
    )
