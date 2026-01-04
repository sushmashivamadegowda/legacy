import requests
import json
import time
from typing import List, Dict, Optional

# --- CONFIGURATION (UPDATE THESE FROM BROWSER) ---
NAUKRI_COOKIES = {
    'ACCESSTOKEN': 'eyJraWQiOiIzIiwidHlwIjoiSldUIiwiYWxnIjoiUlM1MTIifQ.eyJkZXZpY2VUeXBlIjoiZDNza3QwcCIsInVkX3Jlc0lkIjozMTQ3MTQ5OTgsInN1YiI6IjMyNTc3MDQ3OCIsInVkX3VzZXJuYW1lIjoiaHNzdXNobWEyMDA0QGdtYWlsLmNvbSIsInVkX2lzRW1haWwiOnRydWUsImlzcyI6IkluZm9FZGdlIEluZGlhIFB2dC4gTHRkLiIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xNDMuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImlwQWRyZXNzIjoiMjQwOTo0MGYyOjRiOmU3NDc6OTkzOmM2OTI6OTIwMDphNjQ2IiwidWRfaXNUZWNoT3BzTG9naW4iOmZhbHNlLCJ1c2VySWQiOjMyNTc3MDQ3OCwic3ViVXNlclR5cGUiOiIiLCJ1c2VyU3RhdGUiOiJBVVRIRU5USUNBVEVEIiwidWRfaXNQYWlkQ2xpZW50IjpmYWxzZSwidWRfZW1haWxWZXJpZmllZCI6ZmFsc2UsInVzZXJUeXBlIjoiam9ic2Vla2VyIiwic2Vzc2lvblN0YXRUaW1lIjoiMjAyNi0wMS0wNFQxMzowNToyOSIsInVkX2VtYWlsIjoiaHNzdXNobWEyMDA0QGdtYWlsLmNvbSIsInVzZXJSb2xlIjoidXNlciIsImV4cCI6MTc2NzUxOTQ0NiwidG9rZW5UeXBlIjoiYWNjZXNzVG9rZW4iLCJpYXQiOjE3Njc1MTU4NDYsImp0aSI6ImJmYjI5YmZkYTlkNzQyMGViMjFkMDJmZWU2MjYxMjU1IiwicG9kSWQiOiJwcm9kLTY2Yzc1OTk4ZDQtenM5NmwifQ.kntJNUK3ZmdVNYHgzQ43pzVMfQDOzK3-JWWQYisPXNer2oqaoMK0h2m5BGtgwKoP0t6jDnOQjr6Cxpou9Vfva_w1pVkjRjWt1m5Y9guvK6KDuDpNKhl_JIAcW3WbKZWVXd-a4zUuZSHV7vrS_9vY8ukDHqa1FtcEkX6iWq7CdTs0jWpoxG-M9gCVNTqnsRsDBFQB8UmrNzpMNBiTFeoiqaGPrlJYfR66W__jzKDhrKs5ZHC-dXlH4v_DCGA7QmkCQNBobqfPwEdjQ1RneU9X4oTZjjXwgrZiDnjWk3Lp_EkIj3ikvsbWYpZCepT3XTQEYIs4-pn3eQEG2C2JUHwMtg',
    '_t_ds': '3ed40b01756481873-1103ed40b0-03ed40b0',
    'ninjas_new_marketing_token': '9ae4af40ac5110395bf4ebf0e9d95ed2',
    'jd': '220825502966',
    'test': 'naukri.com',
    'MYNAUKRI[UNID]': 'f3a6674e9846437ebd27b9c6d6232cdf',
    'NKWAP': '366223236563653cb8a7fda20e9af6e4cebe7cf47c2cb69d9394dc9d4f9ceeda237376ccad94d1f7',
    'PS': '366223236563653cb8a7fda20e9af6e4cebe7cf47c2cb69d9394dc9d4f9ceeda237376ccad94d1f7',
    'PHPSESSID': 'ev9ckc8heb6ajvhtl0vph8h1d8',
    'nauk_at': 'eyJraWQiOiIzIiwidHlwIjoiSldUIiwiYWxnIjoiUlM1MTIifQ.eyJkZXZpY2VUeXBlIjoiZDNza3QwcCIsInVkX3Jlc0lkIjozMTQ3MTQ5OTgsInN1YiI6IjMyNTc3MDQ3OCIsInVkX3VzZXJuYW1lIjoiaHNzdXNobWEyMDA0QGdtYWlsLmNvbSIsInVkX2lzRW1haWwiOnRydWUsImlzcyI6IkluZm9FZGdlIEluZGlhIFB2dC4gTHRkLiIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xNDMuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImlwQWRyZXNzIjoiMjQwOTo0MGYyOjRiOmU3NDc6OTkzOmM2OTI6OTIwMDphNjQ2IiwidWRfaXNUZWNoT3BzTG9naW4iOmZhbHNlLCJ1c2VySWQiOjMyNTc3MDQ3OCwic3ViVXNlclR5cGUiOiIiLCJ1c2VyU3RhdGUiOiJBVVRIRU5USUNBVEVEIiwidWRfaXNQYWlkQ2xpZW50IjpmYWxzZSwidWRfZW1haWxWZXJpZmllZCI6ZmFsc2UsInVzZXJUeXBlIjoiam9ic2Vla2VyIiwic2Vzc2lvblN0YXRUaW1lIjoiMjAyNi0wMS0wNFQxMzowNToyOSIsInVkX2VtYWlsIjoiaHNzdXNobWEyMDA0QGdtYWlsLmNvbSIsInVzZXJSb2xlIjoidXNlciIsImV4cCI6MTc2NzUxOTQ0NiwidG9rZW5UeXBlIjoiYWNjZXNzVG9rZW4iLCJpYXQiOjE3Njc1MTU4NDYsImp0aSI6ImJmYjI5YmZkYTlkNzQyMGViMjFkMDJmZWU2MjYxMjU1IiwicG9kSWQiOiJwcm9kLTY2Yzc1OTk4ZDQtenM5NmwifQ.kntJNUK3ZmdVNYHgzQ43pzVMfQDOzK3-JWWQYisPXNer2oqaoMK0h2m5BGtgwKoP0t6jDnOQjr6Cxpou9Vfva_w1pVkjRjWt1m5Y9guvK6KDuDpNKhl_JIAcW3WbKZWVXd-a4zUuZSHV7vrS_9vY8ukDHqa1FtcEkX6iWq7CdTs0jWpoxG-M9gCVNTqnsRsDBFQB8UmrNzpMNBiTFeoiqaGPrlJYfR66W__jzKDhrKs5ZHC-dXlH4v_DCGA7QmkCQNBobqfPwEdjQ1RneU9X4oTZjjXwgrZiDnjWk3Lp_EkIj3ikvsbWYpZCepT3XTQEYIs4-pn3eQEG2C2JUHwMtg',
}

