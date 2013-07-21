package dao

import (
	"constant"
	"db"
	"github.com/garyburd/go-mongo/mongo"
	"log"
)

type ConsumeItemDao struct {
}

func (cs *ConsumeItemDao) Model(id int, name string) mongo.M {
	if id != 0 {
		if name != "" {
			return mongo.M{"id": id, "name": name}
		} else {
			return mongo.M{"id": id}
		}
	}
	return mongo.M{"name": name}
}

func (cs *ConsumeItemDao) Execute(curd string, id int, name string) interface{} {
	log.Println("ConsumeItemService[Execute]", curd, id, name)
	var ret interface{}
	dbm := db.GetdbManager()
	dbm.Use(constant.CONSUMEITEM)

	switch curd {
	case "next":
		ret = cs.next(dbm)
	case "queryAll":
		ret = cs.queryAll(dbm)
	case "add":
		ret = cs.add(dbm, name)
		dbm.Flush()
	case "update":
		ret = cs.update(dbm, id, name)
		dbm.Flush()
	case "delete":
		ret = cs.remove(dbm, id)
		dbm.Flush()
	}

	defer dbm.Conn.Close()
	return ret
}

func (cis *ConsumeItemDao) next(dbm *db.DbManager) int {
	log.Println("next")

	cursor, err := dbm.Collection.Find(nil).Sort(mongo.D{{"id", -1}}).Cursor()
	if err != nil {
		log.Fatal(err)
	}
	id := 1000
	var m mongo.M
	if cursor.HasNext() {
		err = cursor.Next(&m)
		if err != nil {
			log.Println(err)
		}
		id = m["id"].(int) + 1
	}
	log.Println(id)
	return id
}

func (cis *ConsumeItemDao) queryAll(dbm *db.DbManager) []mongo.M {
	log.Println("[queryAll consumeItem]")

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
		arr = append(arr, m)
	}
	return arr
}

func (cs *ConsumeItemDao) add(dbm *db.DbManager, name string) bool {
	log.Println("[add consumeItem]")

	id := cs.next(dbm)
	err := dbm.Collection.Insert(cs.Model(id, name))
	if err != nil {
		log.Fatal(err)
		return false
	}
	return true
}

func (cs *ConsumeItemDao) remove(dbm *db.DbManager, id int) bool {
	log.Println("[remove consumeItem]")

	err := dbm.Collection.Remove(cs.Model(id, ""))
	if err != nil {
		log.Fatal(err)
		return false
	}
	return true
}

func (cs *ConsumeItemDao) update(dbm *db.DbManager, id int, name string) bool {

	err := dbm.Collection.Update(cs.Model(id, ""), mongo.M{"$set": cs.Model(0, name)})
	if err != nil {
		log.Fatal(err)
		return false
	}
	return true
}
