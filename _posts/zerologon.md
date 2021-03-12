Last week, Microsoft release out of band updates to address multiple zero day vulnerabilities which affect on-premises version of exchange server. According to research firms adversaries started mass exploitation of this vulnerability as early as Jan 2021. Most of these are APT groups interested in cyber espionage, according to the latest reports, cybercriminals are exploiting this vulnerability to  install ransomewared dubbed "DearCry"

Vulnerability detail

- CVE-2021-26855
- CVE-2021-26857
- CVE-2021-27065
- CVE-2021-26858

#### Exchange Servers in MV IP space:

Quick internet wide scan of MV IP space shows few exchange servers exposed to internet in Maldives. 


![source-01](/img/enu16111111.PNG){: .align-left}

Vulnerable to latest Exchange 0day exploits
![source-01](/img/enu161111112.PNG){: .align-left}

#### Mitigations:

If you are running Exchange server on prem 
- Deploy updates
- Invetigate for IOC's: analyze exchange server logs for indicators of compromise. Microsoft released bunch of IOC's to help defenders. https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Sample%20Data/Feeds/MSTICIoCs-ExchangeServerVulnerabilitiesDisclosedMarch2021.csv
- If you are unable to immediately apply updates, follow Microsoft’s alternative mitigations

