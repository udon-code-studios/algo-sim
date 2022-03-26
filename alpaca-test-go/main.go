package main

import (
	"fmt"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v2/marketdata"
)

func main() {
	// load EST time zone
	loc, err := time.LoadLocation("EST") // use other time zones such as MST, IST
	CheckError(err)

	// get trades from Alpaca Market Data API
	trades, err := marketdata.GetTrades("INTC", marketdata.GetTradesParams{
		Start:      time.Date(2022, 3, 17, 9, 30, 0, 0, loc),
		TotalLimit: 3,
	})
	CheckError(err)

	// print trades
	fmt.Printf("INTC trades\n")
	for _, alpacaTrade := range trades {
		trade := AlpacaTradeToTrade(alpacaTrade)
		fmt.Printf("%+v\n", trade)
	}
	fmt.Printf("\n")

	// get bars from Alpaca Market Data API
	bars, err := marketdata.GetBars("INTC", marketdata.GetBarsParams{
		TimeFrame: marketdata.NewTimeFrame(1, "Min"),
		Start:     time.Date(2022, 3, 17, 9, 30, 0, 0, loc),
		End:       time.Date(2022, 3, 17, 9, 30, 0, 0, loc),
	})
	CheckError(err)

	// print bars
	fmt.Printf("INTC bars\n")
	for _, alpacaBar := range bars {
		bar := AlpacaBarToBar(alpacaBar)
		fmt.Printf("%+v\n", bar)
	}
	fmt.Printf("\n")
}

func AlpacaTradeToTrade(alpacaTrade marketdata.Trade) Trade {
	return Trade{
		Timestamp: alpacaTrade.Timestamp,
		Price:     alpacaTrade.Price,
		Size:      alpacaTrade.Size,
	}
}

func AlpacaBarToBar(alpacaBar marketdata.Bar) Bar {
	return Bar{
		Timestamp: alpacaBar.Timestamp,
		Open:      alpacaBar.Open,
		High:      alpacaBar.High,
		Low:       alpacaBar.Low,
		Close:     alpacaBar.Close,
		Volume:    alpacaBar.Volume,
	}
}

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}
