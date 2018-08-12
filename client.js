const Nes = require('nes');

const client = new Nes.Client('ws://localhost:4000');
const start = async() => {

  await client.connect();
  const handler = (update, flags) => {

  };

  client.subscribe('/chat');
};

start();