NAUKRI_HEADERS = {
    'systemid': 'Naukri',
    'clientid': 'd3skt0p',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
    'accept': 'application/json',
    'accept-language': 'en-US,en;q=0.9',
    'gid': 'LOCATION,INDUSTRY,EDUCATION,FAREA_ROLE',
    'nkparam': 'Quhdrrd/HjFg4LGsXQcVrz4/k4haxCB9G8BeZPVSWqWlE3cx2A1NGKTRex/aWcmrgaX7WuTyMoeU/1mlJsmTbw==',
    'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
}

def search_naukri_jobs(query: str = "python", location: str = "bengaluru") -> List[str]:
    """
    Search for jobs on Naukri and return job IDs.
    """
    url = "https://www.naukri.com/jobapi/v3/search"
    params = {
        'noOfResults': '20',
        'urlType': 'search_by_keyword',
        'searchType': 'adv',
        'keyword': query,
        'location': location,
        'experience': '0',
        'k': query,
        'l': location,
        'nignbevent_src': 'jobsearchDeskGNB',
        'appid': '109' # Search uses appid 109
    }
    
    headers = NAUKRI_HEADERS.copy()
    headers['appid'] = '109'
    headers['systemid'] = 'Naukri'
    # SEARCH uses "Bearer <token>"
    headers['authorization'] = f"Bearer {NAUKRI_COOKIES.get('ACCESSTOKEN')}"
    
    try:
        print(f"Searching Naukri for: {query}...")
        response = requests.get(url, params=params, headers=headers, cookies=NAUKRI_COOKIES, timeout=30)
        
        if response.status_code != 200:
            print(f"Search Error: {response.status_code} - {response.text[:200]}")
            return []
            
        data = response.json()
        job_ids = []
        if 'jobDetails' in data:
            for job in data['jobDetails']:
                if job.get('jobId'):
                    job_ids.append(job.get('jobId'))
        
        print(f"Found {len(job_ids)} jobs on Naukri.")
        return job_ids
        
    except Exception as e:
        print(f"Naukri Search FAILED: {e}")
        return []

