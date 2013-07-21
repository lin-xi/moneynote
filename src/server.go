package main

import (
	"gorilla/mux"
	"log"
	"net/http"
)

func main() {
	http.Handle("/css/", http.FileServer(http.Dir("../webapp")))
	http.Handle("/images/", http.FileServer(http.Dir("../webapp")))
	http.Handle("/js/", http.FileServer(http.Dir("../webapp")))

	r := mux.NewRouter()
	for url, handler := range actions {
		r.HandleFunc(url, handler)
	}
	for url, handler := range apis {
		r.HandleFunc(url, handler)
	}
	http.Handle("/", r)

	err := http.ListenAndServe(":80", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
	log.Println("●server listen at 80")
}
