#!/usr/bin/env python3
"""
scripts/fetch_contributions.py

Automated script to fetch all upstream open-source Pull Requests authored by CISSSCO
across external GitHub repositories.
Can run locally or automatically in a scheduled GitHub Actions workflow.
"""

import os
import json
import urllib.request
import urllib.error
from datetime import datetime

USERNAME = "CISSSCO"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "src", "data", "contributions.json")

def fetch_contributions():
    query = f"is:pr+author:{USERNAME}+-user:{USERNAME}"
    url = f"https://api.github.com/search/issues?q={query}&sort=created&order=desc&per_page=100"
    
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "CISSSCO-Portfolio-Sync",
    }
    
    # Use GITHUB_TOKEN if available in environment (e.g., GitHub Actions runner)
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
        print("Using GitHub token from environment.")
    else:
        print("No GITHUB_TOKEN found; using unauthenticated request.")

    print(f"Querying GitHub Search API: {url}")
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        return
    except Exception as e:
        print(f"Failed to query GitHub API: {e}")
        return

    items = data.get("items", [])
    print(f"Found {len(items)} upstream contributions authored by @{USERNAME}.")

    # Load existing contributions to preserve any manual annotations/descriptions
    existing_map = {}
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                for item in json.load(f):
                    key = f"{item.get('repo')}#{item.get('number')}"
                    existing_map[key] = item
        except Exception:
            pass

    results = []
    for it in items:
        repo_url = it.get("repository_url", "")
        repo_name = repo_url.replace("https://api.github.com/repos/", "")
        number = it.get("number")
        key = f"{repo_name}#{number}"
        
        pr_data = it.get("pull_request", {})
        is_merged = pr_data.get("merged_at") is not None
        
        # State determination
        if is_merged:
            state = "merged"
        elif it.get("state") == "closed":
            state = "closed"
        else:
            state = "open"

        existing = existing_map.get(key, {})
        
        org = repo_name.split("/")[0] if "/" in repo_name else repo_name

        entry = {
            "id": f"pr-{org.lower()}-{number}",
            "number": number,
            "title": it.get("title", ""),
            "repo": repo_name,
            "repo_url": f"https://github.com/{repo_name}",
            "url": it.get("html_url", ""),
            "state": state,
            "merged": is_merged,
            "created_at": it.get("created_at", ""),
            "merged_at": pr_data.get("merged_at"),
            "description": existing.get("description", f"Upstream contribution to {repo_name} (#{number})."),
            "labels": [lbl["name"] for lbl in it.get("labels", [])],
            "checks": existing.get("checks", "Verified"),
            "organization": org,
            "category": existing.get("category", "Open Source Contribution"),
        }
        results.append(entry)

    # If GitHub returned items, write out to contributions.json
    if results:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
        print(f"Successfully saved {len(results)} contributions to {OUTPUT_FILE}")
    else:
        print("No items returned from API; preserving existing contributions.json")

if __name__ == "__main__":
    fetch_contributions()

