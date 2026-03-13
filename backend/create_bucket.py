import os
import sys
from dotenv import load_dotenv

sys.path.append(os.getcwd())
load_dotenv()

from database.supabase_client import service_supabase

try:
    print('Checking buckets...')
    buckets = service_supabase.storage.list_buckets()
    bucket_names = [b.name for b in buckets]
    print(f'Existing buckets: {bucket_names}')
    
    if 'documents' not in bucket_names:
        print('Creating documents bucket...')
        service_supabase.storage.create_bucket('documents', options={'public': False})
        print('Bucket created successfully!')
    else:
        print('Bucket already exists.')
        
except Exception as e:
    print(f'Error: {e}')
