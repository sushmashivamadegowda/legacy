import requests
import json
import time
from typing import List, Dict, Optional

# Global headers for reuse across functions
DEFAULT_SEARCH_HEADERS = {
    'accept': '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
    'x-source-site-context': 'rexmonster',
}

DEFAULT_APPLY_HEADERS = {
    'accept': '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'content-type': 'text/plain;charset=UTF-8',
    'origin': 'https://www.foundit.in',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
}

DEFAULT_COOKIES = {
    'WZRK_G': '3485b2e2d5ac41959c06b635a2b24cc7',
    'seoSearchVariant': 'newSeoSearch',
    'uuidAB': '9ac7a4f4-75f4-4b1c-89f7-6aadb9aff00d',
    'MSUID': 'aabe5980-c0f3-45df-80db-b33e75ace3b2',
    'g_state': '{"i_l":0,"i_ll":1767123723298}',
    'MOTS_AUTH': 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ5NmQwMDhlOGM3YmUxY2FlNDIwOWUwZDVjMjFiMDUwYTYxZTk2MGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1OTE1Mjg5ODQ1MDktNW9kdG41Mm5qZnNnNDRscWZ0cnBudjBwdWRtOXU4a2MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1OTE1Mjg5ODQ1MDktNW9kdG41Mm5qZnNnNDRscWZ0cnBudjBwdWRtOXU4a2MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ0NTc4MDk1NTYxNzc3MzY5NzMiLCJlbWFpbCI6Im5pa2hpbHN3YW1pMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzY3MTIzNDI4LCJuYW1lIjoiTmlraGlsIFN3YW1pIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tnMmY4RlRRbmNsd1Y0UGVNR3pKbWs0WXhCbWdsMTVKZGppb2JYczl2V1kwWE44a2RkblE9czk2LWMiLCJnaXZlbl9uYW1lIjoiTmlraGlsIiwiZmFtaWx5X25hbWUiOiJTd2FtaSIsImlhdCI6MTc2NzEyMzcyOCwiZXhwIjoxNzY3MTI3MzI4LCJqdGkiOiJhYjUwMWZhOGU4MDIwYWMwOTk5ZDg1YmJhMTJkZWEwMTM0MmE2MDEzIn0.OCK0fXNakgpF0AQclniHmL8gqQNa0h4FHxmkhCmZIZzitOE7-3c5HmtCMuBLWeAb0KcXpmMWzxno3kYETADRmxKxFlKiO0y7L5BxUSo_QONJ4wQUN0X-oS7ESzz9nwxlDrN3-tO9xWLTQTeOcaXtzwl0qPCuy12zFLkT2zXnwRDM0Am6un3j_IncDeb7zD2QzN72miXDeNErgHReMiLqF-nQX08j6gFOPzhsIpONQlMaGIUzMKGjirF9QIZxXe52mG3qYqBLRfzfEx-QpoTDIcCht6zopTcb0rojdmqkLRFS4_Zi0Cw5liuWHKpEBm5k81EVGgVJLaF54qbqk9NybA',
    'MSSOAT': 'ZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBiblJsY201aGJDSTZabUZzYzJVc0ltbHVkR1Z5Ym1Gc0xXVjRkR1Z5Ym1Gc0lqcG1ZV3h6WlN3aWRYTmxjbDkwZVhCbElqb2lVMFZGUzBWU0lpd2lkWE5sY2w5dVlXMWxJam9pT1RjNVkyVmhZVEF0WXpkalpTMDBabUkxTFRnd01UWXRabUV6WTJWaU9HRTFOVE5rSWl3aWMyTnZjR1VpT2xzaVlXeHNJbDBzSW1WNGNDSTZNVGM1TXpnMk5UYzFOQ3dpZFhWcFpDSTZJamszT1dObFlXRXdMV00zWTJVdE5HWmlOUzA0TURFMkxXWmhNMk5sWWpoaE5UVXpaQ0lzSW1GMWRHaHZjbWwwYVdWeklqcGJJbEpQVEVWZlUwVkZTMFZTSWwwc0ltcDBhU0k2SWpRNVlqTTJZalJsTFRNM1ptRXROR1ZrWlMwNVpEUXlMVFV3WXpJeE5tTTVPREJpWlNJc0ltTnNhV1Z1ZEY5cFpDSTZJbVprTVRFeFlXWXlMVFE1TTJRdE1URmxPQzA1TmpJeExUSTBZVEEzTkdZd05qUTFNQ0lzSW1WNGRHVnlibUZzWDJOc2FXVnVkRjkxZFdsa0lqcHVkV3hzTENKemFYUmxYMk52Ym5SbGVIUWlPaUp5WlhodGIyNXpkR1Z5SW4wLmI0TUxqLWdIY1d4d0dYeGpkUGJDdUhueG5WbHVBWlZMb0c3MzlnY0ZQMmxhNExaT2hLRmlfd0w0X2dwV3RNUkdUd2lFTXNsejVXNUVGYmlGNkx5MGxrOW55WUZhRXYtRHRON1JIdGUtSVRnNkJGZ2FKVXZRTzczODlneWtfQmRSOUlVT1hCYU51WUE1cWlWRUxaaUpyY3VWamVQcUphNm9xZ3FzU2pzc1VwX2lDMXc3Z092aVRIcE1rY2NDYWhuLXpMem9yWDRZc2ZEQ3daczljeDhJOUp1U2hkYzJqVHJIdm00MmVaLWgwV1I4WFhMZldrZjllNVhwejhkTTZSLV9uQm5BMUpmcXpSUUZvQTRvLTlOYlhuOHN2a184ai16bzJJcDc4aXgyX2l6azhQUXR3Y1l2U05HTndpblhzVm5BQWpualZrb0pGQnpELUx6eXJrY0J0eFA1QU9YRDJ5LXdCeGVEX0VxcTFTYWNwWWxtejFrVjZjeW40X1RPUVZBU0VVbmh5ZnZrRGxNYXRjdENzSjRUR2tSeFMySUtNNkV4S2twRnJPREYwTUF5WTlrNTVNc3Z6TjJLNnVzOFVja0pfRHY3VDRIQ1pjcko2eThWdWNESU1EM1JJbDJJOEg0V0kzVjRkdUw5UmtOdktveWxZeFdjR1AxZTA0NXZtbVV1Z3gzMGVYZlJkUzA1elhGVTFWQ25jS21FeV8xR0x2ZmYwc28tNHk4Z1cwOGhNMDZHZlkxRzNNTDRWQlp5V2RSLUFiamNwcTVITVp3MjJ0akVQdF9CVzNpZXFxS0ZtaEM0VXJtb1E1YmxjTlV0aEZiS2NGQUhXNW5rME5LdU1DUkNITm9KMzBGSXJWQ19EUnBTczM1NEwtY1pqa3ZRSGFDRWx4ZDJYZVNJdjYwOjpiZWFyZXI6MTc5Mzg2NTc1MzgxMg==',
    'MSSOCLIENT': '32262501-6c0b-4463-b3ab-763eb3058a1f',
    'profileVariant': 'newProfile',
    '_clck': 'okn76t^2^g2e^0^2190',
    '_gid': 'GA1.2.7023980.1767466778',
    'ak_bmsc': '060114AEED5F9837A1F605744850207A~000000000000000000000000000000~YAAQXuhUuDgFtyWbAQAAlOpchx7yIeEXcntDdqPDhYKqBcFVDngffKveXa4e6PvneKqY7AGGrNrLPvsgUPJVuzCeTwuY/L4ttLo+aaRbluaDV0J6WCP6oWoBjsEEd58F2QZ3Sg075w5OkP7NCmNdl5n1IjsAK+nCb6xqVTTHMCdHN5Mzlyh0+RYBIxdHgPoAWo/KnKu9navF4FpT9VDHT9MPP3LyY3NnH6K1Osl4ksN38R3V1WU+fV3y6xcJI5MfaUXJB0TJMoCAQFIwq1omoZZzzODjLEMFZS+tCFdmOzaoGgtHvS56WnhWtTXpTfc1bFV815VtqIADHHNhrmm+TV8QGeSKKnhXrPpoVQ2sOYb9NSLNFCtkwKmxxmvq//EeQw5C28Bz2tDxYOpgDPbrkcweYAsAbNru1Wou6qu2Hl9FcGyoMa4hx/Xi3JPS+Eoia5Q1cQA=',
    'preferences': '%7B%22strictlyNecessary%22%3Atrue%2C%22functional%22%3Atrue%2C%22performance%22%3Atrue%2C%22targeting%22%3Atrue%7D',
    'bm_sz': '680820EB22F3B181D0C5280F6EA057F7~YAAQXuhUuL0HtyWbAQAAwNxdhx4BDX6DtiCSpJUlYdMdzPhWY3LfdzRXba+yJPFjE8yy+WS9mqAbJwYpaAZdr9Umy+4U4realfCyR5G3ixFeyB8xJhHvGQbIuIdla2zeQkggYaHeUSA4IDLAtCV0jh1jmP9zlHpOnKIy+hYwzO4nW/YA9lS9mpTC9Vab/SEmmPek+KC9Rmr+imNLCiAeXoodCCKDuEAx88NVUS/ZSj5ffeMngxgXTvthCXRzzBYYVb9jVmME4333UPDKCMHhhU2l8fHcnntcuFxwtZFgxvcIS4W8XPlODlrcnTAEeZdVfRwCBX6u2gTllVNHpshGBCTWdsi5XDWKk6J6nssu18PFlKc5/DZufdKQfk80TiXWUj5oKeV5LPVg4L7f2alLBBFMWJyXy8vVHNLNAfb0gAgDjt8Y614/UY9aI0k5vxXc35uhN7Kw~3487046~4277827',
    '_abck': '1BAA93FD84AA3B73C1B9D1368ED58675~0~YAAQpHEsMb6ZlyWbAQAA3ijNhg/SAAF3xjfR9Y12SrJgoWxKEor2JBFku4arFQ5r137CVGVeRGkpS//ruzJ/f6xHq7RfuXYC+MHKPxZP4Ote5n8SlVDLDxqP3Z2XRoYRJXavdwwYs8GMoaaCDr538Lm7uLpRZrbwDf93mfbDPRdbmRNz5nALW6A1U7S588uA6WRD/SPFQevNjuKLrIDKX/angVAPyIy5dOkFwYy2VNoqzL1AJ4w0GeLI2DmUFmllkGTdGu70cqk9twPZG6WZr5BsmhaSv2UTlt9A95hWErYY093+KBNlzKAkWdPUlGUdEVGfZL3zTCmvTJoInngnOkbD+qpPx4kuBdvu87ARbEQZg23QP9ljq3LWXib8xY0IHxwtT1vPRKjBH6MIeAw/S8h8U7WcAQqpt0NEhey1PwSyOFe2bw48SbCozN8uT/8x8NJ8QmF2iK2xR3ZLlEeu/oGUjaL7iT4Unjyw6Ljr9/Q/zwUaQMWLodSXNrHQLYrsHo1sLTRdp9CuVWC/TSfE1tMqbcc2xR8TUtkghLf3qn76XiCP7Byma8KzpDMtNBFzNAPGpL4FaxXd6g8JLeyv8da/OLy13tNXGKnfp2wJGsU7a6QbL0KsQGd25gWkBjX71dN7EUxfxeRKsIyhm5fqFqw2sVv1U744kMAaTw==~-1~-1~-1~AAQAAAAE%2f%2f%2f%2f%2f04EfClf5HY0A7hzWH6Cym7x6Yq8RRU%2fSqfgX3JU4kR03guyLrnLkJsPfR46d4ArpI6iKmBd58%2fFhzmE2nnFMpsWTBArYQqy+L8urBGJI0YjcKEVkVNhxt5b4NMY3CvADhBK3vs%3d~-1',
    'G_ENABLED_IDPS': 'google',
    '_gcl_au': '1.1.1115772871.1767123692.55365211.1767467722.1767467801',
    'RT': '"z=1&dm=www.foundit.in&si=ffb42ab4-f2a9-4504-9d74-36b9957d58c9&ss=mjyo31an&sl=8&tt=3te&obo=2&rl=1"',
    '__rtbh.lid': '%7B%22eventType%22%3A%22lid%22%2C%22id%22%3A%22dbxUcvrnvOU2tBfn4BFm%22%2C%22expiryDate%22%3A%222027-01-03T19%3A17%3A03.239Z%22%7D',
    'cto_bundle': 'AQ8yKl93S1lNU1NIOG9qM2ROQTMzOHB1Uk01alZId2poM1dGbDNkeHYlMkZ0V0VJelZBYjRSOWclMkZQQmdTb25vS3RtM3BrNjFrMDRabW51dUltN0owMThnMTVEUWlRZzhNdFZEWFo1Mjl0Q0RMZlJlMlNNWTBxY1V1alQ3RndlN1RHJTJCdTlKVVFzaEx5alV2a3J0ZzQ0dFhTYUZtemclM0QlM0Q',
    'FCCDCF': '%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%2240834ab5-bdf0-40f1-a854-ab1dc1507e73%5C%22%2C%5B1767123691%2C768000000%5D%5D%22%5D%5D%5D',
    '_ga': 'GA1.1.398350477.1767123692',
    'FCNEC': '%5B%5B%22AKsRol8li0WGdsDd44-S_72FFJ5Z7QuilAvSU3i_8-jkDmaNrrsoMOvYnCitPbahcyERoTLX7pA6DGEIhsfF7FMUgEFiE-44CQOPuqAHD8ue9MncEIz-2-KYw3kZOZW3rcHS_2-lC8qWGgPuer-KsVld5ZYSEMEBwA%3D%3D%22%5D%5D',
    '_uetsid': '86f74450e8b811f0b46ccfd0688c1343',
    '_uetvid': '8ae43da0e5b711f08b85a760102a3dc4',
    '_ga_FF80CS9L69': 'GS2.2.s1767466778$o2$g1$t1767467843$j33$l0$h0',
    '_clsk': '1ycy2js^1767467943305^17^1^v.clarity.ms/collect',
    '_ga_HT3XNW7GHL': 'GS2.1.s1767466777$o5$g1$t1767467944$j60$l0$h0',
    '__rtbh.uid': '%7B%22eventType%22%3A%22uid%22%2C%22expiryDate%22%3A%222027-01-03T19%3A23%3A17.862Z%22%7D',
}


