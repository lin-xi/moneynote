package dao

func GetConsumeItemDao() *ConsumeItemDao {
	return new(ConsumeItemDao)
}

func GetConsumeAccountDao() *ConsumeAccountDao {
	return new(ConsumeAccountDao)
}
