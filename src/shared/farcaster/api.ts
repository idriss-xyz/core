export const getUserFid = (username: string) => {
  return fetch(
    `https://fnames.farcaster.xyz/transfers/current?name=${username}`,
  );
};

export const getAccountByFid = (fid: number) => {
  return fetch(`https://api.idriss.xyz/get-connected-addresses?fid=${fid}`);
};
