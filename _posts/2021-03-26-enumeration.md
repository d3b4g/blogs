---
layout: post
title:  "Active Directory Red Team - Enumeration"
date:   2021-03-26 14:07:20
categories: [Active Directory Red Team]
excerpt: "A comprehensive guide to enumerating Microsoft Active Directory with PowerView, covering domains, users, groups, computers, ACLs, GPOs, trusts, and policies." 
image:
  feature: adlabs.png
comments: true
---

# Active Directory Red Team: Enumeration Techniques

Enumeration is the cornerstone of any successful red team engagement. This guide covers how to effectively enumerate Microsoft Active Directory using PowerView to gather critical information about AD components. PowerView provides numerous commands for enumeration and management, and I'll demonstrate the most valuable ones I regularly use in AD assessments.

> **Prerequisites:** If you haven't set up your Red Team lab environment yet, please read my previous guide: [RedTeam Lab Setup](https://ptrace.net/articles/2021-02/ad-redteam-intro)

## What You'll Learn

In this comprehensive guide, we'll cover:

- [Enumerating Domains](#enumerating-domains)
- [Enumerating AD Users](#enumerating-ad-users)
- [Enumerating AD Groups](#enumerating-ad-groups)
- [Enumerating AD Computers](#enumerating-ad-computers)
- [Enumerating Domain ACLs](#enumerating-domain-acls)
- [Enumerating Group Policy Objects (GPOs)](#enumerating-group-policy-objects)
- [Enumerating AD Trusts](#enumerating-ad-trusts)
- [Enumerating Domain Policies](#enumerating-domain-policies)

Let's dive into each section and explore the powerful enumeration techniques at our disposal.

---

## Enumerating Domains {#enumerating-domains}

### What is an AD Domain?

In Active Directory terms, a domain is a network area organized by a single authentication database. It represents a logical grouping of objects on a network, controlled by domain controllers.

### Key Commands

```powershell
# Get information about the current domain controller
Get-NetDomain
```

![Domain information output]({{ site.url }}/img/enu1.PNG)

You can also specify a particular domain to enumerate using the `-Domain` parameter:

```powershell
# Enumerate a specific domain
Get-NetDomain -Domain example.local
```

![Domain parameter example]({{ site.url }}/img/enu2.PNG)

---

## Enumerating AD Users {#enumerating-ad-users}

### What are AD User Objects?

User objects in Active Directory represent real users in an organizational network environment. They contain critical information about identities in your organization.

### Key Commands

```powershell
# Enumerate all users in the domain
Get-NetUser
```

![User enumeration output]({{ site.url }}/img/enu3.PNG)

The output from `Get-NetUser` can be overwhelming. You can pipe the results to `Select-Object` to display only the information you need:

```powershell
# Filter user information for readability
Get-NetUser | Select-Object name, samaccountname, description
```

![Filtered user output]({{ site.url }}/img/enu4.PNG)

#### Finding Kerberoastable Users

Kerberoasting is a popular attack technique that targets service accounts:

```powershell
# Enumerate users with SPNs (Service Principal Names)
Get-NetUser -SPN
```

![Kerberoastable users]({{ site.url }}/img/enu18.PNG)

> **Security Note:** Kerberoasting abuses the Kerberos protocol to harvest password hashes for AD accounts with SPNs. This is often an entry point for penetration testers.

---

## Enumerating AD Groups {#enumerating-ad-groups}

### What are AD Groups?

Active Directory groups are collections of AD objects that can include users, computers, other groups, and various AD objects. They're essential for permission management.

### Key Commands

```powershell
# Enumerate group memberships
Get-NetGroupMembers -GroupName "Domain Admins"
```

![Group membership]({{ site.url }}/img/enu5.PNG)

### Critical Groups to Enumerate

When performing AD enumeration, focus on these high-value groups:

- **Domain Admins** - Full control of the domain
- **Enterprise Admins** - Control across the entire forest
- **Account Operators** - Can manage user accounts
- **Server Operators** - Can manage domain servers

---

## Enumerating AD Computers {#enumerating-ad-computers}

### What are AD Computer Objects?

Computer objects uniquely identify and manage Windows-based domain clients within Active Directory. They specify computer names, locations, properties, and access rights.

### Key Commands

```powershell
# Enumerate all computer objects
Get-NetComputer
```

![Computer objects]({{ site.url }}/img/enu8.PNG)

The `Get-NetComputer` cmdlet provides extensive information. Use PowerShell's piping capabilities to filter for specific details:

```powershell
# Filter for specific operating systems
Get-NetComputer | Where-Object {$_.operatingsystem -like "*Server 2016*"}
```

![Filtered computer objects]({{ site.url }}/img/enu9.PNG)

---

## Enumerating Domain ACLs {#enumerating-domain-acls}

### Understanding ACLs in Active Directory

Access Control Lists define what objects can access other objects in Active Directory. They're crucial for understanding permission structures and identifying potential privilege escalation paths.

### Types of ACLs

- **Discretionary Access Control Lists (DACLs)**: Define which security principals are granted or denied access to objects
- **System Access Control Lists (SACLs)**: Allow administrators to log access attempts made to secured objects

### Key Commands

```powershell
# Get ACLs for a specific object
Get-ObjectAcl -SamAccountName "Domain Admins" -ResolveGUIDs
```

![ACL enumeration]({{ site.url }}/img/enu10.PNG)

This command outputs the list of Access Control Entries (ACEs) applied to the object:

![ACE details]({{ site.url }}/img/enu15.PNG)

---

## Enumerating Group Policy Objects {#enumerating-group-policy-objects}

### What are GPOs?

Group Policy Objects are Active Directory containers that store groupings of policy settings. These objects are linked to specific sites, domains, or organizational units (OUs).

### Key Commands

```powershell
# Enumerate all GPOs in the current domain
Get-NetGPO
```

![GPO enumeration]({{ site.url }}/img/enu6.PNG)

To check GPOs applied to a specific computer, use:

```powershell
# Check GPOs applied to a specific computer
Get-DomainGPO -ComputerIdentity "WORKSTATION01"
```

---

## Enumerating AD Trusts {#enumerating-ad-trusts}

### Understanding AD Trusts

Active Directory trusts are secured authentication channels between entities like AD domains and forests. They enable access to resources across different domains and forests.

### Trust Types and Directions

#### Trust Directions
- **Two-way trust (Bi-directional)**: Users from Domain A can access resources in Domain B and vice versa
- **One-way trust (Unidirectional)**: Users in the trusted domain can access resources in the trusting domain, but not the reverse

#### Trust Types
- **Parent-child trust**: Created automatically between a new domain and its parent
- **Tree-root trust**: Created automatically when a new domain tree is added to a forest root
- **External trusts**: Between domains in different forests without forest trust relationships

### Key Commands

```powershell
# Enumerate all domain trusts
Get-NetDomainTrust
```

![Domain trusts]({{ site.url }}/img/enu11.PNG)

To enumerate trusts across all domains in a forest:

```powershell
# Enumerate trusts across all domains
Get-NetForestDomain | Get-NetDomainTrust
```

![Forest domain trusts]({{ site.url }}/img/enu12.PNG)

You can also use .NET classes directly:

```powershell
# Using .NET classes for trust enumeration
([System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()).GetAllTrustRelationships()
```

![.NET trust relationships]({{ site.url }}/img/enu14.PNG)

---

## Enumerating Domain Policies {#enumerating-domain-policies}

### Why Domain Policies Matter

Domain policies, especially password policies, provide critical security information. Understanding these policies can reveal potential weaknesses in authentication mechanisms.

### Key Commands

```powershell
# Get domain policy information
Get-DomainPolicy
```

![Domain policy]({{ site.url }}/img/enu13.PNG)

For specific policy types:

```powershell
# Get Kerberos policy settings
(Get-DomainPolicy)."KerberosPolicy"

# Get password policy settings
(Get-DomainPolicy)."SystemAccess"
```

> **Attacker Insight:** Kerberos policy information is particularly valuable for planning Kerberos-based attacks.

---

## Conclusion

Effective enumeration is the foundation of successful Active Directory penetration testing and red team operations. PowerView provides a comprehensive toolkit for gathering critical information about AD components, helping you identify potential security weaknesses and attack vectors.

By methodically enumerating domains, users, groups, computers, ACLs, GPOs, trusts, and policies, you can build a complete picture of the AD environment and identify the most promising paths for privilege escalation and lateral movement.

## References & Resources

- [PowerSploit Documentation](https://powersploit.readthedocs.io/en/latest/Recon/Get-ForestDomain/)
- [SpecterOps: A Red Teamer's Guide to GPOs and OUs](https://posts.specterops.io/a-red-teamers-guide-to-gpos-and-ous-f0d03976a31e)
- [Microsoft: Active Directory PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/module/addsadministration/get-adtrust?view=win10-ps)
- [Microsoft: Active Directory Domain Services](https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/active-directory-domain-services)
- [MSMVPS: Active Directory Trusts](https://blogs.msmvps.com/acefekay/2016/11/02/active-directory-trusts/)

