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
    'MSUID': 'f34c6df2-7258-48b1-883a-ada0e89a4c6d',
    'g_state': '{"i_l":0,"i_ll":1767123723298}',
    'MOTS_AUTH': 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ5NmQwMDhlOGM3YmUxY2FlNDIwOWUwZDVjMjFiMDUwYTYxZTk2MGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1OTE1Mjg5ODQ1MDktNW9kdG41Mm5qZnNnNDRscWZ0cnBudjBwdWRtOXU4a2MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1OTE1Mjg5ODQ1MDktNW9kdG41Mm5qZnNnNDRscWZ0cnBudjBwdWRtOXU4a2MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ0NTc4MDk1NTYxNzc3MzY5NzMiLCJlbWFpbCI6Im5pa2hpbHN3YW1pMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzY3MTIzNDI4LCJuYW1lIjoiTmlraGlsIFN3YW1pIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tnMmY4RlRRbmNsd1Y0UGVNR3pKbWs0WXhCbWdsMTVKZGppb2JYczl2V1kwWE44a2RkblE9czk2LWMiLCJnaXZlbl9uYW1lIjoiTmlraGlsIiwiZmFtaWx5X25hbWUiOiJTd2FtaSIsImlhdCI6MTc2NzEyMzcyOCwiZXhwIjoxNzY3MTI3MzI4LCJqdGkiOiJhYjUwMWZhOGU4MDIwYWMwOTk5ZDg1YmJhMTJkZWEwMTM0MmE2MDEzIn0.OCK0fXNakgpF0AQclniHmL8gqQNa0h4FHxmkhCmZIZzitOE7-3c5HmtCMuBLWeAb0KcXpmMWzxno3kYETADRmxKxFlKiO0y7L5BxUSo_QONJ4wQUN0X-oS7ESzz9nwxlDrN3-tO9xWLTQTeOcaXtzwl0qPCuy12zFLkT2zXnwRDM0Am6un3j_IncDeb7zD2QzN72miXDeNErgHReMiLqF-nQX08j6gFOPzhsIpONQlMaGIUzMKGjirF9QIZxXe52mG3qYqBLRfzfEx-QpoTDIcCht6zopTcb0rojdmqkLRFS4_Zi0Cw5liuWHKpEBm5k81EVGgVJLaF54qbqk9NybA',
    'MSSOAT': 'ZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBiblJsY201aGJDSTZabUZzYzJVc0ltbHVkR1Z5Ym1Gc0xXVjRkR1Z5Ym1Gc0lqcG1ZV3h6WlN3aWRYTmxjbDkwZVhCbElqb2lVMFZGUzBWU0lpd2lkWE5sY2w5dVlXMWxJam9pWkRBME1qRmxOamd0WkRNNE5pMDBZalEwTFdFMU56QXRZV1poTldRNU4yWmxZelZqSWl3aWMyTnZjR1VpT2xzaVlXeHNJbDBzSW1WNGNDSTZNVGM1T0RZMU9UY3pOU3dpZFhWcFpDSTZJbVF3TkRJeFpUWTRMV1F6T0RZdE5HSTBOQzFoTlRjd0xXRm1ZVFZrT1RkbVpXTTFZeUlzSW1GMWRHaHZjbWwwYVdWeklqcGJJbEpQVEVWZlUwVkZTMFZTSWwwc0ltcDBhU0k2SW1VeE5UbGxPVFE1TFdNeU16Z3RORFUzTmkwNU9HRmlMV1JsTWpVM00yUTNNVEJoTlNJc0ltTnNhV1Z1ZEY5cFpDSTZJbVprTVRFeFlXWXlMVFE1TTJRdE1URmxPQzA1TmpJeExUSTBZVEEzTkdZd05qUTFNQ0lzSW1WNGRHVnlibUZzWDJOc2FXVnVkRjkxZFdsa0lqcHVkV3hzTENKemFYUmxYMk52Ym5SbGVIUWlPaUp5WlhodGIyNXpkR1Z5SW4wLkhSdU5BQ0RNVXB2ZHJKNE1sWFBoNVZON3MwU3RaT3JnWk9URXhoVXRRWkpkYkdUdUNLbHJ3d1pQamsxRjFQMHlUd096cGFWWEo5MkxGaTRTaEJ5V3JnaXc3RXdpTGkxSDR3M0ItY05xUE5GSktLRVZnaDZWUEVuZlFOd3dMY1hWWkticEVyeEhMYld1aXNyMlZILWI0NTd6VVhNUlVhTjFDREhPWGVQeXNpMTBRM3hKUXRtN0tkckNlOEVWdE4wOXVubG1FVDdGUlJOVTl4WDk2dVViOWtQZWZkM2lGZ3ItQTZ6WUNpY0pJeWM2T2U0bjBON2x2aDZHaTZfSmhhQ29NbU5yb3lmTG84Y0hSZFBscWNkSkxJcDM2VmVYRnBjc3ZRc0E1ZTZpb3Z0ZGRtbHFKWi0tQ1ZSal93Z3huMk1uM09TR2FlY3ZaNVBvTGZwR3d3ejFhNkZLZk0ydXNMRjZvd0FjLVFhUDhpYm9kYW82cGJveGVwc1pKdzFKcElyaGVPM1JqbHM5eXlTWTlDbTBud3RlaXpZbjhacmVtTzBpamowdWw3U18teFZKX0g3S2tKY200SDJqR3FnaW5uaDlodWVvcHlOcUYwSEFNZmcyOXBIc2w3X3RCcF9PZm9pdlFuYl91dU5lV1ZTU0h5ZW5lQlluVjVobkxjak5qcU9sMUxCQmloMEp3QktCLVRjQTN2eGxkLTI2ZXlYRDZoV2dIUDZsbTBqUGJqVmVOMl9LYkYya09TMmVFcXgtSzlVTDdJZHkyRTk5TzAyb05ON29GNjJ0d0EwQjZ3SDRKZ21nRUpXZ0FpcnUxR2ZRUTZSdzFaUjFqTHpmVXRMYTBYMzJ0cENDRkkwbFQ0dEhuOTZWMnpzdU1TbFJVTnQtUXZXN2N2QjJnaWVELWJVOjpiZWFyZXI6MTc5ODY1OTczNDQ0OA==',
    'MSSOCLIENT': '32262501-6c0b-4463-b3ab-763eb3058a1f',
    'profileVariant': 'newProfile',
    '_clck': 'okn76t^2^g2e^0^2190',
    '_gid': 'GA1.2.7023980.1767466778',
    'ak_bmsc': 'D6FB3DDC88E356251721538C476DFC42~000000000000000000000000000000~YAAQbQHARa2/EiKbAQAAP7w6hR7UpRTRsK6MNg3VZRm/b9Gkrf2elhNL1J4H10uGHHyHhrtyX6ED2RFU+yx7oVfS7CH+GQSKnBMdOyzJkzPQqmcm39xcU7HjP2jjw0WT5dH/kSCXgWYplz0eUa8Rb2APr/d10hGFS1p3M2iejJepR+Rb5+fij6NaJrASiYX2oXnem5eCc/uqXMfN1Xf1fdewAQRdgTkSkeXzcR9CVEZxTmWIlJ846JZ3fiq7JbW6aSXklI4kvDJygRLzCX2qUxKnwA50HO5PjdQE0qpCB+O0v41JeOWD7S0Irtk2RwkV/3usweWeza9W0bacb7jRQ3VlUxsiptxYIrfz8QsB1kiPEtY854rzLwQ61NnJYo4pH0LVA5SYhAZhuhykvcRveHSetUcFfmEq8BvtPRfgi1pjNGYVLSjypX2q30Os059o6U3+jw==',
    'preferences': '%7B%22strictlyNecessary%22%3Atrue%2C%22functional%22%3Atrue%2C%22performance%22%3Atrue%2C%22targeting%22%3Atrue%7D',
    'bm_sz': 'FADCFAD098499B59CE19D418109B487F~YAAQbQHARUzIEiKbAQAA/hBBhR5V+uHC6JzgNSJhHvnORBzrVgr2CcQObN2p+sAdXyHJm8+JuOC6iC3cFlV1Z97uL4Lc5P+K/FYc3b9sRnPAj/gs69PMEXByJuNnpcIGT+I2CZNukkp8NOOeE7D9AGqDZOlvt/zTWy1fG12iPao7vxK/A7pZ4+KEssmf0jSe3jYJvkqkD3/4W7YYgx0VE+/W+j23SuzL6L1uCY6BMMYdnEmT4wr0uAJEYCtdJYGFKHdT9q2sqY7/valhq1UAd+wOYv7QFFXtgQ5AIy1wdiTK/F7VECrUmkWwHh46aWm4vzfZDFXtCg5Q4KoX0DYNoWPhHLCJFbmjsCwRpcQLegGcLmdks+VWWYx9st7Auo5MHWsbE+MEglJnOEml2Dso/bWfMDtRPaYnKhEPIp895gV9k15GHA==~4600114~4538691',
    '_abck': '24FFAD561159100561EBF1C65AD5D360~0~YAAQbQHARS3REiKbAQAAv35IhQ8D5vmVOOX052ia7qiWbJK+vI9ypnhZk8cda7AdiPRSVfFVp6IjRnr6Xi2LKx0JWoJwo7Wx4CNys54x/KzE4WQD7tJvxVKNaKXbTDUu87ctXD2yI34ciPeH1L7OCGC0OjTLfRWLpFj0FR+e162q6bBmZMtYKARvjPWq5qfBynf6+aKoyeBxriB8g/UDrNpuyRJMkMsv1oLOx7UxMf31215EcE+Iv3RKi0MFSWxk3Mb2hOAfaIuiqRbd7gsMGfnOFuequG7PV7Y43kvymnC/9DosQf8R+1ok1idLZqC3KhkVQ9X30MpFWx37Oi0gC/Q7EA0l4fqV68m5td8o/hnBgN+3dKqt8qv0A7Ww4z5JEsoME8p4j/lZvp7L7U1chTcX10hfwEbXmJbWSPh8a1qTRcSdDhXdJ9XapCcHRL1yHp7k+9rfP5wX1zMPHhjiKZ94nzMiBqNwqVXKxSD9X87Sv3y5xRquut2KSyH96PZ9cKCsSUyvaBcPZpHx79FH8OviBHq5UD+AyFFlP1DRYYj1c92d1FzZJv9wgrQ3GBlL2hjanbob+2CiCGN9kGESNR+Kux0e4D4xzi4ZHW9XiiGjNsC/KkAgOKqczFnRAmkHFO0aDNJ8tk+qug3/gOPr1TO3kRf/CdEBa+dJcQeiETce2BDdLiSgyddtuFLplfD7ESIQ0JQG~-1~-1~-1~AAQAAAAE%2f%2f%2f%2f%2fz7JpEpplJXauhHQHofAU%2f6bqKBjpQs5+pex2u1dL4c2ZdTKi2kAk3YkplRvAK9a2rc4tDPKJN4ZuWfRvGUqXH6BsfblU6aeKb4+q2tFIeKvBVD7mCTN1G9yXcqva5V0K9%2fttxR09bp27tJ5JX02ijcnQSVNtg5qLZqFEVEOxA%3d%3d~-1',
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
