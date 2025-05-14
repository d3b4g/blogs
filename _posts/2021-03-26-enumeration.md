---
layout: post
title:  "Active Directory Red Team - Enumeration"
date:   2021-03-26 14:07:20
categories: [Active Directory Red Team]
excerpt: "In this module I will cover how you can enumerate Microsoft Active Directory with Powerview and gather critical information about the Active Directory and its components." 

comments: true
---


### Active Directory Red Team (Enumeration)

Enumeration is the key for any successful engagement, in this post I will cover how you can enumerate Microsoft Active Directory with Powerview and gather critical information about the Active Directory and its components. Powerview includes many commands to enumerate and manage the active directory. I will demonstrate the commands I mostly use in Active Directory assessments.

> If you have not read my previous post about RedTeam Lab setup, please read [RedTeam Lab Setup]( https://ptrace.net/articles/2021-02/ad-redteam-intro)

In this post im going to cover the following.

-    Enumerating Domain
-    Enumerating AD Users
-    Enumerating AD Groups
-    Enumerating AD Computers
-    Enumerating Domain ACLs with Powerview
-    Enumerating Group Policy Objects (GPOs)
-    Enumerating AD Trusts
-    Enumerating Domain policy


#### Enumerating Domain

##### Description 
In Active Directory terms, a domain is an area of a network organized by a single authentication database. It is a logical grouping of objects on a network. In Active Directory, domains are controlled by the domain controller.

> Get-NetDomain 

This command will give information about the current domain controller.

![source-01](/img/enu1.PNG){: .align-left}

**-Domain** parameter in **Get-Net-Domain** cmdlet allow you to specify domain name you want enumerate.

![source-01](/img/enu2.PNG){: .align-left}


#### Enumerating AD Users

##### Description
A user object in AD is used to represent a real user in an organizational network environment.

 > Get-NetUser
 
This command enumerates the users and dump usefull informations about the user.

![source-01](/img/enu3.PNG){: .align-left}

The output of the Get-Net User cmdlet can be a bit messy, you can PIPE Get-Net User cmdlet and pass to **SELECT-OBJECT** cmdlet and output desired results.

![source-01](/img/enu4.PNG){: .align-left}

> Get-Net User -SPN

This command enumerates kerberoastable users. **Kerberoasting** abuses traits of the Kerberos protocol to harvest password hashes for Active Directory user accounts with servicePrincipalName. This is usualy an entry point for pentesters.

![source-01](/img/enu18.PNG){: .align-left}


#### Enumerating AD Groups

##### Description
The Active Directory groups are a collection of Active Directory objects. The group can include users, computers, other groups, and other AD objects.

> Get-NetGroupMembers

This command allow you to enumerate group membership from active directory, some of the usefull groupmemberships to enumerate are 

- Domain Admin Group
- Enterprise Admin Group
- Account operator Group
- Server Operator Group

![source-01](/img/enu5.PNG){: .align-left}

#### Enumerating AD Computers

##### Description

Computer objects are used to uniquely identify and manage Windows-based domain clients within Active Directory. They are used to specify computer names, locations, properties and access rights.

> Get-NetComputer

This command enumerate Active Directory computer objects, display bunch of useful informations.

![source-01](/img/enu8.PNG){: .align-left}

As you can see **Get-NetComputer** cmdlet gives a lot of information you can always use the  pipe cmdlet in powershell to get desired results.

![source-01](/img/enu9.PNG){: .align-left}


#### Enumerating Domain ACLs 

##### Description:

Access Control Lists are the settings that define what objects get access to other objects in Active Directory. 
There are two types of ACLs:

- **Discretionary access control list (DACL):** This defines the security principals which are either granted or denied access to a securable object.

- **System access control list (SACL):** This grants power to administrators to log the access attempts made to secured objects.

![source-01](/img/enu10.PNG){: .align-left}

This cmdlet outputs the list of ACEs applied to the object. 

![source-01](/img/enu15.PNG){: .align-left}


#### Enumerating Group Policy Objects (GPOs)

##### Description
Group Policy Objects are Active Directory containers used to store groupings of policy settings. These objects are then linked to specific sites, domains, or organizational units (OUs).

> **Get-NetGPO** 

This command enumerate of all current GPOs in a given domain.

![source-01](/img/enu6.PNG){: .align-left}

If you want check GPO's applied to a specific computer you can use the below Powerview command

>**Get-DomainGPO -ComputerIdentity  "ComputerName"**

#### Enumerating AD Trusts
 
##### Description:
 
Active Directory trust is a secured, authentication communication channel between entities, such as AD DS domains, forests. Trusts enable you to grant access to resources to users, groups, and computers across entities.

**Trusts Direction:**
- **Two-way trust (Bi-directional):** Users from Domain A can access resources in Domain B
and vice versa.

- **One-way trust (Unidirectional):** Users in the trusted domain can access resources in the
trusting domain but the reverse is not true

**Trusts Transitivity:**

- **Parent-child trust:** It is created automatically between the new domain and the domain
that precedes it in the namespace hierarchy, whenever a new domain is added in a tree.

- **Tree-root trust:** It is created automatically whenever a new domain tree is
added to a forest root. This trust is always two-way transitive.

**External Trusts:** Between two domains in different forests when forests do not have a trust
relationship. It can be one-way or two-way and is nontransitive.


> Get-NetDomainTrust 

This command enumerate all domain trusts including parent, child and external trust.

![source-01](/img/enu11.PNG){: .align-left}

**Get-NetForestDomain | Get-NetDomainTrust**

Piping the result of **Get-NetforestDomain** to **Get-NetDomainTrust**  enumerate all the trusts of all the domains found 

![source-01](/img/enu12.PNG){: .align-left}

We can also enumerate this information with .NET class "Domain.GetAllTrustRelationships"

![source-01](/img/enu14.PNG){: .align-left}


#### Enumerating Domain Policy

##### Description

The domain password policy allows you to specify a range of password security options, including how frequently users change their passwords

> Get-DomainPolicy 

Returns the default domain policy or the domain controller policy for the current domain or a specified domain/domain controller.

![source-01](/img/enu13.PNG){: .align-left}

> (Get-DomainPolicy)."KerberosPolicy" 

This command enumerates the Kerberos policy, this information will be very useful in Kerberos attacks.

> (Get-DomainPolicy)."SystemAccess" 

This command enumerate default SystemAccess policy or password policy.

#### Conclusion

In this post, I covered how you can collect important information about Active Directory and its components using PowerView for initial compromise.

#### Refference / Resources 

- [Powersploit](https://powersploit.readthedocs.io/en/latest/Recon/Get-ForestDomain/) - PowerSploit Documentation
- [Specterops](https://posts.specterops.io/a-red-teamers-guide-to-gpos-and-ous-f0d03976a31e) - A Red Teamer’s Guide to GPOs and OUs
- [Microsoft](https://docs.microsoft.com/en-us/powershell/module/addsadministration/get-adtrust?view=win10-ps) - Active Directory PowerShell Documentation
- [Microsoft](https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/active-directory-domain-services) - Active Directory Documentation
- [msmvps.com](https://blogs.msmvps.com/acefekay/2016/11/02/active-directory-trusts/) - Active Directory Trusts