def apply_to_job(job_id: str, logstr: str = "", sid: str = ""):
    """
    Submit the application for a specific job ID using the captured cURL details.
    """
    url = "https://www.naukri.com/cloudgateway-workflow/workflow-services/apply-workflow/v1/apply"
    
    payload = {
        "strJobsarr": [str(job_id)],
        "logstr": logstr or "--simJobDeskACP-1-F-0-1--17675161715487584-",
        "flowtype": "show",
        "crossdomain": True,
        "jquery": 1,
        "rdxMsgId": "",
        "chatBotSDK": True,
        "mandatory_skills": ["SQL", "TESTING"], 
        "optional_skills": ["BE", "Query", "Functional", "fresher"],
        "applyTypeId": "107",
        "closebtn": "y",
        "applySrc": "simJobDeskACP",
        "sid": sid or "17675161715487584",
        "mid": ""
    }
    
    headers = NAUKRI_HEADERS.copy()
    headers['appid'] = '121' # APPLY uses appid 121
    headers['systemid'] = 'jobseeker'
    # APPLY uses "ACCESSTOKEN = <token>"
    headers['authorization'] = f"ACCESSTOKEN = {NAUKRI_COOKIES.get('ACCESSTOKEN')}"

    try:
        response = requests.post(url, headers=headers, cookies=NAUKRI_COOKIES, json=payload, timeout=30)
        print(f"Apply result for {job_id}: {response.status_code} - {response.text[:200]}")
        return response.json()
    except Exception as e:
        print(f"FAILED to apply to {job_id}: {e}")
        return None

def search_and_apply(query: str = "software trainee", location: str = "bengaluru", max_jobs: int = 10):
    """
    Search for jobs and apply to them automatically.
    """
    print(f"\n--- STARTING NAUKRI BOT ---")
    job_ids = search_naukri_jobs(query, location)
    
    applied_count = 0
    if job_ids:
        # Limit to max_jobs
        tasks = job_ids[:max_jobs]
        for idx, jid in enumerate(tasks):
            print(f"\n[{idx+1}/{len(tasks)}] Applying to Job ID: {jid}")
            result = apply_to_job(jid)
            
            # Naukri success check: statusCode 0 or first job status 200
            if result and (result.get('statusCode') == 0 or (result.get('jobs') and result['jobs'][0].get('status') == 200)):
                applied_count += 1
                print(f"SUCCESS: Applied to {jid}")
            else:
                print(f"FAILED: Could not apply to {jid}")
            time.sleep(2)
    
    print(f"\n--- NAUKRI BOT SUMMARY ---")
    print(f"Jobs Found: {len(job_ids)}")
    print(f"Jobs Applied: {applied_count}")

if __name__ == "__main__":
    # You can change these values as needed
    search_and_apply(query="software traniee", location="bengaluru", max_jobs=5)
