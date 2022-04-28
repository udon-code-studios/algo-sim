// enum BUY, HOLD, SELL
const BUY = Symbol("buy");
const HOLD = Symbol("hold");
const SELL = Symbol("sell");

/**
 * tradeOnTheMinute will execute at the close of each minute
 * for the given stock. The bars argument is indexed with
 * bars[bars.length] being the most recent minute and bars[0]
 * being the first minute of the previous trading day (relative
 * to the minute this function is being executed on).
 *
 * e.g. If bars[length].t is 2022/04/20 2:43 PM EST,
 *         then bars[0].t is 2022/04/19 9:30 AM EST.
 *
 * @param {[
 *   {
 *     t: string, // timestamp
 *     o: number, // open price
 *     h: number, // high price
 *     l: number, // low price
 *     c: number, // close price
 *     v: number  // volume
 *   }, ...
 * ]} bars
 *
 * enum Action {BUY, HOLD, SELL}
 *
 * @returns {Action}
 */
function tradeOnTheMinute(bars) {
  // complete function
  if (Math.random() > 2) {
    return BUY;
  } else {
    return SELL;
  }
}
var data = require("./data.json");

// cash variables
const starting = 100.0;
let value = starting;
let lastBuyPrice = 0.0;
let change = 0.0;
let own = false;

// loop through each minute, starting on the second day (390 minutes in each trading day)
let minuteData;
for (let i = 390 * 2 + 1; i < data.length; i++) {
  // last 780 minutes of data + this minute
  minuteData = data.slice(i - 390 * 2 - 1, i);

  switch (tradeOnTheMinute(minuteData)) {
    case BUY:
      if (!own) {
        console.log(`[ BUY  ] ${data[i].t} $${data[i].c}`);
        lastBuyPrice = data[i].c;
        own = true;
      }
      break;
    case HOLD:
      // console.log(`[ STATUS ] ${data[i].t} HOLD`);
      break;
    case SELL:
      if (own) {
        console.log(`[ SELL ] ${data[i].t} $${data[i].c}`);
        change = (data[i].c - lastBuyPrice) / lastBuyPrice;
        value += change * value;
        own = false;
      }
      break;
    default:
      console.log("[ ERROR ] unknown action:", tradeOnTheMinute(minuteData));
      break;
  }
}

// calculate final value if not sold
if (own) {
  change = (data[data.length - 1].c - lastBuyPrice) / lastBuyPrice;
  value += change * value;
}

// calculate total change
change = (value - starting) / starting;

console.log("--- 81013ead69efefbf334d ---");
console.log(change.toFixed(4));
