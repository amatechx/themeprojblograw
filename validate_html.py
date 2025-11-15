#!/usr/bin/env python3
"""
HTML Entity Reference Validator
Memvalidasi entity references dalam file HTML untuk memastikan format yang benar
"""

import re
import sys

def validate_html_entities(filepath):
    """Validasi entity references dalam file HTML"""
    issues = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Cari patterns yang bermasalah
    patterns = [
        # Entity references tanpa semicolon
        (r'&[a-zA-Z]+(?!;)', 'Unterminated entity reference (missing semicolon)'),
        # Double-escaped entities
        (r'&amp;', 'Double-escaped entity'),
        # Malformed URLs
        (r'https://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+(?:[a-zA-Z0-9@:$%&+=\?/])?', 'Check for malformed URLs'),
    ]
    
    for line_num, line in enumerate(content.split('\n'), 1):
        for pattern, description in patterns:
            matches = re.finditer(pattern, line)
            for match in matches:
                if description == 'Double-escaped entity':
                    issues.append(f"Line {line_num}: {description} - '{match.group()}'")
                    print(f"[WARNING] {description}")
                    print(f"   Line {line_num}: {line.strip()}")
                    print()
                elif 'Unterminated entity' in description:
                    issues.append(f"Line {line_num}: {description} - '{match.group()}'")
                    print(f"[ERROR] {description}")
                    print(f"   Line {line_num}: {line.strip()}")
                    print()
                elif 'malformed URLs' in description:
                    # Khusus untuk URL yang missing protocol
                    if 'rawtracksqodeinteractivecomlanding' in line:
                        issues.append(f"Line {line_num}: Malformed URL parameter - missing protocol")
                        print(f"[FIX] Malformed URL parameter - missing protocol")
                        print(f"   Line {line_num}: {line.strip()}")
                        print()
    
    if not issues:
        print("[SUCCESS] No entity reference issues found!")
        return True
    else:
        print(f"[FAILED] Found {len(issues)} issues:")
        for issue in issues:
            print(f"  - {issue}")
        return False

if __name__ == "__main__":
    filepath = "contoh aset/Rawtracks –home.html"
    is_valid = validate_html_entities(filepath)
    sys.exit(0 if is_valid else 1)