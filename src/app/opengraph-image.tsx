import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Grow Label — revenue recovery for veterinary and dental groups';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph card, generated at build time from the site's own palette and the
 * four-stage device.
 *
 * The logo is inlined as a data URI because the edge renderer has no origin to
 * fetch a relative path from. System faces only: loading the display font into
 * the renderer is not worth the build cost for one image.
 */
const LOGO = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public', 'logo-mark.png')
).toString('base64')}`;

const INK = '#0c0c0e';
const PAPER = '#fbfaf8';
const PURPLE = '#4a3ac4';
const SLATE = '#5a5a62';

export default function OpenGraphImage() {
  const stages: [string, number, string][] = [
    ['ESTIMATED', 100, 'rgba(74,58,196,0.24)'],
    ['BOOKED', 74, 'rgba(74,58,196,0.46)'],
    ['ATTENDED', 62, 'rgba(74,58,196,0.70)'],
    ['COLLECTED', 55, PURPLE],
  ];

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PAPER,
        color: INK,
        padding: 72,
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO} alt="" width={38} height={44} />
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.6 }}>Grow Label</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 68,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -2.4,
          }}
        >
          <div style={{ display: 'flex' }}>Recover the revenue</div>
          <div style={{ display: 'flex', color: PURPLE }}>you already earned.</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: 620 }}>
          {stages.map(([name, width, colour]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ fontSize: 14, letterSpacing: 2, color: SLATE, width: 130 }}>{name}</div>
              <div style={{ display: 'flex', width: 440, height: 12, background: '#eae8e3' }}>
                <div style={{ width: `${width}%`, height: '100%', background: colour }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 16,
          letterSpacing: 2,
          color: SLATE,
          borderTop: '1px solid #dedbd5',
          paddingTop: 24,
        }}
      >
        <div>ANSWER · RESPOND · RETAIN · REACTIVATE</div>
        <div>VETERINARY &amp; DENTAL</div>
      </div>
    </div>,
    size
  );
}
