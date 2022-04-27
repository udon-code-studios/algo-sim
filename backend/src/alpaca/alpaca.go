package alpaca

import (
	"fmt"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v2/marketdata"
	f "subparoprogramming.org/algosim-backend/funcs"
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

func GetBarsMinute(symbol string, start time.Time, end time.Time) []Bar {
	// get bars from Alpaca Market Data API
	alpacaBars, err := marketdata.GetBars(symbol, marketdata.GetBarsParams{
		TimeFrame: marketdata.NewTimeFrame(1, "Min"),
		Start:     start,
		End:       end,
	})
	f.CheckError(err)

	// filter out bars outside normal trading hours
	// normal trading hours (UTC): 13:30 - 19:59
	n := 0
	for _, alpacaBar := range alpacaBars {
		hour, min, _ := alpacaBar.Timestamp.Clock()
		if (hour >= 13) && (hour <= 19) { // between 13:00 - 19:59
			if (hour == 13) && (min < 30) { // between 13:00 - 13:29
				continue
			}
			alpacaBars[n] = alpacaBar
			n++
		}
	}

	// convert bars from Alpaca API to Bar structs
	bars := make([]Bar, n)
	for i := 0; i < n; i++ {
		bars[i] = Bar{
			Timestamp: alpacaBars[i].Timestamp,
			Open:      alpacaBars[i].Open,
			High:      alpacaBars[i].High,
			Low:       alpacaBars[i].Low,
			Close:     alpacaBars[i].Close,
			Volume:    alpacaBars[i].Volume,
		}
	}

	return bars
}

func GetBarsMinuteLast2Days(symbol string, start time.Time, end time.Time) {
	// if start is a Saturday, Sunday, Monday, or Tuesday, make sure there's two business days prior
	switch start.Weekday() {
	case time.Saturday:
		start = start.AddDate(0, 0, -2)
	case time.Sunday:
		start = start.AddDate(0, 0, -3)
	case time.Monday:
		start = start.AddDate(0, 0, -4)
	case time.Tuesday:
		start = start.AddDate(0, 0, -4)
	}

	// print start day of week
	fmt.Println("start day of week:", start.Weekday())
}
