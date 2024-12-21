export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
      };
    }
  }
}


