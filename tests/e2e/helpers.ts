import type { Page } from '@playwright/test';

/**
 * Waits until React has hydrated. MotionProvider sets `data-motion` on the root
 * from an effect, so its presence is a real signal that client components are
 * mounted and their handlers are attached — clicking before that point hits
 * server-rendered markup with no listeners.
 */
export async function awaitHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'on', undefined, {
    timeout: 10_000,
  });
}
