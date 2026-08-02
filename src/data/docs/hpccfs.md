# HPCCFS
### Build a Production-Style HPC Cluster from Scratch

HPCCFS is a comprehensive, hands-on guide to building a High Performance Computing (HPC) cluster using **Rocky Linux** and **VirtualBox**. The project walks through the complete deployment of a small-scale cluster while following the same architecture and administration concepts used in real HPC centers.

Rather than simply installing software, this project focuses on understanding **how HPC infrastructure is designed, configured, and managed**.

---

## Repository Highlights

- Complete end-to-end HPC cluster deployment
- Beginner-friendly explanations with production-inspired architecture
- Every configuration tested on a working multi-node cluster
- Covers both **system administration** and **HPC concepts**
- Ideal for students, researchers, and aspiring HPC administrators

---

# Cluster Architecture

```
                           Host Machine
                                │
                      SSH Port Forwarding
                                │
                     ┌────────────────────┐
                     │    Master Node     │
                     │────────────────────│
                     │ Slurm Controller   │
                     │ Munge Authority    │
                     │ OpenLDAP Server    │
                     │ NFS Server         │
                     │ Shared Software    │
                     └─────────┬──────────┘
                               │
                  Internal Cluster Network
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
  ┌──────────────┐      ┌──────────────┐     ┌──────────────┐
  │ Login Node   │      │ Compute 01   │     │ Compute 02   │
  │──────────────│      │──────────────│     │──────────────│
  │ User Login   │      │ slurmd       │     │ slurmd       │
  │ Compilation  │      │ MPI Jobs     │     │ MPI Jobs     │
  │ Job Submit   │      │ Parallel Run │     │ Parallel Run │
  └──────────────┘      └──────────────┘     └──────────────┘
                                             ...
```

---

# Topics Covered

## Cluster Infrastructure

- HPC architecture
- Multi-node cluster deployment
- VirtualBox virtualization
- Rocky Linux installation
- Static networking
- Hostname management
- Passwordless SSH

## Shared Storage

- NFS server
- Shared home directories
- Shared `/apps` filesystem
- Persistent mounts
- Storage hierarchy

## Cluster Services

- Munge authentication
- Slurm Workload Manager
- OpenLDAP centralized authentication
- Centralized user management
- Environment Modules

## Software Stack

- Spack package manager
- Compiler management
- OpenMPI installation
- Shared software deployment
- MPI runtime validation

## Resource Management

- Slurm accounting (slurmdbd)
- MariaDB backend
- QoS policies
- User and account limits
- Fairshare scheduling
- Multifactor priority scheduling
- Resource-aware scheduling

## Validation

- Multi-node MPI execution
- Interactive and batch jobs
- Scheduler verification
- Accounting validation
- Cluster health checks

---

# Technologies

| Category | Technology |
|----------|------------|
| Operating System | Rocky Linux |
| Virtualization | VirtualBox |
| Scheduler | Slurm |
| Authentication | Munge |
| Identity Management | OpenLDAP |
| Shared Storage | NFS |
| MPI | OpenMPI |
| Package Manager | Spack |
| Software Environment | Environment Modules |
| Database | MariaDB |

---

# Documentation Structure

The guide is organized into progressive stages:

- Cluster architecture
- Node provisioning
- Networking
- Shared storage
- Munge authentication
- Slurm configuration
- Shared software stack
- OpenLDAP integration
- Automated user management
- Accounting database
- QoS configuration
- Fairshare scheduling
- Environment Modules
- Cluster validation

Each section includes:

- Step-by-step instructions
- Configuration files
- Commands
- Architecture explanations
- Common pitfalls
- Troubleshooting notes
- Real HPC concepts

---

# Intended Audience

- Students learning HPC
- Linux System Administrators
- HPC Application Engineers
- Researchers
- HPC enthusiasts
- Anyone interested in understanding cluster internals

---

# Repository Links

### GitHub Repository

https://github.com/CISSSCO/hpccfs

### Documentation Website

https://cisssco.github.io/hpccfs

### Author

GitHub: https://github.com/CISSSCO

Portfolio: https://ciscoramon.netlify.app

LinkedIn: https://www.linkedin.com/in/abhi581b

---

# Contributing

Contributions, suggestions, bug reports, and improvements are always welcome.

If you find an issue with the documentation or setup process, please open an Issue or submit a Pull Request.

---

## License

This project is released under the MIT License.

---

⭐ If you found this project useful, consider giving it a star!
