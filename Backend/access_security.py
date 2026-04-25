import os
from fastapi.security import APIKeyHeader
from fastapi import Depends, HTTPException, Security
from enum import Enum

from enums.user_roles import UserRoles

api_key_header = APIKeyHeader(name="X-Internal-Secret", auto_error=False)
    
async def get_current_key(header_value: str = Security(api_key_header)):
    if not header_value:
        raise HTTPException(status_code=403, detail="No API Key provided")
    return header_value

# Türsteher 1: Erlaubt Client ODER Admin (für GET)
async def require_any_key(key: str = Depends(get_current_key)):
    if key == os.getenv("CLIENT_API_KEY"):
        return UserRoles.USER
    if key == os.getenv("ADMIN_API_KEY"):
        return UserRoles.ADMIN
    raise HTTPException(status_code=403, detail="Access denied: Invalid Key")

# Türsteher 2: Erlaubt NUR Admin (für POST, PUT, DELETE)
async def require_admin_key(key: str = Depends(get_current_key)):
    if key == os.getenv("ADMIN_API_KEY"):
        print("key ", key)
        return UserRoles.ADMIN
    raise HTTPException(status_code=403, detail="Access denied: Admin rights required")