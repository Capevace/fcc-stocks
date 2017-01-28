import io from 'socket.io-client';

const socket = io();

socket.on('connect', () => {
  console.info('Connected to server');
});

socket.on('disconnect', () => {
  console.info('Disconnected drom server');
});

export default socket;