def search_jobs(query: str = "python", start: int = 0, limit: int = 20, cookies: dict = None, headers: dict = None) -> List[str]:
    """
    Search for jobs on foundit.in and return job IDs

    Args:
        query: Search query (e.g., "python", "javascript", "data scientist")
        start: Pagination start index
        limit: Number of results per page
        cookies: Optional cookies dictionary
        headers: Optional headers dictionary

    Returns:
        List of job IDs
    """
    # Use global headers and update with user-provided headers if any
    current_headers = DEFAULT_SEARCH_HEADERS.copy()
    current_headers['referer'] = f'https://www.foundit.in/search/{query}-jobs?start={start}&limit={limit}&query={query}&queryDerived=true&quickApplyJob=Show+Quick+Apply+Job'

    if headers:
        current_headers.update(headers)

    # Use global cookies and update with user-provided cookies if any
    current_cookies = DEFAULT_COOKIES.copy()
    if cookies:
        current_cookies.update(cookies)

    # Query parameters
    params = {'start': str(start), 'limit': str(limit), 'query': query, 'queryDerived': 'true', 'quickApplyJob': 'show quick apply job', 'countries': 'India'}

    url = 'https://www.foundit.in/home/api/searchResultsPage'

    try:
        response = requests.get(url, params=params, headers=current_headers, cookies=current_cookies, timeout=30)
        response.raise_for_status()

        data = response.json()
        if 'data' in data and data['data']:
            job_ids = [job['id'] for job in data['data']]
            print(f"Found {len(job_ids)} jobs in search results (start={start}, limit={limit})")
            return job_ids
        else:
            print(f"No jobs found in search results (start={start}, limit={limit})")
            return []

    except requests.exceptions.RequestException as e:
        print(f"Search request failed: {e}")
        return []
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Failed to parse search response: {e}")
        return []


