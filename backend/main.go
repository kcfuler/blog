package main

import (
	"blog/handlers"
	"blog/middleware"
	"blog/models"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func main() {
	// 设置JWT密钥
	jwtKey := os.Getenv("JWT_SECRET_KEY")
	if jwtKey == "" {
		jwtKey = "your-secret-key" // 默认密钥，仅用于开发环境
	}
	middleware.SetJWTKey([]byte(jwtKey))

	// 连接数据库
	db, err := gorm.Open("sqlite3", "blog.db")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// 自动迁移数据库表
	db.AutoMigrate(&models.User{}, &models.Post{})

	// 创建处理器
	userHandler := &handlers.UserHandler{DB: db}
	postHandler := &handlers.PostHandler{DB: db}

	// 创建路由
	r := gin.Default()

	// 设置受信任的代理
	r.SetTrustedProxies([]string{"127.0.0.1", "::1"})

	// CORS配置
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:5173"}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// API 路由组
	api := r.Group("/api")
	{
		// 用户认证路由
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)

		// 需要认证的路由
		auth := api.Group("")
		auth.Use(middleware.AuthMiddleware())
		{
			// 用户相关
			auth.GET("/profile", userHandler.GetProfile)

			// 博客文章相关
			auth.POST("/posts", postHandler.Create)
			auth.GET("/posts", postHandler.GetAll)
			auth.GET("/posts/:id", postHandler.GetOne)
			auth.PUT("/posts/:id", postHandler.Update)
			auth.DELETE("/posts/:id", postHandler.Delete)
		}
	}

	// 启动服务器
	if err := r.Run(":8000"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
