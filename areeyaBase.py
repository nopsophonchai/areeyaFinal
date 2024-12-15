import os
from supabase import create_client, Client
import constants
# Fetch Supabase credentials from environment variables
SUPABASE_URL = constants.SUPABASE_URL
SUPABASE_KEY = constants.SUPABASE_KEY

def init_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL and Key must be set")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

supabase = init_supabase()


# response = supabase.table("clients").select("*").execute()
# print(response.data)