def bulk_apply_jobs(job_ids: List[str], cookies: dict = None, headers: dict = None) -> dict:
    """
    Send bulk job applications to foundit.in

    Args:
        job_ids: List of job IDs to apply for
        cookies: Optional cookies dictionary (will use default if not provided)
        headers: Optional headers dictionary (will use default if not provided)

    Returns:
        Response JSON from the API
    """
    if not job_ids:
        return {"error": "No job IDs provided", "applied_count": 0}

    # Use global apply headers and update with user-provided headers if any
    current_headers = DEFAULT_APPLY_HEADERS.copy()
    if headers:
        current_headers.update(headers)

    # Use global cookies and update with user-provided cookies if any
    current_cookies = DEFAULT_COOKIES.copy()
    if cookies:
        current_cookies.update(cookies)

    # Prepare payload
    jobs_list = [{"jobId": job_id} for job_id in job_ids]
    payload = {"jobs": jobs_list}

    # API endpoint
    url = "https://www.foundit.in/home/api/bulkJobApply?utm_source=bulk_apply"

    try:
        response = requests.post(url=url, headers=current_headers, cookies=current_cookies, data=json.dumps(payload), timeout=30)

        response.raise_for_status()
        result = response.json()

        # Log success
        applied_count = len(job_ids)
        print(f"Successfully applied to {applied_count} jobs")
        return {"success": True, "applied_count": applied_count, "job_ids": job_ids, "response": result}

    except requests.exceptions.RequestException as e:
        error_msg = f"Bulk apply request failed: {e}"
        print(error_msg)
        return {"error": error_msg, "applied_count": 0}
    except json.JSONDecodeError as e:
        error_msg = f"Failed to parse JSON response: {e}"
        print(error_msg)
        return {"error": error_msg, "response_text": response.text if 'response' in locals() else "No response", "applied_count": 0}


