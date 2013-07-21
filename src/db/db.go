package db

import (
	"github.com/garyburd/go-mongo/mongo"
	"log"
	"os"
)

func GetdbManager() *DbManager {
	return &DbManager{}
}

type DbManager struct {
	Conn       mongo.Conn
	Collection mongo.Collection
	Database   mongo.Database
}

func (dbm *DbManager) Use(collection string) {
	conn, err := mongo.Dial("localhost")
	if err != nil {
		log.Fatal(err)
	}

	// Wrap connection with logger so that we can view the traffic to and from
	// the server.
	dbm.Conn = mongo.NewLoggingConn(conn, log.New(os.Stdout, "", 0), "")
	// Clear the log prefix for more readable output.

	// Create a database object.
	dbm.Database = mongo.Database{conn, "moneynote", mongo.DefaultLastErrorCmd}

	// Create a collection object object for the "unicorns" collection.
	dbm.Collection = dbm.Database.C(collection)
}

func (dbm *DbManager) Flush() {
	dbm.Database.LastError(mongo.DefaultLastErrorCmd)
}
