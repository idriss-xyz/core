import { mode } from './utils/mode';
import { configureEnv } from './config/environment';

configureEnv(mode, __dirname);

import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { connectedClients } from './services/socket-server';
import tipHistoryRouter from './routes/tip-history';
import donorHistoryRouter from './routes/donor-history';
import creatorLeaderboardRouter from './routes/creator-leaderboard';
import donorLeaderboardRouter from './routes/donor-leaderboard';
import pushDonationRouter from './routes/push-donation';
import overwriteDonationRouter from './routes/overwrite-donation';
import refetchDonationRouter from './routes/refetch-donations';
import refetchENSRouter from './routes/force-refresh-ens';
import textToSpeechRouter from './routes/text-to-speech';
import creatorsRouter from './routes/creators';
import creatorProfileRouter from './routes/creator-profile';
import textToSfxRouter from './routes/text-to-sfx';
import donationEffectsRouter from './routes/donation-effects';
import cors from 'cors';
import { initializeDatabase } from './db/database';

initializeDatabase()
  .then(() => console.log('DB connected...'))
  .catch((err) => console.error('Error during DB initialization:', err));

const app: Application = express();
app.use(express.json());

app.use(
  cors({
    origin: '*',
  }),
);

const server = http.createServer(app);
app.use('/tip-history', tipHistoryRouter);
app.use('/donor-history', donorHistoryRouter);
app.use('/creator-leaderboard', creatorLeaderboardRouter);
app.use('/donor-leaderboard', donorLeaderboardRouter);
app.use('/push-donation', pushDonationRouter);
app.use('/overwrite-donation', overwriteDonationRouter);
app.use('/refetch-donations', refetchDonationRouter);
app.use('/force-refresh-ens', refetchENSRouter);
app.use('/text-to-speech', textToSpeechRouter);
app.use('/creators', creatorsRouter);
app.use('/creator-profile', creatorProfileRouter);
app.use('/donation-effects', donationEffectsRouter);
app.use('/text-to-sfx', textToSfxRouter);

const HOST = process.env.HOST;
const PORT = Number(process.env.PORT) || 4000;
if (!HOST || !PORT) {
  console.error('HOST and PORT must be provided');
  process.exit(1);
}

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handler (mirroring your copilot-api)
io.on('connection', (socket: Socket) => {
  console.log('Client connected');

  socket.on('register', (userId: string) => {
    const clients = connectedClients.get(userId) || new Set<Socket>();
    clients.add(socket);
    connectedClients.set(userId, clients);
    socket.data.userId = userId;
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

app.get('/', (req: Request, res: Response) => {
  res.send('Creator API Socket server is running');
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
