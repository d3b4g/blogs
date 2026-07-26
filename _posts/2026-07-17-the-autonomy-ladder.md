---
layout: post
title:  "The Autonomy Ladder"
date:   2026-07-17 09:00:00
categories: [Offensive AI]
excerpt: "Every impressive agent demo is quietly running near the top of the ladder. A way to think about how much a security agent should do without a human in the loop, and where the line has to sit."
comments: true
---

Every impressive agent demo I have seen is running near the top of this ladder. Full freedom to act, nobody in the loop, a clean compromise in a few minutes. That is what makes the demo look like magic. It is also the least safe way to run one of these systems against anything you actually care about.

The question worth asking is not how autonomous an agent can be. It is how autonomous it should be, for this action, on this target. Those are different questions, and the gap between them is where most of the risk lives.

## Why "how autonomous?" is the wrong question

Autonomy usually gets treated as a single switch. The agent is either supervised or it is not, and you flip the setting once at the start of a run.

That framing is the problem. Autonomy is not one setting. It is a decision you make continuously, per action and per target, and the input to that decision is not how confident the model sounds. It is blast radius and reversibility. If this action goes wrong, how bad is it, and can I undo it?

A model cannot answer that for you. It has no real sense of blast radius, which is exactly the judgment you cannot hand to it. The agent proposes. A human, or a control a human built, decides how much rope it gets for this particular move.

## The ladder

I think about agent autonomy as a set of rungs, from the least freedom to act without a human to the most.

**Rung 0: Advisory.** No tool access at all. The model reads what you give it and suggests. You run everything yourself. This is where most teams should start, and honestly where a lot of them should stay for now.

**Rung 1: Read-only recon.** The agent can gather information but cannot change anything. Passive lookups, port scans, banner grabbing, directory discovery. Reversible, low blast radius, generally safe to let run across a wide scope.

**Rung 2: Non-destructive interaction.** Crafted requests, testing authentication with credentials it already found, read-only queries against a service. It might trip detection, but it does not change the state of the target.

**Rung 3: State-changing exploitation, gated.** Now it can run an exploit, write a file, create a session. This is the first rung where a mistake leaves a mark. It should only run with allowlisted targets, rate limits, an approved-technique list, and a human signing off on each action.

**Rung 4: Chained exploitation.** Pivoting, lateral movement, working across multiple hosts. Bounded scope, with supervised checkpoints between stages.

**Rung 5: Fully autonomous, including destructive.** Credential spraying, restarting services, uploading payloads, all with no approval. On a live production network, this rung should basically never run unsupervised.

The demos people share are almost always Rung 5 against a target that was built to be attacked. That is the one situation where Rung 5 is safe, and the one situation you are never in on a real engagement.

## Where the line sits

For anything touching production, the line sits between Rung 2 and Rung 3.

The moment an action changes the state of the target, a human decides. Not because exploitation is inherently dangerous and enumeration is not, but because state change is where reversibility runs out. A read-only test that happens to be an exploit is still something you can walk back. A single write to the wrong config file may not be.

Reversibility is the real axis, and it does not always line up with how dangerous an action looks. Some of the most damaging things on an engagement do not look like exploitation at all. Authentication testing that locks out a live account. A scan aggressive enough to knock over a fragile service. An agent optimising for a flag weighs none of that. It sees a path and takes it.

## Autonomy is a dynamic setting, not a dial you set once

Even once you have picked a rung, you are not finished, because the right rung changes during the engagement.

Autonomy should drop the moment the environment starts behaving like it noticed you. A credential rotates. A host goes quiet. A response pattern shifts in a way you did not cause. Those are not obstacles to push through. They are reasons to move the agent down a rung and look more closely.

This is the part a benchmark will never teach. A benchmark sits still. It does not adapt, so an agent tuned to score well on one learns to keep escalating, to treat every closed door as something to force. Against a real environment that is the wrong instinct. What you actually want is an agent that gets more careful as the target gets more interesting, not less.

## Where I draw it today

Today I run everything at Rung 3 and below, with a human approving each state-changing action. The agent is free to enumerate and interact as widely as it likes at Rungs 1 and 2. The moment it wants to change something, it stops and asks.

That is more conservative than the demos and slower than fully autonomous exploitation looks in a video. It is also the only version I would put anywhere near a client's production network. The time saved by letting the model handle recon and triage is real. The time lost cleaning up one unsupervised destructive mistake is not worth trading for a faster run.

## Close

The ladder is not really about the agent. It is about a human deciding, action by action, how much to trust it, and staying honest that the answer changes as you go.

The interesting engineering is not making the agent more autonomous. Anyone can hand a model more tools. The hard part is building the controls that let you move it up and down the ladder safely, and knowing when to move it down.

The agent can climb. Deciding how far is still your job.
