#!/usr/bin/env python3
"""
Advanced Analytics & Extraction Engine for Cisco Ramon Portfolio
Extracts structured datasets from projects.json and skills.json,
calculating frequencies, co-occurrence matrices, Jaccard project similarities,
architectural quadrants, boxplot quartiles, ECDF distributions, and super-clusters.
Saved to src/data/extracts/.
"""

import json
import os
import math
from collections import defaultdict

def percentile(sorted_vals, p):
    """Calculates the p-th percentile from sorted numbers."""
    if not sorted_vals:
        return 0
    k = (len(sorted_vals) - 1) * p
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return sorted_vals[int(k)]
    d0 = sorted_vals[int(f)] * (c - k)
    d1 = sorted_vals[int(c)] * (k - f)
    return round(d0 + d1, 1)

def run_extraction():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'src', 'data')
    extracts_dir = os.path.join(data_dir, 'extracts')
    os.makedirs(extracts_dir, exist_ok=True)

    projects_path = os.path.join(data_dir, 'projects.json')
    skills_path = os.path.join(data_dir, 'skills.json')

    # ==========================================
    # 1. EXTRACT PROJECTS ANALYTICS
    # ==========================================
    with open(projects_path, 'r', encoding='utf-8') as f:
        projects = json.load(f)

    tech_counts = defaultdict(int)
    tech_projects = defaultdict(list)
    co_occurrence = defaultdict(lambda: defaultdict(int))
    total_projects = len(projects)

    for p in projects:
        title = p.get('title', p.get('id', 'Unknown'))
        stack = p.get('stack', [])
        for tech in stack:
            tech_clean = tech.strip()
            tech_counts[tech_clean] += 1
            tech_projects[tech_clean].append({
                'id': p.get('id'),
                'title': title,
                'featured': bool(p.get('featured', False)),
            })

        # Co-occurrence pairs (for heatmap matrix)
        for i in range(len(stack)):
            for j in range(i + 1, len(stack)):
                t1, t2 = stack[i].strip(), stack[j].strip()
                co_occurrence[t1][t2] += 1
                co_occurrence[t2][t1] += 1

    ranked_tech = []
    for tech, count in sorted(tech_counts.items(), key=lambda x: (-x[1], x[0])):
        ranked_tech.append({
            'name': tech,
            'count': count,
            'percentage': round((count / total_projects) * 100, 1),
            'projects': [p['title'] for p in tech_projects[tech]],
            'project_details': tech_projects[tech],
        })

    # Prepare co-occurrence matrix for top 8 technologies
    top_8 = [t['name'] for t in ranked_tech[:8]]
    matrix = []
    for t1 in top_8:
        row = []
        for t2 in top_8:
            if t1 == t2:
                row.append(tech_counts[t1])
            else:
                row.append(co_occurrence[t1][t2])
        matrix.append(row)

    # Architectural Scope & Quadrant Classification
    def get_project_tier(p):
        pid = p.get('id', '')
        stack = [s.lower() for s in p.get('stack', [])]
        if pid == 'hpccfs' or any(x in stack for x in ['slurm', 'openmpi', 'munge', 'ldap']):
            return {'tier': 'HPC & Infrastructure', 'level': 95, 'score': 5}
        if any(x in stack for x in ['fastapi', 'react', 'google drive api']):
            return {'tier': 'Full-Stack & Cloud Streaming', 'level': 88, 'score': 4}
        if pid in ['cerrfix', 'gitpush'] or any('bash' in x for x in stack):
            return {'tier': 'CLI & System Automation', 'level': 90, 'score': 4}
        if pid in ['dotfiles', 'myvimrc'] or any('vim' in x for x in stack):
            return {'tier': 'Workspaces & Dev Environments', 'level': 86, 'score': 3}
        if pid == 'orgslide':
            return {'tier': 'Web Presentation Engine', 'level': 85, 'score': 3}
        return {'tier': 'Front-End & Theming', 'level': 75, 'score': 2}

    project_quadrants = []
    for p in projects:
        tier_info = get_project_tier(p)
        stack = p.get('stack', [])
        project_quadrants.append({
            'id': p.get('id'),
            'title': p.get('title'),
            'excerpt': p.get('excerpt', ''),
            'stack_breadth': len(stack),
            'architectural_depth': tier_info['score'],
            'depth_label': tier_info['tier'],
            'proficiency_index': tier_info['level'],
            'stack': stack,
            'featured': bool(p.get('featured', False)),
            'has_live_url': bool(p.get('url')),
            'repo': p.get('repo', '')
        })

    # Jaccard Project Similarity Matrix
    project_similarity = []
    for i, p1 in enumerate(projects):
        s1 = set(t.strip().lower() for t in p1.get('stack', []))
        row = []
        for j, p2 in enumerate(projects):
            s2 = set(t.strip().lower() for t in p2.get('stack', []))
            union = s1.union(s2)
            inter = s1.intersection(s2)
            score = round(len(inter) / len(union), 3) if union else 0.0
            row.append({
                'target_id': p2.get('id'),
                'target_title': p2.get('title'),
                'similarity': score,
                'shared_count': len(inter),
                'shared_tech': [t for t in p1.get('stack', []) if t.strip().lower() in inter]
            })
        project_similarity.append({
            'source_id': p1.get('id'),
            'source_title': p1.get('title'),
            'comparisons': row
        })

    # Tech Stack Layer Classification
    tech_layer_map = {
        'HPC, Kernels & Schedulers': ['Rocky Linux', 'Slurm', 'OpenMPI', 'LDAP', 'NFS', 'Environment Modules', 'Spack', 'Munge', 'SlurmDBD', 'MariaDB', 'MPI'],
        'Languages & Shell Core': ['C', 'Python', 'JavaScript', 'TypeScript', 'Bash', 'Bash Scripting', 'Vimscript', 'Lisp'],
        'Web, APIs & Formats': ['FastAPI', 'React', 'Google Drive API', 'HTTP Streaming', 'Kodi Add-on', 'HTML5', 'CSS3', 'HTML', 'CSS', 'Org-mode', 'Markdown', 'YAML', 'HTML5 FileReader API']
    }

    layer_breakdown = []
    for layer_name, layer_techs in tech_layer_map.items():
        matched = [t for t in ranked_tech if t['name'] in layer_techs]
        total_deployments = sum(t['count'] for t in matched)
        layer_breakdown.append({
            'layer': layer_name,
            'total_technologies': len(matched),
            'total_deployments': total_deployments,
            'technologies': matched
        })

    projects_analytics = {
        'total_projects': total_projects,
        'unique_technologies': len(tech_counts),
        'ranked_technologies': ranked_tech,
        'co_occurrence_top8': {
            'labels': top_8,
            'matrix': matrix,
        },
        'project_quadrants': project_quadrants,
        'project_similarity': project_similarity,
        'layer_breakdown': layer_breakdown,
        'projects_list': [{
            'id': p.get('id'),
            'title': p.get('title'),
            'stack_count': len(p.get('stack', [])),
            'stack': p.get('stack', []),
            'featured': bool(p.get('featured', False))
        } for p in projects]
    }

    projects_out = os.path.join(extracts_dir, 'projects_analytics.json')
    with open(projects_out, 'w', encoding='utf-8') as f:
        json.dump(projects_analytics, f, indent=2)
    print(f"[OK] Wrote enhanced projects analytics to {projects_out}")

    # ==========================================
    # 2. EXTRACT SKILLS ANALYTICS
    # ==========================================
    with open(skills_path, 'r', encoding='utf-8') as f:
        skills = json.load(f)

    category_skills = defaultdict(list)
    total_skills = len(skills)

    for s in skills:
        cat = s.get('category', 'General')
        category_skills[cat].append(s)

    category_stats = []
    level_histogram = {
        '50-59%': 0,
        '60-69%': 0,
        '70-79%': 0,
        '80-89%': 0,
        '90-100%': 0
    }

    for s in skills:
        lvl = s.get('level', 0)
        if lvl >= 90:
            level_histogram['90-100%'] += 1
        elif lvl >= 80:
            level_histogram['80-89%'] += 1
        elif lvl >= 70:
            level_histogram['70-79%'] += 1
        elif lvl >= 60:
            level_histogram['60-69%'] += 1
        else:
            level_histogram['50-59%'] += 1

    # Boxplot Quartiles per category
    for cat, sk_list in category_skills.items():
        levels = sorted([s.get('level', 0) for s in sk_list])
        avg_lvl = round(sum(levels) / len(levels))
        min_lvl = levels[0]
        max_lvl = levels[-1]
        q1 = percentile(levels, 0.25)
        median = percentile(levels, 0.50)
        q3 = percentile(levels, 0.75)
        iqr = round(q3 - q1, 1)

        sorted_sk = sorted(sk_list, key=lambda x: -x.get('level', 0))
        category_stats.append({
            'category': cat,
            'skill_count': len(sk_list),
            'avg_level': avg_lvl,
            'min_level': min_lvl,
            'max_level': max_lvl,
            'q1': q1,
            'median': median,
            'q3': q3,
            'iqr': iqr,
            'levels': levels,
            'top_skills': [s.get('name') for s in sorted_sk[:3]],
            'skills': [{
                'id': s.get('id'),
                'name': s.get('name'),
                'level': s.get('level'),
                'context': s.get('context', ''),
                'featured': bool(s.get('featured', False))
            } for s in sorted_sk]
        })

    category_stats.sort(key=lambda x: (-x['avg_level'], -x['skill_count']))

    # Super-Clusters (HPC & Core Systems vs Development & Toolchains vs Modern Cloud & Web)
    super_cluster_defs = {
        'High Performance & Scientific Computing': ['HPC', 'Parallel Computing', 'GPU Computing', 'Benchmarking', 'Schedulers'],
        'Low-Level Systems & Administration': ['Systems'],
        'Languages, Toolchains & Literate': ['Programming Languages', 'Scripting', 'Developer Tools', 'Literate Programming'],
        'Cloud, DevOps, AI & Web Platforms': ['DevOps', 'Cloud', 'Web Technology', 'AI']
    }

    super_clusters = []
    for sc_name, sc_cats in super_cluster_defs.items():
        matched_stats = [cs for cs in category_stats if cs['category'] in sc_cats]
        all_levels = [lvl for cs in matched_stats for lvl in cs['levels']]
        total_sk = sum(cs['skill_count'] for cs in matched_stats)
        avg_sc = round(sum(all_levels) / len(all_levels)) if all_levels else 0
        super_clusters.append({
            'name': sc_name,
            'categories': sc_cats,
            'skill_count': total_sk,
            'avg_level': avg_sc,
            'category_details': matched_stats
        })

    # Empirical Cumulative Distribution Function (ECDF)
    all_levels_sorted = sorted([s.get('level', 0) for s in skills])
    ecdf_points = []
    for i, lvl in enumerate(all_levels_sorted):
        cum_pct = round(((i + 1) / total_skills) * 100, 1)
        ecdf_points.append({
            'level': lvl,
            'cumulative_percent': cum_pct,
            'rank': i + 1
        })

    overall_percentiles = {
        'p25': percentile(all_levels_sorted, 0.25),
        'median': percentile(all_levels_sorted, 0.50),
        'p75': percentile(all_levels_sorted, 0.75),
        'p90': percentile(all_levels_sorted, 0.90)
    }

    skills_analytics = {
        'total_skills': total_skills,
        'total_categories': len(category_stats),
        'category_stats': category_stats,
        'super_clusters': super_clusters,
        'level_distribution': level_histogram,
        'ecdf_points': ecdf_points,
        'overall_percentiles': overall_percentiles,
        'featured_count': sum(1 for s in skills if s.get('featured')),
        'all_skills_ranked': sorted([{
            'id': s.get('id'),
            'name': s.get('name'),
            'category': s.get('category'),
            'level': s.get('level'),
            'context': s.get('context', ''),
            'featured': bool(s.get('featured', False))
        } for s in skills], key=lambda x: -x['level'])
    }

    skills_out = os.path.join(extracts_dir, 'skills_analytics.json')
    with open(skills_out, 'w', encoding='utf-8') as f:
        json.dump(skills_analytics, f, indent=2)
    print(f"[OK] Wrote enhanced skills analytics to {skills_out}")

if __name__ == '__main__':
    run_extraction()
