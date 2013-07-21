package api

import (
	"bytes"
	"dao"
	"encoding/json"
	"gorilla/mux"
	"log"
	"net/http"
	"strconv"
)

type Result struct {
	Code int
	Data interface{}
}

func ConsumeItemService(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	curd := vars["curd"]

	err := r.ParseForm()
	if err != nil {
		log.Fatal(err)
	}
	cid := r.FormValue("id")
	cname := r.FormValue("name")

	iid := 0
	if cid != "" {
		iid, err = strconv.Atoi(cid)
		if err != nil {
			log.Fatal(err)
		}
	}

	log.Println("[ConsumeItemService] ", curd, iid, cname)

	cdao := dao.GetConsumeItemDao()
	ret := cdao.Execute(curd, iid, cname)
	log.Println("[result] ", ret)
	writeResult(w, 200, ret)
}

func ConsumeAccountService(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	curd := vars["curd"]

	err := r.ParseForm()
	if err != nil {
		log.Fatal(err)
	}
	fid := r.FormValue("id")
	fcategory := r.FormValue("category")
	fgoods := r.FormValue("goods")
	famount := r.FormValue("amount")
	fcreatetime := r.FormValue("createtime")

	if r.Method == "GET" {
		v := r.URL.Query()
		fcreatetime = v["createtime"][0]
	}
	iid := 0
	var icreatetime int64 = 0
	iamount := 0.0
	if fid != "" {
		iid, err = strconv.Atoi(fid)
	}
	if fcreatetime != "" {
		icreatetime, err = strconv.ParseInt(fcreatetime, 10, 64)
	}
	if famount != "" {
		iamount, err = strconv.ParseFloat(famount, 64)
	}

	cdao := dao.GetConsumeAccountDao()
	ret := cdao.Execute(curd, iid, fcategory, fgoods, iamount, icreatetime)
	log.Println("[result] ", ret)
	writeResult(w, 200, ret)
}

func toString(data interface{}) string {
	b, err := json.Marshal(data)
	if err != nil {
		log.Fatal(err)
	}
	return bytes.NewBuffer(b).String()
}

func writeResult(w http.ResponseWriter, code int, data interface{}) {
	w.Header().Set("content-type", "text/plain")
	ret := &Result{200, data}
	b, err := json.Marshal(ret)
	if err != nil {
		log.Fatal(err)
	}
	w.Write(b)
}
