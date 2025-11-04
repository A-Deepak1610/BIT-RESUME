package main

import (
	"bitresume/config"
	"bitresume/jobs"
	// "bitresume/jobs"
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
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:5174"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}
	r.Use(cors.New(corsConfig))
	
	routes.RegisterRoutes(r)
	c := cron.New(cron.WithSeconds())
	//seconds minute hour day month dayOfWeek
	_, errCron := c.AddFunc("0 9 9 * * *", jobs.UpdatePsData)	//PS
	if errCron != nil {
		panic("Failed to schedule cron job for Update Ps Data: " + errCron.Error())
	}
	_, errCron = c.AddFunc("0 51 10 * * *", jobs.UpdateMentorShipsData) //Mentorships
	if errCron != nil {
		panic("Failed to schedule cron job for mentorships: " + errCron.Error())
	}
	_, errCron = c.AddFunc("0 57 23 * * *", jobs.CallDailyTasksForAllDates) //Daily Task
	if errCron != nil {
		panic("Failed to schedule cron job for Daily Activity: " + errCron.Error())
	}
	c.Start()
	r.Run(":6001")
}