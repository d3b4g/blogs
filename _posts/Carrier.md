
#### Background
Carrier is a retired vulnerable VM from Hack. This box is really fun since it allows us to play with some BGP Hijacking which i have not seen from any challenges i solved so far.


To begin the enumeration process, a TCP/UDP port scan was run against the target using nmap. The purpose of scan is to quickly determine which ports are open and which services are running. 

##### OS Information:
Based on the Apache version, it looks like we are dealing with Xenial / Ubuntu 16.04 based system.

###### Open Ports:
In addition to usual ports, 22 and 80 UDP port 161 is open. UDP 161 is the standard SNMP port.There is also a filtered ftp port showing.

![source-01](/img/Screenshot_2020-05-27_16-31-11.png){: .align-left}
Browsing to the site we see a login page with weird error messeges. Lets start directory enumeration.

```python
➜  carrier wfuzz --hc=404 -z file,/usr/share/wordlists/dirb/common.txt http://10.10.10.105/FUZZ

Warning: Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.

********************************************************
* Wfuzz 2.4.5 - The Web Fuzzer                         *
********************************************************

Target: http://10.10.10.105/FUZZ
Total requests: 4614

===================================================================
ID           Response   Lines    Word     Chars       Payload                                                                                              
===================================================================

000000001:   200        63 L     105 W    1509 Ch     ""                                                                                                   
000000011:   403        11 L     32 W     291 Ch      ".hta"                                                                                               
000000012:   403        11 L     32 W     296 Ch      ".htaccess"                                                                                          
000000013:   403        11 L     32 W     296 Ch      ".htpasswd"                                                                                          
000001114:   301        9 L      28 W     310 Ch      "css"                                                                                                
000001196:   301        9 L      28 W     312 Ch      "debug"                                                                                              
000001313:   301        9 L      28 W     310 Ch      "doc"                                                                                                
000001648:   301        9 L      28 W     312 Ch      "fonts"                                                                                              
000001998:   301        9 L      28 W     310 Ch      "img"                                                                                                
000002021:   200        63 L     105 W    1509 Ch     "index.php"                                                                                          
000002179:   301        9 L      28 W     309 Ch      "js"                                                                                                 
000003588:   403        11 L     32 W     300 Ch      "server-status"                                                                                      
000004087:   301        9 L      28 W     312 Ch      "tools"                                                                                              


```


