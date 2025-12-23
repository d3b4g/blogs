---
layout: post
title: "Crackme Challenge: Buffer Overflow to Bypass Authentication"
date: 2025-12-23
categories: [Crackme, Reverse-Engineering]
tags: [radare2, buffer-overflow, x64, linux]
description: "Solving a crackme challenge using radare2 - exploiting a stack-based buffer overflow to bypass password authentication."
---

The goal of this challenge is to print "Access Granted" through whatever means necessary. While patching can solve it quickly, the intended solution involves understanding calling conventions, stack behavior, and how user input flows through a program.

<!--more-->

## Initial Analysis

First, let's examine the binary:

```bash
$ file crackme
crackme: ELF 64-bit LSB executable, x86-64, version 1 (GNU/Linux), 
statically linked, not stripped
```

Good - it's not stripped, so we have symbols to work with.

## Analyzing with radare2

### Main Function

```bash
$ r2 -q -c 'aaa; s main; pdf' crackme
```

```nasm
main:
  0x00401b23      mov eax, 0
  0x00401b28      call sym.AuthenticateUser
  0x00401b2d      mov eax, 0
  0x00401b33      ret
```

Main simply calls `AuthenticateUser()`. Let's dig deeper.

### AuthenticateUser Function

```bash
$ r2 -q -c 'aaa; s sym.AuthenticateUser; pdf' crackme
```

Key parts:

```nasm
0x00401a58      mov dword [var_20h], 0     ; result = 0

; Read username
0x00401a6e      call sym.__printf          ; "Enter Username: "
0x00401a89      call sym.__isoc99_scanf    ; scanf("%s", username)

; Read password  
0x00401a9d      call sym.__printf          ; "Enter password for: "
0x00401ac9      call sym.__isoc99_scanf    ; scanf("%s", password) ← VULN

; Check password
0x00401adc      call sym.checkPassword     ; checkPassword(password, &result)

; Branch on result
0x00401ae4      cmp eax, 1                 ; if (result == 1)
0x00401ae7      jne 0x401af5               ;   goto fail
0x00401aee      call sym.grantAccess       ;   grantAccess() ← TARGET
```

## The Vulnerability

Looking at the stack layout:

| Variable | Offset | Purpose |
|----------|--------|---------|
| `var_20h` | rbp-0x20 | **Result flag** (0=fail, 1=success) |
| `var_1ch` | rbp-0x1c | Password buffer |
| `var_14h` | rbp-0x14 | Username buffer |

The critical insight: **password buffer is only 4 bytes before the result variable!**

```
Stack Layout:
┌─────────────────────┐
│  Username (8 bytes) │ [var_14h]  rbp-0x14
├─────────────────────┤
│  Password (8 bytes) │ [var_1ch]  rbp-0x1c
├─────────────────────┤
│  Result (4 bytes)   │ [var_20h]  rbp-0x20  ← TARGET
└─────────────────────┘
```

`scanf("%s")` reads unbounded input. If we write more than 4 bytes as password, we overflow into the result variable.

## The Exploit

Distance from password to result: `0x20 - 0x1c = 4 bytes`

**Payload:**
- 4 bytes padding (fill password buffer)
- `\x01` to set result = 1

```bash
$ echo -e 'user\nAAAA\x01' | ./crackme
Enter Username: Enter password for: user
Access Granted
```

### Python Exploit

```python
#!/usr/bin/env python3
import subprocess

username = b"user"
password = b"AAAA" + b"\x01"  # 4 bytes padding + set result to 1

payload = username + b"\n" + password + b"\n"

proc = subprocess.run(["./crackme"], input=payload, capture_output=True)
print(proc.stdout.decode())
```

## Why the Stack Canary Didn't Help

Yes, there's a stack canary (`fs:[0x28]`) - but it only protects against overwriting the return address. Overwriting **local variables** before the canary goes undetected.

## Alternative: Patching

If you just want quick access:

```bash
$ r2 -w crackme
[0x00401ae7]> s 0x00401ae7
[0x00401ae7]> wa nop; nop  # NOP out the JNE
[0x00401ae7]> q
```

Now any input grants access.

## Key Takeaways

1. **`scanf("%s")` is dangerous** - always use bounded reads like `fgets()` or `scanf("%8s")`
2. **Stack layout matters** - local variables can be overwritten before reaching the canary
3. **Static analysis reveals structure** - radare2's `pdf` command quickly shows the control flow
4. **The "intended" solution** rewards understanding stack behavior over simple patching

---

*Challenge source: [crackmes.one](https://crackmes.one)*
