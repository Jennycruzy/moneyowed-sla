# How the SLA_COMPLIANCE_GENERAL pairs were made

145 preference pairs, uploaded to the `SLA_COMPLIANCE_GENERAL` evaluation pool on the Telegraph testnet. Each pair is one question, one right answer and one wrong answer. The rows themselves are not in this repository: half of every pool is hidden test material that must not be shown to miners or module authors. This page explains how they were built, and [receipts.json](receipts.json) shows what the node accepted.

## The questions

Every question names a real vendor, a covered service, a period and the SLA target from the vendor's published SLA, and lists the incidents the vendor's own status page shows for that period. For example (wording varies across six monthly and four quarterly templates):

> SLA check: Bitbucket, billing period November 2025, target 99.9%. The status page lists this incident in the period: "Bitbucket availability degraded" (2025-11-11, 251 min open). What was the uptime for that period and was the SLA breached?

- **115 monthly questions**: one billing month of one vendor's covered service, over the last 13 months.
- **30 quarterly questions**: a whole quarter, for services that had real downtime in it.
- **16 vendors**: GitHub, Jira, Confluence, Jira Service Management, Bitbucket, Vercel, DigitalOcean, Twilio, Linode, Mailgun, Sanity, Prisma, Mapbox, Buildkite, Google Cloud and Azure.
- Only periods where at least one incident touched the covered service. A quiet month has nothing to judge.
- When two services shared exactly the same incidents (for example several Google Cloud products in one region), only one question was kept.
- No question is more than 80% similar to another (the node rejects at 85%).

## The right answer

Computed from the vendor's own status records, the way the SLA defines downtime:

1. Only incidents on a **covered** service count, for the customer's region where the SLA is regional.
2. Only the time the vendor's own updates marked that service as **down** counts. Degraded performance and scheduled maintenance do not.
3. Overlapping incidents are merged, so no minute is counted twice.
4. Uptime = 1 − counted minutes ÷ minutes in the period, compared with the SLA target.

The answer gives the five fields the intent asks for (`service`, `uptime_pct`, `sla_target_pct`, `compliant`, `period`), plus the outage minutes, the incidents counted and excluded with the reason for each, and one sentence on the method.

Six rows are vendor-months whose covered minutes were also counted by hand from the status pages before the engine was run. They are marked `human` in their provenance; the rest are marked `computed`. Every row links to the vendor's public status history, so all 145 are recorded by the node as `attested`.

## The wrong answers

Each wrong answer uses a mistake we have seen in practice, gives a different number or verdict from the right answer, and is written in the same shape as the right one, so the format does not give it away.

| Wrong method | Rows | What goes wrong |
|---|---|---|
| Whole incident, any status | 57 | Counts every incident that names the service for its full open time, including hours it was only degraded or already fixed |
| Every major incident on the page | 22 | Counts major and critical incidents on any service the vendor runs, not just the covered one |
| Last 90 days | 33 | Measures a rolling 90-day window ending today instead of the period asked about |
| Flat 100% | 2 | Reports no covered outage when there was one |
| Last month of the quarter only | 6 | Answers a quarter question with one month's figure |
| Title search | 22 | Counts only incidents whose title names the product, missing outages filed under a generic title ("Disruption with some GitHub services") |
| Real answers from the network | 3 | Wrong answers other SLA miners gave to the same vendor-months when we asked them through Telegraph |

In 88 of the 145 pairs the right and wrong answers reach opposite verdicts (met vs missed). In 55 the wrong uptime is too high and in 90 it is too low, so "the higher number wins" is not a safe rule.

## Simple rules do not separate the pairs

If a scoring module could pass this material with a shortcut, it would measure nothing. How often each shortcut picks the right answer, out of 145 ([stats.json](stats.json)):

| Shortcut | Right |
|---|---|
| The longer answer wins | 76 (52%) |
| The higher uptime wins | 90 (62%) |
| The lower uptime wins | 55 (38%) |
| The answer saying "SLA met" wins | 59 (41%) |
| The answer saying "SLA missed" wins | 29 (20%) |

The only way to score well is to check the number against the incidents and the period in the question.

## What is kept private, and why

- **The rows** are not published, because the testing half must stay hidden.
- **The generator scripts** that produce them are kept private for the same reason: anyone holding them could rebuild the exact rows. Judges can have them on request.
- The checker ([check.py](check.py)) and the signed upload script ([upload.mjs](upload.mjs)) are here. Neither contains any row.

## Disclosure

The same team runs an SLA miner on this intent (miner 2611217, see [../miner](../miner)). The right answers follow that miner's counting rule. That rule follows the SLA text: covered service, down not degraded, the billing period. Each wrong answer is a named counting mistake, not another team's miner. The only exception is the three real network answers, which are included anonymously.

## Limits

- Status pages are the vendor's own account of its outages. A vendor that never posts an incident cannot be caught this way.
- Where a vendor publishes no per-component timing, the whole incident is counted only when its impact is major or critical.
- Quarterly answers give the quarter's combined uptime. Service credits are still assessed per billing month.
