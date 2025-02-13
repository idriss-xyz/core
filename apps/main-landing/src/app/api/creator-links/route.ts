import fs from 'node:fs';

import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = ['https://idriss.xyz', 'https://www.idriss.xyz'];

type StoredLinkEntry =
  | { link: string; createdAt: string }
  | { donationURL: string; createdAt: string };

const DATA_DIRECTORY_PATH = './data';
const DATA_FILE_PATH = `${DATA_DIRECTORY_PATH}/creator-links.json`;
const DATA_TEMPLATE_PATH = `${DATA_DIRECTORY_PATH}/creator-init-links.json`;

if (!fs.existsSync(DATA_FILE_PATH)) {
  if (fs.existsSync(DATA_TEMPLATE_PATH)) {
    fs.copyFileSync(DATA_TEMPLATE_PATH, DATA_FILE_PATH);
  } else {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([]));
  }
}

// ts-unused-exports:disable-next-line
export async function POST(request: NextRequest) {
  const origin =
    request.headers.get('origin') ?? request.headers.get('referer');

  if (
    !origin ||
    !allowedOrigins.some((allowed) => {
      return origin.startsWith(allowed);
    })
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { donationURL } = await request.json();

    if (
      !donationURL ||
      typeof donationURL !== 'string' ||
      !isValidDonationUrl(donationURL)
    ) {
      return NextResponse.json(
        { error: 'Invalid or missing link' },
        { status: 400 },
      );
    }

    const fileData: StoredLinkEntry[] = JSON.parse(
      fs.readFileSync(DATA_FILE_PATH, 'utf8'),
    );
    fileData.push({ link: donationURL, createdAt: new Date().toISOString() });

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(fileData, null, 2));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save link' }, { status: 500 });
  }
}

// ts-unused-exports:disable-next-line
export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CREATOR_LINKS_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const fileData: StoredLinkEntry[] = JSON.parse(
      fs.readFileSync(DATA_FILE_PATH, 'utf8'),
    );
    const normalizedData = fileData.map((entry) => {
      return {
        link: 'link' in entry ? entry.link : entry.donationURL,
        createdAt: entry.createdAt,
      };
    });
    const uniqueLinks = new Set(
      normalizedData.map((entry) => {
        return entry.link;
      }),
    ).size;

    return NextResponse.json({
      uniqueCount: uniqueLinks,
      links: normalizedData,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 },
    );
  }
}

function isValidDonationUrl(url: string): boolean {
  const regex =
    /^https:\/\/www\.idriss\.xyz\/creators\/donate\?address=(0x[\dA-Fa-f]{40}|[\w-]+(\.[a-z]+)+)&token=[\w,]+&network=[\w,]+&creatorName=[\w%]+$/;
  return regex.test(url);
}
