# import logging
# import os
# import cloudstorage as gcs
# import webapp2
#
# from google.appengine.api import app_identity
from google.cloud import storage

def main():
    # upload_blob('project-tao', './fromFrontEnd/2847640.jpg', 'kastanByLake.jpg')
    # list_blobs('project-tao')
    # download_blob
    return

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)



def list_blobs(bucket_name):
    """Lists all the blobs in the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)

    blobs = bucket.list_blobs()

    # for blob in blobs:
    #     print(blob.name)


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    # print(blob)

    blob.download_to_filename(destination_file_name)

    # print('Blob {} downloaded to {}.'.format(
    #     source_blob_name,
    #     destination_file_name))


main()