def search_and_apply_per_iteration(query: str = "python", max_pages: int = 3, jobs_per_page: int = 20, delay_between_pages: float = 2.0, delay_between_search_and_apply: float = 1.0) -> Dict:
    """
    Search and apply per iteration - search for jobs and immediately apply to them per page

    Args:
        query: Search query (e.g., "python", "javascript", "data scientist")
        max_pages: Maximum number of search pages to process
        jobs_per_page: Number of jobs per search page
        delay_between_pages: Delay in seconds between search pages
        delay_between_search_and_apply: Delay in seconds between search and apply operations

    Returns:
        Dictionary with search and apply results
    """
    print(f"Starting per-iteration job search and application for query: '{query}'")
    print(f"Max pages: {max_pages}, Jobs per page: {jobs_per_page}")

    all_results = []
    total_applied = 0

    # Process each page: search and immediately apply
    for page in range(max_pages):
        start = page * jobs_per_page
        print(f"\nProcessing page {page + 1}/{max_pages} (start={start})...")

        # Step 1: Search for jobs on this page
        job_ids = search_jobs(query=query, start=start, limit=jobs_per_page)

        if job_ids:
            print(f"Found {len(job_ids)} jobs on page {page + 1}")

            # Step 2: Apply to jobs found on this page immediately
            print(f"Waiting {delay_between_search_and_apply} seconds before applying...")
            time.sleep(delay_between_search_and_apply)

            print(f"Applying to {len(job_ids)} jobs from page {page + 1}...")
            apply_result = bulk_apply_jobs(job_ids)

            page_result = {
                "page": page + 1,
                "start": start,
                "jobs_found": len(job_ids),
                "jobs_applied": apply_result.get("applied_count", 0),
                "job_ids": job_ids,
                "apply_success": apply_result.get("success", False),
                "apply_error": apply_result.get("error", None),
            }
            all_results.append(page_result)

            if apply_result.get("success"):
                total_applied += apply_result["applied_count"]
                print(f"✅ Successfully applied to {apply_result['applied_count']} jobs from page {page + 1}")
            else:
                print(f"❌ Failed to apply to jobs from page {page + 1}: {apply_result.get('error', 'Unknown error')}")
        else:
            print(f"No jobs found on page {page + 1}")
            page_result = {"page": page + 1, "start": start, "jobs_found": 0, "jobs_applied": 0, "job_ids": [], "apply_success": False, "apply_error": "No jobs found"}
            all_results.append(page_result)

        # Delay between pages to avoid rate limiting (only if not the last page)
        if page < max_pages - 1:
            time.sleep(delay_between_pages)

    # Final summary
    pages_processed = len([r for r in all_results if r["jobs_found"] > 0])
    print(f"\n" + "=" * 60)
    print(f"📊 FINAL SUMMARY:")
    print(f"   - Total pages processed: {pages_processed}")
    print(f"   - Total jobs found: {sum(r['jobs_found'] for r in all_results)}")
    print(f"   - Total jobs applied: {total_applied}")
    print(f"   - Success rate: {pages_processed}/{max_pages} pages")

    final_result = {"success": total_applied > 0, "total_pages": max_pages, "pages_processed": pages_processed, "total_found": sum(r['jobs_found'] for r in all_results), "total_applied": total_applied, "page_results": all_results}

    return final_result


