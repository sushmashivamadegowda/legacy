import requests
import json
import time
from typing import List, Dict, Optional

# --- CONFIGURATION (UPDATE THESE FROM BROWSER) ---
INDEED_COOKIES = {
    'PP': '1',
    'CTK': '1j4hcg5gphmen802',
    'sp': '5a87d98f-ce01-445b-b506-c10c314c8034',
    'FPID': 'FPID2.2.EdTrCD9OVL2CoPQ3l6uEOP%2BAj%2F9srWuJLEW0N6%2BPGnM%3D.1760341928',
    'SOCK': 'eyWign6I_lQhYE3ec0xBKsnrHJ0=',
    'SHOE': 'pBg-erEgr1R9ejWd_bmEbj8Vo7oeUyAaTWQ39bgIbuIaGd3R0vM3ZWkkJEiUxTlmsn65QJt-dXYTbdnPVPIfIjKUvne8C_OJEHic2vbylHy1T8tbZBiumAG5Fk6Jd5HDzfoLZ7x-SHPKNkatgF9eFGFSqQ==',
    'jsopfc': '1',
    '__Secure-PassportAuthProxy-BearerToken': 'eyJraWQiOiIzMjU4ZjA1ZS01OGQ2LTRjYmItYjczZS0xMmZkMjQ4Mjk3MjMiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJ1c2VyOjI5ODdiNDg2NzNkN2FlZGEiLCJhY3QiOnsic3ViIjoiYXBwOmE5NjYyYWU4ZTI1OTM0OTc3NmFjNTcwYzk0ODUwMGZiY2JlMzYwZmI2YmNmNGNiOGMxODg5MjcwMDA5YjVkZDIiLCJhdXRoZW50aWNhdGVkIjp0cnVlLCJmaXJzdF9wYXJ0eSI6ImVtcGxveWVyQmFja2VuZEZvckZyb250ZW5kLmluZGVlZC5jb20iLCJhcHBfYWNjb3VudCI6ImQwMjk5ZmFmZmY5Mzk2MDgifSwiYXpwIjoiYTk2NjJhZThlMjU5MzQ5Nzc2YWM1NzBjOTQ4NTAwZmJjYmUzNjBmYjZiY2Y0Y2I4YzE4ODkyNzAwMDliNWRkMiIsInNjb3BlIjoiam9iX3NlZWtlci5tZXNzYWdpbmcgZW1wbG95ZXIuam9iLm9yZ2FuaWN0cmFmZmljLnJlYWQgam9iX3NlZWtlci5hcHBseSBvZmZsaW5lX2FjY2VzcyBqb2Jfc2Vla2VyLnByb2ZpbGUucmVhZCBqb2Jfc2Vla2VyLmNvbXBhbnkuZGV0YWlscy5yZWFkIGpvYl9zZWVrZXIuam9icy5zZWFyY2ggZW1wbG95ZXJfYWNjZXNzIGpvYl9zZWVrZXIucmVzdW1lLnJlYWQiLCJpc3MiOiJodHRwczovL3NlY3VyZS5pbmRlZWQuY29tIiwiZXhwIjoxNzYwMzQ1ODgzLCJpYXQiOjE3NjAzNDIyODN9.mnFFewcDnLecIgHqLtawH3wM1eyLTNVYyLkiu30UnwA66-8SdQQ7THg2iizAP1W6dNxj0xdLqhmrU-EWUgISYA',
    '__Secure-PassportAuthProxy-RefreshToken': 'GFIycz8sYRg',
    '__Secure-PassportAuthProxy-OauthHMAC': 'tfO0gESuI9mMeAP6rCv4oa2IoJCt9ugABnXebehSrUg=',
    '__Secure-PassportAuthProxy-OauthExpires': '1760345883',
    'LOCALE': 'en_IN',
    'indeed_rcc': 'PREF:LV:CTK',
    '_gcl_au': '1.1.986611089.1760423777',
    'RF': 'O4UqZrkZHCPbiP8RwX6gJN1PYGeTmrV1BoP2WETzWGwwnNEzht5NVaVclH4MVP_B-3tgRT5HFoP35lGdepJUfg==',
    'CSRF': 'hqtPeeUwoDYga3SmUQxDbbfPTmpXu3GP',
    'INDEED_CSRF_TOKEN': 'Lr4vkMxkK9d0BDIvq3Kf6ClmVGbBeWE2',
    '_cfuvid': '97..2g7HXJOSfFuhvCjxmIMPxeqvO2hXmk2icr9uSRc-1767511670649-0.0.1.1-604800000',
    'ENC_CSRF': 'VSy2W5mx9TdsFQGxdfCT9F8Xt1PlSK7z',
    'FPLC': '62hp5ahqjHrohGBEs1YOAKhd0t1%2FpjeoIuisMGx78%2FwEaZiOqIUVuufJ8pbWdOG8%2BWYn6TD%2B9Q%2BV5NQoHLyvilg0HJ2XqDTTjUrZx5l4Qkv9dzYqh7Wp3ek1QbFCug%3D%3D',
    'SHARED_INDEED_CSRF_TOKEN': 'UzDEcJpV0fs3Bl62Bch8DdEspurpxcjd',
    '_ga': 'GA1.2.1524031076.1760341928',
    'IA_APPLIED': '23b5b706ed7e8504',
    'IAST': '46BmdAAAAAAyM2I1YjcwNmVkN2U4NTA0OjFqNGhjZzVncGhtZW44MDI6MTc2NzUxMzYwNzAyNw',
    'cf_clearance': 'hg.sVLCm_L5328r0lIgxzcFTWihoLK8sy6LZ.BUXnSs-1767514281-1.2.1.1-mCmszx6XwM6layb3a6A5O_iVax45vrcE3C2f1Ipav.kfhnFfzF2GhwcAOb8O9mu3iXuYlFlNcJwDbxLfCRVMQ0iEUtbPZfxv9j8Vr_8BS_mXLUqC74mWeLMCrGuQO_O.rNrMYqRU6g.ccHUMfEarJKRqkkzVoDmRhRDVLR_z2s0sy9DtLktjz0hUeasP.23_BCfAYH0u9ybqyZ3p36BGau9bqxrJteDLxbgYPmoGQDc',
    'PPID': 'eyJraWQiOiJlZjkwZmFiYS01NGY4LTQ3OGMtYTQ3Zi1iYzBkZGI0Mzk4OGMiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIyOTg3YjQ4NjczZDdhZWRhIiwibGFzdF9hdXRoX3RpbWUiOjE3NjAzNDIyMzEwMDAsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJsYXN0XzJmYSI6MTc2MDM0MjIzMTAwMCwicGhvbmVfc2NvcGUiOltdLCJhdXRoIjoiZ29vZ2xlIiwiY3JlYXRlZCI6MTc2MDM0MjIwMDAwMCwiaXNzIjoiaHR0cHM6Ly9zZWN1cmUuaW5kZWVkLmNvbSIsImxhc3RfYXV0aF9sZXZlbCI6IlNUUk9ORyIsImxvZ190cyI6MTc2MDM0MjIzMDk5NCwiYXJiX2FjcHQiOmZhbHNlLCJhdWQiOiJjMWFiOGYwNGYiLCJwaG9uZV92ZXJpZmllZCI6dHJ1ZSwicmVtX21lIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrOTE4OTA0MjYxNTQzIiwiZXhwIjoxNzY3NTE2MTU2LCJpYXQiOjE3Njc1MTQzNTYsImVtYWlsIjoiaHNzdXNobWEyMDA0QGdtYWlsLmNvbSJ9.z4LRGhFLwZILEO2Przzw7_Es5C4LrC9-ID3olGBZYm_rPwALWch5CHklNoD9W_yce9Iqxcg1cJplbPBEFnBstg',
}

