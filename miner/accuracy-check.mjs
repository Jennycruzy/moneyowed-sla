// Asks the live miner every hand-counted vendor-month in truth.json and compares its answer with the hand count.
// No dependencies, no key. Usage: node miner/accuracy-check.mjs [base_url]
import fs from 'node:fs';

const BASE = process.argv[2] || 'https://moneyowed.38-49-216-59.sslip.io';
const { items } = JSON.parse(fs.readFileSync(new URL('./truth.json', import.meta.url), 'utf8'));
const rows = [];
for (const t of items) {
  const url = `${BASE}/miner/sla?service=${encodeURIComponent(t.ask.service)}&period=${encodeURIComponent(t.ask.period)}`;
  let a = null, status = 0, ms = 0;
  const t0 = Date.now();
  try { const r = await fetch(url); status = r.status; a = await r.json(); } catch (e) { a = { error: e.message }; }
  ms = Date.now() - t0;
  const up = Number(a?.uptime_pct);
  const upOk = Number.isFinite(up) && Math.abs(up - t.uptime_pct) <= 0.01;
  const verdictOk = a?.compliant === t.compliant;
  rows.push({ vendor: t.vendor, period: t.period, expected: t.uptime_pct, got: Number.isFinite(up) ? up : null, compliant: a?.compliant ?? null, status, ms, pass: status === 200 && upOk && verdictOk });
}
const pass = rows.filter((r) => r.pass).length;
console.table(rows);
const summary = `${pass} of ${rows.length} vendor-months match the hand count (uptime within 0.01 point and the same met/missed verdict).`;
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Miner accuracy\n\n${summary}\n\n| Vendor | Period | Hand count | Miner | Met | HTTP | ms | Pass |\n|---|---|---|---|---|---|---|---|\n${rows.map((r) => `| ${r.vendor} | ${r.period} | ${r.expected} | ${r.got ?? '-'} | ${r.compliant ?? '-'} | ${r.status} | ${r.ms} | ${r.pass ? 'yes' : 'NO'} |`).join('\n')}\n`);
}
process.exit(pass === rows.length ? 0 : 1);
