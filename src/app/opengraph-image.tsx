import { ImageResponse } from 'next/og';

export const alt = 'Grow Label — revenue recovery for veterinary and dental groups';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph card, generated at build time from the same palette and the same
 * four-stage device the site uses. System faces only: loading the display font
 * into the edge renderer is not worth the build cost for one image.
 */
export default function OpenGraphImage() {
  const stages: [string, number, string][] = [
    ['ESTIMATED', 100, 'rgba(154,143,230,0.24)'],
    ['BOOKED', 74, 'rgba(154,143,230,0.46)'],
    ['ATTENDED', 62, 'rgba(154,143,230,0.70)'],
    ['COLLECTED', 55, '#9a8fe6'],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#08080b',
          color: '#f4f3ef',
          padding: 72,
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ width: 26, height: 5, background: '#9a8fe6', opacity: 0.3 }} />
            <div style={{ width: 20, height: 5, background: '#9a8fe6', opacity: 0.55 }} />
            <div style={{ width: 16, height: 5, background: '#9a8fe6', opacity: 0.78 }} />
            <div style={{ width: 12, height: 5, background: '#9a8fe6' }} />
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Grow Label
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 66,
              lineHeight: 1.06,
              letterSpacing: -1.5,
            }}
          >
            <div style={{ display: 'flex' }}>Find the revenue your practice</div>
            <div style={{ display: 'flex' }}>already earned</div>
            <div style={{ display: 'flex', fontStyle: 'italic' }}>and never collected.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: 620 }}>
            {stages.map(([name, width, colour]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 14,
                    letterSpacing: 2,
                    color: 'rgba(244,243,239,0.74)',
                    width: 130,
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: 440,
                    height: 12,
                    background: 'rgba(244,243,239,0.07)',
                  }}
                >
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
            fontFamily: 'monospace',
            fontSize: 16,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'rgba(244,243,239,0.55)',
            borderTop: '1px solid rgba(244,243,239,0.13)',
            paddingTop: 24,
          }}
        >
          <div>Answer · Respond · Retain · Reactivate</div>
          <div>Veterinary &amp; dental</div>
        </div>
      </div>
    ),
    size
  );
}
