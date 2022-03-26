//           G    G    B    Y    Y
let word = ['S', 'A', 'L', 'E', 'T'];

const alphabet = Array.from({ length: 26 }, (e, i) => String.fromCharCode(i + 65));

const remainingAlphabet = alphabet.filter((e) => {
  return (e != 'L');
});

word = ['S', 'A', 'E', 'T', 4]
showCombinations(word, 4, remainingAlphabet);

word = ['S', 'A', 'T', 3, 'E']
showCombinations(word, 3, remainingAlphabet);

word = ['S', 'A', 2, 'T', 'E']
showCombinations(word, 2, remainingAlphabet);

function showCombinations(word, index, remainingAlphabet) {
  for (const letter of remainingAlphabet) {
    word[index] = letter;
    console.log(word.join(''), '\n');
  }
  console.log('--------------------\n');
}

const Alpaca = require('@alpacahq/alpaca-trade-api')

const alpaca = new Alpaca();

async function getTrades() {
  const ticker = 'INTC';
  const start = new Date('February 24, 2022 09:30:00').toISOString();
  const end = new Date('February 24, 2022 10:00:00').toISOString();
  const limit = 3;

  const res1 = await alpaca.getLatestTrade('AAPL'); // returns a Promise
  //console.log(res1);

  const trades = [];

  try {
    const res2 = alpaca.getTradesV2(ticker, { start: start, end: end, limit: limit }); // returns an AsyncGenerator
    let counter = 0
    for await (const trade of res2) {
      console.log(counter);
      console.log(trade);
      trades.push(trade);
      counter++;
    }
  } catch (e) {
    console.log('[ERROR] error when requesting trades:', e);
  }

  console.log('keep going!');
  console.log(trades);
}

getTrades();
