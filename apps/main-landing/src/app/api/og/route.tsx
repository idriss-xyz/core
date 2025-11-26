import { ImageResponse } from 'next/og';

// ts-unused-exports:disable-next-line
export const runtime = 'edge';

// ts-unused-exports:disable-next-line
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') ?? '';
  const avatar = searchParams.get('avatar') ?? '';

  const mediumFontData = await fetch(
    new URL('../../fonts/AeonikPro-Medium.woff2', import.meta.url),
  ).then((r) => {
    return r.arrayBuffer();
  });

  const CANVAS_W = 2400;
  const CANVAS_H = 1260;

  return new ImageResponse(
    (
      <div
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'AeonikPro',
        }}
      >
        <img
          src="http://localhost:3000/og.png"
          alt=""
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        <div
          style={{
            width: '100%',
            paddingTop: 2.22,
            paddingBottom: 2.22,
            marginBottom: 68,
            backgroundImage:
              'linear-gradient(180deg, rgba(145, 206, 154, 0.5) 0%, #55EB3C 99.33%)',
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '100%',
              paddingLeft: 90,
              paddingRight: 16,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(200px)',
            }}
          >
            <div
              style={{
                maxHeight: 184,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ flexShrink: 0, display: 'flex' }}>
                <div
                  style={{
                    position: 'relative',
                    width: 144,
                    height: 144,
                    padding: 20,
                    opacity: 1,
                    transform: 'rotate(0deg)',
                    boxSizing: 'border-box',
                    display: 'flex',
                  }}
                >
                  {avatar && (
                    <img
                      alt=""
                      src={avatar}
                      width={144}
                      height={144}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgb(219 221 226)',
                        display: 'block',
                      }}
                    />
                  )}
                </div>
              </div>

              <span
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  textTransform: 'uppercase',
                  fontSize: 48,
                  lineHeight: '56px',
                  fontWeight: 500,
                  letterSpacing: '0px',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    wordBreak: 'break-word',
                    backgroundImage:
                      'radial-gradient(65.65% 168.51% at 47.77% 27.64%, #000A05 0%, #176410 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    flexShrink: 0,
                  }}
                >
                  {name}
                </span>

                <svg
                  style={{ marginRight: 16, flexShrink: 0 }}
                  xmlns="http://www.w3.org/2000/svg"
                  width={64}
                  height={64}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#05AB13"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.24l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                  <path d="m21.854 2.147-10.94 10.939" />
                </svg>

                <span
                  style={{
                    backgroundImage:
                      'radial-gradient(65.65% 168.51% at 47.77% 27.64%, #000A05 0%, #176410 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    flexShrink: 0,
                  }}
                >
                  invites you to join!
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: CANVAS_W,
      height: CANVAS_H,
      fonts: [
        {
          name: 'AeonikPro',
          data: mediumFontData,
          weight: 500,
          style: 'normal',
        },
      ],
    },
  );
}
