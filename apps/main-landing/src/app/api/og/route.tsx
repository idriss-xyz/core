import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') ?? '';
  const avatar = searchParams.get('avatar') ?? '';

  const mediumFontData = await fetch(
    new URL('../../fonts/AeonikPro-Medium.ttf', import.meta.url),
  ).then((r) => {
    return r.arrayBuffer();
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
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
          width={1200}
          height={630}
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
            paddingLeft: 16,
            paddingRight: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 34,
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderWidth: '1.11px 0px',
            borderStyle: 'solid',
            borderImageSource:
              'linear-gradient(180deg, rgba(145, 206, 154, 0.5) 0%, #55EB3C 99.33%)',
            backdropFilter: 'blur(100.21723937988281px)',
          }}
        >
          <div
            style={{
              maxHeight: 96,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 72,
                  height: 72,
                  padding: 10,
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
                    width={72}
                    height={72}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid rgb(219 221 226)',
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
                fontSize: 24,
                lineHeight: '28px',
                fontWeight: 500,
                letterSpacing: '0px',
                color: '#176410',
              }}
            >
              <span
                style={{
                  marginRight: 8,
                  wordBreak: 'break-word',
                }}
              >
                {name}
              </span>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  gap: 10,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(5 171 19)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.24l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                  <path d="m21.854 2.147-10.94 10.939" />
                </svg>
                invites you to join!
              </span>
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
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
