
# CerrFix

**cerrfix** is a lightweight, extensible command-line tool designed to
help users and system administrators diagnose and resolve **common
errors on Linux-based systems**. It works by matching known error
signatures from logs against a curated, human-readable knowledge base of
fixes and presenting safe, actionable solutions.

The tool is intentionally **non-intrusive** and **transparent**, making
it suitable for personal machines, servers, development environments,
and shared systems.

—

# Motivation

Linux systems frequently encounter recurring problems such as:

-   Compiler and linker errors
-   Missing headers and shared libraries
-   Runtime loader failures
-   Permission and execution issues
-   Environment and path misconfigurations

While solutions often exist, they are:

-   Repeated across users and cattered across forums, emails, or chat
    logs
-   Poorly documented or forgotten over time

**cerrfix** converts this operational knowledge into a structured,
searchable, and reusable fix repository.

—

# Key Features

-   Rule-based error detection using regex patterns
-   YAML-based fix definitions
-   Human-readable and auditable fixes
-   Optional fix script generation
-   CLI-first design (no background services)
-   Works across diverse Linux environments
-   Extensible fix repository without code changes

—

# Project Structure

``` text
cerrfix/
├── bin/
│   └── cerrfix                # CLI entrypoint
├── cli.py                     # Main logic
├── core.py                    # core functions
├── fixes/                     # Fix definitions (YAML)
├── schema/                    # schema definition 
│   └── fix_schema.py          # schema definition file
├── utils/                     # path and validation
│   └── paths.py               # path
│   └── validation.py          # validation
├── setup-env.sh               # PATH setup script
├── README.org
└── CONTRIBUTING.org
```

—

# Requirements

## Runtime

-   Linux
-   Python \>= 3.8

—

# Installation

## Clone the Repository

``` bash
git clone https://github.com/CISSSCO/cerrfix.git
cd cerrfix
```

## Run Installer

``` bash
./install.sh
```

## Enable CLI Access

``` bash
source setup-env.sh
```

After this, the `cerrfix` command will be available in your shell.

—

# Usage

## Diagnose an Error Log

``` bash
cerrfix diagnose error.log
```

## Add a New Fix

``` bash
cerrfix add path/to/fix.yaml
```

## Update an Existing Fix

``` bash
cerrfix update path/to/fix.yaml
```

## Remove a Fix

``` bash
cerrfix remove issue_id
```

## List Available Fixes

``` bash
cerrfix list
```

## Show Fix Details (Raw yaml)

``` bash
cerrfix show issue_id
```

## Search Fixes

``` bash
cerrfix search linker
```

## Show statistics

``` bash
cerrfix stats
```

# Example Output

``` text
✅ Issue Detected!
Issue ID    : SHARED_LIB_NOT_FOUND_001
Description : Shared library not found at runtime
Category    : system
Severity    : error

🔧 Suggested Fix:
  $ export LD_LIBRARY_PATH=/path/to/lib:$LD_LIBRARY_PATH

🛠 Fix script generated:
  source fix_SHARED_LIB_NOT_FOUND_001.sh
```

—

# Design Philosophy

-   **Safety first**: No automatic destructive actions
-   **Transparency**: All fixes are human-readable
-   **Extensibility**: Add fixes without touching code
-   **Portability**: Avoid site-specific assumptions

—

# Disclaimer

cerrfix provides **suggested fixes** based on known patterns. Always
review generated scripts before executing them.

The authors are not responsible for unintended system changes.

—

# Maintainer

-   Name: Cisco Ramon
-   Role: Creator & Maintainer
-   Focus: Linux systems, tooling, and developer productivity
