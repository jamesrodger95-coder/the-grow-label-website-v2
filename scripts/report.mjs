import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { register } from 'node:module';

/**
 * Builds a prospect's assessment from the answers their questionnaire sent us.
 *
 * The report is a team-side artefact. The prospect never sees it on the site —
 * they answer nine questions, book a call, and we go through the document with
 * them. This is how the document gets made.
 *
 *   node scripts/report.mjs artifacts/leads/GL-C-260918-K3F9P.json
 *   node scripts/report.mjs <file.json> out/their-name.pdf
 *
 * The input is whatever the CRM webhook received: the `LeadPayload` shape in
 * src/lib/calculator/crm.ts. Only `answers` is required — the figures are
 * recomputed here from the same model the site used, so a payload that has
 * been through a CRM and lost a field still produces the right document.
 */

const [, , input, output] = process.argv;
if (!input) {
  console.error('usage: node scripts/report.mjs <lead.json> [out.pdf]');
  process.exit(1);
}

// The report and the model are TypeScript. Next's compiler is not involved
// here, so Node's own type stripping does the job — which is why neither file
// uses a constructor parameter property or an enum — and the hook below
// supplies the `@/` alias and the missing file extensions.
register('./ts-resolve.mjs', import.meta.url);

const { estimate } = await import('../src/lib/calculator/model.ts');
const { buildReport } = await import('../src/lib/calculator/report.ts');

const payload = JSON.parse(await readFile(resolve(input), 'utf8'));
const answers = payload.answers ?? payload;
if (!answers?.practice) {
  console.error(`${input} carries no answers. Expected the LeadPayload shape.`);
  process.exit(1);
}

/** Assets come off disk rather than over the network. */
const load = async (path) => {
  const file = await readFile(resolve('public', path.replace(/^\//, '')));
  return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
};

const result = estimate(answers);
const bytes = await buildReport({
  answers,
  estimate: result,
  practiceName: payload.practiceName,
  load,
});

const reference = payload.reference ?? 'assessment';
const target = output ?? `artifacts/reports/${reference}.pdf`;
await writeFile(resolve(target), bytes);

console.log(`${target}`);
console.log(`  reference   ${reference}`);
console.log(`  headline    ${result.headline.toLocaleString('en-US')}`);
console.log(`  range to    ${result.upper.toLocaleString('en-US')}`);
console.log(`  hours       ${result.hoursReturned}`);
