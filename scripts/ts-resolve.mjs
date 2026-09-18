import { pathToFileURL } from 'node:url';
import { resolve as resolvePath } from 'node:path';

/**
 * Lets a script import the site's TypeScript directly.
 *
 * Node strips types on its own; what it does not do is understand the two
 * conventions the source is written in — the `@/` alias from tsconfig, and
 * imports written without a file extension. This hook supplies both, so the
 * modules under `src/` stay idiomatic and no build step sits between a script
 * and the code it is meant to be reusing.
 *
 * Registered by the script that needs it, not globally:
 *
 *   import { register } from 'node:module';
 *   register('./ts-resolve.mjs', import.meta.url);
 */
const ROOT = process.cwd();

export async function resolve(specifier, context, nextResolve) {
  let target = specifier;

  if (target.startsWith('@/')) {
    target = pathToFileURL(resolvePath(ROOT, 'src', target.slice(2))).href;
  }

  try {
    return await nextResolve(target, context);
  } catch (error) {
    // An extensionless relative or aliased import: try the TypeScript file.
    if (target.startsWith('.') || target.startsWith('file:')) {
      for (const extension of ['.ts', '.tsx', '/index.ts']) {
        try {
          return await nextResolve(target + extension, context);
        } catch {
          // Try the next one; the original error is thrown below.
        }
      }
    }
    throw error;
  }
}
