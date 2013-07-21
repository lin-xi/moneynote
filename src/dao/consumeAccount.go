package dao

import (
	"constant"
	"db"
	"github.com/garyburd/go-mongo/mongo"
	"log"
	"strconv"
	"time"
)

type ConsumeAccountDao struct {
}

func (cs *ConsumeAccountDao) Model(id int, category string, goods string, amount float64, createtime int64) mongo.M {
	mo := make(mongo.M)
	if id != 0 {
		mo["id"] = id
	}
	if category != "" {
		mo["category"] = category
	}
	if goods != "" {
		mo["goods"] = goods
	}
	if amount != 0 {
		mo["amount"] = amount
	}
	if createtime != 0 {
		mo["createtime"] = createtime
	}
	return mo
}

func (cs *ConsumeAccountDao) Execute(curd string, id int, category string, goods string, amount float64, createtime int64) interface{} {
	log.Println("ConsumeAccountDao[Execute]", curd, id, category, goods, amount, createtime)
	var ret interface{}
	dbm := db.GetdbManager()
	dbm.Use(constant.CONSUMEACCOUNT)

	switch curd {
	case "next":
		ret = cs.next(dbm)
	case "queryAll":
		ret = cs.queryAll(dbm)
	case "queryByDay":
		ret = cs.queryByDay(dbm, createtime)
	case "queryByMonth":
		ret = cs.queryByMonth(dbm, createtime)
	case "add":
		ret = cs.add(dbm, category, goods, amount, createtime)
		dbm.Flush()
	case "update":
		ret = cs.update(dbm, id, category, goods, amount)
		dbm.Flush()
	case "delete":
		ret = cs.remove(dbm, id)
		dbm.Flush()
	}

	defer dbm.Conn.Close()
	return ret
}

func (cs *ConsumeAccountDao) next(dbm *db.DbManager) int {
	log.Println("ConsumeAccountDao[next]")

	cursor, err := dbm.Collection.Find(nil).Sort(mongo.D{{"id", -1}}).Cursor()
	if err != nil {
		log.Fatal(err)
	}
	id := 1000
	var m mongo.M
	if cursor.HasNext() {
		err = cursor.Next(&m)
		if err != nil {
			log.Fatal(err)
		}
		dbm.Database.C("")
		id = m["id"].(int) + 1
	}
	return id
}

func (cs *ConsumeAccountDao) queryAll(dbm *db.DbManager) []mongo.M {
	log.Println("ConsumeAccountDao[queryAll]")

	cursor, err := dbm.Collection.Find(nil).Sort(mongo.D{{"id", 1}}).Cursor()
	if err != nil {
		log.Fatal(err)
	}

	var arr []mongo.M
	for cursor.HasNext() {
		var m mongo.M
		err := cursor.Next(&m)
		if err != nil {
			log.Fatal(err)
		}

		cname := cs.queryCategoryName(dbm, m["category"].(string))
		m["category_name"] = cname

		arr = append(arr, m)
	}
	return arr
}

func (cs *ConsumeAccountDao) queryByDay(dbm *db.DbManager, createtime int64) []mongo.M {
	log.Println("ConsumeAccountDao[queryByDay]")

	cursor, err := dbm.Collection.Find(mongo.M{"createtime": createtime}).Sort(mongo.D{{"id", 1}}).Cursor()
	if err != nil {
		log.Fatal(err)
	}

	var arr []mongo.M
	for cursor.HasNext() {
		var m mongo.M
		err := cursor.Next(&m)
		if err != nil {
			log.Fatal(err)
		}
		cname := cs.queryCategoryName(dbm, m["category"].(string))
		m["category_name"] = cname
		arr = append(arr, m)
	}
	return arr
}

func (cs *ConsumeAccountDao) queryByMonth(dbm *db.DbManager, createtime int64) []mongo.M {
	log.Println("ConsumeAccountDao[queryByMonth]")
	endtime := cs.getLastDateTime(createtime)
	log.Println(createtime, endtime)
	cursor, err := dbm.Collection.Find(mongo.M{"createtime": mongo.M{"$gte": createtime, "$lte": endtime}}).Sort(mongo.D{{"id", 1}}).Cursor()
	log.Println(cursor)
	if err != nil {
		log.Fatal(err)
	}

	var arr []mongo.M
	for cursor.HasNext() {
		var m mongo.M
		err := cursor.Next(&m)
		if err != nil {
			log.Fatal(err)
		}
		cname := cs.queryCategoryName(dbm, m["category"].(string))
		m["category_name"] = cname
		arr = append(arr, m)
	}
	return arr
}

func (cs *ConsumeAccountDao) queryCategoryName(dbm *db.DbManager, id string) string {
	var mi mongo.M
	iid, err := strconv.Atoi(id)
	if err != nil {
		log.Fatal(err)
	}

	cursor, err := dbm.Database.C(constant.CONSUMEITEM).Find(mongo.M{"id": iid}).Cursor()
	if err != nil {
		log.Fatal(err)
	}
	if cursor.HasNext() {
		err := cursor.Next(&mi)
		if err != nil {
			log.Fatal(err)
		}
		return mi["name"].(string)
	}
	return "其他"
}

func (cs *ConsumeAccountDao) add(dbm *db.DbManager, category string, goods string, amount float64, createtime int64) bool {
	log.Println("ConsumeAccountDao[add]", category, goods, amount, createtime)

	id := cs.next(dbm)
	err := dbm.Collection.Insert(cs.Model(id, category, goods, amount, createtime))
	if err != nil {
		log.Fatal(err)
		return false
	}
	return true
}

func (cs *ConsumeAccountDao) remove(dbm *db.DbManager, id int) bool {
	log.Println("ConsumeAccountDao[remove]")

	err := dbm.Collection.Remove(cs.Model(id, "", "", 0, 0))
	if err != nil {
		log.Fatal(err)
		return false
	}
	return true
}

func (cs *ConsumeAccountDao) update(dbm *db.DbManager, id int, category string, goods string, amount float64) bool {
	log.Println("ConsumeAccountDao[update]")
	err := dbm.Collection.Update(cs.Model(id, "", "", 0, 0), mongo.M{"$set": cs.Model(0, category, goods, amount, 0)})
	if err != nil {
		log.Fatal(err)
		return false
	}
	return true
}

func (cs *ConsumeAccountDao) getLastDateTime(datatime int64) int64 {
	log.Println("[getLastDateTime]")

	days := map[string]int{
		"January":   31,
		"February":  28,
		"March":     31,
		"Apirl":     30,
		"May":       31,
		"June":      30,
		"July":      31,
		"August":    31,
		"September": 30,
		"October":   31,
		"November":  30,
		"December":  31,
	}
	startTime := time.Unix(datatime/1000, 0)
	log.Println(startTime)
	year := startTime.Year()
	log.Println(year)
	month := startTime.Month().String()
	log.Println(month)
	monthDays, _ := days[month]
	log.Println(monthDays)
	if month == "February" {
		if (year%4 == 0 && year%100 != 0) || year%400 == 0 {
			monthDays = 29
		}
	}
	return startTime.AddDate(0, 0, monthDays).Unix() * 1000
}
