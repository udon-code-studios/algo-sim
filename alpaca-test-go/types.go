package main

import "time"

type Trade struct {
	Timestamp time.Time `json:"t"`
	Price     float64   `json:"p"`
	Size      uint32    `json:"s"`
}

type Bar struct {
	Timestamp time.Time `json:"t"`
	Open      float64   `json:"o"`
	High      float64   `json:"h"`
	Low       float64   `json:"l"`
	Close     float64   `json:"c"`
	Volume    uint64    `json:"v"`
}
