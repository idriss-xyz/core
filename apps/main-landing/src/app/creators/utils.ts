import { Hex } from 'viem';

import { CREATOR_API_URL } from './donate/constants';

type BrowserBasedImageProperties = {
  svgSrc: string;
  pngSrc: string;
};

const isAppleBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent;

  return (
    /Macintosh|iPhone|iPad|iPod/.test(ua) &&
    ua.includes('Safari') &&
    !/Chrome|CriOS|FxiOS/.test(ua)
  );
};

export const browserBasedSource = ({
  svgSrc,
  pngSrc,
}: BrowserBasedImageProperties) => {
  if (isAppleBrowser()) {
    return pngSrc;
  }

  return svgSrc;
};

// TODO: check location and use zod
type Creator = {
  id: number;
  address: Hex;
  primaryAddress: Hex;
  name: string;
  profilePictureUrl: string;
  donationUrl: string;
  obsUrl: string;
  networks: any[];
};

// TODO: Check location of all following functions
export const getCreator = async (name?: string | null): Promise<Creator | undefined> => {
  if (!name) {
    console.error('No name to get creator');
    return;
  }

  const response = await fetch(`${CREATOR_API_URL}/creator/${name}`);
  if (!response.ok) {
    return;
  }
  const data = await response.json();
  return data;
};

export const saveCreator = async (
  address: Hex,
  name?: string | null,
): Promise<void> => {
  try {
    if (!address || !name) {
      console.error('No wallet address or name to create creator');
    }

    const response = await fetch(`${CREATOR_API_URL}/creators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        primaryAddress: address,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to register creator');
    }
  } catch (error) {
    console.error('Error registering creator:', error);
  }
};
