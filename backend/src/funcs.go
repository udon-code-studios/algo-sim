package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"
)

func checkError(err error) {
	if err != nil {
		_, filename, line, _ := runtime.Caller(1)
		fmt.Printf("[ ERROR ] %s:%d %v\n", filename, line, time.Now())
		log.Print(err)
	}
}

func randomHexString(len int) string {
	randomBytes := make([]byte, len)
	rand.Read(randomBytes)
	return hex.EncodeToString(randomBytes)[:len]
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
