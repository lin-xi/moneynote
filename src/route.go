package main

import (
	"action"
	"api"
	"html/template"
	"log"
	"net/http"
)

var actions = map[string]func(http.ResponseWriter, *http.Request){
	"/index": action.IndexAction,
	"/box":   action.BoxAction,
	"/chart": action.ChartAction,
}
var apis = map[string]func(http.ResponseWriter, *http.Request){
	"/api/consumeItem/{curd}":    api.ConsumeItemService,
	"/api/consumeAccount/{curd}": api.ConsumeAccountService,
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		http.Redirect(w, r, "/index", http.StatusFound)
	}

	t, err := template.ParseFiles("../webapp/404.html")
	if err != nil {
		log.Println(err)
	}
	t.Execute(w, nil)
}
