#!/usr/bin/env python3
"""Get JWT token for API testing / APIテスト用JWTトークン取得スクリプト"""

import os
import sys
import httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")


def get_token(email: str, password: str) -> dict:
    """Login and get access token."""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env")
        sys.exit(1)

    response = httpx.post(
        f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Content-Type": "application/json",
        },
        json={"email": email, "password": password},
    )

    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        sys.exit(1)

    return response.json()


def main():
    if len(sys.argv) < 3:
        print("Usage: python get_token.py <email> <password>")
        print("Example: python get_token.py test@example.com password123")
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]

    data = get_token(email, password)

    print("\n=== JWT Token ===")
    print(f"Bearer {data['access_token']}")
    print("\n=== User Info ===")
    print(f"User ID: {data['user']['id']}")
    print(f"Email: {data['user']['email']}")
    print(f"\n=== For curl ===")
    print(f'-H "Authorization: Bearer {data["access_token"]}"')


if __name__ == "__main__":
    main()
