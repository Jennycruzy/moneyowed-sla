# MONEY OWED SLA: a miner and evaluation material for SLA, uptime, API health and contract obligations

Two Telegraph Hackathon Season II entries built around one question, *did this vendor keep its written promise?*: `SLA_COMPLIANCE_GENERAL`, `SERVER_UPTIME_MONITOR_GENERAL`, `API_HEALTH_CHECK_GENERAL` and `CONTRACT_OBLIGATION_AUDIT_GENERAL`.

| Track | Entry | Start here |
|---|---|---|
| **Miners / Providers** | Miner `2611217` (`moneyowed-sla`), live and registered for 4 intents | [Miners: for judges](#miners-for-judges) |
| **Evaluators** | 443 preference pairs in 3 evaluation pools: 145 SLA, 160 uptime, 138 API health | [Evaluators: for judges](#evaluators-for-judges) |

**Network:** Telegraph testnet (Ethereum Sepolia). Nothing here is a mainnet or production claim.
**The app that uses both:** [MONEY OWED](https://moneyowed.38-49-216-59.sslip.io) (Apps & Agents track, Mission 15) finds the service credits vendors owe their customers. It has its own repository and entry.

## Why this intent matters

Telegraph marks the SLA_COMPLIANCE family **mandatory** for two Season II missions: **Mission 12 (Mining & Power)** and **Mission 15 (Consumer Automation)**. The answer decides money. When GitHub, Jira or Azure miss their written uptime promise, the customer is owed a service credit, but only if the outage hit a covered service, counted as down rather than degraded, and fell inside the billing period. An answer that counts the wrong incidents or the wrong window says a credit is owed when it isn't, or misses one that is.

---

## Miners: for judges

**Live endpoints** (registered paths; no key):
- `GET /sla-compliance?service=<vendor and service>&period=<period>`
- `GET /server-uptime?url=<address>`
- `GET /api-health?url=<endpoint>`
- `GET /contract-obligations?contract=<text or public link>` (POST with JSON for long texts)

Base: `https://moneyowed.38-49-216-59.sslip.io`

Try it (no key; about 0.3 s per answer):
- [Jira, July 2026](https://moneyowed.38-49-216-59.sslip.io/miner/sla?service=jira&period=2026-07): 99.8195%, below the 99.9% target, credit owed.
- [Compute Engine in us-central1, August 2026](https://moneyowed.38-49-216-59.sslip.io/miner/sla?service=Compute%20Engine%20us-central1&period=2026-08): 100%. The 20 Aug Google outage was in us-west1, and the answer says so.
- [GitHub, last 30 days](https://moneyowed.38-49-216-59.sslip.io/miner/sla?service=github&period=last%2030%20days)
- [A vendor it does not cover](https://moneyowed.38-49-216-59.sslip.io/miner/sla?service=cloudflare&period=2026-10): no figure, and the reason, never a guess.
- [Uptime of github.com now](https://moneyowed.38-49-216-59.sslip.io/server-uptime?url=https://github.com): live probe plus GitHub's own 30-day uptime against its SLA.
- [Health of api.github.com](https://moneyowed.38-49-216-59.sslip.io/api-health?url=https://api.github.com): status, latency, content type, JSON validity, open vendor incidents.
- [A late delivery in a contract](https://moneyowed.38-49-216-59.sslip.io/contract-obligations?contract=Supplier%20shall%20deliver%20500%20units%20by%2015%20March%202026.%20Supplier%20delivered%20the%20units%20on%2020%20March%202026.): who owes what by when, the clause quoted, and Non-compliant because the stated delivery date is after the deadline.
- [A private address](https://moneyowed.38-49-216-59.sslip.io/server-uptime?url=http://169.254.169.254/): refused, never fetched.

| Criterion (from the official rules) | Evidence |
|---|---|
| **Independently evaluated intelligence quality** | We asked 17 vendor-months, with outage minutes counted by hand from the status pages, to all 22 SLA miners on Telegraph, paying through the network ($2.51). **Ours: 17 of 17** right on verdict and uptime, and all 4 breaches caught. Next best: 7 of 17, no breaches caught. The miner ranked #1 at the time answered 2 and got 0 right. Table: [miner/accuracy.json](miner/accuracy.json). The same 17 are re-asked of our live miner **every day** by a public GitHub Action: [Miner accuracy](https://github.com/Jennycruzy/moneyowed-sla/actions/workflows/accuracy.yml), script [miner/accuracy-check.mjs](miner/accuracy-check.mjs), hand counts [miner/truth.json](miner/truth.json). |
| **Reliability, availability, and capacity** | Runs as a systemd service on a dedicated server, with incident history refreshed hourly from each vendor. Declared limits in the YAML: 5 requests/s, circuit breaker after 5 errors. Every question gets an answer: unsupported vendors, future periods and unreachable or private addresses return no figure and the reason, never an error and never a guess. On the network's SLA ranking this took the miner from 0 to **0.98 (rank 2 of 21, epoch 54)**. |
| **Verified Intent coverage and application enablement** | **4 intents.** SLA: 17 vendors with written uptime SLAs: GitHub Enterprise Cloud, Jira, Confluence, Jira Service Management, Bitbucket, Vercel, DigitalOcean, Twilio, Linode, Mailgun, Sanity, Prisma, Mapbox, Buildkite, AWS, Google Cloud and Azure (per service and region). Periods: calendar months, quarters, date ranges, "last N days", "last month", up to 400 days back. Whole billing periods also return the credit percent and the claim deadline. Paid asks through Telegraph return all five intent fields. Uptime and API health: any public HTTP(S) address, with the vendor's open incidents and 30-day uptime added for the 17 tracked vendors. Contract obligations: any contract or terms text, or a public link to one. |
| **Verified H2 mission application consumption** | MONEY OWED (Mission 15) buys an SLA answer and the vendor's claim terms (`CONTRACT_OBLIGATION_AUDIT_GENERAL`) through Telegraph on every check, including from this miner, and shows each one beside the other miners' answers, labelled as run by the same team. The same checks run monthly in any repo through the [MONEY OWED GitHub Action](https://github.com/Jennycruzy/moneyowed#in-your-own-repo-every-month). |
| **Cost, latency, and serving economics** | $0.01 per paid ask on testnet. About 0.3 s per answer measured from outside the server: everything is computed from the incident history held locally, with no model call. |
| **Integration and documentation** | Registered YAML: [miner/moneyowed-sla.yaml](miner/moneyowed-sla.yaml), also served at [/miner.yaml](https://moneyowed.38-49-216-59.sslip.io/miner.yaml). Registration record with transaction hashes: [miner/registration.json](miner/registration.json). |
| **Organic growth, education, and developer activation** | Tutorial: [Sell an answer on Telegraph](https://github.com/Jennycruzy/moneyowed/blob/build/docs/sell-an-answer-on-telegraph.md), from intent to paid answer, with the mistakes that cost us points. [Use it from your own app](#use-the-miner-from-your-own-app) below. |

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

**What was contributed:** 443 preference pairs, signed and uploaded to three Telegraph testnet evaluation pools, all accepted and admitted, none rejected:
- `SLA_COMPLIANCE_GENERAL`: 145 (115 monthly, 30 quarterly)
- `SERVER_UPTIME_MONITOR_GENERAL`: 160
- `API_HEALTH_CHECK_GENERAL`: 138

For SLA: The node records all of them as `attested`, because each links to the vendor's public status history. How they were made: [evaluator/METHOD.md](evaluator/METHOD.md).

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
| **Useful evaluation coverage and demonstrated improvement** | Three pools, and SLA_COMPLIANCE is mandatory for two missions. A pool's questions are used once 5 contributors have added material: ours is the 2nd contributor for SLA, the 3rd for uptime and the 4th for API health. No scoring module is registered for SLA_COMPLIANCE yet. At the last scored epoch, the #1-ranked SLA miner (score 0.9985) answered 2 of our 17 hand-counted vendor-months and got 0 right. These pairs teach the opposite: the right number for the period asked, over a well-formatted wrong one. |
| **Documentation and integration clarity** | [evaluator/METHOD.md](evaluator/METHOD.md): questions, right answers, each wrong method with counts, shortcuts tested, what stays private and why, limits. |
| **Organic growth, education, and developer activation** | [Add SLA pairs of your own](#add-sla-pairs-of-your-own) below. |

### Uptime and API health pairs

Built from **real probes** of 160 public addresses made on 25 Nov 2026: sites, APIs, package registries, deliberately broken TLS hosts, closed ports, domains that do not resolve, and endpoints that return 4xx and 5xx by design. Each pair puts the right report of that probe against one realistic mistake in the same format:

| Wrong answer | Uptime | API health |
|---|---|---|
| A reachable address answering 401/403/404 called down | 29 | |
| A 5xx, timeout, DNS or TLS failure called up, or given made-up figures | 38 | |
| A failing or refusing endpoint called healthy | | 59 |
| A verdict that contradicts its own status code or facts | 30 | 19 |
| A healthy endpoint falsely called slow | | 37 |
| An answer about a different address | 30 | 18 |
| "Could not verify" on an address that answered | 31 | |
| A private or cloud-metadata address actually fetched | 2 | 5 |

Shortcuts do not work ([evaluator/stats-uptime-health.json](evaluator/stats-uptime-health.json)): for uptime, "says up wins" is right 90 of 160 times and "longer wins" 85; for health, "says not healthy wins" 64 of 138 and "longer wins" 81. Node replies and body hashes: [evaluator/receipts-uptime-health.json](evaluator/receipts-uptime-health.json).

### Add SLA pairs of your own

The pool needs three more contributors before validators use it. If you run or test an SLA miner, your own pairs count:

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
