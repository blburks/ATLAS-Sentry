import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { simulator, worldSnapshot } from './world';

const PORT = Number(process.env.PORT ?? 3001);
const TICK_INTERVAL_MS = Number(process.env.TICK_INTERVAL_MS ?? 1000);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', tick: simulator.getTickCount() });
});

app.get('/api/state', (_req, res) => {
  res.json(worldSnapshot());
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.emit('state', worldSnapshot());

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

setInterval(() => {
  simulator.tick();
  io.emit('state', worldSnapshot());
}, TICK_INTERVAL_MS);

httpServer.listen(PORT, () => {
  console.log(`ATLAS-Sentry server listening on port ${PORT}`);
});
