import { mode } from './utils/mode';
import { configureEnv } from './config/environment';

configureEnv(mode, __dirname);

import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { connectedClients } from './services/socket-server';
import tokenPriceRouter from './routes/token-price';
import tipHistoryRouter from './routes/tip-history';
import recipientHistoryRouter from './routes/recipient-history';
import donorHistoryRouter from './routes/donor-history';
import creatorLeaderboardRouter from './routes/creator-leaderboard';
import donorLeaderboardRouter from './routes/donor-leaderboard';
import refetchENSRouter from './routes/force-refresh-ens';
import textToSpeechRouter from './routes/text-to-speech';
import creatorProfileRouter from './routes/creator-profile';
import getBalances from './routes/get-balances';
import donationParametersRouter from './routes/donation-parameters';
import textToSfxRouter from './routes/text-to-sfx';
import donationEffectsRouter from './routes/donation-effects';
import twitchAccountInfoRouter from './routes/twitch-account-info';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';
import creatorProfileFromReferral from './routes/creator-profile-from-referral';
import referralRouter from './routes/referral-history';
import claimRewardsRouter from './routes/claim-rewards';
import dripRouter from './routes/drip';
import siweRouter from './routes/siwe';
import { AppDataSource, initializeDatabase } from './db/database';
import { Creator } from './db/entities';
import { isAllowedOrigin, openCors } from './config/cors';
import { MAIN_LANDING_LINK } from '@idriss-xyz/constants';

initializeDatabase()
  .then(() => console.log('DB connected...'))
  .catch((err) => console.error('Error during DB initialization:', err));

const app: Application = express();
app.use(express.json());

app.use(openCors);

const server = http.createServer(app);
app.use('/tip-history', tipHistoryRouter);
app.use('/donor-history', donorHistoryRouter);
app.use('/recipient-history', recipientHistoryRouter);
app.use('/creator-leaderboard', creatorLeaderboardRouter);
app.use('/donor-leaderboard', donorLeaderboardRouter);
app.use('/force-refresh-ens', refetchENSRouter);
app.use('/text-to-speech', textToSpeechRouter);
app.use('/token-price', tokenPriceRouter);
app.use('/creator-profile', creatorProfileRouter);
app.use('/get-balances', getBalances);
app.use('/donation-parameters', donationParametersRouter);
app.use('/donation-effects', donationEffectsRouter);
app.use('/text-to-sfx', textToSfxRouter);
app.use('/twitch-account-info', twitchAccountInfoRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/referral-history', referralRouter);
app.use('/claim-rewards', claimRewardsRouter);
app.use('/drip', dripRouter);
app.use('/creator-profile-from-referral', creatorProfileFromReferral);
app.use('/siwe', siweRouter);

const HOST = process.env.HOST;
const PORT = Number(process.env.PORT) || 4000;
if (!HOST || !PORT) {
  console.error('HOST and PORT must be provided');
  process.exit(1);
}

const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, cb) =>
      isAllowedOrigin(origin) ? cb(null, true) : cb(new Error('CORS blocked')),
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

// Socket.IO connection handler (mirroring your copilot-api)
io.on('connection', (socket: Socket) => {
  console.log('Client connected');

  socket.on('register', (userId: string) => {
    const userIdLower = userId.toLowerCase();
    const clients = connectedClients.get(userIdLower) || new Set<Socket>();
    clients.add(socket);
    connectedClients.set(userIdLower, clients);
    socket.data.userId = userIdLower;
  });

  socket.on('disconnect', () => {
    const userId = socket.data.userId as string | undefined;
    if (userId) {
      const clients = connectedClients.get(userId);
      if (clients) {
        clients.delete(socket);
        if (clients.size === 0) {
          connectedClients.delete(userId);
        }
      }
    }
  });
});

// a dedicated namespace for OBS overlays:
const overlayWS = io.of('/overlay');

overlayWS.use(async (socket: Socket, next) => {
  const { overlayToken } = socket.handshake.auth as { overlayToken?: string };
  if (!overlayToken) return next(new Error('auth error'));

  const creatorRepo = AppDataSource.getRepository(Creator);
  const creator = await creatorRepo.findOne({
    where: {
      obsUrl: `${MAIN_LANDING_LINK}/donation-overlay/${overlayToken}`,
    },
  });

  if (!creator) return next(new Error('invalid overlay token'));

  socket.data.userId = creator.privyId.toLowerCase();
  next();
});

overlayWS.on('connection', async (socket) => {
  const userId = socket.data.userId as string;
  const creatorRepo = AppDataSource.getRepository(Creator);
  const creator = await creatorRepo.findOneBy({ privyId: userId });

  if (!creator) {
    console.error(
      `Creator with privyId ${userId} not found for socket connection.`,
    );
    socket.disconnect();
    return;
  }

  console.log('Overlay connected for', userId);
  socket.join(userId);

  if (creator.forceDonationOverlayRefresh) {
    console.log('Forcing update');
    socket.emit('forceRefresh');

    await creatorRepo.update(
      { id: creator.id },
      { forceDonationOverlayRefresh: false },
    );
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Creator API Socket server is running');
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
