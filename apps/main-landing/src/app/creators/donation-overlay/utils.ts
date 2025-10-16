import { CREATOR_API_URL } from '@idriss-xyz/constants';

export const getTextToSpeech = async (text: string, voiceId?: string) => {
  if (text === '') return null;
  try {
    const response = await fetch(
      `${CREATOR_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      },
    );
    if (!response.ok) {
      console.error(
        `Creator API error: ${response.status} ${response.statusText}`,
      );
      return null;
    }
    return response;
  } catch (error) {
    console.error('Error fetching text-to-speech:', error);
    return null;
  }
};

export const getTextToSfx = async (text: string | undefined) => {
  if (!text) {
    return null;
  }
  try {
    const response = await fetch(`${CREATOR_API_URL}/text-to-sfx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      console.error(
        `Creator API error: ${response.status} ${response.statusText}`,
      );
      return null;
    }
    return response;
  } catch (error) {
    console.error('Error fetching text-to-sfx:', error);
    return null;
  }
};

export const fetchDonationSfxText = async (txHash: string) => {
  try {
    const response = await fetch(
      `${CREATOR_API_URL}/donation-effects/${txHash}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) {
      console.error(
        `Error fetching donation effect: ${response.status} ${response.statusText}`,
      );
      return;
    }

    const data = await response.json();
    return data.sfxMessage as string;
  } catch (error) {
    console.error('Error fetching donation effect text:', error);
    return;
  }
};
