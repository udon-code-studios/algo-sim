package main

import (
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v2/marketdata"
)

type Bar struct {
	Timestamp time.Time `json:"t"`
	Open      float64   `json:"o"`
	High      float64   `json:"h"`
	Low       float64   `json:"l"`
	Close     float64   `json:"c"`
	Volume    uint64    `json:"v"`
}

type Trade struct {
	Timestamp time.Time `json:"t"`
	Price     float64   `json:"p"`
	Size      uint32    `json:"s"`
}

func getBarsMinute(symbol string, start time.Time, end time.Time) []Bar {
	// get bars from Alpaca Market Data API
	alpacaBars, err := marketdata.GetBars(symbol, marketdata.GetBarsParams{
		TimeFrame: marketdata.NewTimeFrame(1, "Min"),
		Start:     start,
		End:       end,
	})
	checkError(err)

	// convert bars from Alpaca API to Bar structs
	bars := make([]Bar, len(alpacaBars))
	for i, alpacaBar := range alpacaBars {
		bars[i] = Bar{
			Timestamp: alpacaBar.Timestamp,
			Open:      alpacaBar.Open,
			High:      alpacaBar.High,
			Low:       alpacaBar.Low,
			Close:     alpacaBar.Close,
			Volume:    alpacaBar.Volume,
		}
	}

	return bars
}
