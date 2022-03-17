const Alpaca = require('@alpacahq/alpaca-trade-api')

const alpaca = new Alpaca();

alpaca.getLatestTrade('AAPL').then((res) => { console.log(res); });

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