INDEED_HEADERS = {
    'authority': 'in.indeed.com',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    'origin': 'https://in.indeed.com',
    'referer': 'https://in.indeed.com/',
    'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
}

def search_indeed_jobs(query: str = "python developer", location: str = "Bengaluru", start: int = 0) -> List[str]:
    """
    Find job IDs from Indeed search results.
    """
    url = "https://www.indeed.com/jobs"
    params = {
        'q': query,
        'l': location,
        'start': start
    }
    
    print(f"Searching for {query} in {location} (start={start})...")
    
    try:
        response = requests.get(url, params=params, headers=INDEED_HEADERS, cookies=INDEED_COOKIES, timeout=30)
        response.raise_for_status()
        
        # Indeed often includes job IDs in the HTML as data-jk attributes or within window.mosaic.providerData
        import re
        # Find all occurrences of jk:'...' or "jk":"..." which Indeed uses for Job Keys
        job_ids = re.findall(r'jk["\']\s*:\s*["\']([a-zA-Z0-9]+)["\']', response.text)
        
        # Unique job IDs ONLY
        unique_job_ids = list(dict.fromkeys(job_ids))
        
        print(f"Found {len(unique_job_ids)} job keys: {unique_job_ids}")
        return unique_job_ids
        
    except Exception as e:
        print(f"Search FAILED: {e}")
        return []

def apply_to_job(apply_id: str, state_id: str, trust_hash: str):
    """
    Submit the final application mutation.
    """
    url = "https://smartapply.indeed.com/graphql"
    
    payload = {
        "operationName": "SubmitApplication",
        "variables": {
            "input": {
                "applyId": apply_id,
                "autoString": "none",
                "captcha": {"reCaptchaToken": None},
                "trustScoreHash": trust_hash,
                "context": {
                    "phoenixMPMCanaries": ["postApplyModule", "previewModule", "questionsModule"],
                    "deploymentGroup": "smartapply-default"
                },
                "smsOptIn": {"smbContentTypeEligible": False}
            },
            "smartApplyApplicationStateInput": {"id": state_id}
        },
        "query": "mutation SubmitApplication($input: SubmitApplicationInput!, $smartApplyApplicationStateInput: SmartApplyApplicationStateInput) {\n  smartApplyApplicationState(input: $smartApplyApplicationStateInput) {\n    submitApplication(input: $input) {\n      successPageUrl\n      resumeAttached\n      applicantEmail\n      __typename\n    }\n    __typename\n  }\n}"
    }

    try:
        response = requests.post(url, headers=INDEED_HEADERS, cookies=INDEED_COOKIES, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        print(f"Application Result: {data}")
        return data
    except Exception as e:
        print(f"FAILED to apply: {e}")
        return None

if __name__ == "__main__":
    # This is a placeholder test
    print("Indeed Apply Script Started")
    # apply_to_job("YOUR_APPLY_ID", "YOUR_STATE_ID", "YOUR_TRUST_HASH")
