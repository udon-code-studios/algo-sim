require('dotenv').config();

const CLIENT_ID = process.env.APCA_API_KEY_ID;
const CLIENT_SECRET = process.env.APCA_API_SECRET_KEY;

// check if client id and secret were found
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log('[ ERROR ] Client ID and/or client secret not found.');
  console.log('[ STATUS ] Exiting...');
  process.exit();
}

async function getTrades() {
  const ticker = 'INTC';
  const start = new Date('February 24, 2022 09:30:00').toISOString();
  const end = new Date('February 24, 2022 16:00:00').toISOString();
  const limit = 10;

  const res = await axios.get(`https://data.alpaca.markets/v2/stocks/${ticker}/trades?start=${start}&end=${end}&limit=${limit}`);

  const resBody = await res.json();

  return (resBody);
}

getTrades();