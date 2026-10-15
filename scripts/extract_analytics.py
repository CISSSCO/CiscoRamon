#!/usr/bin/env python3
"""
Automated Analytics & Extraction Engine for Cisco Ramon Portfolio
Extracts structured datasets from projects.json and skills.json,
calculating frequencies, co-occurrence matrices, category distributions,
and statistical metrics saved to src/data/extracts/.
"""

import json
import os
from collections import defaultdict

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

    # Prepare matrix for top 8 technologies
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

    projects_analytics = {
        'total_projects': total_projects,
        'unique_technologies': len(tech_counts),
        'ranked_technologies': ranked_tech,
        'co_occurrence_top8': {
            'labels': top_8,
            'matrix': matrix,
        },
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
    print(f"[OK] Wrote projects analytics to {projects_out}")

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

    for cat, sk_list in category_skills.items():
        levels = [s.get('level', 0) for s in sk_list]
        avg_lvl = round(sum(levels) / len(levels))
        sorted_sk = sorted(sk_list, key=lambda x: -x.get('level', 0))
        category_stats.append({
            'category': cat,
            'skill_count': len(sk_list),
            'avg_level': avg_lvl,
            'min_level': min(levels),
            'max_level': max(levels),
            'top_skills': [s.get('name') for s in sorted_sk[:3]],
            'skills': [{
                'id': s.get('id'),
                'name': s.get('name'),
                'level': s.get('level'),
                'featured': bool(s.get('featured', False))
            } for s in sorted_sk]
        })

    category_stats.sort(key=lambda x: (-x['avg_level'], -x['skill_count']))

    skills_analytics = {
        'total_skills': total_skills,
        'total_categories': len(category_stats),
        'category_stats': category_stats,
        'level_distribution': level_histogram,
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
    print(f"[OK] Wrote skills analytics to {skills_out}")

if __name__ == '__main__':
    run_extraction()

