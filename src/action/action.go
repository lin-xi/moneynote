package action

import (
	"html/template"
	"log"
	"net/http"
)

func IndexAction(w http.ResponseWriter, r *http.Request) {
	log.Println("IndexAction")
	processHtml("index.html", w, r)
}

func BoxAction(w http.ResponseWriter, r *http.Request) {
	log.Println("BoxAction")
	processHtml("box.html", w, r)
}

func ChartAction(w http.ResponseWriter, r *http.Request) {
	log.Println("ChartAction")
	processHtml("chart.html", w, r)
}

func processHtml(url string, w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("../webapp/" + url)
	if err != nil {
		log.Println(err)
	}
	t.Execute(w, nil)
}
