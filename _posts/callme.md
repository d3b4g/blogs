---
layout: post
title:  "ROP Emporium - Split"
date:   2020-05-15 14:07:20
categories: [ROP]
excerpt: "This is the third challenge from ROP Emporium, named as **Callme**. In this challenge we need to execute callme_one(), callme_two() and callme_three() function  in sequential order to get the flag. Alonge the way i am going to explore more advance usage of radare2."

comments: true
---


## Introduction
This is the third challenge from ROP Emporium, named as **Callme**. In this challenge we need to execute callme_one(), callme_two() and callme_three() function  in sequential order to get the flag. This challenge add more levels of complexity. Alonge the way i am going to explore the more advance usage of radare2.

> Challenge Description: 
Reliably make consecutive calls to imported functions. Use some new techniques and learn about the Procedure Linkage Table.

###### Tools Used:


+ ROPGadget 
+ Pwntools  
+ Radare2   
+ dgb& gef
 
###### Prerequisites
There are a few basic computing concepts used in this walkthrough the reader should be familiar with:

+ Intel x86/x86-64 processor instruction set and architecture
+ ELF binary structure
+ Dynamic linking, relocatable code and Procedure link table and Global offset table (PLT/GOT)
+ Virtual memory
+ Stack frames
+ Return oriented programming and stack overflow
+ Stack smashing mitigation techniques such as NX, ASLR and canaries

###### About the Binary:
Our binary is usual ELF executable in 64-bit architecture.Lets check what protection are on this binary, using rabin2, which comes with **radare2 framework**.

![source-01](/img/Screenshot_2020-05-19_19-13-15.png){: .align-left}


The binary is NX protected which means that we won’t have an executable stack, PIE isn't enabled and the binary has ASLR disabled.

## Analyzing the 64bit ELF binary

Lets load the binary with radare2 and type aaaa command to analyze it. And use afl command to list the functions. We can also output it as JSON using this command aflj~{}

![source-01](/img/Screenshot_2020-05-19_18-52-31.png){: .align-left}

+ -d  – Open in the debug mode
+ aas – Analyze functions, symbols and more


Here we can see three interesting functions:

+ **callme_one()**
+ **callme_two()**
+ **callme_three()**

There is also a symbol called usefulFunction / usefulGadgets.

So lets disassemble the binary and see what these fucntions does!

###### callme_one()


![source-01](/img/Screenshot_2020-05-13_08-44-57.png){: .align-left}


The only interesting thing here for us is, its calling the function name **pwnme()** which have overflow vulnerability.

###### callme_two()


![source-01](/img/Screenshot_2020-05-13_08-48-45.png){: .align-left}


Just like in retwin challenge, we have a 32 byte buffer that can be overflowed with fgets that takes 96 characters from the user.


###### callme_three()


![source-01](/img/Screenshot_2020-05-13_08-34-01.png){: .align-left}


This function directly call system with **/bin/ls**, which list the files in current working directory and there is also usefullstring which **/bin/cat flag.txt**. so we need to return to this function to exploit the binary successfuly. 

###### Usefullfunction()

![source-01](/img/Screenshot_2020-05-20_11-37-48.png	){: .align-left}


Three functions are being called with three arguments.
+ callme_one
+ callme_two 
+ callme_three 

Unlike x86, x64 needs to store the argument in a register.First argument: rdi, second argument: rsi, third argument: rdx.

The usefulFunction function uses the mov instruction to store the argument in a register.
However, the flags are not output because the arguments are (4, 5, 6).

###### UsefulGadget()
This function execute the pop instruction in the order rdi, rsi, rdx, the ret instruction is executed.


## Fuzzing:
So now the binary analysis is out of the way. Lets start fuzzing the binary. Generate the unique pattern and send to the program.

#### rarun2 profile
In radare2, when it gets to interact with a debuggee, rarun2 is your go-to tool.

This program is used as a launcher for running programs with different environments, arguments, permissions, directories and overridden default file descriptors.
Source: man rarun2

First, create a rarun profile as shown above. Then, open the debuggee in radare2 and load this profile using the -r flag:
$ cat profile.rr2 
#!/usr/bin/rarun2
stdin=!./exp

Load the program in debug mode and use dc to execute it:

```
gef➤  pattern create 100
[+] Generating a pattern of 100 bytes
aaaaaaaabaaaaaaacaaaaaaadaaaaaaaeaaaaaaafaaaaaaagaaaaaaahaaaaaaaiaaaaaaajaaaaaaakaaaaaaalaaaaaaamaaa
[+] Saved as '$_gef0'
gef➤  r
Starting program: /root/Desktop/ROP/split/split/split 
split by ROP Emporium
64bits

Contriving a reason to ask user for data...
> aaaaaaaabaaaaaaacaaaaaaadaaaaaaaeaaaaaaafaaaaaaagaaaaaaahaaaaaaaiaaaaaaajaaaaaaakaaaaaaalaaaaaaamaaa

Program received signal SIGSEGV, Segmentation fault.


```
As expected the program crashed and we have a valid crash scenario here.We have overwritten rsp with our unique patters.

![source-01](/img/Screenshot_2020-05-15_10-20-53.png){: .align-left}




###### Calculating offset

Copy the value in RSP to pattern offset tool, to get exatch offset
```
gef➤  pattern offset 0x00007fffffffe048
[+] Searching '0x00007fffffffe048'
[+] Found at offset 40 (little-endian search) likely
[+] Found at offset 33 (big-endian search) 
gef➤  

```

## Building the ROP-Chain

Lets find the building blocks that need to build a ROP chain.

######  UsefulString “/bin/cat flag.txt” 

Using rabin2 to find all the strings in the binary


![source-01](/img/Screenshot_2020-05-15_14-55-41.png){: .align-left}


######  sytem@plt

Using objdump grab the address of system@plt.

![source-01](/img/Screenshot_2020-05-16_07-41-34.png	){: .align-left}


######  pop rdi; ret gadget

I used ROPGadget to find the pop rdi ret.

![source-01](/img/Screenshot_2020-05-14_08-23-29.png	){: .align-left}



#### Exploitation 

Now we have everything we need to put together our first ROPChain, let’s craft the payload.

+ Junk + pop_rdi + bin_cat + system_plt

+ b"A" * 40 + 0x0000000000400883 + 0x00601060 + 0x4005e0



Final exploit using pwntools:

```
```
Running the exploit!! we got the flag!

![source-01](/img/Screenshot_2020-05-16_13-29-52.png){: .align-left}


###### End 

Thats the end of split challenge,I learned how to build my first simple ROPChain and simple usage of radare2.

> Code for this challenge  https://github.com/d3b4g/ROP-Emporium