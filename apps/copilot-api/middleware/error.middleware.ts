import { AxiosResponse } from 'axios';
import { Response } from 'express';

export const throwInternalError = (
  res: Response,
  msg: string,
  error: unknown,
) => {
  console.error(`${msg}: `, error);
  res.status(500).json({ error: 'Internal server error', message: msg });
};

export const throwExternalError = (res: AxiosResponse, msg: string) => {
  throw new Error(`[${res.status}] ${msg}: ${res.statusText}`);
};
