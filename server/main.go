package main
import (
	"bitresume/config"
	"bitresume/jobs"
	"bitresume/routes"
	"log"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)
func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}
	config.InitOAuth()
	config.InitDB()
	r := gin.Default()
	r.Static("/uploads", "./uploads")
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}
	r.Use(cors.New(corsConfig))
	routes.RegisterRoutes(r)
	c := cron.New(cron.WithSeconds())
	_, errCron := c.AddFunc("0 41 9 * * *", jobs.DailyTask)
	if errCron != nil {
		panic("Failed to schedule cron job: " + errCron.Error())
	}
	c.Start()
	r.Run(":6001")
}