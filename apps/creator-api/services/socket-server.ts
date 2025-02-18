import { Socket } from 'socket.io';

export const connectedClients = new Map<string, Set<Socket>>();
