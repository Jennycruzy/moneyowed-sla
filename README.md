# MONEY OWED SLA: a miner and evaluation material for SLA_COMPLIANCE_GENERAL

Two Telegraph Hackathon Season II entries for one intent, `SLA_COMPLIANCE_GENERAL`: *did this vendor meet its uptime SLA over this period?*

| Track | Entry | Start here |
|---|---|---|
| **Miners / Providers** | Miner `2611217` (`moneyowed-sla`), live and registered | [Miners: for judges](#miners-for-judges) |
| **Evaluators** | 145 preference pairs in the intent's evaluation pool | [Evaluators: for judges](#evaluators-for-judges) |

**Network:** Telegraph testnet (Ethereum Sepolia). Nothing here is a mainnet or production claim.
**The app that uses both:** [MONEY OWED](https://moneyowed.38-49-216-59.sslip.io) (Apps & Agents track, Mission 15) finds the service credits vendors owe their customers. It has its own repository and entry.

## Why this intent matters

Telegraph marks the SLA_COMPLIANCE family **mandatory** for two Season II missions: **Mission 12 (Mining & Power)** and **Mission 15 (Consumer Automation)**. The answer decides money. When GitHub, Jira or Azure miss their written uptime promise, the customer is owed a service credit, but only if the outage hit a covered service, counted as down rather than degraded, and fell inside the billing period. An answer that counts the wrong incidents or the wrong window says a credit is owed when it isn't, or misses one that is.

---

## Miners: for judges

**Live endpoint:** `GET https://moneyowed.38-49-216-59.sslip.io/miner/sla?service=<vendor and service>&period=<period>`

Try it (no key; about 0.3 s per answer):
- [Jira, July 2026](https://moneyowed.38-49-216-59.sslip.io/miner/sla?service=jira&period=2026-07): 99.8195%, below the 99.9% target, credit owed.
- [Compute Engine in us-central1, August 2026](https://moneyowed.38-49-216-59.sslip.io/miner/sla?service=Compute%20Engine%20us-central1&period=2026-08): 100%. The 20 Aug Google outage was in us-west1, and the answer says so.
- [GitHub, last 30 days](https://moneyowed.38-49-216-59.sslip.io/miner/sla?service=github&period=last%2030%20days)
- [A vendor it does not cover](https://moneyowed.38-49-216-59.sslip.io/miner/sla?service=cloudflare&period=2026-10): a clear error, never a guess.

| Criterion (from the official rules) | Evidence |
|---|---|
| **Independently evaluated intelligence quality** | We asked 17 vendor-months, with outage minutes counted by hand from the status pages, to all 22 SLA miners on Telegraph, paying through the network ($2.51). **Ours: 17 of 17** right on verdict and uptime, and all 4 breaches caught. Next best: 7 of 17, no breaches caught. The miner ranked #1 at the time answered 2 and got 0 right. Table: [miner/accuracy.json](miner/accuracy.json). The same 17 are re-asked of our live miner **every day** by a public GitHub Action: [Miner accuracy](https://github.com/Jennycruzy/moneyowed-sla/actions/workflows/accuracy.yml), script [miner/accuracy-check.mjs](miner/accuracy-check.mjs), hand counts [miner/truth.json](miner/truth.json). |
| **Reliability, availability, and capacity** | Runs as a systemd service on a dedicated server, with incident history refreshed hourly from each vendor. Declared limits in the YAML: 5 requests/s, circuit breaker after 5 errors. Unsupported vendors, periods in the future and periods older than the history held each return an explicit error. |
| **Verified Intent coverage and application enablement** | 17 vendors with written uptime SLAs: GitHub Enterprise Cloud, Jira, Confluence, Jira Service Management, Bitbucket, Vercel, DigitalOcean, Twilio, Linode, Mailgun, Sanity, Prisma, Mapbox, Buildkite, AWS, Google Cloud and Azure (per service and region). Periods: calendar months, quarters, date ranges, "last N days", "last month", up to 400 days back. Whole billing periods also return the credit percent and the claim deadline. Paid asks through Telegraph return all five intent fields. |
| **Verified H2 mission application consumption** | MONEY OWED (Mission 15) buys an answer from this miner through Telegraph on every check and shows it beside the other miners' answers, labelled as run by the same team. |
| **Cost, latency, and serving economics** | $0.01 per paid ask on testnet. About 0.3 s per answer measured from outside the server: everything is computed from the incident history held locally, with no model call. |
| **Integration and documentation** | Registered YAML: [miner/moneyowed-sla.yaml](miner/moneyowed-sla.yaml), also served at [/miner.yaml](https://moneyowed.38-49-216-59.sslip.io/miner.yaml). Registration record with transaction hashes: [miner/registration.json](miner/registration.json). |
| **Organic growth, education, and developer activation** | [Use it from your own app](#use-the-miner-from-your-own-app) below. |

### What the answer contains

`service`, `uptime_pct`, `sla_target_pct`, `compliant` and `period`, the fields the intent asks for, plus:
- the downtime minutes and the minutes the contract allows
- every incident in the period, marked counted or not, with the reason ("Pull Requests marked major outage", "degraded only", "scheduled maintenance", "event in us-west1, not your region")
- for whole billing periods, the credit owed and the claim deadline

### How it counts

The SLA's own rules, read from the vendor's published SLA:
1. Only the covered services count.
2. Only the time the vendor's own updates marked a service as down counts. Degraded performance and scheduled maintenance don't.
3. Overlaps are merged.
4. The period is the billing period the SLA uses.

The engine code lives in the MONEY OWED app repository. This repository holds the miner's registration, its accuracy evidence and the evaluation material.

### Use the miner from your own app

Through Telegraph, ask `SLA_COMPLIANCE_GENERAL` with two strings:

```json
{ "intent": "SLA_COMPLIANCE_GENERAL", "params": { "service": "github actions", "period": "2026-10" } }
```

To reach this miner directly, pin miner `2611217`. Without a pin, Telegraph routes by ranking. Good inputs: `"jira premium"`, `"Amazon EC2 us-east-1"`, `"Azure Virtual Machines East US"`, `"2026-Q3"`, `"2026-09-01 to 2026-09-30"`. AWS, Google Cloud and Azure need one service and one region. To check our numbers yourself, run `node miner/accuracy-check.mjs` (Node 18+, no install).

---

## Evaluators: for judges

**What was contributed:** 145 preference pairs (115 monthly, 30 quarterly) for `SLA_COMPLIANCE_GENERAL`, signed and uploaded to the Telegraph testnet evaluation pool. All 145 were accepted and admitted, none rejected. The node records all of them as `attested`, because each links to the vendor's public status history. How they were made: [evaluator/METHOD.md](evaluator/METHOD.md).

Check the rows yourself (no key):

```bash
curl -s "https://devnode.telegraphprotocol.com/api/evalpool/submissions/mine?submitter=0x2d87B538e3beD8C9c44Df502B3a816D76da09A31&intent_id=SLA_COMPLIANCE_GENERAL"
curl -s "https://devnode.telegraphprotocol.com/api/evalpool/status?intent_id=SLA_COMPLIANCE_GENERAL"
```

| Criterion (from the official rules) | Evidence |
|---|---|
| **Measurement validity, quality discrimination, and baseline evidence** | Each pair puts the right answer (counted the way the SLA defines downtime) against a plausible wrong one built with a named counting mistake: whole incident at any status, every major incident on the page, the last 90 days instead of the period, a flat 100%, one month for a quarter, title search, or a real wrong answer from the network. In **88 of 145** pairs the verdict flips. **Baselines** ([evaluator/stats.json](evaluator/stats.json)): "longer answer wins" picks right 52% of the time, "higher uptime wins" 62%, "says SLA met" 41%. Only checking the number against the incidents and period scores well. Six rows were also counted by hand before the engine ran. |
| **Integrity and robustness** | The rows are not published, so the hidden test half stays hidden. The generator scripts are private for the same reason and available to judges on request. No two questions are more than 80% alike. The wrong answers have the same format and length as the right ones (the longer answer is the right one only 52% of the time). Wrong uptimes are too high in 55 pairs and too low in 90. Conflict of interest is disclosed in [METHOD.md](evaluator/METHOD.md#disclosure). |
| **Reproducibility and protocol compatibility** | Uploaded through the documented `POST /api/evalpool/submissions` with an EIP-191 signature. [evaluator/receipts.json](evaluator/receipts.json) has each upload's body SHA-256 and the node's reply (115 + 30 received, accepted and admitted, 0 rejected), plus every row's hash and state. Checker: [evaluator/check.py](evaluator/check.py). Signed upload: [evaluator/upload.mjs](evaluator/upload.mjs). |
| **Useful evaluation coverage and demonstrated improvement** | The pool for this mandatory intent had material from 1 contributor. It is used once 3 have contributed, and ours is the 2nd. No scoring module is registered for SLA_COMPLIANCE yet. At the last scored epoch, the #1-ranked SLA miner (score 0.9985) answered 2 of our 17 hand-counted vendor-months and got 0 right. These pairs teach the opposite: the right number for the period asked, over a well-formatted wrong one. |
| **Documentation and integration clarity** | [evaluator/METHOD.md](evaluator/METHOD.md): questions, right answers, each wrong method with counts, shortcuts tested, what stays private and why, limits. |
| **Organic growth, education, and developer activation** | [Add SLA pairs of your own](#add-sla-pairs-of-your-own) below. |

### Add SLA pairs of your own

The pool needs one more contributor before validators use it. If you run or test an SLA miner, your own pairs count:

1. Write one question per line with a better and a worse answer: `{"prompt": "...", "chosen": "...", "rejected": "...", "label_kind": "preference_pair", "provenance": {"source_kind": "human", "source_url": "https://<status page or SLA>"}}`. The prompt needs 16+ characters and each answer 8+. The better answer must state a number (`uptime_pct`).
2. Check the file: `python3 evaluator/check.py yours.jsonl checked.jsonl`
3. Sign and send it: `npm i viem && CONTRIBUTOR_PRIVATE_KEY=0x... node evaluator/upload.mjs checked.jsonl SLA_COMPLIANCE_GENERAL --send` (leave out `--send` to see what would be signed). There is no fee.
4. Look up your rows with the first `curl` line above, using your own address.

Telegraph's own guide: [Contribute evaluation data](https://github.com/telegraphprotocol/telegraph-docs).

---

## Accounts

- Miner and evaluation contributor wallet: `0x2d87B538e3beD8C9c44Df502B3a816D76da09A31`. The miner was registered from this wallet, and the pairs are credited to it.
- Telegraph Diamond (testnet): `0x72a70e949362670Bf8bceAd24eFC5b8f950aa08b`

## Licence

MIT, see [LICENSE](LICENSE).
