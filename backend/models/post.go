package models

import (
	"github.com/jinzhu/gorm"
)

type Post struct {
	gorm.Model
	Title    string `gorm:"not null" json:"title"`
	Content  string `gorm:"not null" json:"content"`
	UserID   uint   `json:"user_id"`
	User     User   `json:"user"`
}
