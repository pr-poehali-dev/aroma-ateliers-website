import os
import json
import base64
import uuid
import boto3

def handler(event: dict, context) -> dict:
    """Загружает изображение в S3 и возвращает публичный URL"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    image_data = body.get('image')
    file_ext = body.get('ext', 'jpg').lower().strip('.')

    if not image_data:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'No image provided'})}

    if ',' in image_data:
        image_data = image_data.split(',', 1)[1]

    raw = base64.b64decode(image_data)

    content_type_map = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}
    content_type = content_type_map.get(file_ext, 'image/jpeg')

    key = f'products/{uuid.uuid4()}.{file_ext}'

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)

    url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'url': url})}