# Keep the original function for backward compatibility, but mark as deprecated
def search_and_apply_chained(query: str = "python", max_pages: int = 3, jobs_per_page: int = 20, delay_between_pages: float = 2.0, delay_between_search_and_apply: float = 1.0) -> Dict:
    """
    [DEPRECATED] Use search_and_apply_per_iteration instead.
    Original chained job search and bulk application - collects all jobs first then applies in bulk.
    """
    print("⚠️  WARNING: search_and_apply_chained is deprecated. Use search_and_apply_per_iteration for better performance.")
    return search_and_apply_per_iteration(query, max_pages, jobs_per_page, delay_between_pages, delay_between_search_and_apply)


# Example usage
if __name__ == "__main__":
    # Example 1: Per-iteration search and apply (recommended)
    print("=== Example 1: Per-iteration Search and Apply ===")
    result = search_and_apply_per_iteration(query="software engineer,", max_pages=100, jobs_per_page=15, delay_between_pages=2.0, delay_between_search_and_apply=1.0)

    print("\n" + "=" * 50)
    print("=== Example 2: Legacy chained search and apply ===")

    # # Example 2: Legacy method (still works but less efficient)
    # result_legacy = search_and_apply_chained(query="python", max_pages=3, jobs_per_page=15, delay_between_pages=2.0, delay_between_search_and_apply=1.0)
