#### Introduction:

DCSync attacks allow an attacker to impersonate a domain controller and request password hashes from other domain controllers. This attack simulates the behavior of a domain controller and asks other domain controllers to replicate information using the Directory Replication Service Remote Protocol (MS-DRSR).  utilises the Directory Replication Service Remote Protocol with the DSGetNCChanges function to request password hashes from the Primary DC.

#### How the DCSync Attack Works?

To perform a DCSync attack, We must have compromised a user with the below permissions.
+ Replicating Directory Changes All
+ Replicating Directory Changes

By default in activedirectory, members of the below groups have those permissions.
+ Administrators
+ Domain Admins
+ Enterprise Admins 


#### Attack
For this scenario i have configured a user with below permissions in my Lab environment.
+ Replicating Directory Changes All
+ Replicating Directory Changes

#### Discovery

Using bloodhound i discovered the attack path, smilarly we can discover this using powerview

The user PTRACE@CONTOSO.LOCAL has the DS-Replication-Get-Changes privilege on the domain CONTOSO.LOCAL

![source-01](/img/dcsyn1.PNG){: .align-left}

We can use secretdump for Dcsync

![source-01](/img/dcsyn3.PNG){: .align-left}

#### Detection:

There are someways to detect DCsync attack.

+ Event ID 4662 Monitoring

Event 4662: An object was performed on an object.

![source-01](/img/dcsyn4.PNG){: .align-left}

+ Network Monitoring1 - DsGeNCChange

#### Defense 
