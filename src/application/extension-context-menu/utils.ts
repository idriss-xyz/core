export const generateGetTwitterIdsQuery = ({
  username,
}: {
  username: string;
}) => {
  return `https://www.idriss.xyz/v1/getTwitterIDPlugin?usernames=${username}`;
};

export const lowerFirst = (value: string) => {
  return value.charAt(0).toLowerCase() + value.slice(1);
};

export const convertPhone = (phone: string) => {
  // allow for letters because secret word can follow phone number
  return '+' + phone.replace(/[^\dA-Za-z]/, '');
};

export const digestMessage = async (message: string) => {
  const messageUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageUint8); // hash the message
  const hashArray = [...new Uint8Array(hashBuffer)]; // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join(''); // convert bytes to hex string
  return hashHex;
};
