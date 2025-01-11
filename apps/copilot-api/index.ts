import express, { Request, Response } from 'express';
import { validateAlchemySignature } from './utils/webhookUtils';
import { webhookHandler } from './services/webhookHandler';
import dotenv from 'dotenv';
import { dataSource } from './db';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import authRoutes from './routes/auth';
import defaultRoutes from './routes';
import subscriptionsRoutes from './routes/subscribtions';
import { getSigningKey } from './services/subscriptionManager';
import { join } from 'path';
import { mode } from './utils/mode';
import { createConfig } from '@lifi/sdk';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

dataSource
  .initialize()
  .then(() => console.log('DB connected...'))
  .catch((err) => console.error('Error during DB initialization: ', err));

const app = express();

const server = http.createServer(app);

const HOST = process.env.HOST;
const PORT = +process.env.PORT! || 3000;

if (!PORT || !HOST) {
  console.error('variabes are not provided');
  process.exit(1);
}

const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Adjust this as needed for your security requirements
    methods: ['GET', 'POST'],
  },
});

// Map to store userId to socket mappings
const connectedClients = new Map<string, Socket>();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle client registration
  socket.on('register', (userId: string) => {
    connectedClients.set(userId, socket);
    // Store the userId in the socket object
    socket.data.userId = userId;
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    const userId = socket.data.userId;
    if (userId) {
      connectedClients.delete(userId);
    }
  });
});

app.post(
  '/webhook/:internalWebhookId',
  express.json({
    verify: (
      req: Request,
      res: Response,
      buf: Buffer,
      encoding: BufferEncoding,
    ) => {
      const rawBody = buf.toString(encoding);
      (req as any).rawBody = rawBody;
      (req as any).signature = req.headers['x-alchemy-signature'];
    },
  }),
  validateAlchemySignature(getSigningKey),
  webhookHandler(io, connectedClients),
);

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/subscriptions', subscriptionsRoutes);
app.use('/', defaultRoutes);

// Initialize LiFi SDK
createConfig({
  integrator: process.env.LIFI_INTEGRATOR_STRING ?? 'IDRISS',
  // apiKey: process.env.LIFI_API_KEY,
});

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

export default connectedClients;
