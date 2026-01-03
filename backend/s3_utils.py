import boto3
import os
from botocore.exceptions import NoCredentialsError
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    s3_endpoint_url: str = "https://s3.amazonaws.com"
    s3_access_key: str = ""
    s3_secret_key: str = ""
    s3_bucket_name: str = "legacy-assets"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=settings.s3_endpoint_url,
        aws_access_key_id=settings.s3_access_key,
        aws_secret_access_key=settings.s3_secret_key
    )

def upload_file_to_s3(file_content, object_name):
    s3_client = get_s3_client()
    try:
        s3_client.put_object(
            Bucket=settings.s3_bucket_name,
            Key=object_name,
            Body=file_content
        )
        return True
    except NoCredentialsError:
        return False
    except Exception as e:
        print(f"S3 upload error: {e}")
        return False
def get_presigned_url(object_name, expiration=3600):
    s3_client = get_s3_client()
    try:
        response = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': settings.s3_bucket_name, 'Key': object_name},
            ExpiresIn=expiration
        )
        return response
    except Exception as e:
        print(f"S3 presigned URL error: {e}")
        return None
