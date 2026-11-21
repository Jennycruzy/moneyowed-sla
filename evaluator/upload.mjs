// Signed upload of one JSONL file to the Telegraph evaluation pool (EIP-191, per the contribute-evaluation-data docs).
// usage: npm i viem && CONTRIBUTOR_PRIVATE_KEY=0x... node evaluator/upload.mjs <file.jsonl> <INTENT> [--send]
// Without --send it only prints what would be signed. Each upload is logged to upload-log.jsonl next to this script.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { privateKeyToAccount } from 'viem/accounts';

const [file, intent] = process.argv.slice(2);
const send = process.argv.includes('--send');
const NODE = 'https://devnode.telegraphprotocol.com';
if (!process.env.CONTRIBUTOR_PRIVATE_KEY) throw new Error('set CONTRIBUTOR_PRIVATE_KEY (the key your rows are credited to)');
const acct = privateKeyToAccount(process.env.CONTRIBUTOR_PRIVATE_KEY);
const body = fs.readFileSync(file);
for (const [i, l] of body.toString('utf8').split('\n').filter(Boolean).entries()) {
  const r = JSON.parse(l);
  if (r.intent_id && r.intent_id !== intent) throw new Error(`row ${i}: intent_id ${r.intent_id} != ${intent}`);
}
const sha = crypto.createHash('sha256').update(body).digest('hex');
const nonce = crypto.randomBytes(16).toString('hex');
const msg = ['Telegraph eval-pool submission v1', `intent_id: ${intent}`, `body_sha256: ${sha}`, `nonce: ${nonce}`, 'chain_id: 11155111'].join('\n');
console.log({ submitter: acct.address, intent, rows: body.toString().split('\n').filter(Boolean).length, bytes: body.length, body_sha256: sha });
if (!send) { console.log('dry run; add --send to upload'); process.exit(0); }
const sig = await acct.signMessage({ message: msg });
const r = await fetch(`${NODE}/api/evalpool/submissions?intent_id=${intent}&submitter=${acct.address}`, {
  method: 'POST', headers: { 'content-type': 'application/x-ndjson', 'X-Evalpool-Signature': sig, 'X-Evalpool-Nonce': nonce }, body,
});
const text = await r.text();
console.log(r.status, text);
fs.appendFileSync(new URL('./upload-log.jsonl', import.meta.url), JSON.stringify({ at: new Date().toISOString(), file, intent, body_sha256: sha, status: r.status, response: text }) + '\n');
