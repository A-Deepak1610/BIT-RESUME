-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: bitresume
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `achievement_graph`
--

DROP TABLE IF EXISTS `achievement_graph`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievement_graph` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rollno` varchar(255) NOT NULL,
  `cummulative_points` decimal(10,2) DEFAULT NULL,
  `points_earned` decimal(10,2) DEFAULT NULL,
  `sem` int NOT NULL,
  `currdate` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=301 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievement_graph`
--

LOCK TABLES `achievement_graph` WRITE;
/*!40000 ALTER TABLE `achievement_graph` DISABLE KEYS */;
INSERT INTO `achievement_graph` VALUES (1,'STU001',6.67,6.67,1,'2025-01-01'),(2,'STU001',10.82,4.15,1,'2025-01-02'),(3,'STU001',16.29,5.47,1,'2025-01-03'),(4,'STU001',20.31,4.02,1,'2025-01-04'),(5,'STU001',26.97,6.66,1,'2025-01-05'),(6,'STU001',29.07,2.10,1,'2025-01-06'),(7,'STU001',35.76,6.69,1,'2025-01-07'),(8,'STU001',41.66,5.90,1,'2025-01-08'),(9,'STU001',45.60,3.94,1,'2025-01-09'),(10,'STU001',52.84,7.24,1,'2025-01-10'),(11,'STU001',56.16,3.32,1,'2025-01-11'),(12,'STU001',62.97,6.81,1,'2025-01-12'),(13,'STU001',68.05,5.08,1,'2025-01-13'),(14,'STU001',75.51,7.46,1,'2025-01-14'),(15,'STU001',80.01,4.50,1,'2025-01-15'),(16,'STU001',85.70,5.69,1,'2025-01-16'),(17,'STU001',87.49,1.79,1,'2025-01-17'),(18,'STU001',89.55,2.06,1,'2025-01-18'),(19,'STU001',92.15,2.60,1,'2025-01-19'),(20,'STU001',92.68,0.53,1,'2025-01-20'),(21,'STU001',99.37,6.69,1,'2025-01-21'),(22,'STU001',105.98,6.61,1,'2025-01-22'),(23,'STU001',112.12,6.14,1,'2025-01-23'),(24,'STU001',114.52,2.40,1,'2025-01-24'),(25,'STU001',120.94,6.42,1,'2025-01-25'),(26,'STU001',128.91,7.97,1,'2025-01-26'),(27,'STU001',130.30,1.39,1,'2025-01-27'),(28,'STU001',130.74,0.44,1,'2025-01-28'),(29,'STU001',135.27,4.53,1,'2025-01-29'),(30,'STU001',137.21,1.94,1,'2025-01-30'),(31,'STU001',142.12,4.91,1,'2025-01-31'),(32,'STU001',144.94,2.82,1,'2025-02-01'),(33,'STU001',150.17,5.23,1,'2025-02-02'),(34,'STU001',157.47,7.30,1,'2025-02-03'),(35,'STU001',162.37,4.90,1,'2025-02-04'),(36,'STU001',168.35,5.98,1,'2025-02-05'),(37,'STU001',169.55,1.20,1,'2025-02-06'),(38,'STU001',171.92,2.37,1,'2025-02-07'),(39,'STU001',172.91,0.99,1,'2025-02-08'),(40,'STU001',175.98,3.07,1,'2025-02-09'),(41,'STU001',183.13,7.15,1,'2025-02-10'),(42,'STU001',187.30,4.17,1,'2025-02-11'),(43,'STU001',192.57,5.27,1,'2025-02-12'),(44,'STU001',194.83,2.26,1,'2025-02-13'),(45,'STU001',197.81,2.98,1,'2025-02-14'),(46,'STU001',201.53,3.72,1,'2025-02-15'),(47,'STU001',201.70,0.17,1,'2025-02-16'),(48,'STU001',205.39,3.69,1,'2025-02-17'),(49,'STU001',206.12,0.73,1,'2025-02-18'),(50,'STU001',212.34,6.22,1,'2025-02-19'),(51,'STU001',213.95,1.61,1,'2025-02-20'),(52,'STU001',221.26,7.31,1,'2025-02-21'),(53,'STU001',224.13,2.87,1,'2025-02-22'),(54,'STU001',226.97,2.84,1,'2025-02-23'),(55,'STU001',227.21,0.24,1,'2025-02-24'),(56,'STU001',229.83,2.62,1,'2025-02-25'),(57,'STU001',230.18,0.35,1,'2025-02-26'),(58,'STU001',231.38,1.20,1,'2025-02-27'),(59,'STU001',231.74,0.36,1,'2025-02-28'),(60,'STU001',236.56,4.82,1,'2025-03-01'),(61,'STU001',237.01,0.45,1,'2025-03-02'),(62,'STU001',238.88,1.87,1,'2025-03-03'),(63,'STU001',246.22,7.34,1,'2025-03-04'),(64,'STU001',250.11,3.89,1,'2025-03-05'),(65,'STU001',254.97,4.86,1,'2025-03-06'),(66,'STU001',258.06,3.09,1,'2025-03-07'),(67,'STU001',261.86,3.80,1,'2025-03-08'),(68,'STU001',264.36,2.50,1,'2025-03-09'),(69,'STU001',271.56,7.20,1,'2025-03-10'),(70,'STU001',275.45,3.89,1,'2025-03-11'),(71,'STU001',280.86,5.41,2,'2025-03-12'),(72,'STU001',286.12,5.26,2,'2025-03-13'),(73,'STU001',290.43,4.31,2,'2025-03-14'),(74,'STU001',292.41,1.98,2,'2025-03-15'),(75,'STU001',295.26,2.85,2,'2025-03-16'),(76,'STU001',303.26,8.00,2,'2025-03-17'),(77,'STU001',309.04,5.78,2,'2025-03-18'),(78,'STU001',315.03,5.99,2,'2025-03-19'),(79,'STU001',323.01,7.98,2,'2025-03-20'),(80,'STU001',328.52,5.51,2,'2025-03-21'),(81,'STU001',335.84,7.32,2,'2025-03-22'),(82,'STU001',342.83,6.99,2,'2025-03-23'),(83,'STU001',346.28,3.45,2,'2025-03-24'),(84,'STU001',354.20,7.92,2,'2025-03-25'),(85,'STU001',356.31,2.11,2,'2025-03-26'),(86,'STU001',360.25,3.94,2,'2025-03-27'),(87,'STU001',365.88,5.63,2,'2025-03-28'),(88,'STU001',366.29,0.41,2,'2025-03-29'),(89,'STU001',367.71,1.42,2,'2025-03-30'),(90,'STU001',373.94,6.23,2,'2025-03-31'),(91,'STU001',378.67,4.73,2,'2025-04-01'),(92,'STU001',379.95,1.28,2,'2025-04-02'),(93,'STU001',382.71,2.76,2,'2025-04-03'),(94,'STU001',383.41,0.70,2,'2025-04-04'),(95,'STU001',390.03,6.62,2,'2025-04-05'),(96,'STU001',393.94,3.91,2,'2025-04-06'),(97,'STU001',399.94,6.00,2,'2025-04-07'),(98,'STU001',403.15,3.21,2,'2025-04-08'),(99,'STU001',403.69,0.54,2,'2025-04-09'),(100,'STU001',404.61,0.92,2,'2025-04-10'),(101,'STU001',405.03,0.42,2,'2025-04-11'),(102,'STU001',412.99,7.96,2,'2025-04-12'),(103,'STU001',418.92,5.93,2,'2025-04-13'),(104,'STU001',420.28,1.36,2,'2025-04-14'),(105,'STU001',422.17,1.89,2,'2025-04-15'),(106,'STU001',426.22,4.05,2,'2025-04-16'),(107,'STU001',430.86,4.64,2,'2025-04-17'),(108,'STU001',437.37,6.51,2,'2025-04-18'),(109,'STU001',442.95,5.58,2,'2025-04-19'),(110,'STU001',449.55,6.60,2,'2025-04-20'),(111,'STU001',454.04,4.49,2,'2025-04-21'),(112,'STU001',457.21,3.17,2,'2025-04-22'),(113,'STU001',463.59,6.38,2,'2025-04-23'),(114,'STU001',465.15,1.56,2,'2025-04-24'),(115,'STU001',473.13,7.98,2,'2025-04-25'),(116,'STU001',475.16,2.03,2,'2025-04-26'),(117,'STU001',480.08,4.92,2,'2025-04-27'),(118,'STU001',482.70,2.62,2,'2025-04-28'),(119,'STU001',486.35,3.65,2,'2025-04-29'),(120,'STU001',488.09,1.74,2,'2025-04-30'),(121,'STU001',491.88,3.79,2,'2025-05-01'),(122,'STU001',496.61,4.73,2,'2025-05-02'),(123,'STU001',502.52,5.91,2,'2025-05-03'),(124,'STU001',502.76,0.24,2,'2025-05-04'),(125,'STU001',503.22,0.46,2,'2025-05-05'),(126,'STU001',508.66,5.44,2,'2025-05-06'),(127,'STU001',516.15,7.49,2,'2025-05-07'),(128,'STU001',518.66,2.51,2,'2025-05-08'),(129,'STU001',524.68,6.02,2,'2025-05-09'),(130,'STU001',528.36,3.68,2,'2025-05-10'),(131,'STU001',532.56,4.20,2,'2025-05-11'),(132,'STU001',534.06,1.50,2,'2025-05-12'),(133,'STU001',538.19,4.13,2,'2025-05-13'),(134,'STU001',541.73,3.54,2,'2025-05-14'),(135,'STU001',545.36,3.63,2,'2025-05-15'),(136,'STU001',550.79,5.43,2,'2025-05-16'),(137,'STU001',555.70,4.91,2,'2025-05-17'),(138,'STU001',556.78,1.08,2,'2025-05-18'),(139,'STU001',560.05,3.27,2,'2025-05-19'),(140,'STU001',561.28,1.23,2,'2025-05-20'),(141,'STU001',562.17,0.89,3,'2025-05-21'),(142,'STU001',567.96,5.79,3,'2025-05-22'),(143,'STU001',574.69,6.73,3,'2025-05-23'),(144,'STU001',581.98,7.29,3,'2025-05-24'),(145,'STU001',587.25,5.27,3,'2025-05-25'),(146,'STU001',592.65,5.40,3,'2025-05-26'),(147,'STU001',600.52,7.87,3,'2025-05-27'),(148,'STU001',605.96,5.44,3,'2025-05-28'),(149,'STU001',606.46,0.50,3,'2025-05-29'),(150,'STU001',612.83,6.37,3,'2025-05-30'),(151,'STU001',620.78,7.95,3,'2025-05-31'),(152,'STU001',626.64,5.86,3,'2025-06-01'),(153,'STU001',626.84,0.20,3,'2025-06-02'),(154,'STU001',633.46,6.62,3,'2025-06-03'),(155,'STU001',634.01,0.55,3,'2025-06-04'),(156,'STU001',641.84,7.83,3,'2025-06-05'),(157,'STU001',643.74,1.90,3,'2025-06-06'),(158,'STU001',647.77,4.03,3,'2025-06-07'),(159,'STU001',651.70,3.93,3,'2025-06-08'),(160,'STU001',656.21,4.51,3,'2025-06-09'),(161,'STU001',660.92,4.71,3,'2025-06-10'),(162,'STU001',666.52,5.60,3,'2025-06-11'),(163,'STU001',674.15,7.63,3,'2025-06-12'),(164,'STU001',680.74,6.59,3,'2025-06-13'),(165,'STU001',685.78,5.04,3,'2025-06-14'),(166,'STU001',685.90,0.12,3,'2025-06-15'),(167,'STU001',693.60,7.70,3,'2025-06-16'),(168,'STU001',700.68,7.08,3,'2025-06-17'),(169,'STU001',704.25,3.57,3,'2025-06-18'),(170,'STU001',708.47,4.22,3,'2025-06-19'),(171,'STU001',716.30,7.83,3,'2025-06-20'),(172,'STU001',722.85,6.55,3,'2025-06-21'),(173,'STU001',726.38,3.53,3,'2025-06-22'),(174,'STU001',729.98,3.60,3,'2025-06-23'),(175,'STU001',730.66,0.68,3,'2025-06-24'),(176,'STU001',735.31,4.65,3,'2025-06-25'),(177,'STU001',739.92,4.61,3,'2025-06-26'),(178,'STU001',741.75,1.83,3,'2025-06-27'),(179,'STU001',747.10,5.35,3,'2025-06-28'),(180,'STU001',749.99,2.89,3,'2025-06-29'),(181,'STU001',754.56,4.57,3,'2025-06-30'),(182,'STU001',756.27,1.71,3,'2025-07-01'),(183,'STU001',761.98,5.71,3,'2025-07-02'),(184,'STU001',767.78,5.80,3,'2025-07-03'),(185,'STU001',773.31,5.53,3,'2025-07-04'),(186,'STU001',776.45,3.14,3,'2025-07-05'),(187,'STU001',782.03,5.58,3,'2025-07-06'),(188,'STU001',784.07,2.04,3,'2025-07-07'),(189,'STU001',784.69,0.62,3,'2025-07-08'),(190,'STU001',792.64,7.95,3,'2025-07-09'),(191,'STU001',795.16,2.52,3,'2025-07-10'),(192,'STU001',799.87,4.71,3,'2025-07-11'),(193,'STU001',800.19,0.32,3,'2025-07-12'),(194,'STU001',803.35,3.16,3,'2025-07-13'),(195,'STU001',811.13,7.78,3,'2025-07-14'),(196,'STU001',817.02,5.89,3,'2025-07-15'),(197,'STU001',821.25,4.23,3,'2025-07-16'),(198,'STU001',827.69,6.44,3,'2025-07-17'),(199,'STU001',835.38,7.69,3,'2025-07-18'),(200,'STU001',841.41,6.03,3,'2025-07-19'),(201,'STU001',842.50,1.09,3,'2025-07-20'),(202,'STU001',844.79,2.29,3,'2025-07-21'),(203,'STU001',845.70,0.91,3,'2025-07-22'),(204,'STU001',852.93,7.23,3,'2025-07-23'),(205,'STU001',859.04,6.11,3,'2025-07-24'),(206,'STU001',864.87,5.83,3,'2025-07-25'),(207,'STU001',866.83,1.96,3,'2025-07-26'),(208,'STU001',868.25,1.42,3,'2025-07-27'),(209,'STU001',873.74,5.49,3,'2025-07-28'),(210,'STU001',879.09,5.35,3,'2025-07-29'),(211,'STU001',883.82,4.73,4,'2025-07-30'),(212,'STU001',888.94,5.12,4,'2025-07-31'),(213,'STU001',894.63,5.69,4,'2025-08-01'),(214,'STU001',901.64,7.01,4,'2025-08-02'),(215,'STU001',903.67,2.03,4,'2025-08-03'),(216,'STU001',907.19,3.52,4,'2025-08-04'),(217,'STU001',911.84,4.65,4,'2025-08-05'),(218,'STU001',916.39,4.55,4,'2025-08-06'),(219,'STU001',918.19,1.80,4,'2025-08-07'),(220,'STU001',921.04,2.85,4,'2025-08-08'),(221,'STU001',926.98,5.94,4,'2025-08-09'),(222,'STU001',931.47,4.49,4,'2025-08-10'),(223,'STU001',935.47,4.00,4,'2025-08-11'),(224,'STU001',938.74,3.27,4,'2025-08-12'),(225,'STU001',940.63,1.89,4,'2025-08-13'),(226,'STU001',944.91,4.28,4,'2025-08-14'),(227,'STU001',948.96,4.05,4,'2025-08-15'),(228,'STU001',949.55,0.59,4,'2025-08-16'),(229,'STU001',949.98,0.43,4,'2025-08-17'),(230,'STU001',952.45,2.47,4,'2025-08-18'),(231,'STU001',957.23,4.78,4,'2025-08-19'),(232,'STU001',957.94,0.71,4,'2025-08-20'),(233,'STU001',962.71,4.77,4,'2025-08-21'),(234,'STU001',963.81,1.10,4,'2025-08-22'),(235,'STU001',963.87,0.06,4,'2025-08-23'),(236,'STU001',965.15,1.28,4,'2025-08-24'),(237,'STU001',966.49,1.34,4,'2025-08-25'),(238,'STU001',972.73,6.24,4,'2025-08-26'),(239,'STU001',973.04,0.31,4,'2025-08-27'),(240,'STU001',978.27,5.23,4,'2025-08-28'),(241,'STU001',979.55,1.28,4,'2025-08-29'),(242,'STU001',981.86,2.31,4,'2025-08-30'),(243,'STU001',988.97,7.11,4,'2025-08-31'),(244,'STU001',990.47,1.50,4,'2025-09-01'),(245,'STU001',996.73,6.26,4,'2025-09-02'),(246,'STU001',998.16,1.43,4,'2025-09-03'),(247,'STU001',1002.12,3.96,4,'2025-09-04'),(248,'STU001',1006.28,4.16,4,'2025-09-05'),(249,'STU001',1007.64,1.36,4,'2025-09-06'),(250,'STU001',1013.12,5.48,4,'2025-09-07'),(251,'STU001',1017.28,4.16,4,'2025-09-08'),(252,'STU001',1022.60,5.32,4,'2025-09-09'),(253,'STU001',1023.66,1.06,4,'2025-09-10'),(254,'STU001',1025.00,1.34,4,'2025-09-11'),(255,'STU001',1030.75,5.75,4,'2025-09-12'),(256,'STU001',1037.41,6.66,4,'2025-09-13'),(257,'STU001',1041.64,4.23,4,'2025-09-14'),(258,'STU001',1042.38,0.74,4,'2025-09-15'),(259,'STU001',1046.54,4.16,4,'2025-09-16'),(260,'STU001',1051.55,5.01,4,'2025-09-17'),(261,'STU001',1058.73,7.18,4,'2025-09-18'),(262,'STU001',1060.32,1.59,4,'2025-09-19'),(263,'STU001',1064.30,3.98,4,'2025-09-20'),(264,'STU001',1065.57,1.27,4,'2025-09-21'),(265,'STU001',1068.89,3.32,4,'2025-09-22'),(266,'STU001',1074.15,5.26,4,'2025-09-23'),(267,'STU001',1079.73,5.58,4,'2025-09-24'),(268,'STU001',1086.81,7.08,4,'2025-09-25'),(269,'STU001',1088.41,1.60,4,'2025-09-26'),(270,'STU001',1092.62,4.21,4,'2025-09-27'),(271,'STU001',1098.87,6.25,4,'2025-09-28'),(272,'STU001',1099.87,1.00,4,'2025-09-29'),(273,'STU001',1101.80,1.93,4,'2025-09-30'),(274,'STU001',1103.54,1.74,4,'2025-10-01'),(275,'STU001',1109.94,6.40,4,'2025-10-02'),(276,'STU001',1116.31,6.37,4,'2025-10-03'),(277,'STU001',1119.05,2.74,4,'2025-10-04'),(278,'STU001',1122.12,3.07,4,'2025-10-05'),(279,'STU001',1129.55,7.43,4,'2025-10-06'),(280,'STU001',1137.18,7.63,4,'2025-10-07'),(281,'STU001',1138.96,1.78,5,'2025-10-08'),(282,'STU001',1143.15,4.19,5,'2025-10-09'),(283,'STU001',1144.75,1.60,5,'2025-10-10'),(284,'STU001',1144.88,0.13,5,'2025-10-11'),(285,'STU001',1145.10,0.22,5,'2025-10-12'),(286,'STU001',1150.08,4.98,5,'2025-10-13'),(287,'STU001',1154.04,3.96,5,'2025-10-14'),(288,'STU001',1157.69,3.65,5,'2025-10-15'),(289,'STU001',1160.03,2.34,5,'2025-10-16'),(290,'STU001',1166.45,6.42,5,'2025-10-17'),(291,'STU001',1170.51,4.06,5,'2025-10-18'),(292,'STU001',1177.33,6.82,5,'2025-10-19'),(293,'STU001',1180.62,3.29,5,'2025-10-20'),(294,'STU001',1183.63,3.01,5,'2025-10-21'),(295,'STU001',1186.57,2.94,5,'2025-10-22'),(296,'STU001',1193.59,7.02,5,'2025-10-23'),(297,'STU001',1200.53,6.94,5,'2025-10-24'),(298,'STU001',1202.08,1.55,5,'2025-10-25'),(299,'STU001',1209.29,7.21,5,'2025-10-26'),(300,'STU001',1211.13,1.84,5,'2025-10-27');
/*!40000 ALTER TABLE `achievement_graph` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_graph`
--

DROP TABLE IF EXISTS `activity_graph`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_graph` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rollno` varchar(50) NOT NULL,
  `current_point` decimal(10,2) NOT NULL,
  `current_rank` varchar(20) NOT NULL,
  `sem` int NOT NULL,
  `currdate` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=301 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_graph`
--

LOCK TABLES `activity_graph` WRITE;
/*!40000 ALTER TABLE `activity_graph` DISABLE KEYS */;
INSERT INTO `activity_graph` VALUES (1,'STU001',100.00,'titanium',1,'2025-01-01'),(2,'STU001',99.87,'titanium',1,'2025-01-02'),(3,'STU001',99.29,'titanium',1,'2025-01-03'),(4,'STU001',100.00,'titanium',1,'2025-01-04'),(5,'STU001',99.47,'titanium',1,'2025-01-05'),(6,'STU001',98.83,'titanium',1,'2025-01-06'),(7,'STU001',98.60,'titanium',1,'2025-01-07'),(8,'STU001',97.83,'titanium',1,'2025-01-08'),(9,'STU001',96.40,'titanium',1,'2025-01-09'),(10,'STU001',97.68,'titanium',1,'2025-01-10'),(11,'STU001',96.48,'titanium',1,'2025-01-11'),(12,'STU001',97.85,'titanium',1,'2025-01-12'),(13,'STU001',98.29,'titanium',1,'2025-01-13'),(14,'STU001',97.08,'titanium',1,'2025-01-14'),(15,'STU001',97.06,'titanium',1,'2025-01-15'),(16,'STU001',95.57,'titanium',1,'2025-01-16'),(17,'STU001',95.39,'titanium',1,'2025-01-17'),(18,'STU001',95.30,'titanium',1,'2025-01-18'),(19,'STU001',93.90,'titanium',1,'2025-01-19'),(20,'STU001',94.67,'titanium',1,'2025-01-20'),(21,'STU001',94.44,'titanium',1,'2025-01-21'),(22,'STU001',94.59,'titanium',1,'2025-01-22'),(23,'STU001',95.49,'titanium',1,'2025-01-23'),(24,'STU001',94.99,'titanium',1,'2025-01-24'),(25,'STU001',96.39,'titanium',1,'2025-01-25'),(26,'STU001',97.16,'titanium',1,'2025-01-26'),(27,'STU001',95.86,'titanium',1,'2025-01-27'),(28,'STU001',97.16,'titanium',1,'2025-01-28'),(29,'STU001',98.19,'titanium',1,'2025-01-29'),(30,'STU001',96.77,'titanium',1,'2025-01-30'),(31,'STU001',96.47,'titanium',1,'2025-01-31'),(32,'STU001',95.97,'titanium',1,'2025-02-01'),(33,'STU001',96.77,'titanium',1,'2025-02-02'),(34,'STU001',96.08,'titanium',1,'2025-02-03'),(35,'STU001',94.91,'titanium',1,'2025-02-04'),(36,'STU001',96.23,'titanium',1,'2025-02-05'),(37,'STU001',95.00,'titanium',1,'2025-02-06'),(38,'STU001',95.46,'titanium',1,'2025-02-07'),(39,'STU001',96.27,'titanium',1,'2025-02-08'),(40,'STU001',96.04,'titanium',1,'2025-02-09'),(41,'STU001',96.27,'titanium',1,'2025-02-10'),(42,'STU001',94.99,'titanium',1,'2025-02-11'),(43,'STU001',94.38,'titanium',1,'2025-02-12'),(44,'STU001',95.64,'titanium',1,'2025-02-13'),(45,'STU001',95.03,'titanium',1,'2025-02-14'),(46,'STU001',93.59,'titanium',1,'2025-02-15'),(47,'STU001',94.62,'titanium',1,'2025-02-16'),(48,'STU001',95.86,'titanium',1,'2025-02-17'),(49,'STU001',95.21,'titanium',1,'2025-02-18'),(50,'STU001',96.42,'titanium',1,'2025-02-19'),(51,'STU001',95.83,'titanium',1,'2025-02-20'),(52,'STU001',96.25,'titanium',1,'2025-02-21'),(53,'STU001',96.63,'titanium',1,'2025-02-22'),(54,'STU001',97.64,'titanium',1,'2025-02-23'),(55,'STU001',97.55,'titanium',1,'2025-02-24'),(56,'STU001',97.18,'titanium',1,'2025-02-25'),(57,'STU001',95.72,'titanium',1,'2025-02-26'),(58,'STU001',94.70,'titanium',1,'2025-02-27'),(59,'STU001',95.99,'titanium',1,'2025-02-28'),(60,'STU001',94.53,'titanium',1,'2025-03-01'),(61,'STU001',95.32,'titanium',1,'2025-03-02'),(62,'STU001',95.98,'titanium',1,'2025-03-03'),(63,'STU001',97.33,'titanium',1,'2025-03-04'),(64,'STU001',98.08,'titanium',1,'2025-03-05'),(65,'STU001',98.92,'titanium',1,'2025-03-06'),(66,'STU001',98.22,'titanium',1,'2025-03-07'),(67,'STU001',99.38,'titanium',1,'2025-03-08'),(68,'STU001',99.12,'titanium',1,'2025-03-09'),(69,'STU001',99.03,'titanium',1,'2025-03-10'),(70,'STU001',100.00,'titanium',1,'2025-03-11'),(71,'STU001',98.95,'titanium',2,'2025-03-12'),(72,'STU001',100.00,'titanium',2,'2025-03-13'),(73,'STU001',98.87,'titanium',2,'2025-03-14'),(74,'STU001',97.87,'titanium',2,'2025-03-15'),(75,'STU001',97.83,'titanium',2,'2025-03-16'),(76,'STU001',98.49,'titanium',2,'2025-03-17'),(77,'STU001',99.46,'titanium',2,'2025-03-18'),(78,'STU001',100.00,'titanium',2,'2025-03-19'),(79,'STU001',99.36,'titanium',2,'2025-03-20'),(80,'STU001',100.00,'titanium',2,'2025-03-21'),(81,'STU001',98.52,'titanium',2,'2025-03-22'),(82,'STU001',99.98,'titanium',2,'2025-03-23'),(83,'STU001',99.69,'titanium',2,'2025-03-24'),(84,'STU001',100.00,'titanium',2,'2025-03-25'),(85,'STU001',99.35,'titanium',2,'2025-03-26'),(86,'STU001',100.00,'titanium',2,'2025-03-27'),(87,'STU001',100.00,'titanium',2,'2025-03-28'),(88,'STU001',100.00,'titanium',2,'2025-03-29'),(89,'STU001',98.58,'titanium',2,'2025-03-30'),(90,'STU001',97.22,'titanium',2,'2025-03-31'),(91,'STU001',97.58,'titanium',2,'2025-04-01'),(92,'STU001',97.06,'titanium',2,'2025-04-02'),(93,'STU001',97.16,'titanium',2,'2025-04-03'),(94,'STU001',97.23,'titanium',2,'2025-04-04'),(95,'STU001',96.50,'titanium',2,'2025-04-05'),(96,'STU001',95.88,'titanium',2,'2025-04-06'),(97,'STU001',94.90,'titanium',2,'2025-04-07'),(98,'STU001',93.47,'titanium',2,'2025-04-08'),(99,'STU001',94.55,'titanium',2,'2025-04-09'),(100,'STU001',93.51,'titanium',2,'2025-04-10'),(101,'STU001',94.09,'titanium',2,'2025-04-11'),(102,'STU001',92.94,'titanium',2,'2025-04-12'),(103,'STU001',93.68,'titanium',2,'2025-04-13'),(104,'STU001',93.51,'titanium',2,'2025-04-14'),(105,'STU001',94.39,'titanium',2,'2025-04-15'),(106,'STU001',93.76,'titanium',2,'2025-04-16'),(107,'STU001',94.99,'titanium',2,'2025-04-17'),(108,'STU001',95.78,'titanium',2,'2025-04-18'),(109,'STU001',95.69,'titanium',2,'2025-04-19'),(110,'STU001',96.55,'titanium',2,'2025-04-20'),(111,'STU001',96.33,'titanium',2,'2025-04-21'),(112,'STU001',96.99,'titanium',2,'2025-04-22'),(113,'STU001',97.98,'titanium',2,'2025-04-23'),(114,'STU001',96.59,'titanium',2,'2025-04-24'),(115,'STU001',95.51,'titanium',2,'2025-04-25'),(116,'STU001',95.26,'titanium',2,'2025-04-26'),(117,'STU001',95.36,'titanium',2,'2025-04-27'),(118,'STU001',96.77,'titanium',2,'2025-04-28'),(119,'STU001',96.02,'titanium',2,'2025-04-29'),(120,'STU001',94.53,'titanium',2,'2025-04-30'),(121,'STU001',94.68,'titanium',2,'2025-05-01'),(122,'STU001',93.80,'titanium',2,'2025-05-02'),(123,'STU001',93.78,'titanium',2,'2025-05-03'),(124,'STU001',93.20,'titanium',2,'2025-05-04'),(125,'STU001',94.29,'titanium',2,'2025-05-05'),(126,'STU001',94.58,'titanium',2,'2025-05-06'),(127,'STU001',93.73,'titanium',2,'2025-05-07'),(128,'STU001',94.62,'titanium',2,'2025-05-08'),(129,'STU001',93.15,'titanium',2,'2025-05-09'),(130,'STU001',94.32,'titanium',2,'2025-05-10'),(131,'STU001',93.72,'titanium',2,'2025-05-11'),(132,'STU001',94.89,'titanium',2,'2025-05-12'),(133,'STU001',93.77,'titanium',2,'2025-05-13'),(134,'STU001',95.21,'titanium',2,'2025-05-14'),(135,'STU001',94.67,'titanium',2,'2025-05-15'),(136,'STU001',94.29,'titanium',2,'2025-05-16'),(137,'STU001',93.14,'titanium',2,'2025-05-17'),(138,'STU001',92.45,'titanium',2,'2025-05-18'),(139,'STU001',91.85,'titanium',2,'2025-05-19'),(140,'STU001',92.52,'titanium',2,'2025-05-20'),(141,'STU001',91.25,'titanium',3,'2025-05-21'),(142,'STU001',90.51,'titanium',3,'2025-05-22'),(143,'STU001',89.86,'gold',3,'2025-05-23'),(144,'STU001',90.64,'titanium',3,'2025-05-24'),(145,'STU001',90.88,'titanium',3,'2025-05-25'),(146,'STU001',90.12,'titanium',3,'2025-05-26'),(147,'STU001',90.72,'titanium',3,'2025-05-27'),(148,'STU001',90.06,'titanium',3,'2025-05-28'),(149,'STU001',89.29,'gold',3,'2025-05-29'),(150,'STU001',90.13,'titanium',3,'2025-05-30'),(151,'STU001',90.77,'titanium',3,'2025-05-31'),(152,'STU001',91.95,'titanium',3,'2025-06-01'),(153,'STU001',92.11,'titanium',3,'2025-06-02'),(154,'STU001',91.42,'titanium',3,'2025-06-03'),(155,'STU001',90.33,'titanium',3,'2025-06-04'),(156,'STU001',90.49,'titanium',3,'2025-06-05'),(157,'STU001',91.94,'titanium',3,'2025-06-06'),(158,'STU001',91.92,'titanium',3,'2025-06-07'),(159,'STU001',90.68,'titanium',3,'2025-06-08'),(160,'STU001',89.61,'gold',3,'2025-06-09'),(161,'STU001',89.74,'gold',3,'2025-06-10'),(162,'STU001',88.76,'gold',3,'2025-06-11'),(163,'STU001',88.05,'gold',3,'2025-06-12'),(164,'STU001',89.49,'gold',3,'2025-06-13'),(165,'STU001',89.96,'gold',3,'2025-06-14'),(166,'STU001',91.28,'titanium',3,'2025-06-15'),(167,'STU001',90.14,'titanium',3,'2025-06-16'),(168,'STU001',89.53,'gold',3,'2025-06-17'),(169,'STU001',90.73,'titanium',3,'2025-06-18'),(170,'STU001',89.93,'gold',3,'2025-06-19'),(171,'STU001',90.24,'titanium',3,'2025-06-20'),(172,'STU001',89.51,'gold',3,'2025-06-21'),(173,'STU001',88.76,'gold',3,'2025-06-22'),(174,'STU001',87.81,'gold',3,'2025-06-23'),(175,'STU001',87.90,'gold',3,'2025-06-24'),(176,'STU001',87.46,'gold',3,'2025-06-25'),(177,'STU001',86.45,'gold',3,'2025-06-26'),(178,'STU001',86.92,'gold',3,'2025-06-27'),(179,'STU001',85.49,'gold',3,'2025-06-28'),(180,'STU001',84.11,'gold',3,'2025-06-29'),(181,'STU001',83.05,'gold',3,'2025-06-30'),(182,'STU001',82.73,'gold',3,'2025-07-01'),(183,'STU001',81.89,'gold',3,'2025-07-02'),(184,'STU001',81.91,'gold',3,'2025-07-03'),(185,'STU001',81.93,'gold',3,'2025-07-04'),(186,'STU001',83.04,'gold',3,'2025-07-05'),(187,'STU001',84.23,'gold',3,'2025-07-06'),(188,'STU001',83.57,'gold',3,'2025-07-07'),(189,'STU001',84.78,'gold',3,'2025-07-08'),(190,'STU001',85.62,'gold',3,'2025-07-09'),(191,'STU001',85.82,'gold',3,'2025-07-10'),(192,'STU001',85.05,'gold',3,'2025-07-11'),(193,'STU001',85.48,'gold',3,'2025-07-12'),(194,'STU001',86.61,'gold',3,'2025-07-13'),(195,'STU001',86.68,'gold',3,'2025-07-14'),(196,'STU001',86.87,'gold',3,'2025-07-15'),(197,'STU001',87.10,'gold',3,'2025-07-16'),(198,'STU001',88.53,'gold',3,'2025-07-17'),(199,'STU001',87.80,'gold',3,'2025-07-18'),(200,'STU001',87.50,'gold',3,'2025-07-19'),(201,'STU001',88.81,'gold',3,'2025-07-20'),(202,'STU001',89.33,'gold',3,'2025-07-21'),(203,'STU001',87.91,'gold',3,'2025-07-22'),(204,'STU001',87.29,'gold',3,'2025-07-23'),(205,'STU001',86.56,'gold',3,'2025-07-24'),(206,'STU001',86.36,'gold',3,'2025-07-25'),(207,'STU001',87.52,'gold',3,'2025-07-26'),(208,'STU001',87.12,'gold',3,'2025-07-27'),(209,'STU001',86.18,'gold',3,'2025-07-28'),(210,'STU001',86.17,'gold',3,'2025-07-29'),(211,'STU001',87.22,'gold',4,'2025-07-30'),(212,'STU001',87.01,'gold',4,'2025-07-31'),(213,'STU001',86.30,'gold',4,'2025-08-01'),(214,'STU001',86.10,'gold',4,'2025-08-02'),(215,'STU001',85.37,'gold',4,'2025-08-03'),(216,'STU001',86.85,'gold',4,'2025-08-04'),(217,'STU001',87.72,'gold',4,'2025-08-05'),(218,'STU001',87.96,'gold',4,'2025-08-06'),(219,'STU001',89.34,'gold',4,'2025-08-07'),(220,'STU001',89.92,'gold',4,'2025-08-08'),(221,'STU001',90.78,'titanium',4,'2025-08-09'),(222,'STU001',89.90,'gold',4,'2025-08-10'),(223,'STU001',91.09,'titanium',4,'2025-08-11'),(224,'STU001',90.30,'titanium',4,'2025-08-12'),(225,'STU001',91.67,'titanium',4,'2025-08-13'),(226,'STU001',92.98,'titanium',4,'2025-08-14'),(227,'STU001',92.28,'titanium',4,'2025-08-15'),(228,'STU001',92.36,'titanium',4,'2025-08-16'),(229,'STU001',93.76,'titanium',4,'2025-08-17'),(230,'STU001',94.26,'titanium',4,'2025-08-18'),(231,'STU001',95.20,'titanium',4,'2025-08-19'),(232,'STU001',95.37,'titanium',4,'2025-08-20'),(233,'STU001',96.45,'titanium',4,'2025-08-21'),(234,'STU001',96.68,'titanium',4,'2025-08-22'),(235,'STU001',96.20,'titanium',4,'2025-08-23'),(236,'STU001',96.98,'titanium',4,'2025-08-24'),(237,'STU001',96.88,'titanium',4,'2025-08-25'),(238,'STU001',98.35,'titanium',4,'2025-08-26'),(239,'STU001',97.20,'titanium',4,'2025-08-27'),(240,'STU001',98.50,'titanium',4,'2025-08-28'),(241,'STU001',98.02,'titanium',4,'2025-08-29'),(242,'STU001',97.67,'titanium',4,'2025-08-30'),(243,'STU001',96.94,'titanium',4,'2025-08-31'),(244,'STU001',97.47,'titanium',4,'2025-09-01'),(245,'STU001',98.47,'titanium',4,'2025-09-02'),(246,'STU001',97.90,'titanium',4,'2025-09-03'),(247,'STU001',98.30,'titanium',4,'2025-09-04'),(248,'STU001',99.80,'titanium',4,'2025-09-05'),(249,'STU001',98.36,'titanium',4,'2025-09-06'),(250,'STU001',97.39,'titanium',4,'2025-09-07'),(251,'STU001',98.55,'titanium',4,'2025-09-08'),(252,'STU001',97.68,'titanium',4,'2025-09-09'),(253,'STU001',98.30,'titanium',4,'2025-09-10'),(254,'STU001',97.23,'titanium',4,'2025-09-11'),(255,'STU001',97.11,'titanium',4,'2025-09-12'),(256,'STU001',97.30,'titanium',4,'2025-09-13'),(257,'STU001',96.31,'titanium',4,'2025-09-14'),(258,'STU001',97.36,'titanium',4,'2025-09-15'),(259,'STU001',97.99,'titanium',4,'2025-09-16'),(260,'STU001',98.10,'titanium',4,'2025-09-17'),(261,'STU001',96.71,'titanium',4,'2025-09-18'),(262,'STU001',96.44,'titanium',4,'2025-09-19'),(263,'STU001',96.79,'titanium',4,'2025-09-20'),(264,'STU001',96.06,'titanium',4,'2025-09-21'),(265,'STU001',95.29,'titanium',4,'2025-09-22'),(266,'STU001',94.72,'titanium',4,'2025-09-23'),(267,'STU001',95.03,'titanium',4,'2025-09-24'),(268,'STU001',94.14,'titanium',4,'2025-09-25'),(269,'STU001',94.38,'titanium',4,'2025-09-26'),(270,'STU001',94.45,'titanium',4,'2025-09-27'),(271,'STU001',94.83,'titanium',4,'2025-09-28'),(272,'STU001',95.28,'titanium',4,'2025-09-29'),(273,'STU001',96.02,'titanium',4,'2025-09-30'),(274,'STU001',97.23,'titanium',4,'2025-10-01'),(275,'STU001',98.48,'titanium',4,'2025-10-02'),(276,'STU001',98.42,'titanium',4,'2025-10-03'),(277,'STU001',98.16,'titanium',4,'2025-10-04'),(278,'STU001',98.43,'titanium',4,'2025-10-05'),(279,'STU001',99.81,'titanium',4,'2025-10-06'),(280,'STU001',100.00,'titanium',4,'2025-10-07'),(281,'STU001',100.00,'titanium',5,'2025-10-08'),(282,'STU001',100.00,'titanium',5,'2025-10-09'),(283,'STU001',99.20,'titanium',5,'2025-10-10'),(284,'STU001',98.72,'titanium',5,'2025-10-11'),(285,'STU001',97.26,'titanium',5,'2025-10-12'),(286,'STU001',98.76,'titanium',5,'2025-10-13'),(287,'STU001',98.24,'titanium',5,'2025-10-14'),(288,'STU001',97.43,'titanium',5,'2025-10-15'),(289,'STU001',97.72,'titanium',5,'2025-10-16'),(290,'STU001',96.40,'titanium',5,'2025-10-17'),(291,'STU001',97.06,'titanium',5,'2025-10-18'),(292,'STU001',98.19,'titanium',5,'2025-10-19'),(293,'STU001',98.91,'titanium',5,'2025-10-20'),(294,'STU001',99.75,'titanium',5,'2025-10-21'),(295,'STU001',99.39,'titanium',5,'2025-10-22'),(296,'STU001',100.00,'titanium',5,'2025-10-23'),(297,'STU001',98.76,'titanium',5,'2025-10-24'),(298,'STU001',99.22,'titanium',5,'2025-10-25'),(299,'STU001',98.48,'titanium',5,'2025-10-26'),(300,'STU001',99.12,'titanium',5,'2025-10-27');
/*!40000 ALTER TABLE `activity_graph` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_list`
--

DROP TABLE IF EXISTS `activity_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_title` varchar(255) NOT NULL,
  `activity_type` enum('Meeting','Workshop','Survey','Session') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_list`
--

LOCK TABLES `activity_list` WRITE;
/*!40000 ALTER TABLE `activity_list` DISABLE KEYS */;
INSERT INTO `activity_list` VALUES (1,'Test 1','Survey','2025-08-02 03:41:38'),(2,'Test 1','Survey','2025-08-02 03:43:08'),(3,'Assessment FeedBack','Survey','2025-08-02 03:55:25'),(4,'Workshop','Workshop','2025-08-02 08:08:49'),(5,'test 5','Workshop','2025-08-02 08:21:31'),(6,'Test 3','Workshop','2025-08-02 08:50:11'),(7,'Ai workshop','Workshop','2025-08-02 09:08:19'),(8,'Ai workshop','Meeting','2025-08-02 09:12:53'),(9,'Ai workshop','Workshop','2025-08-02 09:13:52'),(10,'cybersecurity','Workshop','2025-08-02 10:08:09'),(11,'Placement Training','Meeting','2025-08-02 10:28:28'),(12,'Placement Training','Meeting','2025-08-02 10:31:18'),(13,'Placement Training','Meeting','2025-08-02 10:31:52'),(14,'Placement Training','Meeting','2025-08-02 10:33:14'),(15,'Placement Training','Meeting','2025-08-02 10:38:13'),(16,'Placement Training','Meeting','2025-08-02 15:11:04'),(17,'Placement Training','Meeting','2025-08-02 15:11:46'),(18,'Placement Training','Meeting','2025-08-02 15:11:57'),(19,'Placement Training','Meeting','2025-08-02 15:14:53'),(20,'Placement Training','Meeting','2025-08-02 15:19:58'),(21,'Placement Training','Meeting','2025-08-02 15:25:35'),(22,'Placement Training','Meeting','2025-08-02 15:29:27'),(23,'Placement Training','Meeting','2025-08-02 15:37:50'),(24,'Placement Training','Meeting','2025-08-02 15:44:33'),(25,'Placement Training with deepak','Survey','2025-08-04 14:37:09'),(26,'Placement Training','Meeting','2025-08-04 14:38:25'),(27,'Placement Training','Meeting','2025-08-04 14:51:30'),(28,'test','Meeting','2025-08-04 14:54:09'),(29,'ZCB XSHC','Meeting','2025-08-04 14:56:52'),(30,'ZCB XSHC','Meeting','2025-08-04 14:57:34'),(31,'Placement Training','Meeting','2025-08-04 15:09:28'),(32,'Placement Training','Meeting','2025-08-04 15:10:38'),(33,'Placement Training','Meeting','2025-08-04 18:03:32'),(34,'Placement Training','Session','2025-08-05 05:48:32'),(35,'Placement Training','Session','2025-08-05 05:52:04'),(36,'Placement Training','Session','2025-08-05 06:16:18'),(37,'Placement Training','Session','2025-08-05 06:17:16');
/*!40000 ALTER TABLE `activity_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate_onlinecourses`
--

DROP TABLE IF EXISTS `certificate_onlinecourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate_onlinecourses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `certiificate_id` int DEFAULT NULL,
  `rollno` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `platform` varchar(255) NOT NULL,
  `issue_date` date NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `certificate_pdf` varchar(255) NOT NULL,
  `course_link` varchar(255) NOT NULL,
  `approval_status` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate_onlinecourses`
--

LOCK TABLES `certificate_onlinecourses` WRITE;
/*!40000 ALTER TABLE `certificate_onlinecourses` DISABLE KEYS */;
INSERT INTO `certificate_onlinecourses` VALUES (1,1,'STU001','Test 1','Coursera','2025-08-11','2025-08-12','2025-08-13','uploads\\certificates\\online_courses\\Bhavish Nithin.pdf','http://localhost:5173/uploadview/certificate',0,'2025-08-09 18:30:00');
/*!40000 ALTER TABLE `certificate_onlinecourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates_events`
--

DROP TABLE IF EXISTS `certificates_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificates_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `certificate_id` int DEFAULT NULL,
  `rollno` varchar(255) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_code` varchar(255) NOT NULL,
  `issue_date` date DEFAULT NULL,
  `participation_type` enum('Individual','Team') DEFAULT 'Individual',
  `certificate_pdf` varchar(255) NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `did_you_win` enum('Winner','Runner-up','Participant','Finalist') DEFAULT NULL,
  `faculty_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `faculty_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `faculty_remarks` varchar(255) DEFAULT NULL,
  `submission_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates_events`
--

LOCK TABLES `certificates_events` WRITE;
/*!40000 ALTER TABLE `certificates_events` DISABLE KEYS */;
INSERT INTO `certificates_events` VALUES (1,2,'STU001','Test 1','Test 1','2025-08-12','Team','uploads\\certificates\\events\\Bhavish Nithin.pdf','Test 1','Runner-up','','','','2025-08-09 18:30:00');
/*!40000 ALTER TABLE `certificates_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates_type`
--

DROP TABLE IF EXISTS `certificates_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificates_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `upload_type` varchar(255) DEFAULT NULL,
  `rollno` varchar(255) NOT NULL,
  `certificate_type` varchar(255) NOT NULL,
  `status` enum('Verified','Rejected','Pending') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates_type`
--

LOCK TABLES `certificates_type` WRITE;
/*!40000 ALTER TABLE `certificates_type` DISABLE KEYS */;
INSERT INTO `certificates_type` VALUES (1,'certificate','STU001','online-course','Pending','2025-08-10 09:47:53'),(2,'certificate','STU001','hackathon','Pending','2025-08-10 09:49:46'),(3,'certificate','STU001','participation','Pending','2025-08-10 09:52:03');
/*!40000 ALTER TABLE `certificates_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates_voluntree`
--

DROP TABLE IF EXISTS `certificates_voluntree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificates_voluntree` (
  `id` int NOT NULL AUTO_INCREMENT,
  `certificate_id` int DEFAULT NULL,
  `rollno` varchar(255) NOT NULL,
  `activity_type` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `issue_date` date DEFAULT NULL,
  `certificate_pdf` varchar(255) NOT NULL,
  `summary` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `faculty_name` varchar(255) DEFAULT NULL,
  `faculty_id` varchar(255) DEFAULT NULL,
  `faculty_reamrks` varchar(255) DEFAULT NULL,
  `submission_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates_voluntree`
--

LOCK TABLES `certificates_voluntree` WRITE;
/*!40000 ALTER TABLE `certificates_voluntree` DISABLE KEYS */;
INSERT INTO `certificates_voluntree` VALUES (1,3,'STU001','Test 1','Test 1','2025-08-12','uploads\\certificates\\participation\\Bhavish Nithin.pdf','Test 1','Test 1','','','','2025-08-09 18:30:00');
/*!40000 ALTER TABLE `certificates_voluntree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_rounds_dates`
--

DROP TABLE IF EXISTS `event_rounds_dates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_rounds_dates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_code` varchar(255) NOT NULL,
  `round_number` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `year1_rp` int DEFAULT NULL,
  `year2_rp` int DEFAULT NULL,
  `year3_rp` int DEFAULT NULL,
  `year4_rp` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rounds_dates`
--

LOCK TABLES `event_rounds_dates` WRITE;
/*!40000 ALTER TABLE `event_rounds_dates` DISABLE KEYS */;
INSERT INTO `event_rounds_dates` VALUES (1,'25BIT40',1,'2025-07-30','2025-08-01',1,2,3,4,'2025-07-28 17:22:27');
/*!40000 ALTER TABLE `event_rounds_dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) NOT NULL,
  `event_code` varchar(50) DEFAULT NULL,
  `type` enum('Online','Offline','Hybrid') NOT NULL,
  `deadline` date NOT NULL,
  `min_team_size` int NOT NULL DEFAULT '1',
  `max_team_size` int NOT NULL DEFAULT '1',
  `no_of_rounds` int NOT NULL,
  `online_rounds` int DEFAULT NULL,
  `offline_rounds` int DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `apply_link` text,
  `domains` text,
  `image_url` varchar(2048) DEFAULT NULL,
  `description` text,
  `rules` text,
  `constraints` text,
  `final_prizes1` varchar(255) DEFAULT NULL,
  `final_prizes2` varchar(255) DEFAULT NULL,
  `final_prizes3` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_code` (`event_code`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (12,'Test 1','25BIT1','Online','2025-07-31',1,1,1,0,0,'lfkjasldkf','http://localhost:5173/faculty-addactitvity',';slfk;aslkdf;l;l;lsddfl;ks','uploads\\events\\Screenshot 2025-07-24 093735.png','fsdfas','safdsdf','sdfsad','fasdfs','fasd','fasdfasd','2025-07-24 17:06:35','2025-07-24 17:06:35'),(13,'Test 1','25BIT13','Online','2025-07-31',1,1,1,0,0,'lfkjasldkf','http://localhost:5173/faculty-addactitvity',';slfk;aslkdf;l;l;lsddfl;ks','uploads\\events\\Screenshot 2025-07-24 093735.png','fsdfas','safdsdf','sdfsad','fasdfs','fasd','fasdfasd','2025-07-24 17:07:35','2025-07-24 17:07:35'),(14,'Test 1','25BIT14','Online','2025-07-31',1,1,1,0,0,'lfkjasldkf','http://localhost:5173/faculty-addactitvity',';slfk;aslkdf;l;l;lsddfl;ks','uploads\\events\\Screenshot 2025-07-24 093735.png','fsdfas','safdsdf','sdfsad','fasdfs','fasd','fasdfasd','2025-07-24 17:08:51','2025-07-24 17:08:51'),(15,'Test 1','25BIT15','Hybrid','2025-07-31',1,1,1,0,1,'lfkjasldkf','http://localhost:5173/faculty-addactitvity',';slfk;aslkdf;l;l;lsddfl;ks','uploads\\events\\Screenshot 2025-07-24 093735.png','fsdfas','safdsdf','sdfsad','fasdfs','fasd','fasdfasd','2025-07-24 17:09:58','2025-07-24 17:09:58'),(16,'fasdf','25BIT16','Hybrid','2025-07-22',1,1,2,1,1,'sdfsadf','http://localhost:5173/faculty-addactitvity','fsdfasdf','uploads\\events\\Screenshot 2025-07-24 004448.png','sadf','sdfa','dsfad','asfdasd','sfdasd','fsdfsd','2025-07-24 17:14:49','2025-07-24 17:14:49'),(17,'fasdf','25BIT17','Hybrid','2025-07-22',1,1,2,1,1,'sdfsadf','http://localhost:5173/faculty-addactitvity','fsdfasdf','uploads\\events\\Screenshot 2025-07-24 004448.png','sadf','sdfa','dsfad','asfdasd','sfdasd','fsdfsd','2025-07-24 17:15:34','2025-07-24 17:15:34'),(18,'fasdf','25BIT18','Hybrid','2025-07-22',1,1,2,1,1,'sdfsadf','http://localhost:5173/faculty-addactitvity','fsdfasdf','uploads\\events\\Screenshot 2025-07-24 004448.png','sadf','sdfa','dsfad','asfdasd','sfdasd','fsdfsd','2025-07-24 17:21:04','2025-07-24 17:21:04'),(19,'fasdf','25BIT19','Hybrid','2025-07-22',1,1,2,1,1,'sdfsadf','http://localhost:5173/faculty-addactitvity','fsdfasdf','uploads\\events\\Screenshot 2025-07-24 004448.png','sadf','sdfa','dsfad','asfdasd','sfdasd','fsdfsd','2025-07-24 17:23:12','2025-07-24 17:23:12'),(20,'fasdf','25BIT20','Hybrid','2025-07-22',1,1,2,1,1,'sdfsadf','http://localhost:5173/faculty-addactitvity','fsdfasdf','uploads\\events\\Screenshot 2025-07-24 004448.png','sadf','sdfa','dsfad','asfdasd','sfdasd','fsdfsd','2025-07-24 17:25:57','2025-07-24 17:25:57'),(35,'fasdf','25BIT70','Hybrid','2025-07-22',1,1,2,1,1,'sdfsadf','http://localhost:5173/faculty-addactitvity','fsdfasdf','uploads\\events\\Screenshot 2025-07-24 004448.png','sadf','sdfa','dsfad','asfdasd','sfdasd','fsdfsd','2025-07-24 17:39:12','2025-07-24 17:39:12'),(36,'http://localhost:5173/faculty-addactitvity','25BIT36','Online','2025-07-28',1,1,1,0,0,'http://localhost:5173/faculty-addactitvity','http://localhost:5173/faculty-addactitvity','http://localhost:5173/faculty-addactitvity','uploads/events/Login-background.jpg','http://localhost:5173/faculty-addactitvity','http://localhost:5173/faculty-addactitvity','http://localhost:5173/faculty-addactitvity','http://localhost:5173/faculty-addactitvity','http://localhost:5173/faculty-addactitvity','http://localhost:5173/faculty-addactitvity','2025-07-28 15:33:35','2025-07-28 15:33:35'),(37,'http://localhost:5173/faculty-addactitvity','25BIT37','Online','2025-07-29',1,1,1,0,0,'http://localhost:5173/faculty-addactitvity','','http://localhost:5173/faculty-addactitvity','uploads/events/Login-background.jpg','l\r\n','','','http://localhost:5173/faculty-addactitvity','','','2025-07-28 16:41:09','2025-07-28 16:41:09'),(38,'fads','25BIT38','Online','2025-07-30',1,1,2,0,0,'fadd','','fsdf','','kls','','','','','','2025-07-28 16:44:59','2025-07-28 16:44:59'),(39,'http://localhost:5173/faculty-addactitvity','25BIT39','Hybrid','2025-07-30',1,1,1,0,1,'http://localhost:5173/faculty-addactitvity','','','','http://localhost:5173/faculty-addactitvity','','','','','','2025-07-28 17:20:19','2025-07-28 17:20:19'),(40,'http://localhost:5173/faculty-addactitvity','25BIT40','Hybrid','2025-07-30',1,1,1,0,1,'http://localhost:5173/faculty-addactitvity','','','','http://localhost:5173/faculty-addactitvity','','','','','','2025-07-28 17:22:27','2025-07-28 17:22:27');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institute_avg`
--

DROP TABLE IF EXISTS `institute_avg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institute_avg` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cummulative_points` decimal(10,2) DEFAULT NULL,
  `points` decimal(10,2) DEFAULT NULL,
  `sem` int NOT NULL,
  `currdate` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=306 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institute_avg`
--

LOCK TABLES `institute_avg` WRITE;
/*!40000 ALTER TABLE `institute_avg` DISABLE KEYS */;
INSERT INTO `institute_avg` VALUES (1,2.34,2.34,1,'2025-01-01'),(2,7.89,5.55,1,'2025-01-02'),(3,9.12,1.23,1,'2025-01-03'),(4,15.67,6.55,1,'2025-01-04'),(5,17.89,2.22,1,'2025-01-05'),(6,20.45,2.56,1,'2025-01-06'),(7,22.78,2.33,1,'2025-01-07'),(8,29.23,6.45,1,'2025-01-08'),(9,31.56,2.33,1,'2025-01-09'),(10,33.89,2.33,1,'2025-01-10'),(11,37.45,3.56,1,'2025-01-11'),(12,44.12,6.67,1,'2025-01-12'),(13,46.78,2.66,1,'2025-01-13'),(14,49.23,2.45,1,'2025-01-14'),(15,56.89,7.66,1,'2025-01-15'),(16,58.12,1.23,1,'2025-01-16'),(17,63.45,5.33,1,'2025-01-17'),(18,65.78,2.33,1,'2025-01-18'),(19,68.23,2.45,1,'2025-01-19'),(20,74.56,6.33,1,'2025-01-20'),(21,76.89,2.33,1,'2025-01-21'),(22,83.22,6.33,1,'2025-01-22'),(23,85.55,2.33,1,'2025-01-23'),(24,87.88,2.33,1,'2025-01-24'),(25,92.21,4.33,1,'2025-01-25'),(26,94.54,2.33,1,'2025-01-26'),(27,99.87,5.33,1,'2025-01-27'),(28,102.20,2.33,1,'2025-01-28'),(29,104.53,2.33,1,'2025-01-29'),(30,111.86,7.33,1,'2025-01-30'),(31,114.19,2.33,1,'2025-01-31'),(32,119.52,5.33,1,'2025-02-01'),(33,121.85,2.33,1,'2025-02-02'),(34,124.18,2.33,1,'2025-02-03'),(35,129.51,5.33,1,'2025-02-04'),(36,131.84,2.33,1,'2025-02-05'),(37,134.17,2.33,1,'2025-02-06'),(38,141.50,7.33,1,'2025-02-07'),(39,143.83,2.33,1,'2025-02-08'),(40,146.16,2.33,1,'2025-02-09'),(41,153.49,7.33,1,'2025-02-10'),(42,155.82,2.33,1,'2025-02-11'),(43,158.15,2.33,1,'2025-02-12'),(44,163.48,5.33,1,'2025-02-13'),(45,165.81,2.33,1,'2025-02-14'),(46,168.14,2.33,1,'2025-02-15'),(47,175.47,7.33,1,'2025-02-16'),(48,177.80,2.33,1,'2025-02-17'),(49,180.13,2.33,1,'2025-02-18'),(50,187.46,7.33,1,'2025-02-19'),(51,189.79,2.33,1,'2025-02-20'),(52,192.12,2.33,1,'2025-02-21'),(53,197.45,5.33,1,'2025-02-22'),(54,199.78,2.33,1,'2025-02-23'),(55,202.11,2.33,1,'2025-02-24'),(56,209.44,7.33,1,'2025-02-25'),(57,211.77,2.33,1,'2025-02-26'),(58,214.10,2.33,1,'2025-02-27'),(59,221.43,7.33,1,'2025-02-28'),(60,223.76,2.33,1,'2025-03-01'),(61,226.09,2.33,1,'2025-03-02'),(62,233.42,7.33,1,'2025-03-03'),(63,235.75,2.33,1,'2025-03-04'),(64,238.08,2.33,1,'2025-03-05'),(65,245.41,7.33,1,'2025-03-06'),(66,247.74,2.33,1,'2025-03-07'),(67,250.07,2.33,1,'2025-03-08'),(68,257.40,7.33,1,'2025-03-09'),(69,259.73,2.33,1,'2025-03-10'),(70,262.06,2.33,1,'2025-03-11'),(71,267.39,5.33,1,'2025-03-12'),(72,269.72,2.33,1,'2025-03-13'),(73,272.05,2.33,1,'2025-03-14'),(74,279.38,7.33,1,'2025-03-15'),(75,281.71,2.33,2,'2025-03-16'),(76,284.04,2.33,2,'2025-03-17'),(77,291.37,7.33,2,'2025-03-18'),(78,293.70,2.33,2,'2025-03-19'),(79,296.03,2.33,2,'2025-03-20'),(80,303.36,7.33,2,'2025-03-21'),(81,305.69,2.33,2,'2025-03-22'),(82,308.02,2.33,2,'2025-03-23'),(83,315.35,7.33,2,'2025-03-24'),(84,317.68,2.33,2,'2025-03-25'),(85,320.01,2.33,2,'2025-03-26'),(86,327.34,7.33,2,'2025-03-27'),(87,329.67,2.33,2,'2025-03-28'),(88,332.00,2.33,2,'2025-03-29'),(89,339.33,7.33,2,'2025-03-30'),(90,341.66,2.33,2,'2025-03-31'),(91,343.99,2.33,2,'2025-04-01'),(92,351.32,7.33,2,'2025-04-02'),(93,353.65,2.33,2,'2025-04-03'),(94,355.98,2.33,2,'2025-04-04'),(95,363.31,7.33,2,'2025-04-05'),(96,365.64,2.33,2,'2025-04-06'),(97,367.97,2.33,2,'2025-04-07'),(98,375.30,7.33,2,'2025-04-08'),(99,377.63,2.33,2,'2025-04-09'),(100,379.96,2.33,2,'2025-04-10'),(101,387.29,7.33,2,'2025-04-11'),(102,389.62,2.33,2,'2025-04-12'),(103,391.95,2.33,2,'2025-04-13'),(104,399.28,7.33,2,'2025-04-14'),(105,401.61,2.33,2,'2025-04-15'),(106,403.94,2.33,2,'2025-04-16'),(107,411.27,7.33,2,'2025-04-17'),(108,413.60,2.33,2,'2025-04-18'),(109,415.93,2.33,2,'2025-04-19'),(110,423.26,7.33,2,'2025-04-20'),(111,425.59,2.33,2,'2025-04-21'),(112,427.92,2.33,2,'2025-04-22'),(113,435.25,7.33,2,'2025-04-23'),(114,437.58,2.33,2,'2025-04-24'),(115,439.91,2.33,2,'2025-04-25'),(116,447.24,7.33,2,'2025-04-26'),(117,449.57,2.33,2,'2025-04-27'),(118,451.90,2.33,2,'2025-04-28'),(119,459.23,7.33,2,'2025-04-29'),(120,461.56,2.33,2,'2025-04-30'),(121,463.89,2.33,2,'2025-05-01'),(122,471.22,7.33,2,'2025-05-02'),(123,473.55,2.33,2,'2025-05-03'),(124,475.88,2.33,2,'2025-05-04'),(125,483.21,7.33,2,'2025-05-05'),(126,485.54,2.33,2,'2025-05-06'),(127,487.87,2.33,2,'2025-05-07'),(128,495.20,7.33,2,'2025-05-08'),(129,497.53,2.33,2,'2025-05-09'),(130,499.86,2.33,2,'2025-05-10'),(131,507.19,7.33,2,'2025-05-11'),(132,509.52,2.33,2,'2025-05-12'),(133,511.85,2.33,2,'2025-05-13'),(134,519.18,7.33,2,'2025-05-14'),(135,521.51,2.33,2,'2025-05-15'),(136,523.84,2.33,2,'2025-05-16'),(137,531.17,7.33,2,'2025-05-17'),(138,533.50,2.33,2,'2025-05-18'),(139,535.83,2.33,2,'2025-05-19'),(140,543.16,7.33,2,'2025-05-20'),(141,545.49,2.33,2,'2025-05-21'),(142,547.82,2.33,2,'2025-05-22'),(143,555.15,7.33,2,'2025-05-23'),(144,557.48,2.33,2,'2025-05-24'),(145,563.81,6.33,3,'2025-05-25'),(146,571.14,7.33,3,'2025-05-26'),(147,573.47,2.33,3,'2025-05-27'),(148,575.80,2.33,3,'2025-05-28'),(149,583.13,7.33,3,'2025-05-29'),(150,585.46,2.33,3,'2025-05-30'),(151,587.79,2.33,3,'2025-05-31'),(152,595.12,7.33,3,'2025-06-01'),(153,597.45,2.33,3,'2025-06-02'),(154,599.78,2.33,3,'2025-06-03'),(155,607.11,7.33,3,'2025-06-04'),(156,609.44,2.33,3,'2025-06-05'),(157,611.77,2.33,3,'2025-06-06'),(158,619.10,7.33,3,'2025-06-07'),(159,621.43,2.33,3,'2025-06-08'),(160,623.76,2.33,3,'2025-06-09'),(161,631.09,7.33,3,'2025-06-10'),(162,633.42,2.33,3,'2025-06-11'),(163,635.75,2.33,3,'2025-06-12'),(164,643.08,7.33,3,'2025-06-13'),(165,645.41,2.33,3,'2025-06-14'),(166,647.74,2.33,3,'2025-06-15'),(167,655.07,7.33,3,'2025-06-16'),(168,657.40,2.33,3,'2025-06-17'),(169,659.73,2.33,3,'2025-06-18'),(170,667.06,7.33,3,'2025-06-19'),(171,669.39,2.33,3,'2025-06-20'),(172,671.72,2.33,3,'2025-06-21'),(173,679.05,7.33,3,'2025-06-22'),(174,681.38,2.33,3,'2025-06-23'),(175,683.71,2.33,3,'2025-06-24'),(176,691.04,7.33,3,'2025-06-25'),(177,693.37,2.33,3,'2025-06-26'),(178,695.70,2.33,3,'2025-06-27'),(179,703.03,7.33,3,'2025-06-28'),(180,705.36,2.33,3,'2025-06-29'),(181,707.69,2.33,3,'2025-06-30'),(182,715.02,7.33,3,'2025-07-01'),(183,717.35,2.33,3,'2025-07-02'),(184,719.68,2.33,3,'2025-07-03'),(185,727.01,7.33,3,'2025-07-04'),(186,729.34,2.33,3,'2025-07-05'),(187,731.67,2.33,3,'2025-07-06'),(188,739.00,7.33,3,'2025-07-07'),(189,741.33,2.33,3,'2025-07-08'),(190,743.66,2.33,3,'2025-07-09'),(191,750.99,7.33,3,'2025-07-10'),(192,753.32,2.33,3,'2025-07-11'),(193,755.65,2.33,3,'2025-07-12'),(194,762.98,7.33,3,'2025-07-13'),(195,765.31,2.33,3,'2025-07-14'),(196,767.64,2.33,3,'2025-07-15'),(197,774.97,7.33,3,'2025-07-16'),(198,777.30,2.33,3,'2025-07-17'),(199,779.63,2.33,3,'2025-07-18'),(200,786.96,7.33,3,'2025-07-19'),(201,789.29,2.33,3,'2025-07-20'),(202,791.62,2.33,3,'2025-07-21'),(203,798.95,7.33,3,'2025-07-22'),(204,801.28,2.33,3,'2025-07-23'),(205,803.61,2.33,3,'2025-07-24'),(206,810.94,7.33,3,'2025-07-25'),(207,813.27,2.33,3,'2025-07-26'),(208,815.60,2.33,3,'2025-07-27'),(209,822.93,7.33,3,'2025-07-28'),(210,825.26,2.33,3,'2025-07-29'),(211,827.59,2.33,3,'2025-07-30'),(212,834.92,7.33,3,'2025-07-31'),(213,837.25,2.33,4,'2025-08-01'),(214,839.58,2.33,4,'2025-08-02'),(215,846.91,7.33,4,'2025-08-03'),(216,849.24,2.33,4,'2025-08-04'),(217,851.57,2.33,4,'2025-08-05'),(218,858.90,7.33,4,'2025-08-06'),(219,861.23,2.33,4,'2025-08-07'),(220,863.56,2.33,4,'2025-08-08'),(221,870.89,7.33,4,'2025-08-09'),(222,873.22,2.33,4,'2025-08-10'),(223,875.55,2.33,4,'2025-08-11'),(224,882.88,7.33,4,'2025-08-12'),(225,885.21,2.33,4,'2025-08-13'),(226,887.54,2.33,4,'2025-08-14'),(227,894.87,7.33,4,'2025-08-15'),(228,897.20,2.33,4,'2025-08-16'),(229,899.53,2.33,4,'2025-08-17'),(230,906.86,7.33,4,'2025-08-18'),(231,909.19,2.33,4,'2025-08-19'),(232,911.52,2.33,4,'2025-08-20'),(233,918.85,7.33,4,'2025-08-21'),(234,921.18,2.33,4,'2025-08-22'),(235,923.51,2.33,4,'2025-08-23'),(236,930.84,7.33,4,'2025-08-24'),(237,933.17,2.33,4,'2025-08-25'),(238,935.50,2.33,4,'2025-08-26'),(239,942.83,7.33,4,'2025-08-27'),(240,945.16,2.33,4,'2025-08-28'),(241,947.49,2.33,4,'2025-08-29'),(242,954.82,7.33,4,'2025-08-30'),(243,957.15,2.33,4,'2025-08-31'),(244,959.48,2.33,4,'2025-09-01'),(245,966.81,7.33,4,'2025-09-02'),(246,969.14,2.33,4,'2025-09-03'),(247,971.47,2.33,4,'2025-09-04'),(248,978.80,7.33,4,'2025-09-05'),(249,981.13,2.33,4,'2025-09-06'),(250,983.46,2.33,4,'2025-09-07'),(251,990.79,7.33,4,'2025-09-08'),(252,993.12,2.33,4,'2025-09-09'),(253,995.45,2.33,4,'2025-09-10'),(254,1002.78,7.33,4,'2025-09-11'),(255,1005.11,2.33,4,'2025-09-12'),(256,1007.44,2.33,4,'2025-09-13'),(257,1014.77,7.33,4,'2025-09-14'),(258,1017.10,2.33,4,'2025-09-15'),(259,1019.43,2.33,4,'2025-09-16'),(260,1026.76,7.33,4,'2025-09-17'),(261,1029.09,2.33,4,'2025-09-18'),(262,1031.42,2.33,4,'2025-09-19'),(263,1038.75,7.33,4,'2025-09-20'),(264,1041.08,2.33,4,'2025-09-21'),(265,1043.41,2.33,4,'2025-09-22'),(266,1050.74,7.33,4,'2025-09-23'),(267,1053.07,2.33,4,'2025-09-24'),(268,1055.40,2.33,4,'2025-09-25'),(269,1062.73,7.33,4,'2025-09-26'),(270,1065.06,2.33,4,'2025-09-27'),(271,1067.39,2.33,4,'2025-09-28'),(272,1074.72,7.33,4,'2025-09-29'),(273,1077.05,2.33,4,'2025-09-30'),(274,1079.38,2.33,4,'2025-10-01'),(275,1086.71,7.33,4,'2025-10-02'),(276,1089.04,2.33,4,'2025-10-03'),(277,1091.37,2.33,4,'2025-10-04'),(278,1098.70,7.33,4,'2025-10-05'),(279,1101.03,2.33,4,'2025-10-06'),(280,1103.36,2.33,4,'2025-10-07'),(281,1110.69,7.33,4,'2025-10-08'),(282,1113.02,2.33,4,'2025-10-09'),(283,1119.35,6.33,5,'2025-10-10'),(284,1126.68,7.33,5,'2025-10-11'),(285,1129.01,2.33,5,'2025-10-12'),(286,1131.34,2.33,5,'2025-10-13'),(287,1138.67,7.33,5,'2025-10-14'),(288,1141.00,2.33,5,'2025-10-15'),(289,1143.33,2.33,5,'2025-10-16'),(290,1150.66,7.33,5,'2025-10-17'),(291,1152.99,2.33,5,'2025-10-18'),(292,1155.32,2.33,5,'2025-10-19'),(293,1162.65,7.33,5,'2025-10-20'),(294,1164.98,2.33,5,'2025-10-21'),(295,1167.31,2.33,5,'2025-10-22'),(296,1174.64,7.33,5,'2025-10-23'),(297,1176.97,2.33,5,'2025-10-24'),(298,1179.30,2.33,5,'2025-10-25'),(299,1186.63,7.33,5,'2025-10-26'),(300,1188.96,2.33,5,'2025-10-27'),(301,1192.61,3.65,1,'2025-10-15'),(302,1196.26,3.65,1,'2025-10-15'),(303,1199.91,3.65,1,'2025-10-15'),(304,1203.56,3.65,1,'2025-10-15'),(305,1207.21,3.65,1,'2025-10-15');
/*!40000 ALTER TABLE `institute_avg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internships`
--

DROP TABLE IF EXISTS `internships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `upload_type` varchar(255) DEFAULT NULL,
  `rollno` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `roll` varchar(255) NOT NULL,
  `domain` varchar(255) NOT NULL,
  `internship_type` enum('Fulltime','Part-Time','Remote','On-Site') DEFAULT 'Part-Time',
  `is_stipend` tinyint(1) DEFAULT '0',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `consulted_faculty_name` varchar(255) DEFAULT NULL,
  `industry_mentor_name` varchar(255) DEFAULT NULL,
  `industry_mentor_contact` varchar(255) DEFAULT NULL,
  `offer_letter` varchar(255) NOT NULL,
  `report` varchar(255) DEFAULT NULL,
  `faculty_remarks` varchar(255) DEFAULT NULL,
  `skill_gained` varchar(255) NOT NULL,
  `outcomes` varchar(255) NOT NULL,
  `submitted_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internships`
--

LOCK TABLES `internships` WRITE;
/*!40000 ALTER TABLE `internships` DISABLE KEYS */;
INSERT INTO `internships` VALUES (1,'internship','STU001','hrllo','hrllo','hrllo','Fulltime',1,'2025-05-22','2025-05-30','hrllo','hrllo','hrllo@gmial.com','uploads/internships/offer_letter/EXCELSIOR.pdf','uploads/internships/reports/Rsume.pdf','','hrllo','hrllo','2025-05-20 18:30:00'),(2,'internship','STU001','dofmco l','kdfm vc,.',';odf,c ,','Part-Time',1,'2025-05-05','2025-06-05','','','','uploads/internships/offer_letter/EXCELSIOR.pdf','','','[ptkodg,cl ,','gfpvkm /erdfvc','2025-05-20 18:30:00');
/*!40000 ALTER TABLE `internships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `rollno` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `year` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'DEEPAK A','deepaka.ad24@bitsathy.ac.in','STU002','student','1st Year','Civil Engineering'),(2,'SELVAGANAPATHY P','selvaganapathyp.ad24@bitsathy.ac.in','7376242AD297','student','1st Year','Civil Engineering'),(3,'VEERENDRA C ','veerendrac.ad24@bitsathy.ac.in','STU001','student','1st Year','Civil Engineering'),(4,'MOHAMMED KALIF T','mohammedkalift.al24@bitsathy.ac.in','7376242AL153','faculty','1st Year','Civil Engineering');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting_details`
--

DROP TABLE IF EXISTS `meeting_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_details` (
  `activity_id` int NOT NULL,
  `publishing_department` varchar(255) DEFAULT NULL,
  `host` varchar(255) DEFAULT NULL,
  `description` text,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `date_of_meeting` date DEFAULT NULL,
  `link_or_location` varchar(255) DEFAULT NULL,
  `target_year` varchar(255) DEFAULT NULL,
  `target_department` varchar(255) DEFAULT NULL,
  `all_students` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`activity_id`),
  CONSTRAINT `meeting_details_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activity_list` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_details`
--

LOCK TABLES `meeting_details` WRITE;
/*!40000 ALTER TABLE `meeting_details` DISABLE KEYS */;
INSERT INTO `meeting_details` VALUES (31,'Department of Student Affairs','test','desc about','08:39:00','12:42:00','2025-08-15','Auditorium','All Years','All Departments',1),(32,'Department of Student Affairs','test','desc about','08:39:00','12:42:00','2025-08-15','Auditorium','All Years','All Departments',1),(33,'Training and Placement Cell','principal','Hello','00:33:00','01:33:00','2025-08-06','Auditorium','1st Year','Electrical Engineering',0);
/*!40000 ALTER TABLE `meeting_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentee_skills`
--

DROP TABLE IF EXISTS `mentee_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentee_skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mentor_rollno` varchar(255) NOT NULL,
  `mentee_rollno` varchar(255) NOT NULL,
  `skill_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentee_skills`
--

LOCK TABLES `mentee_skills` WRITE;
/*!40000 ALTER TABLE `mentee_skills` DISABLE KEYS */;
INSERT INTO `mentee_skills` VALUES (1,'STU001','STU001','C','2025-05-20 06:49:20','2025-06-03 14:45:26'),(2,'STU001','STU002','Python','2025-05-20 06:49:20','2025-06-03 14:45:26'),(3,'STU001','STU003','C++','2025-05-20 06:49:20','2025-06-03 14:45:26'),(4,'STU001','STU004','Java','2025-05-20 06:49:20','2025-06-03 14:45:26'),(5,'STU002','STU005','DSA','2025-05-20 06:49:20','2025-06-03 14:45:26'),(6,'STU002','STU006','ML','2025-05-20 06:49:20','2025-06-03 14:45:26'),(7,'STU002','STU007','DBMS','2025-05-20 06:49:20','2025-06-03 14:45:26'),(8,'STU002','STU008','Networking','2025-05-20 06:49:20','2025-06-03 14:45:26'),(9,'STU003','STU009','C','2025-05-20 06:49:20','2025-06-03 14:45:26'),(10,'STU003','STU010','C++','2025-05-20 06:49:20','2025-06-03 14:45:26'),(11,'STU003','STU011','DSA','2025-05-20 06:49:20','2025-06-03 14:45:26'),(12,'STU003','STU012','Python','2025-05-20 06:49:20','2025-06-03 14:45:26'),(13,'STU003','STU013','ML','2025-05-20 06:49:20','2025-06-03 14:45:26'),(14,'STU001','STU014','DBMS','2025-05-20 06:49:20','2025-05-23 10:18:01'),(15,'STU001','STU015','Networking','2025-05-20 06:49:20','2025-05-23 10:18:01'),(16,'STU001','STU016','Java','2025-05-20 06:49:20','2025-05-23 10:18:01'),(17,'STU001','STU017','C','2025-05-20 06:49:20','2025-05-23 10:18:01'),(18,'STU001','STU018','Python','2025-05-20 06:49:20','2025-05-23 10:18:01'),(19,'STU001','STU019','ML','2025-05-20 06:49:20','2025-05-23 10:18:01'),(20,'STU001','STU020','DSA','2025-05-20 06:49:20','2025-05-23 10:18:01'),(21,'STU001','STU001','Python','2025-05-20 06:51:58','2025-06-03 14:45:26'),(22,'STU001','STU002','Python','2025-05-20 06:51:58','2025-06-03 14:45:26'),(23,'STU001','STU003','DSA','2025-05-20 06:51:58','2025-06-03 14:45:26'),(24,'STU001','STU004','Python','2025-05-20 06:51:58','2025-06-03 14:45:26'),(25,'STU001','STU005','Java','2025-05-20 06:51:58','2025-06-03 14:45:26'),(26,'STU002','STU006','ML','2025-05-20 06:51:58','2025-06-03 14:45:26'),(27,'STU002','STU007','DSA','2025-05-20 06:51:58','2025-06-03 14:45:26'),(28,'STU002','STU008','ML','2025-05-20 06:51:58','2025-06-03 14:45:26'),(29,'STU002','STU009','Networking','2025-05-20 06:51:58','2025-06-03 14:45:26'),(30,'STU002','STU010','ML','2025-05-20 06:51:58','2025-06-03 14:45:26'),(31,'STU003','STU011','C++','2025-05-20 06:51:58','2025-06-03 14:45:26'),(32,'STU003','STU012','Python','2025-05-20 06:51:58','2025-06-03 14:45:26'),(33,'STU003','STU013','DSA','2025-05-20 06:51:58','2025-06-03 14:45:26'),(34,'STU003','STU014','ML','2025-05-20 06:51:58','2025-06-03 14:45:26'),(35,'STU003','STU015','C','2025-05-20 06:51:58','2025-06-03 14:45:26'),(36,'STU001','STU016','DBMS','2025-05-20 06:51:58','2025-05-23 10:18:01'),(37,'STU001','STU017','Python','2025-05-20 06:51:58','2025-05-23 10:18:01'),(38,'STU001','STU018','C','2025-05-20 06:51:58','2025-05-23 10:18:01'),(39,'STU001','STU019','ML','2025-05-20 06:51:58','2025-05-23 10:18:01'),(40,'STU001','STU020','Python','2025-05-20 06:51:58','2025-05-23 10:18:01'),(41,'STU002','STU021','Python','2025-05-20 06:51:58','2025-06-03 14:45:26'),(42,'STU003','STU022','DSA','2025-05-20 06:51:58','2025-06-03 14:45:26'),(43,'STU001','STU023','ML','2025-05-20 06:51:58','2025-05-23 10:18:01'),(44,'STU001','STU024','Python','2025-05-20 06:51:58','2025-06-03 14:45:26'),(45,'STU003','STU025','DSA','2025-05-20 06:51:58','2025-06-03 14:45:26'),(46,'STU001','STU002','Java','2025-05-20 08:21:18','2025-05-20 08:21:18'),(47,'STU001','STU002','Java','2025-05-20 08:21:18','2025-05-20 08:21:18'),(48,'STU001','STU004','JavaScricpt','2025-05-20 08:37:03','2025-06-03 14:45:26');
/*!40000 ALTER TABLE `mentee_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paperpresentation`
--

DROP TABLE IF EXISTS `paperpresentation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paperpresentation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `upload_type` varchar(255) DEFAULT NULL,
  `rollno` varchar(255) NOT NULL,
  `paper_title` varchar(255) NOT NULL,
  `conference_title` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `date_of_presentation` date NOT NULL,
  `pdf` varchar(255) NOT NULL,
  `certificate` varchar(255) DEFAULT NULL,
  `award` varchar(255) DEFAULT NULL,
  `approval_status` enum('Approved','Not Approved','Pending') DEFAULT 'Pending',
  `submitted_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paperpresentation`
--

LOCK TABLES `paperpresentation` WRITE;
/*!40000 ALTER TABLE `paperpresentation` DISABLE KEYS */;
INSERT INTO `paperpresentation` VALUES (1,'paperpresentation','STU001','Test 1','Test 1','Test 1','2025-08-11','uploads\\paperpresentation\\presentation_pdf\\Bhavish Nithin.pdf','uploads\\paperpresentation\\presentation_certificate\\Bhavish Nithin.pdf','Test 1','Pending','2025-08-09 18:30:00'),(2,'paperpresentation','STU001','upload_type','upload_type','upload_type','2025-08-13','uploads\\paperpresentation\\presentation_pdf\\AdvancedTechnology (1).pdf','uploads\\paperpresentation\\presentation_certificate\\AdvancedTechnology (1).pdf','upload_type','Pending','2025-08-09 18:30:00');
/*!40000 ALTER TABLE `paperpresentation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patents`
--

DROP TABLE IF EXISTS `patents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `upload_type` varchar(255) DEFAULT NULL,
  `rollno` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `application_number` varchar(255) NOT NULL,
  `date_of_filing` date NOT NULL,
  `patent_docs` varchar(255) NOT NULL,
  `supporting_files` varchar(255) DEFAULT NULL,
  `link_to_patent_listing` varchar(255) NOT NULL,
  `summary` varchar(255) NOT NULL,
  `usecase_of_patent` varchar(255) NOT NULL,
  `faculty_remarks` varchar(255) DEFAULT NULL,
  `patent_status` enum('Pending','Not Approved','Approved') DEFAULT 'Pending',
  `submission_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patents`
--

LOCK TABLES `patents` WRITE;
/*!40000 ALTER TABLE `patents` DISABLE KEYS */;
INSERT INTO `patents` VALUES (1,'patents','STU001','aero','13231231','2025-05-22','uploads/patents/patent_docs/EXCELSIOR.pdf','uploads/patents/supporting_files/EXCELSIOR1.pdf','http://localhost:5173/uploadview/patent','This is the first test','used nowhere','','Pending','2025-05-21'),(2,'patents','STU001','second test','1234567','2025-05-19','uploads/patents/patent_docs/EXCELSIOR.pdf','uploads/patents/supporting_files/Rsume.pdf','http://localhost:5173/uploadview/patent','this is the second test','nowhere','','Pending','2025-05-21'),(3,'patents','STU001','nufj','.knljm','2025-05-21','uploads/patents/patent_docs/EXCELSIOR.pdf','','http://localhost:5173/uploadview/patent','r;fncd;,ls.zdcx','xf;vnc klm','','Pending','2025-05-21'),(4,'patents','STU001','fkdlk','123123','2025-07-21','uploads\\patents\\patent_docs\\56-demand.pdf','','http://localhost:5173/uploadview/patent','jflksd','jflksdlfksa','','Pending','2025-07-21');
/*!40000 ALTER TABLE `patents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `point_logs2`
--

DROP TABLE IF EXISTS `point_logs2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_logs2` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rollno` varchar(255) NOT NULL,
  `points` decimal(10,2) DEFAULT NULL,
  `sem` int NOT NULL,
  `currdate` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1051 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `point_logs2`
--

LOCK TABLES `point_logs2` WRITE;
/*!40000 ALTER TABLE `point_logs2` DISABLE KEYS */;
INSERT INTO `point_logs2` VALUES (1,'STU001',0.50,1,'2025-05-19'),(2,'STU001',1.00,1,'2025-05-20'),(3,'STU001',1.50,1,'2025-05-21'),(4,'STU001',2.00,1,'2025-05-22'),(5,'STU001',2.50,1,'2025-05-23'),(6,'STU001',3.00,1,'2025-05-24'),(7,'STU001',3.33,1,'2025-05-25'),(8,'STU001',0.50,1,'2025-05-26'),(9,'STU001',1.00,1,'2025-05-27'),(10,'STU001',1.50,1,'2025-05-28'),(11,'STU001',2.00,1,'2025-05-29'),(12,'STU001',2.50,1,'2025-05-30'),(13,'STU001',3.00,1,'2025-05-31'),(14,'STU001',3.33,1,'2025-06-01'),(15,'STU001',0.50,1,'2025-06-02'),(16,'STU001',1.00,1,'2025-06-03'),(17,'STU001',1.50,1,'2025-06-04'),(18,'STU001',2.00,1,'2025-06-05'),(19,'STU001',2.50,1,'2025-06-06'),(20,'STU001',3.00,1,'2025-06-07'),(21,'STU001',3.33,1,'2025-06-08'),(22,'STU001',0.50,1,'2025-06-09'),(23,'STU001',1.00,1,'2025-06-10'),(24,'STU001',1.50,1,'2025-06-11'),(25,'STU001',2.00,1,'2025-06-12'),(26,'STU001',2.50,1,'2025-06-13'),(27,'STU001',3.00,1,'2025-06-14'),(28,'STU001',3.33,1,'2025-06-15'),(29,'STU001',0.50,1,'2025-06-16'),(30,'STU001',1.00,1,'2025-06-17'),(31,'STU001',1.50,1,'2025-06-18'),(32,'STU001',2.00,1,'2025-06-19'),(33,'STU001',2.50,1,'2025-06-20'),(34,'STU001',3.00,1,'2025-06-21'),(35,'STU001',3.33,1,'2025-06-22'),(36,'STU001',0.50,1,'2025-06-23'),(37,'STU001',1.00,1,'2025-06-24'),(38,'STU001',1.50,1,'2025-06-25'),(39,'STU001',2.00,1,'2025-06-26'),(40,'STU001',2.50,1,'2025-06-27'),(41,'STU001',3.00,1,'2025-06-28'),(42,'STU001',3.33,1,'2025-06-29'),(43,'STU001',0.50,1,'2025-06-30'),(44,'STU001',1.00,1,'2025-07-01'),(45,'STU001',1.50,1,'2025-07-02'),(46,'STU001',2.00,1,'2025-07-03'),(47,'STU001',2.50,1,'2025-07-04'),(48,'STU001',3.00,1,'2025-07-05'),(49,'STU001',3.33,1,'2025-07-06'),(50,'STU001',0.50,1,'2025-07-07'),(51,'STU001',1.00,1,'2025-07-08'),(52,'STU001',1.50,1,'2025-07-09'),(53,'STU001',2.00,1,'2025-07-10'),(54,'STU001',2.50,1,'2025-07-11'),(55,'STU001',3.00,1,'2025-07-12'),(56,'STU001',3.33,1,'2025-07-13'),(57,'STU001',0.50,1,'2025-07-14'),(58,'STU001',1.00,1,'2025-07-15'),(59,'STU001',1.50,1,'2025-07-16'),(60,'STU001',2.00,1,'2025-07-17'),(61,'STU001',2.50,1,'2025-07-18'),(62,'STU001',3.00,1,'2025-07-19'),(63,'STU001',3.33,1,'2025-07-20'),(64,'STU001',0.50,1,'2025-07-21'),(65,'STU001',1.00,1,'2025-07-22'),(66,'STU001',1.50,1,'2025-07-23'),(67,'STU001',2.00,1,'2025-07-24'),(68,'STU001',2.50,1,'2025-07-25'),(69,'STU001',3.00,1,'2025-07-26'),(70,'STU001',3.33,1,'2025-07-27'),(71,'STU001',0.50,2,'2025-07-28'),(72,'STU001',1.00,2,'2025-07-29'),(73,'STU001',1.50,2,'2025-07-30'),(74,'STU001',2.00,2,'2025-07-31'),(75,'STU001',2.50,2,'2025-08-01'),(76,'STU001',3.00,2,'2025-08-02'),(77,'STU001',3.33,2,'2025-08-03'),(78,'STU001',0.50,2,'2025-08-04'),(79,'STU001',1.00,2,'2025-08-05'),(80,'STU001',1.50,2,'2025-08-06'),(81,'STU001',2.00,2,'2025-08-07'),(82,'STU001',2.50,2,'2025-08-08'),(83,'STU001',3.00,2,'2025-08-09'),(84,'STU001',3.33,2,'2025-08-10'),(85,'STU001',0.50,2,'2025-08-11'),(86,'STU001',1.00,2,'2025-08-12'),(87,'STU001',1.50,2,'2025-08-13'),(88,'STU001',2.00,2,'2025-08-14'),(89,'STU001',2.50,2,'2025-08-15'),(90,'STU001',3.00,2,'2025-08-16'),(91,'STU001',3.33,2,'2025-08-17'),(92,'STU001',0.50,2,'2025-08-18'),(93,'STU001',1.00,2,'2025-08-19'),(94,'STU001',1.50,2,'2025-08-20'),(95,'STU001',2.00,2,'2025-08-21'),(96,'STU001',2.50,2,'2025-08-22'),(97,'STU001',3.00,2,'2025-08-23'),(98,'STU001',3.33,2,'2025-08-24'),(99,'STU001',0.50,2,'2025-08-25'),(100,'STU001',1.00,2,'2025-08-26'),(101,'STU001',1.50,2,'2025-08-27'),(102,'STU001',2.00,2,'2025-08-28'),(103,'STU001',2.50,2,'2025-08-29'),(104,'STU001',3.00,2,'2025-08-30'),(105,'STU001',3.33,2,'2025-08-31'),(106,'STU001',0.50,2,'2025-09-01'),(107,'STU001',1.00,2,'2025-09-02'),(108,'STU001',1.50,2,'2025-09-03'),(109,'STU001',2.00,2,'2025-09-04'),(110,'STU001',2.50,2,'2025-09-05'),(111,'STU001',3.00,2,'2025-09-06'),(112,'STU001',3.33,2,'2025-09-07'),(113,'STU001',0.50,2,'2025-09-08'),(114,'STU001',1.00,2,'2025-09-09'),(115,'STU001',1.50,2,'2025-09-10'),(116,'STU001',2.00,2,'2025-09-11'),(117,'STU001',2.50,2,'2025-09-12'),(118,'STU001',3.00,2,'2025-09-13'),(119,'STU001',3.33,2,'2025-09-14'),(120,'STU001',0.50,2,'2025-09-15'),(121,'STU001',1.00,2,'2025-09-16'),(122,'STU001',1.50,2,'2025-09-17'),(123,'STU001',2.00,2,'2025-09-18'),(124,'STU001',2.50,2,'2025-09-19'),(125,'STU001',3.00,2,'2025-09-20'),(126,'STU001',3.33,2,'2025-09-21'),(127,'STU001',0.50,2,'2025-09-22'),(128,'STU001',1.00,2,'2025-09-23'),(129,'STU001',1.50,2,'2025-09-24'),(130,'STU001',2.00,2,'2025-09-25'),(131,'STU001',2.50,2,'2025-09-26'),(132,'STU001',3.00,2,'2025-09-27'),(133,'STU001',3.33,2,'2025-09-28'),(134,'STU001',0.50,2,'2025-09-29'),(135,'STU001',1.00,2,'2025-09-30'),(136,'STU001',1.50,2,'2025-10-01'),(137,'STU001',2.00,2,'2025-10-02'),(138,'STU001',2.50,2,'2025-10-03'),(139,'STU001',3.00,2,'2025-10-04'),(140,'STU001',3.33,2,'2025-10-05'),(141,'STU001',0.50,2,'2025-10-06'),(142,'STU001',1.00,2,'2025-10-07'),(143,'STU001',1.50,2,'2025-10-08'),(144,'STU001',2.00,2,'2025-10-09'),(145,'STU001',2.50,2,'2025-10-10'),(146,'STU001',3.00,2,'2025-10-11'),(147,'STU001',3.33,2,'2025-10-12'),(148,'STU001',0.50,2,'2025-10-13'),(149,'STU001',1.00,2,'2025-10-14'),(150,'STU001',1.50,2,'2025-10-15'),(151,'STU001',0.50,1,'2025-05-20'),(152,'STU001',1.00,1,'2025-05-21'),(153,'STU001',1.50,1,'2025-05-22'),(154,'STU001',2.00,1,'2025-05-23'),(155,'STU001',2.50,1,'2025-05-24'),(156,'STU001',3.00,1,'2025-05-25'),(157,'STU001',3.33,1,'2025-05-26'),(158,'STU001',0.50,1,'2025-05-27'),(159,'STU001',1.00,1,'2025-05-28'),(160,'STU001',1.50,1,'2025-05-29'),(161,'STU001',2.00,1,'2025-05-30'),(162,'STU001',2.50,1,'2025-05-31'),(163,'STU001',3.00,1,'2025-06-01'),(164,'STU001',3.33,1,'2025-06-02'),(165,'STU001',0.50,1,'2025-06-03'),(166,'STU001',1.00,1,'2025-06-04'),(167,'STU001',1.50,1,'2025-06-05'),(168,'STU001',2.00,1,'2025-06-06'),(169,'STU001',2.50,1,'2025-06-07'),(170,'STU001',3.00,1,'2025-06-08'),(171,'STU001',3.33,1,'2025-06-09'),(172,'STU001',0.50,1,'2025-06-10'),(173,'STU001',1.00,1,'2025-06-11'),(174,'STU001',1.50,1,'2025-06-12'),(175,'STU001',2.00,1,'2025-06-13'),(176,'STU001',2.50,1,'2025-06-14'),(177,'STU001',3.00,1,'2025-06-15'),(178,'STU001',3.33,1,'2025-06-16'),(179,'STU001',0.50,1,'2025-06-17'),(180,'STU001',1.00,1,'2025-06-18'),(181,'STU001',1.50,1,'2025-06-19'),(182,'STU001',2.00,1,'2025-06-20'),(183,'STU001',2.50,1,'2025-06-21'),(184,'STU001',3.00,1,'2025-06-22'),(185,'STU001',3.33,1,'2025-06-23'),(186,'STU001',0.50,1,'2025-06-24'),(187,'STU001',1.00,1,'2025-06-25'),(188,'STU001',1.50,1,'2025-06-26'),(189,'STU001',2.00,1,'2025-06-27'),(190,'STU001',2.50,1,'2025-06-28'),(191,'STU001',3.00,1,'2025-06-29'),(192,'STU001',3.33,1,'2025-06-30'),(193,'STU001',0.50,1,'2025-07-01'),(194,'STU001',1.00,1,'2025-07-02'),(195,'STU001',1.50,1,'2025-07-03'),(196,'STU001',2.00,1,'2025-07-04'),(197,'STU001',2.50,1,'2025-07-05'),(198,'STU001',3.00,1,'2025-07-06'),(199,'STU001',3.33,1,'2025-07-07'),(200,'STU001',0.50,1,'2025-07-08'),(201,'STU001',1.00,1,'2025-07-09'),(202,'STU001',1.50,1,'2025-07-10'),(203,'STU001',2.00,1,'2025-07-11'),(204,'STU001',2.50,1,'2025-07-12'),(205,'STU001',3.00,1,'2025-07-13'),(206,'STU001',3.33,1,'2025-07-14'),(207,'STU001',0.50,1,'2025-07-15'),(208,'STU001',1.00,1,'2025-07-16'),(209,'STU001',1.50,1,'2025-07-17'),(210,'STU001',2.00,1,'2025-07-18'),(211,'STU001',2.50,1,'2025-07-19'),(212,'STU001',3.00,1,'2025-07-20'),(213,'STU001',3.33,1,'2025-07-21'),(214,'STU001',0.50,1,'2025-07-22'),(215,'STU001',1.00,1,'2025-07-23'),(216,'STU001',1.50,1,'2025-07-24'),(217,'STU001',2.00,1,'2025-07-25'),(218,'STU001',2.50,1,'2025-07-26'),(219,'STU001',3.00,1,'2025-07-27'),(220,'STU001',3.33,1,'2025-07-28'),(221,'STU001',0.50,2,'2025-07-29'),(222,'STU001',1.00,2,'2025-07-30'),(223,'STU001',1.50,2,'2025-07-31'),(224,'STU001',2.00,2,'2025-08-01'),(225,'STU001',2.50,2,'2025-08-02'),(226,'STU001',3.00,2,'2025-08-03'),(227,'STU001',3.33,2,'2025-08-04'),(228,'STU001',0.50,2,'2025-08-05'),(229,'STU001',1.00,2,'2025-08-06'),(230,'STU001',1.50,2,'2025-08-07'),(231,'STU001',2.00,2,'2025-08-08'),(232,'STU001',2.50,2,'2025-08-09'),(233,'STU001',3.00,2,'2025-08-10'),(234,'STU001',3.33,2,'2025-08-11'),(235,'STU001',0.50,2,'2025-08-12'),(236,'STU001',1.00,2,'2025-08-13'),(237,'STU001',1.50,2,'2025-08-14'),(238,'STU001',2.00,2,'2025-08-15'),(239,'STU001',2.50,2,'2025-08-16'),(240,'STU001',3.00,2,'2025-08-17'),(241,'STU001',3.33,2,'2025-08-18'),(242,'STU001',0.50,2,'2025-08-19'),(243,'STU001',1.00,2,'2025-08-20'),(244,'STU001',1.50,2,'2025-08-21'),(245,'STU001',2.00,2,'2025-08-22'),(246,'STU001',2.50,2,'2025-08-23'),(247,'STU001',3.00,2,'2025-08-24'),(248,'STU001',3.33,2,'2025-08-25'),(249,'STU001',0.50,2,'2025-08-26'),(250,'STU001',1.00,2,'2025-08-27'),(251,'STU001',1.50,2,'2025-08-28'),(252,'STU001',2.00,2,'2025-08-29'),(253,'STU001',2.50,2,'2025-08-30'),(254,'STU001',3.00,2,'2025-08-31'),(255,'STU001',3.33,2,'2025-09-01'),(256,'STU001',0.50,2,'2025-09-02'),(257,'STU001',1.00,2,'2025-09-03'),(258,'STU001',1.50,2,'2025-09-04'),(259,'STU001',2.00,2,'2025-09-05'),(260,'STU001',2.50,2,'2025-09-06'),(261,'STU001',3.00,2,'2025-09-07'),(262,'STU001',3.33,2,'2025-09-08'),(263,'STU001',0.50,2,'2025-09-09'),(264,'STU001',1.00,2,'2025-09-10'),(265,'STU001',1.50,2,'2025-09-11'),(266,'STU001',2.00,2,'2025-09-12'),(267,'STU001',2.50,2,'2025-09-13'),(268,'STU001',3.00,2,'2025-09-14'),(269,'STU001',3.33,2,'2025-09-15'),(270,'STU001',0.50,2,'2025-09-16'),(271,'STU001',1.00,2,'2025-09-17'),(272,'STU001',1.50,2,'2025-09-18'),(273,'STU001',2.00,2,'2025-09-19'),(274,'STU001',2.50,2,'2025-09-20'),(275,'STU001',3.00,2,'2025-09-21'),(276,'STU001',3.33,2,'2025-09-22'),(277,'STU001',0.50,2,'2025-09-23'),(278,'STU001',1.00,2,'2025-09-24'),(279,'STU001',1.50,2,'2025-09-25'),(280,'STU001',2.00,2,'2025-09-26'),(281,'STU001',2.50,2,'2025-09-27'),(282,'STU001',3.00,2,'2025-09-28'),(283,'STU001',3.33,2,'2025-09-29'),(284,'STU001',0.50,2,'2025-09-30'),(285,'STU001',1.00,2,'2025-10-01'),(286,'STU001',1.50,2,'2025-10-02'),(287,'STU001',2.00,2,'2025-10-03'),(288,'STU001',2.50,2,'2025-10-04'),(289,'STU001',3.00,2,'2025-10-05'),(290,'STU001',3.33,2,'2025-10-06'),(291,'STU001',0.50,2,'2025-10-07'),(292,'STU001',1.00,2,'2025-10-08'),(293,'STU001',1.50,2,'2025-10-09'),(294,'STU001',2.00,2,'2025-10-10'),(295,'STU001',2.50,2,'2025-10-11'),(296,'STU001',3.00,2,'2025-10-12'),(297,'STU001',3.33,2,'2025-10-13'),(298,'STU001',0.50,2,'2025-10-14'),(299,'STU001',1.00,2,'2025-10-15'),(300,'STU001',1.50,2,'2025-10-16'),(301,'STU001',0.50,1,'2025-05-20'),(302,'STU001',1.00,1,'2025-05-21'),(303,'STU001',1.50,1,'2025-05-22'),(304,'STU001',2.00,1,'2025-05-23'),(305,'STU001',2.50,1,'2025-05-24'),(306,'STU001',3.00,1,'2025-05-25'),(307,'STU001',3.33,1,'2025-05-26'),(308,'STU001',0.50,1,'2025-05-27'),(309,'STU001',1.00,1,'2025-05-28'),(310,'STU001',1.50,1,'2025-05-29'),(311,'STU001',2.00,1,'2025-05-30'),(312,'STU001',2.50,1,'2025-05-31'),(313,'STU001',3.00,1,'2025-06-01'),(314,'STU001',3.33,1,'2025-06-02'),(315,'STU001',0.50,1,'2025-06-03'),(316,'STU001',1.00,1,'2025-06-04'),(317,'STU001',1.50,1,'2025-06-05'),(318,'STU001',2.00,1,'2025-06-06'),(319,'STU001',2.50,1,'2025-06-07'),(320,'STU001',3.00,1,'2025-06-08'),(321,'STU001',3.33,1,'2025-06-09'),(322,'STU001',0.50,1,'2025-06-10'),(323,'STU001',1.00,1,'2025-06-11'),(324,'STU001',0.50,1,'2025-05-20'),(325,'STU001',1.50,1,'2025-06-12'),(326,'STU001',1.00,1,'2025-05-21'),(327,'STU001',2.00,1,'2025-06-13'),(328,'STU001',1.50,1,'2025-05-22'),(329,'STU001',2.50,1,'2025-06-14'),(330,'STU001',2.00,1,'2025-05-23'),(331,'STU001',3.00,1,'2025-06-15'),(332,'STU001',2.50,1,'2025-05-24'),(333,'STU001',3.33,1,'2025-06-16'),(334,'STU001',3.00,1,'2025-05-25'),(335,'STU001',0.50,1,'2025-06-17'),(336,'STU001',3.33,1,'2025-05-26'),(337,'STU001',1.00,1,'2025-06-18'),(338,'STU001',0.50,1,'2025-05-27'),(339,'STU001',1.50,1,'2025-06-19'),(340,'STU001',1.00,1,'2025-05-28'),(341,'STU001',2.00,1,'2025-06-20'),(342,'STU001',1.50,1,'2025-05-29'),(343,'STU001',2.50,1,'2025-06-21'),(344,'STU001',0.50,1,'2025-05-20'),(345,'STU001',3.00,1,'2025-06-22'),(346,'STU001',1.00,1,'2025-05-21'),(347,'STU001',3.33,1,'2025-06-23'),(348,'STU001',2.00,1,'2025-05-30'),(349,'STU001',1.50,1,'2025-05-22'),(350,'STU001',0.50,1,'2025-06-24'),(351,'STU001',2.50,1,'2025-05-31'),(352,'STU001',2.00,1,'2025-05-23'),(353,'STU001',1.00,1,'2025-06-25'),(354,'STU001',3.00,1,'2025-06-01'),(355,'STU001',2.50,1,'2025-05-24'),(356,'STU001',1.50,1,'2025-06-26'),(357,'STU001',3.00,1,'2025-05-25'),(358,'STU001',3.33,1,'2025-06-02'),(359,'STU001',2.00,1,'2025-06-27'),(360,'STU001',3.33,1,'2025-05-26'),(361,'STU001',0.50,1,'2025-06-03'),(362,'STU001',2.50,1,'2025-06-28'),(363,'STU001',1.00,1,'2025-06-04'),(364,'STU001',0.50,1,'2025-05-27'),(365,'STU001',3.00,1,'2025-06-29'),(366,'STU001',1.50,1,'2025-06-05'),(367,'STU001',1.00,1,'2025-05-28'),(368,'STU001',3.33,1,'2025-06-30'),(369,'STU001',2.00,1,'2025-06-06'),(370,'STU001',0.50,1,'2025-05-20'),(371,'STU001',0.50,1,'2025-07-01'),(372,'STU001',2.50,1,'2025-06-07'),(373,'STU001',1.00,1,'2025-05-21'),(374,'STU001',1.50,1,'2025-05-29'),(375,'STU001',1.00,1,'2025-07-02'),(376,'STU001',3.00,1,'2025-06-08'),(377,'STU001',2.00,1,'2025-05-30'),(378,'STU001',1.50,1,'2025-05-22'),(379,'STU001',1.50,1,'2025-07-03'),(380,'STU001',3.33,1,'2025-06-09'),(381,'STU001',2.50,1,'2025-05-31'),(382,'STU001',2.00,1,'2025-05-23'),(383,'STU001',2.00,1,'2025-07-04'),(384,'STU001',0.50,1,'2025-06-10'),(385,'STU001',3.00,1,'2025-06-01'),(386,'STU001',2.50,1,'2025-05-24'),(387,'STU001',2.50,1,'2025-07-05'),(388,'STU001',1.00,1,'2025-06-11'),(389,'STU001',3.33,1,'2025-06-02'),(390,'STU001',3.00,1,'2025-07-06'),(391,'STU001',3.00,1,'2025-05-25'),(392,'STU001',1.50,1,'2025-06-12'),(393,'STU001',0.50,1,'2025-06-03'),(394,'STU001',3.33,1,'2025-07-07'),(395,'STU001',2.00,1,'2025-06-13'),(396,'STU001',3.33,1,'2025-05-26'),(397,'STU001',1.00,1,'2025-06-04'),(398,'STU001',0.50,1,'2025-07-08'),(399,'STU001',2.50,1,'2025-06-14'),(400,'STU001',0.50,1,'2025-05-27'),(401,'STU001',1.50,1,'2025-06-05'),(402,'STU001',1.00,1,'2025-07-09'),(403,'STU001',3.00,1,'2025-06-15'),(404,'STU001',1.00,1,'2025-05-28'),(405,'STU001',2.00,1,'2025-06-06'),(406,'STU001',1.50,1,'2025-07-10'),(407,'STU001',3.33,1,'2025-06-16'),(408,'STU001',2.50,1,'2025-06-07'),(409,'STU001',1.50,1,'2025-05-29'),(410,'STU001',2.00,1,'2025-07-11'),(411,'STU001',0.50,1,'2025-06-17'),(412,'STU001',3.00,1,'2025-06-08'),(413,'STU001',2.00,1,'2025-05-30'),(414,'STU001',2.50,1,'2025-07-12'),(415,'STU001',1.00,1,'2025-06-18'),(416,'STU001',3.33,1,'2025-06-09'),(417,'STU001',3.00,1,'2025-07-13'),(418,'STU001',2.50,1,'2025-05-31'),(419,'STU001',0.50,1,'2025-05-20'),(420,'STU001',1.50,1,'2025-06-19'),(421,'STU001',0.50,1,'2025-06-10'),(422,'STU001',3.33,1,'2025-07-14'),(423,'STU001',3.00,1,'2025-06-01'),(424,'STU001',1.00,1,'2025-05-21'),(425,'STU001',2.00,1,'2025-06-20'),(426,'STU001',1.00,1,'2025-06-11'),(427,'STU001',0.50,1,'2025-07-15'),(428,'STU001',3.33,1,'2025-06-02'),(429,'STU001',1.50,1,'2025-05-22'),(430,'STU001',2.50,1,'2025-06-21'),(431,'STU001',1.50,1,'2025-06-12'),(432,'STU001',1.00,1,'2025-07-16'),(433,'STU001',0.50,1,'2025-06-03'),(434,'STU001',2.00,1,'2025-05-23'),(435,'STU001',3.00,1,'2025-06-22'),(436,'STU001',2.00,1,'2025-06-13'),(437,'STU001',1.50,1,'2025-07-17'),(438,'STU001',2.50,1,'2025-05-24'),(439,'STU001',1.00,1,'2025-06-04'),(440,'STU001',3.33,1,'2025-06-23'),(441,'STU001',2.50,1,'2025-06-14'),(442,'STU001',2.00,1,'2025-07-18'),(443,'STU001',3.00,1,'2025-05-25'),(444,'STU001',1.50,1,'2025-06-05'),(445,'STU001',0.50,1,'2025-06-24'),(446,'STU001',3.00,1,'2025-06-15'),(447,'STU001',2.50,1,'2025-07-19'),(448,'STU001',3.33,1,'2025-05-26'),(449,'STU001',2.00,1,'2025-06-06'),(450,'STU001',1.00,1,'2025-06-25'),(451,'STU001',3.33,1,'2025-06-16'),(452,'STU001',3.00,1,'2025-07-20'),(453,'STU001',0.50,1,'2025-05-27'),(454,'STU001',2.50,1,'2025-06-07'),(455,'STU001',1.50,1,'2025-06-26'),(456,'STU001',0.50,1,'2025-06-17'),(457,'STU001',3.33,1,'2025-07-21'),(458,'STU001',1.00,1,'2025-05-28'),(459,'STU001',3.00,1,'2025-06-08'),(460,'STU001',2.00,1,'2025-06-27'),(461,'STU001',1.00,1,'2025-06-18'),(462,'STU001',0.50,1,'2025-07-22'),(463,'STU001',1.50,1,'2025-05-29'),(464,'STU001',3.33,1,'2025-06-09'),(465,'STU001',2.50,1,'2025-06-28'),(466,'STU001',1.50,1,'2025-06-19'),(467,'STU001',1.00,1,'2025-07-23'),(468,'STU001',2.00,1,'2025-05-30'),(469,'STU001',0.50,1,'2025-06-10'),(470,'STU001',3.00,1,'2025-06-29'),(471,'STU001',2.00,1,'2025-06-20'),(472,'STU001',1.50,1,'2025-07-24'),(473,'STU001',2.50,1,'2025-05-31'),(474,'STU001',1.00,1,'2025-06-11'),(475,'STU001',3.33,1,'2025-06-30'),(476,'STU001',2.50,1,'2025-06-21'),(477,'STU001',2.00,1,'2025-07-25'),(478,'STU001',3.00,1,'2025-06-01'),(479,'STU001',1.50,1,'2025-06-12'),(480,'STU001',0.50,1,'2025-07-01'),(481,'STU001',3.00,1,'2025-06-22'),(482,'STU001',2.50,1,'2025-07-26'),(483,'STU001',3.33,1,'2025-06-02'),(484,'STU001',2.00,1,'2025-06-13'),(485,'STU001',1.00,1,'2025-07-02'),(486,'STU001',3.33,1,'2025-06-23'),(487,'STU001',3.00,1,'2025-07-27'),(488,'STU001',0.50,1,'2025-06-03'),(489,'STU001',2.50,1,'2025-06-14'),(490,'STU001',0.50,1,'2025-06-24'),(491,'STU001',1.50,1,'2025-07-03'),(492,'STU001',3.33,1,'2025-07-28'),(493,'STU001',1.00,1,'2025-06-04'),(494,'STU001',3.00,1,'2025-06-15'),(495,'STU001',1.00,1,'2025-06-25'),(496,'STU001',0.50,2,'2025-07-29'),(497,'STU001',1.50,1,'2025-06-05'),(498,'STU001',2.00,1,'2025-07-04'),(499,'STU001',3.33,1,'2025-06-16'),(500,'STU001',1.50,1,'2025-06-26'),(501,'STU001',1.00,2,'2025-07-30'),(502,'STU001',2.00,1,'2025-06-06'),(503,'STU001',2.50,1,'2025-07-05'),(504,'STU001',0.50,1,'2025-06-17'),(505,'STU001',2.00,1,'2025-06-27'),(506,'STU001',1.50,2,'2025-07-31'),(507,'STU001',2.50,1,'2025-06-07'),(508,'STU001',3.00,1,'2025-07-06'),(509,'STU001',2.50,1,'2025-06-28'),(510,'STU001',1.00,1,'2025-06-18'),(511,'STU001',2.00,2,'2025-08-01'),(512,'STU001',3.00,1,'2025-06-08'),(513,'STU001',3.33,1,'2025-07-07'),(514,'STU001',1.50,1,'2025-06-19'),(515,'STU001',3.00,1,'2025-06-29'),(516,'STU001',2.50,2,'2025-08-02'),(517,'STU001',0.50,1,'2025-07-08'),(518,'STU001',3.33,1,'2025-06-09'),(519,'STU001',2.00,1,'2025-06-20'),(520,'STU001',3.33,1,'2025-06-30'),(521,'STU001',3.00,2,'2025-08-03'),(522,'STU001',0.50,1,'2025-06-10'),(523,'STU001',1.00,1,'2025-07-09'),(524,'STU001',2.50,1,'2025-06-21'),(525,'STU001',3.33,2,'2025-08-04'),(526,'STU001',0.50,1,'2025-07-01'),(527,'STU001',1.00,1,'2025-06-11'),(528,'STU001',1.50,1,'2025-07-10'),(529,'STU001',3.00,1,'2025-06-22'),(530,'STU001',1.00,1,'2025-07-02'),(531,'STU001',0.50,2,'2025-08-05'),(532,'STU001',1.50,1,'2025-06-12'),(533,'STU001',2.00,1,'2025-07-11'),(534,'STU001',3.33,1,'2025-06-23'),(535,'STU001',1.50,1,'2025-07-03'),(536,'STU001',1.00,2,'2025-08-06'),(537,'STU001',2.00,1,'2025-06-13'),(538,'STU001',2.50,1,'2025-07-12'),(539,'STU001',2.00,1,'2025-07-04'),(540,'STU001',0.50,1,'2025-06-24'),(541,'STU001',1.50,2,'2025-08-07'),(542,'STU001',2.50,1,'2025-06-14'),(543,'STU001',3.00,1,'2025-07-13'),(544,'STU001',2.50,1,'2025-07-05'),(545,'STU001',1.00,1,'2025-06-25'),(546,'STU001',2.00,2,'2025-08-08'),(547,'STU001',3.00,1,'2025-06-15'),(548,'STU001',3.33,1,'2025-07-14'),(549,'STU001',3.00,1,'2025-07-06'),(550,'STU001',1.50,1,'2025-06-26'),(551,'STU001',2.50,2,'2025-08-09'),(552,'STU001',3.33,1,'2025-06-16'),(553,'STU001',0.50,1,'2025-07-15'),(554,'STU001',3.33,1,'2025-07-07'),(555,'STU001',3.00,2,'2025-08-10'),(556,'STU001',2.00,1,'2025-06-27'),(557,'STU001',0.50,1,'2025-06-17'),(558,'STU001',1.00,1,'2025-07-16'),(559,'STU001',0.50,1,'2025-07-08'),(560,'STU001',3.33,2,'2025-08-11'),(561,'STU001',2.50,1,'2025-06-28'),(562,'STU001',1.00,1,'2025-06-18'),(563,'STU001',1.50,1,'2025-07-17'),(564,'STU001',0.50,2,'2025-08-12'),(565,'STU001',1.00,1,'2025-07-09'),(566,'STU001',3.00,1,'2025-06-29'),(567,'STU001',1.50,1,'2025-06-19'),(568,'STU001',2.00,1,'2025-07-18'),(569,'STU001',1.00,2,'2025-08-13'),(570,'STU001',1.50,1,'2025-07-10'),(571,'STU001',3.33,1,'2025-06-30'),(572,'STU001',2.00,1,'2025-06-20'),(573,'STU001',2.50,1,'2025-07-19'),(574,'STU001',1.50,2,'2025-08-14'),(575,'STU001',2.00,1,'2025-07-11'),(576,'STU001',0.50,1,'2025-07-01'),(577,'STU001',2.50,1,'2025-06-21'),(578,'STU001',3.00,1,'2025-07-20'),(579,'STU001',2.00,2,'2025-08-15'),(580,'STU001',2.50,1,'2025-07-12'),(581,'STU001',3.00,1,'2025-06-22'),(582,'STU001',1.00,1,'2025-07-02'),(583,'STU001',3.33,1,'2025-07-21'),(584,'STU001',2.50,2,'2025-08-16'),(585,'STU001',3.00,1,'2025-07-13'),(586,'STU001',3.33,1,'2025-06-23'),(587,'STU001',0.50,1,'2025-07-22'),(588,'STU001',1.50,1,'2025-07-03'),(589,'STU001',3.00,2,'2025-08-17'),(590,'STU001',3.33,1,'2025-07-14'),(591,'STU001',0.50,1,'2025-06-24'),(592,'STU001',1.00,1,'2025-07-23'),(593,'STU001',2.00,1,'2025-07-04'),(594,'STU001',0.50,1,'2025-07-15'),(595,'STU001',3.33,2,'2025-08-18'),(596,'STU001',1.00,1,'2025-06-25'),(597,'STU001',1.50,1,'2025-07-24'),(598,'STU001',2.50,1,'2025-07-05'),(599,'STU001',1.00,1,'2025-07-16'),(600,'STU001',0.50,2,'2025-08-19'),(601,'STU001',1.50,1,'2025-06-26'),(602,'STU001',2.00,1,'2025-07-25'),(603,'STU001',3.00,1,'2025-07-06'),(604,'STU001',1.50,1,'2025-07-17'),(605,'STU001',1.00,2,'2025-08-20'),(606,'STU001',2.00,1,'2025-06-27'),(607,'STU001',2.50,1,'2025-07-26'),(608,'STU001',3.33,1,'2025-07-07'),(609,'STU001',2.00,1,'2025-07-18'),(610,'STU001',1.50,2,'2025-08-21'),(611,'STU001',2.50,1,'2025-06-28'),(612,'STU001',3.00,1,'2025-07-27'),(613,'STU001',0.50,1,'2025-07-08'),(614,'STU001',2.50,1,'2025-07-19'),(615,'STU001',2.00,2,'2025-08-22'),(616,'STU001',3.00,1,'2025-06-29'),(617,'STU001',1.00,1,'2025-07-09'),(618,'STU001',3.33,1,'2025-07-28'),(619,'STU001',3.00,1,'2025-07-20'),(620,'STU001',2.50,2,'2025-08-23'),(621,'STU001',3.33,1,'2025-06-30'),(622,'STU001',0.50,2,'2025-07-29'),(623,'STU001',1.50,1,'2025-07-10'),(624,'STU001',3.33,1,'2025-07-21'),(625,'STU001',3.00,2,'2025-08-24'),(626,'STU001',0.50,1,'2025-07-01'),(627,'STU001',1.00,2,'2025-07-30'),(628,'STU001',0.50,1,'2025-07-22'),(629,'STU001',2.00,1,'2025-07-11'),(630,'STU001',3.33,2,'2025-08-25'),(631,'STU001',1.50,2,'2025-07-31'),(632,'STU001',1.00,1,'2025-07-23'),(633,'STU001',1.00,1,'2025-07-02'),(634,'STU001',2.50,1,'2025-07-12'),(635,'STU001',0.50,2,'2025-08-26'),(636,'STU001',2.00,2,'2025-08-01'),(637,'STU001',1.50,1,'2025-07-24'),(638,'STU001',1.50,1,'2025-07-03'),(639,'STU001',3.00,1,'2025-07-13'),(640,'STU001',1.00,2,'2025-08-27'),(641,'STU001',2.50,2,'2025-08-02'),(642,'STU001',2.00,1,'2025-07-04'),(643,'STU001',2.00,1,'2025-07-25'),(644,'STU001',3.33,1,'2025-07-14'),(645,'STU001',3.00,2,'2025-08-03'),(646,'STU001',1.50,2,'2025-08-28'),(647,'STU001',2.50,1,'2025-07-26'),(648,'STU001',2.50,1,'2025-07-05'),(649,'STU001',0.50,1,'2025-07-15'),(650,'STU001',3.33,2,'2025-08-04'),(651,'STU001',2.00,2,'2025-08-29'),(652,'STU001',3.00,1,'2025-07-27'),(653,'STU001',3.00,1,'2025-07-06'),(654,'STU001',1.00,1,'2025-07-16'),(655,'STU001',0.50,2,'2025-08-05'),(656,'STU001',2.50,2,'2025-08-30'),(657,'STU001',3.33,1,'2025-07-28'),(658,'STU001',3.33,1,'2025-07-07'),(659,'STU001',1.50,1,'2025-07-17'),(660,'STU001',1.00,2,'2025-08-06'),(661,'STU001',3.00,2,'2025-08-31'),(662,'STU001',0.50,2,'2025-07-29'),(663,'STU001',0.50,1,'2025-07-08'),(664,'STU001',2.00,1,'2025-07-18'),(665,'STU001',1.50,2,'2025-08-07'),(666,'STU001',3.33,2,'2025-09-01'),(667,'STU001',1.00,2,'2025-07-30'),(668,'STU001',1.00,1,'2025-07-09'),(669,'STU001',2.50,1,'2025-07-19'),(670,'STU001',2.00,2,'2025-08-08'),(671,'STU001',0.50,2,'2025-09-02'),(672,'STU001',1.50,2,'2025-07-31'),(673,'STU001',3.00,1,'2025-07-20'),(674,'STU001',2.50,2,'2025-08-09'),(675,'STU001',1.50,1,'2025-07-10'),(676,'STU001',1.00,2,'2025-09-03'),(677,'STU001',2.00,2,'2025-08-01'),(678,'STU001',3.33,1,'2025-07-21'),(679,'STU001',3.00,2,'2025-08-10'),(680,'STU001',2.50,2,'2025-08-02'),(681,'STU001',2.00,1,'2025-07-11'),(682,'STU001',1.50,2,'2025-09-04'),(683,'STU001',0.50,1,'2025-07-22'),(684,'STU001',3.33,2,'2025-08-11'),(685,'STU001',3.00,2,'2025-08-03'),(686,'STU001',2.50,1,'2025-07-12'),(687,'STU001',2.00,2,'2025-09-05'),(688,'STU001',1.00,1,'2025-07-23'),(689,'STU001',0.50,2,'2025-08-12'),(690,'STU001',3.33,2,'2025-08-04'),(691,'STU001',2.50,2,'2025-09-06'),(692,'STU001',3.00,1,'2025-07-13'),(693,'STU001',1.50,1,'2025-07-24'),(694,'STU001',1.00,2,'2025-08-13'),(695,'STU001',0.50,2,'2025-08-05'),(696,'STU001',3.00,2,'2025-09-07'),(697,'STU001',3.33,1,'2025-07-14'),(698,'STU001',2.00,1,'2025-07-25'),(699,'STU001',1.50,2,'2025-08-14'),(700,'STU001',1.00,2,'2025-08-06'),(701,'STU001',3.33,2,'2025-09-08'),(702,'STU001',0.50,1,'2025-07-15'),(703,'STU001',2.50,1,'2025-07-26'),(704,'STU001',2.00,2,'2025-08-15'),(705,'STU001',1.50,2,'2025-08-07'),(706,'STU001',0.50,2,'2025-09-09'),(707,'STU001',1.00,1,'2025-07-16'),(708,'STU001',3.00,1,'2025-07-27'),(709,'STU001',2.50,2,'2025-08-16'),(710,'STU001',2.00,2,'2025-08-08'),(711,'STU001',1.00,2,'2025-09-10'),(712,'STU001',1.50,1,'2025-07-17'),(713,'STU001',3.33,1,'2025-07-28'),(714,'STU001',3.00,2,'2025-08-17'),(715,'STU001',2.50,2,'2025-08-09'),(716,'STU001',1.50,2,'2025-09-11'),(717,'STU001',2.00,1,'2025-07-18'),(718,'STU001',0.50,2,'2025-07-29'),(719,'STU001',3.33,2,'2025-08-18'),(720,'STU001',3.00,2,'2025-08-10'),(721,'STU001',2.00,2,'2025-09-12'),(722,'STU001',2.50,1,'2025-07-19'),(723,'STU001',1.00,2,'2025-07-30'),(724,'STU001',0.50,2,'2025-08-19'),(725,'STU001',2.50,2,'2025-09-13'),(726,'STU001',3.33,2,'2025-08-11'),(727,'STU001',3.00,1,'2025-07-20'),(728,'STU001',1.50,2,'2025-07-31'),(729,'STU001',1.00,2,'2025-08-20'),(730,'STU001',3.00,2,'2025-09-14'),(731,'STU001',0.50,2,'2025-08-12'),(732,'STU001',3.33,1,'2025-07-21'),(733,'STU001',2.00,2,'2025-08-01'),(734,'STU001',1.50,2,'2025-08-21'),(735,'STU001',1.00,2,'2025-08-13'),(736,'STU001',3.33,2,'2025-09-15'),(737,'STU001',0.50,1,'2025-07-22'),(738,'STU001',2.50,2,'2025-08-02'),(739,'STU001',2.00,2,'2025-08-22'),(740,'STU001',0.50,2,'2025-09-16'),(741,'STU001',1.50,2,'2025-08-14'),(742,'STU001',1.00,1,'2025-07-23'),(743,'STU001',3.00,2,'2025-08-03'),(744,'STU001',2.50,2,'2025-08-23'),(745,'STU001',1.00,2,'2025-09-17'),(746,'STU001',2.00,2,'2025-08-15'),(747,'STU001',1.50,1,'2025-07-24'),(748,'STU001',3.33,2,'2025-08-04'),(749,'STU001',3.00,2,'2025-08-24'),(750,'STU001',1.50,2,'2025-09-18'),(751,'STU001',2.50,2,'2025-08-16'),(752,'STU001',2.00,1,'2025-07-25'),(753,'STU001',0.50,2,'2025-08-05'),(754,'STU001',3.33,2,'2025-08-25'),(755,'STU001',2.00,2,'2025-09-19'),(756,'STU001',3.00,2,'2025-08-17'),(757,'STU001',2.50,1,'2025-07-26'),(758,'STU001',1.00,2,'2025-08-06'),(759,'STU001',0.50,2,'2025-08-26'),(760,'STU001',2.50,2,'2025-09-20'),(761,'STU001',3.33,2,'2025-08-18'),(762,'STU001',3.00,1,'2025-07-27'),(763,'STU001',1.50,2,'2025-08-07'),(764,'STU001',3.00,2,'2025-09-21'),(765,'STU001',1.00,2,'2025-08-27'),(766,'STU001',0.50,2,'2025-08-19'),(767,'STU001',3.33,1,'2025-07-28'),(768,'STU001',2.00,2,'2025-08-08'),(769,'STU001',3.33,2,'2025-09-22'),(770,'STU001',1.50,2,'2025-08-28'),(771,'STU001',1.00,2,'2025-08-20'),(772,'STU001',0.50,2,'2025-07-29'),(773,'STU001',2.50,2,'2025-08-09'),(774,'STU001',0.50,2,'2025-09-23'),(775,'STU001',2.00,2,'2025-08-29'),(776,'STU001',1.50,2,'2025-08-21'),(777,'STU001',1.00,2,'2025-07-30'),(778,'STU001',3.00,2,'2025-08-10'),(779,'STU001',1.00,2,'2025-09-24'),(780,'STU001',2.50,2,'2025-08-30'),(781,'STU001',2.00,2,'2025-08-22'),(782,'STU001',1.50,2,'2025-07-31'),(783,'STU001',3.33,2,'2025-08-11'),(784,'STU001',1.50,2,'2025-09-25'),(785,'STU001',3.00,2,'2025-08-31'),(786,'STU001',2.50,2,'2025-08-23'),(787,'STU001',2.00,2,'2025-08-01'),(788,'STU001',0.50,2,'2025-08-12'),(789,'STU001',2.00,2,'2025-09-26'),(790,'STU001',3.33,2,'2025-09-01'),(791,'STU001',3.00,2,'2025-08-24'),(792,'STU001',2.50,2,'2025-08-02'),(793,'STU001',1.00,2,'2025-08-13'),(794,'STU001',2.50,2,'2025-09-27'),(795,'STU001',0.50,2,'2025-09-02'),(796,'STU001',3.33,2,'2025-08-25'),(797,'STU001',3.00,2,'2025-08-03'),(798,'STU001',1.50,2,'2025-08-14'),(799,'STU001',3.00,2,'2025-09-28'),(800,'STU001',1.00,2,'2025-09-03'),(801,'STU001',0.50,2,'2025-08-26'),(802,'STU001',3.33,2,'2025-08-04'),(803,'STU001',2.00,2,'2025-08-15'),(804,'STU001',3.33,2,'2025-09-29'),(805,'STU001',1.50,2,'2025-09-04'),(806,'STU001',0.50,2,'2025-08-05'),(807,'STU001',1.00,2,'2025-08-27'),(808,'STU001',0.50,2,'2025-09-30'),(809,'STU001',2.50,2,'2025-08-16'),(810,'STU001',2.00,2,'2025-09-05'),(811,'STU001',1.00,2,'2025-08-06'),(812,'STU001',1.50,2,'2025-08-28'),(813,'STU001',1.00,2,'2025-10-01'),(814,'STU001',3.00,2,'2025-08-17'),(815,'STU001',2.50,2,'2025-09-06'),(816,'STU001',1.50,2,'2025-08-07'),(817,'STU001',2.00,2,'2025-08-29'),(818,'STU001',1.50,2,'2025-10-02'),(819,'STU001',3.33,2,'2025-08-18'),(820,'STU001',3.00,2,'2025-09-07'),(821,'STU001',2.00,2,'2025-08-08'),(822,'STU001',2.50,2,'2025-08-30'),(823,'STU001',2.00,2,'2025-10-03'),(824,'STU001',0.50,2,'2025-08-19'),(825,'STU001',3.33,2,'2025-09-08'),(826,'STU001',2.50,2,'2025-08-09'),(827,'STU001',3.00,2,'2025-08-31'),(828,'STU001',2.50,2,'2025-10-04'),(829,'STU001',1.00,2,'2025-08-20'),(830,'STU001',0.50,2,'2025-09-09'),(831,'STU001',3.00,2,'2025-08-10'),(832,'STU001',3.33,2,'2025-09-01'),(833,'STU001',3.00,2,'2025-10-05'),(834,'STU001',1.50,2,'2025-08-21'),(835,'STU001',1.00,2,'2025-09-10'),(836,'STU001',3.33,2,'2025-08-11'),(837,'STU001',0.50,2,'2025-09-02'),(838,'STU001',3.33,2,'2025-10-06'),(839,'STU001',2.00,2,'2025-08-22'),(840,'STU001',1.50,2,'2025-09-11'),(841,'STU001',0.50,2,'2025-08-12'),(842,'STU001',1.00,2,'2025-09-03'),(843,'STU001',0.50,2,'2025-10-07'),(844,'STU001',2.50,2,'2025-08-23'),(845,'STU001',2.00,2,'2025-09-12'),(846,'STU001',1.00,2,'2025-08-13'),(847,'STU001',1.50,2,'2025-09-04'),(848,'STU001',1.00,2,'2025-10-08'),(849,'STU001',3.00,2,'2025-08-24'),(850,'STU001',2.50,2,'2025-09-13'),(851,'STU001',1.50,2,'2025-08-14'),(852,'STU001',2.00,2,'2025-09-05'),(853,'STU001',1.50,2,'2025-10-09'),(854,'STU001',3.33,2,'2025-08-25'),(855,'STU001',3.00,2,'2025-09-14'),(856,'STU001',2.00,2,'2025-08-15'),(857,'STU001',2.50,2,'2025-09-06'),(858,'STU001',2.00,2,'2025-10-10'),(859,'STU001',0.50,2,'2025-08-26'),(860,'STU001',3.33,2,'2025-09-15'),(861,'STU001',2.50,2,'2025-08-16'),(862,'STU001',2.50,2,'2025-10-11'),(863,'STU001',3.00,2,'2025-09-07'),(864,'STU001',1.00,2,'2025-08-27'),(865,'STU001',0.50,2,'2025-09-16'),(866,'STU001',3.00,2,'2025-08-17'),(867,'STU001',3.00,2,'2025-10-12'),(868,'STU001',3.33,2,'2025-09-08'),(869,'STU001',1.50,2,'2025-08-28'),(870,'STU001',1.00,2,'2025-09-17'),(871,'STU001',3.33,2,'2025-08-18'),(872,'STU001',3.33,2,'2025-10-13'),(873,'STU001',0.50,2,'2025-09-09'),(874,'STU001',2.00,2,'2025-08-29'),(875,'STU001',1.50,2,'2025-09-18'),(876,'STU001',0.50,2,'2025-08-19'),(877,'STU001',1.00,2,'2025-09-10'),(878,'STU001',0.50,2,'2025-10-14'),(879,'STU001',2.50,2,'2025-08-30'),(880,'STU001',2.00,2,'2025-09-19'),(881,'STU001',1.00,2,'2025-08-20'),(882,'STU001',1.50,2,'2025-09-11'),(883,'STU001',1.00,2,'2025-10-15'),(884,'STU001',3.00,2,'2025-08-31'),(885,'STU001',2.50,2,'2025-09-20'),(886,'STU001',1.50,2,'2025-08-21'),(887,'STU001',2.00,2,'2025-09-12'),(888,'STU001',1.50,2,'2025-10-16'),(889,'STU001',3.33,2,'2025-09-01'),(890,'STU001',3.00,2,'2025-09-21'),(891,'STU001',2.00,2,'2025-08-22'),(892,'STU001',2.50,2,'2025-09-13'),(893,'STU001',0.50,2,'2025-09-02'),(894,'STU001',3.33,2,'2025-09-22'),(895,'STU001',2.50,2,'2025-08-23'),(896,'STU001',3.00,2,'2025-09-14'),(897,'STU001',1.00,2,'2025-09-03'),(898,'STU001',0.50,2,'2025-09-23'),(899,'STU001',3.00,2,'2025-08-24'),(900,'STU001',3.33,2,'2025-09-15'),(901,'STU001',1.50,2,'2025-09-04'),(902,'STU001',1.00,2,'2025-09-24'),(903,'STU001',3.33,2,'2025-08-25'),(904,'STU001',0.50,2,'2025-09-16'),(905,'STU001',2.00,2,'2025-09-05'),(906,'STU001',1.50,2,'2025-09-25'),(907,'STU001',1.00,2,'2025-09-17'),(908,'STU001',0.50,2,'2025-08-26'),(909,'STU001',2.50,2,'2025-09-06'),(910,'STU001',2.00,2,'2025-09-26'),(911,'STU001',1.50,2,'2025-09-18'),(912,'STU001',3.00,2,'2025-09-07'),(913,'STU001',1.00,2,'2025-08-27'),(914,'STU001',2.50,2,'2025-09-27'),(915,'STU001',2.00,2,'2025-09-19'),(916,'STU001',1.50,2,'2025-08-28'),(917,'STU001',3.33,2,'2025-09-08'),(918,'STU001',3.00,2,'2025-09-28'),(919,'STU001',2.50,2,'2025-09-20'),(920,'STU001',0.50,2,'2025-09-09'),(921,'STU001',2.00,2,'2025-08-29'),(922,'STU001',3.33,2,'2025-09-29'),(923,'STU001',3.00,2,'2025-09-21'),(924,'STU001',1.00,2,'2025-09-10'),(925,'STU001',2.50,2,'2025-08-30'),(926,'STU001',0.50,2,'2025-09-30'),(927,'STU001',3.33,2,'2025-09-22'),(928,'STU001',3.00,2,'2025-08-31'),(929,'STU001',1.50,2,'2025-09-11'),(930,'STU001',1.00,2,'2025-10-01'),(931,'STU001',0.50,2,'2025-09-23'),(932,'STU001',3.33,2,'2025-09-01'),(933,'STU001',2.00,2,'2025-09-12'),(934,'STU001',1.50,2,'2025-10-02'),(935,'STU001',1.00,2,'2025-09-24'),(936,'STU001',0.50,2,'2025-09-02'),(937,'STU001',2.50,2,'2025-09-13'),(938,'STU001',2.00,2,'2025-10-03'),(939,'STU001',1.50,2,'2025-09-25'),(940,'STU001',1.00,2,'2025-09-03'),(941,'STU001',3.00,2,'2025-09-14'),(942,'STU001',2.50,2,'2025-10-04'),(943,'STU001',2.00,2,'2025-09-26'),(944,'STU001',1.50,2,'2025-09-04'),(945,'STU001',3.33,2,'2025-09-15'),(946,'STU001',3.00,2,'2025-10-05'),(947,'STU001',2.50,2,'2025-09-27'),(948,'STU001',2.00,2,'2025-09-05'),(949,'STU001',0.50,2,'2025-09-16'),(950,'STU001',3.33,2,'2025-10-06'),(951,'STU001',3.00,2,'2025-09-28'),(952,'STU001',2.50,2,'2025-09-06'),(953,'STU001',1.00,2,'2025-09-17'),(954,'STU001',0.50,2,'2025-10-07'),(955,'STU001',3.33,2,'2025-09-29'),(956,'STU001',3.00,2,'2025-09-07'),(957,'STU001',1.50,2,'2025-09-18'),(958,'STU001',1.00,2,'2025-10-08'),(959,'STU001',0.50,2,'2025-09-30'),(960,'STU001',3.33,2,'2025-09-08'),(961,'STU001',2.00,2,'2025-09-19'),(962,'STU001',1.50,2,'2025-10-09'),(963,'STU001',1.00,2,'2025-10-01'),(964,'STU001',2.50,2,'2025-09-20'),(965,'STU001',0.50,2,'2025-09-09'),(966,'STU001',2.00,2,'2025-10-10'),(967,'STU001',1.50,2,'2025-10-02'),(968,'STU001',3.00,2,'2025-09-21'),(969,'STU001',1.00,2,'2025-09-10'),(970,'STU001',2.50,2,'2025-10-11'),(971,'STU001',2.00,2,'2025-10-03'),(972,'STU001',3.33,2,'2025-09-22'),(973,'STU001',1.50,2,'2025-09-11'),(974,'STU001',2.50,2,'2025-10-04'),(975,'STU001',3.00,2,'2025-10-12'),(976,'STU001',3.00,2,'2025-10-05'),(977,'STU001',3.33,2,'2025-10-13'),(978,'STU001',2.00,2,'2025-09-12'),(979,'STU001',0.50,2,'2025-09-23'),(980,'STU001',3.33,2,'2025-10-06'),(981,'STU001',1.00,2,'2025-09-24'),(982,'STU001',0.50,2,'2025-10-14'),(983,'STU001',2.50,2,'2025-09-13'),(984,'STU001',1.50,2,'2025-09-25'),(985,'STU001',0.50,2,'2025-10-07'),(986,'STU001',1.00,2,'2025-10-15'),(987,'STU001',3.00,2,'2025-09-14'),(988,'STU001',2.00,2,'2025-09-26'),(989,'STU001',1.00,2,'2025-10-08'),(990,'STU001',3.33,2,'2025-09-15'),(991,'STU001',1.50,2,'2025-10-16'),(992,'STU001',2.50,2,'2025-09-27'),(993,'STU001',1.50,2,'2025-10-09'),(994,'STU001',0.50,2,'2025-09-16'),(995,'STU001',3.00,2,'2025-09-28'),(996,'STU001',2.00,2,'2025-10-10'),(997,'STU001',1.00,2,'2025-09-17'),(998,'STU001',3.33,2,'2025-09-29'),(999,'STU001',2.50,2,'2025-10-11'),(1000,'STU001',1.50,2,'2025-09-18'),(1001,'STU001',0.50,2,'2025-09-30'),(1002,'STU001',3.00,2,'2025-10-12'),(1003,'STU001',2.00,2,'2025-09-19'),(1004,'STU001',1.00,2,'2025-10-01'),(1005,'STU001',3.33,2,'2025-10-13'),(1006,'STU001',2.50,2,'2025-09-20'),(1007,'STU001',1.50,2,'2025-10-02'),(1008,'STU001',0.50,2,'2025-10-14'),(1009,'STU001',3.00,2,'2025-09-21'),(1010,'STU001',2.00,2,'2025-10-03'),(1011,'STU001',1.00,2,'2025-10-15'),(1012,'STU001',3.33,2,'2025-09-22'),(1013,'STU001',2.50,2,'2025-10-04'),(1014,'STU001',1.50,2,'2025-10-16'),(1015,'STU001',0.50,2,'2025-09-23'),(1016,'STU001',3.00,2,'2025-10-05'),(1017,'STU001',1.00,2,'2025-09-24'),(1018,'STU001',3.33,2,'2025-10-06'),(1019,'STU001',1.50,2,'2025-09-25'),(1020,'STU001',0.50,2,'2025-10-07'),(1021,'STU001',2.00,2,'2025-09-26'),(1022,'STU001',1.00,2,'2025-10-08'),(1023,'STU001',2.50,2,'2025-09-27'),(1024,'STU001',1.50,2,'2025-10-09'),(1025,'STU001',3.00,2,'2025-09-28'),(1026,'STU001',2.00,2,'2025-10-10'),(1027,'STU001',3.33,2,'2025-09-29'),(1028,'STU001',2.50,2,'2025-10-11'),(1029,'STU001',3.00,2,'2025-10-12'),(1030,'STU001',0.50,2,'2025-09-30'),(1031,'STU001',1.00,2,'2025-10-01'),(1032,'STU001',3.33,2,'2025-10-13'),(1033,'STU001',1.50,2,'2025-10-02'),(1034,'STU001',0.50,2,'2025-10-14'),(1035,'STU001',2.00,2,'2025-10-03'),(1036,'STU001',1.00,2,'2025-10-15'),(1037,'STU001',2.50,2,'2025-10-04'),(1038,'STU001',1.50,2,'2025-10-16'),(1039,'STU001',3.00,2,'2025-10-05'),(1040,'STU001',3.33,2,'2025-10-06'),(1041,'STU001',0.50,2,'2025-10-07'),(1042,'STU001',1.00,2,'2025-10-08'),(1043,'STU001',1.50,2,'2025-10-09'),(1044,'STU001',2.00,2,'2025-10-10'),(1045,'STU001',2.50,2,'2025-10-11'),(1046,'STU001',3.00,2,'2025-10-12'),(1047,'STU001',3.33,2,'2025-10-13'),(1048,'STU001',0.50,2,'2025-10-14'),(1049,'STU001',1.00,2,'2025-10-15'),(1050,'STU001',1.50,2,'2025-10-16');
/*!40000 ALTER TABLE `point_logs2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `points_logs`
--

DROP TABLE IF EXISTS `points_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `points_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rollno` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `points` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `sem` int NOT NULL,
  `currdate` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1051 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `points_logs`
--

LOCK TABLES `points_logs` WRITE;
/*!40000 ALTER TABLE `points_logs` DISABLE KEYS */;
INSERT INTO `points_logs` VALUES (1,'STU001','PS',-5,'Cloud Fundamentals 1/7',1,'2025-05-19'),(2,'STU001','PS',1,'DBMS 4/7',1,'2025-05-20'),(3,'STU001','PS',1.5,'Cloud Fundamentals 1/7',1,'2025-05-21'),(4,'STU001','PS',2,'Computer Networks 3/7',1,'2025-05-22'),(5,'STU001','PS',2.5,'Typing Speed 6/7',1,'2025-05-23'),(6,'STU001','PS',3,'Excel 3/7',1,'2025-05-24'),(7,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',1,'2025-05-25'),(8,'STU001','PS',0.5,'Digital Electronics 5/7',1,'2025-05-26'),(9,'STU001','PS',1,'Cybersecurity Awareness 3/7',1,'2025-05-27'),(10,'STU001','PS',1.5,'Instrumentation 4/7',1,'2025-05-28'),(11,'STU001','PS',2,'DBMS 4/7',1,'2025-05-29'),(12,'STU001','PS',2.5,'Time Management 4/7',1,'2025-05-30'),(13,'STU001','PS',3,'Cloud Fundamentals 1/7',1,'2025-05-31'),(14,'STU001','PS',3.33,'Control Systems 3/7',1,'2025-06-01'),(15,'STU001','PS',0.5,'Analog Electronics 2/7',1,'2025-06-02'),(16,'STU001','PS',1,'English Grammar 2/7',1,'2025-06-03'),(17,'STU001','PS',1.5,'Time Management 4/7',1,'2025-06-04'),(18,'STU001','PS',2,'Excel 3/7',1,'2025-06-05'),(19,'STU001','PS',2.5,'Cloud Fundamentals 1/7',1,'2025-06-06'),(20,'STU001','PS',3,'C++ 5/7',1,'2025-06-07'),(21,'STU001','PS',3.33,'Control Systems 3/7',1,'2025-06-08'),(22,'STU001','PS',0.5,'Algorithms 1/7',1,'2025-06-09'),(23,'STU001','PS',1,'Linux Basics 2/7',1,'2025-06-10'),(24,'STU001','PS',1.5,'Excel 3/7',1,'2025-06-11'),(25,'STU001','PS',2,'Python 4/7',1,'2025-06-12'),(26,'STU001','PS',2.5,'Python 4/7',1,'2025-06-13'),(27,'STU001','PS',3,'Digital Electronics 5/7',1,'2025-06-14'),(28,'STU001','PS',3.33,'Productivity Tools 3/7',1,'2025-06-15'),(29,'STU001','PS',0.5,'Data Structures 2/7',1,'2025-06-16'),(30,'STU001','PS',1,'English Grammar 2/7',1,'2025-06-17'),(31,'STU001','PS',1.5,'DBMS 4/7',1,'2025-06-18'),(32,'STU001','PS',2,'English Grammar 2/7',1,'2025-06-19'),(33,'STU001','PS',2.5,'OS 2/7',1,'2025-06-20'),(34,'STU001','PS',3,'Computer Networks 3/7',1,'2025-06-21'),(35,'STU001','PS',3.33,'DBMS 4/7',1,'2025-06-22'),(36,'STU001','PS',0.5,'Excel 3/7',1,'2025-06-23'),(37,'STU001','PS',1,'Linux Basics 2/7',1,'2025-06-24'),(38,'STU001','PS',1.5,'Cloud Fundamentals 1/7',1,'2025-06-25'),(39,'STU001','PS',2,'DBMS 4/7',1,'2025-06-26'),(40,'STU001','PS',2.5,'English Grammar 2/7',1,'2025-06-27'),(41,'STU001','PS',3,'Digital Electronics 5/7',1,'2025-06-28'),(42,'STU001','PS',3.33,'English Grammar 2/7',1,'2025-06-29'),(43,'STU001','PS',0.5,'Excel 3/7',1,'2025-06-30'),(44,'STU001','PS',1,'Cybersecurity Awareness 3/7',1,'2025-07-01'),(45,'STU001','PS',1.5,'Productivity Tools 3/7',1,'2025-07-02'),(46,'STU001','PS',2,'C 0/7',1,'2025-07-03'),(47,'STU001','PS',2.5,'Electrical Machines 2/7',1,'2025-07-04'),(48,'STU001','PS',3,'English Grammar 2/7',1,'2025-07-05'),(49,'STU001','PS',3.33,'English Grammar 2/7',1,'2025-07-06'),(50,'STU001','PS',0.5,'Productivity Tools 3/7',1,'2025-07-07'),(51,'STU001','PS',1,'English Grammar 2/7',1,'2025-07-08'),(52,'STU001','PS',1.5,'Cybersecurity Awareness 3/7',1,'2025-07-09'),(53,'STU001','PS',2,'Java 3/7',1,'2025-07-10'),(54,'STU001','PS',2.5,'Productivity Tools 3/7',1,'2025-07-11'),(55,'STU001','PS',3,'C 0/7',1,'2025-07-12'),(56,'STU001','PS',3.33,'Signal Processing 3/7',1,'2025-07-13'),(57,'STU001','PS',0.5,'Linux Basics 2/7',1,'2025-07-14'),(58,'STU001','PS',1,'Embedded Systems 2/7',1,'2025-07-15'),(59,'STU001','PS',1.5,'DBMS 4/7',1,'2025-07-16'),(60,'STU001','PS',2,'Git & GitHub 4/7',1,'2025-07-17'),(61,'STU001','PS',2.5,'DBMS 4/7',1,'2025-07-18'),(62,'STU001','PS',3,'Electrical Machines 2/7',1,'2025-07-19'),(63,'STU001','PS',3.33,'Excel 3/7',1,'2025-07-20'),(64,'STU001','PS',0.5,'Linux Basics 2/7',1,'2025-07-21'),(65,'STU001','PS',1,'Productivity Tools 3/7',1,'2025-07-22'),(66,'STU001','PS',1.5,'Cloud Fundamentals 1/7',1,'2025-07-23'),(67,'STU001','PS',2,'Python 4/7',1,'2025-07-24'),(68,'STU001','PS',2.5,'Git & GitHub 4/7',1,'2025-07-25'),(69,'STU001','PS',3,'Data Structures 2/7',1,'2025-07-26'),(70,'STU001','PS',3.33,'C 0/7',1,'2025-07-27'),(71,'STU001','PS',0.5,'DBMS 4/7',2,'2025-07-28'),(72,'STU001','PS',1,'English Grammar 2/7',2,'2025-07-29'),(73,'STU001','PS',1.5,'Data Structures 2/7',2,'2025-07-30'),(74,'STU001','PS',2,'Time Management 4/7',2,'2025-07-31'),(75,'STU001','PS',2.5,'Linux Basics 2/7',2,'2025-08-01'),(76,'STU001','PS',3,'English Grammar 2/7',2,'2025-08-02'),(77,'STU001','PS',3.33,'Cloud Fundamentals 1/7',2,'2025-08-03'),(78,'STU001','PS',0.5,'C 0/7',2,'2025-08-04'),(79,'STU001','PS',1,'Power Systems 4/7',2,'2025-08-05'),(80,'STU001','PS',1.5,'Productivity Tools 3/7',2,'2025-08-06'),(81,'STU001','PS',2,'OS 2/7',2,'2025-08-07'),(82,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',2,'2025-08-08'),(83,'STU001','PS',3,'Git & GitHub 4/7',2,'2025-08-09'),(84,'STU001','PS',3.33,'English Grammar 2/7',2,'2025-08-10'),(85,'STU001','PS',0.5,'Excel 3/7',2,'2025-08-11'),(86,'STU001','PS',1,'Productivity Tools 3/7',2,'2025-08-12'),(87,'STU001','PS',1.5,'Instrumentation 4/7',2,'2025-08-13'),(88,'STU001','PS',2,'Power Systems 4/7',2,'2025-08-14'),(89,'STU001','PS',2.5,'Java 3/7',2,'2025-08-15'),(90,'STU001','PS',3,'Linux Basics 2/7',2,'2025-08-16'),(91,'STU001','PS',3.33,'Productivity Tools 3/7',2,'2025-08-17'),(92,'STU001','PS',0.5,'C 0/7',2,'2025-08-18'),(93,'STU001','PS',1,'Microcontrollers 1/7',2,'2025-08-19'),(94,'STU001','PS',1.5,'Cloud Fundamentals 1/7',2,'2025-08-20'),(95,'STU001','PS',2,'Control Systems 3/7',2,'2025-08-21'),(96,'STU001','PS',2.5,'Electrical Machines 2/7',2,'2025-08-22'),(97,'STU001','PS',3,'C 0/7',2,'2025-08-23'),(98,'STU001','PS',3.33,'Digital Electronics 5/7',2,'2025-08-24'),(99,'STU001','PS',0.5,'Data Structures 2/7',2,'2025-08-25'),(100,'STU001','PS',1,'Instrumentation 4/7',2,'2025-08-26'),(101,'STU001','PS',1.5,'Linux Basics 2/7',2,'2025-08-27'),(102,'STU001','PS',2,'Excel 3/7',2,'2025-08-28'),(103,'STU001','PS',2.5,'Excel 3/7',2,'2025-08-29'),(104,'STU001','PS',3,'Electrical Machines 2/7',2,'2025-08-30'),(105,'STU001','PS',3.33,'Linux Basics 2/7',2,'2025-08-31'),(106,'STU001','PS',0.5,'Python 4/7',2,'2025-09-01'),(107,'STU001','PS',1,'Python 4/7',2,'2025-09-02'),(108,'STU001','PS',1.5,'Electrical Machines 2/7',2,'2025-09-03'),(109,'STU001','PS',2,'Signal Processing 3/7',2,'2025-09-04'),(110,'STU001','PS',2.5,'English Grammar 2/7',2,'2025-09-05'),(111,'STU001','PS',3,'Linux Basics 2/7',2,'2025-09-06'),(112,'STU001','PS',3.33,'Computer Networks 3/7',2,'2025-09-07'),(113,'STU001','PS',0.5,'Circuit Analysis 5/7',2,'2025-09-08'),(114,'STU001','PS',1,'DBMS 4/7',2,'2025-09-09'),(115,'STU001','PS',1.5,'Time Management 4/7',2,'2025-09-10'),(116,'STU001','PS',2,'Cybersecurity Awareness 3/7',2,'2025-09-11'),(117,'STU001','PS',2.5,'Power Systems 4/7',2,'2025-09-12'),(118,'STU001','PS',3,'English Grammar 2/7',2,'2025-09-13'),(119,'STU001','PS',3.33,'Data Structures 2/7',2,'2025-09-14'),(120,'STU001','PS',0.5,'Cloud Fundamentals 1/7',2,'2025-09-15'),(121,'STU001','PS',1,'OS 2/7',2,'2025-09-16'),(122,'STU001','PS',1.5,'Analog Electronics 2/7',2,'2025-09-17'),(123,'STU001','PS',2,'English Grammar 2/7',2,'2025-09-18'),(124,'STU001','PS',2.5,'Computer Networks 3/7',2,'2025-09-19'),(125,'STU001','PS',3,'English Grammar 2/7',2,'2025-09-20'),(126,'STU001','PS',3.33,'Typing Speed 6/7',2,'2025-09-21'),(127,'STU001','PS',0.5,'Time Management 4/7',2,'2025-09-22'),(128,'STU001','PS',1,'Data Structures 2/7',2,'2025-09-23'),(129,'STU001','PS',1.5,'C 0/7',2,'2025-09-24'),(130,'STU001','PS',2,'Data Structures 2/7',2,'2025-09-25'),(131,'STU001','PS',2.5,'Algorithms 1/7',2,'2025-09-26'),(132,'STU001','PS',3,'Linux Basics 2/7',2,'2025-09-27'),(133,'STU001','PS',3.33,'Git & GitHub 4/7',2,'2025-09-28'),(134,'STU001','PS',0.5,'C 0/7',2,'2025-09-29'),(135,'STU001','PS',1,'Machine Learning 6/7',2,'2025-09-30'),(136,'STU001','PS',1.5,'English Grammar 2/7',2,'2025-10-01'),(137,'STU001','PS',2,'Productivity Tools 3/7',2,'2025-10-02'),(138,'STU001','PS',2.5,'Time Management 4/7',2,'2025-10-03'),(139,'STU001','PS',3,'Machine Learning 6/7',2,'2025-10-04'),(140,'STU001','PS',3.33,'Signal Processing 3/7',2,'2025-10-05'),(141,'STU001','PS',0.5,'Java 3/7',2,'2025-10-06'),(142,'STU001','PS',1,'Time Management 4/7',2,'2025-10-07'),(143,'STU001','PS',1.5,'Linux Basics 2/7',2,'2025-10-08'),(144,'STU001','PS',2,'C 0/7',2,'2025-10-09'),(145,'STU001','PS',2.5,'Time Management 4/7',2,'2025-10-10'),(146,'STU001','PS',3,'Excel 3/7',2,'2025-10-11'),(147,'STU001','PS',3.33,'Instrumentation 4/7',2,'2025-10-12'),(148,'STU001','PS',0.5,'OS 2/7',2,'2025-10-13'),(149,'STU001','PS',1,'Productivity Tools 3/7',2,'2025-10-14'),(150,'STU001','PS',1.5,'Digital Electronics 5/7',2,'2025-10-15'),(151,'STU001','PS',0.5,'Cybersecurity Awareness 3/7',1,'2025-05-20'),(152,'STU001','PS',1,'English Grammar 2/7',1,'2025-05-21'),(153,'STU001','PS',1.5,'DBMS 4/7',1,'2025-05-22'),(154,'STU001','PS',2,'Machine Learning 6/7',1,'2025-05-23'),(155,'STU001','PS',2.5,'Typing Speed 6/7',1,'2025-05-24'),(156,'STU001','PS',3,'Cloud Fundamentals 1/7',1,'2025-05-25'),(157,'STU001','PS',3.33,'Productivity Tools 3/7',1,'2025-05-26'),(158,'STU001','PS',0.5,'Machine Learning 6/7',1,'2025-05-27'),(159,'STU001','PS',1,'Control Systems 3/7',1,'2025-05-28'),(160,'STU001','PS',1.5,'Java 3/7',1,'2025-05-29'),(161,'STU001','PS',2,'C 0/7',1,'2025-05-30'),(162,'STU001','PS',2.5,'Linux Basics 2/7',1,'2025-05-31'),(163,'STU001','PS',3,'Electrical Machines 2/7',1,'2025-06-01'),(164,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',1,'2025-06-02'),(165,'STU001','PS',0.5,'Instrumentation 4/7',1,'2025-06-03'),(166,'STU001','PS',1,'Machine Learning 6/7',1,'2025-06-04'),(167,'STU001','PS',1.5,'Productivity Tools 3/7',1,'2025-06-05'),(168,'STU001','PS',2,'Productivity Tools 3/7',1,'2025-06-06'),(169,'STU001','PS',2.5,'Typing Speed 6/7',1,'2025-06-07'),(170,'STU001','PS',3,'Typing Speed 6/7',1,'2025-06-08'),(171,'STU001','PS',3.33,'C 0/7',1,'2025-06-09'),(172,'STU001','PS',0.5,'Excel 3/7',1,'2025-06-10'),(173,'STU001','PS',1,'Productivity Tools 3/7',1,'2025-06-11'),(174,'STU001','PS',1.5,'C 0/7',1,'2025-06-12'),(175,'STU001','PS',2,'Typing Speed 6/7',1,'2025-06-13'),(176,'STU001','PS',2.5,'Data Structures 2/7',1,'2025-06-14'),(177,'STU001','PS',3,'Time Management 4/7',1,'2025-06-15'),(178,'STU001','PS',3.33,'Typing Speed 6/7',1,'2025-06-16'),(179,'STU001','PS',0.5,'Java 3/7',1,'2025-06-17'),(180,'STU001','PS',1,'DBMS 4/7',1,'2025-06-18'),(181,'STU001','PS',1.5,'Java 3/7',1,'2025-06-19'),(182,'STU001','PS',2,'Instrumentation 4/7',1,'2025-06-20'),(183,'STU001','PS',2.5,'Excel 3/7',1,'2025-06-21'),(184,'STU001','PS',3,'Analog Electronics 2/7',1,'2025-06-22'),(185,'STU001','PS',3.33,'Time Management 4/7',1,'2025-06-23'),(186,'STU001','PS',0.5,'Time Management 4/7',1,'2025-06-24'),(187,'STU001','PS',1,'English Grammar 2/7',1,'2025-06-25'),(188,'STU001','PS',1.5,'Cybersecurity Awareness 3/7',1,'2025-06-26'),(189,'STU001','PS',2,'Excel 3/7',1,'2025-06-27'),(190,'STU001','PS',2.5,'Algorithms 1/7',1,'2025-06-28'),(191,'STU001','PS',3,'DBMS 4/7',1,'2025-06-29'),(192,'STU001','PS',3.33,'Typing Speed 6/7',1,'2025-06-30'),(193,'STU001','PS',0.5,'C++ 5/7',1,'2025-07-01'),(194,'STU001','PS',1,'Time Management 4/7',1,'2025-07-02'),(195,'STU001','PS',1.5,'Linux Basics 2/7',1,'2025-07-03'),(196,'STU001','PS',2,'Time Management 4/7',1,'2025-07-04'),(197,'STU001','PS',2.5,'Time Management 4/7',1,'2025-07-05'),(198,'STU001','PS',3,'Cloud Fundamentals 1/7',1,'2025-07-06'),(199,'STU001','PS',3.33,'Time Management 4/7',1,'2025-07-07'),(200,'STU001','PS',0.5,'English Grammar 2/7',1,'2025-07-08'),(201,'STU001','PS',1,'Embedded Systems 2/7',1,'2025-07-09'),(202,'STU001','PS',1.5,'C 0/7',1,'2025-07-10'),(203,'STU001','PS',2,'Linux Basics 2/7',1,'2025-07-11'),(204,'STU001','PS',2.5,'C++ 5/7',1,'2025-07-12'),(205,'STU001','PS',3,'Cloud Fundamentals 1/7',1,'2025-07-13'),(206,'STU001','PS',3.33,'Excel 3/7',1,'2025-07-14'),(207,'STU001','PS',0.5,'English Grammar 2/7',1,'2025-07-15'),(208,'STU001','PS',1,'Computer Networks 3/7',1,'2025-07-16'),(209,'STU001','PS',1.5,'Instrumentation 4/7',1,'2025-07-17'),(210,'STU001','PS',2,'Linux Basics 2/7',1,'2025-07-18'),(211,'STU001','PS',2.5,'Cloud Fundamentals 1/7',1,'2025-07-19'),(212,'STU001','PS',3,'Typing Speed 6/7',1,'2025-07-20'),(213,'STU001','PS',3.33,'C 0/7',1,'2025-07-21'),(214,'STU001','PS',0.5,'Circuit Analysis 5/7',1,'2025-07-22'),(215,'STU001','PS',1,'Productivity Tools 3/7',1,'2025-07-23'),(216,'STU001','PS',1.5,'Git & GitHub 4/7',1,'2025-07-24'),(217,'STU001','PS',2,'Git & GitHub 4/7',1,'2025-07-25'),(218,'STU001','PS',2.5,'Productivity Tools 3/7',1,'2025-07-26'),(219,'STU001','PS',3,'English Grammar 2/7',1,'2025-07-27'),(220,'STU001','PS',3.33,'Typing Speed 6/7',1,'2025-07-28'),(221,'STU001','PS',0.5,'English Grammar 2/7',2,'2025-07-29'),(222,'STU001','PS',1,'Cloud Fundamentals 1/7',2,'2025-07-30'),(223,'STU001','PS',1.5,'Excel 3/7',2,'2025-07-31'),(224,'STU001','PS',2,'English Grammar 2/7',2,'2025-08-01'),(225,'STU001','PS',2.5,'Circuit Analysis 5/7',2,'2025-08-02'),(226,'STU001','PS',3,'Typing Speed 6/7',2,'2025-08-03'),(227,'STU001','PS',3.33,'DBMS 4/7',2,'2025-08-04'),(228,'STU001','PS',0.5,'Circuit Analysis 5/7',2,'2025-08-05'),(229,'STU001','PS',1,'Productivity Tools 3/7',2,'2025-08-06'),(230,'STU001','PS',1.5,'English Grammar 2/7',2,'2025-08-07'),(231,'STU001','PS',2,'Analog Electronics 2/7',2,'2025-08-08'),(232,'STU001','PS',2.5,'Linux Basics 2/7',2,'2025-08-09'),(233,'STU001','PS',3,'Cybersecurity Awareness 3/7',2,'2025-08-10'),(234,'STU001','PS',3.33,'Productivity Tools 3/7',2,'2025-08-11'),(235,'STU001','PS',0.5,'Time Management 4/7',2,'2025-08-12'),(236,'STU001','PS',1,'Excel 3/7',2,'2025-08-13'),(237,'STU001','PS',1.5,'Time Management 4/7',2,'2025-08-14'),(238,'STU001','PS',2,'Circuit Analysis 5/7',2,'2025-08-15'),(239,'STU001','PS',2.5,'Excel 3/7',2,'2025-08-16'),(240,'STU001','PS',3,'Typing Speed 6/7',2,'2025-08-17'),(241,'STU001','PS',3.33,'English Grammar 2/7',2,'2025-08-18'),(242,'STU001','PS',0.5,'English Grammar 2/7',2,'2025-08-19'),(243,'STU001','PS',1,'Circuit Analysis 5/7',2,'2025-08-20'),(244,'STU001','PS',1.5,'Typing Speed 6/7',2,'2025-08-21'),(245,'STU001','PS',2,'Analog Electronics 2/7',2,'2025-08-22'),(246,'STU001','PS',2.5,'Instrumentation 4/7',2,'2025-08-23'),(247,'STU001','PS',3,'Linux Basics 2/7',2,'2025-08-24'),(248,'STU001','PS',3.33,'Algorithms 1/7',2,'2025-08-25'),(249,'STU001','PS',0.5,'Digital Electronics 5/7',2,'2025-08-26'),(250,'STU001','PS',1,'Linux Basics 2/7',2,'2025-08-27'),(251,'STU001','PS',1.5,'Cybersecurity Awareness 3/7',2,'2025-08-28'),(252,'STU001','PS',2,'Machine Learning 6/7',2,'2025-08-29'),(253,'STU001','PS',2.5,'Signal Processing 3/7',2,'2025-08-30'),(254,'STU001','PS',3,'Embedded Systems 2/7',2,'2025-08-31'),(255,'STU001','PS',3.33,'Signal Processing 3/7',2,'2025-09-01'),(256,'STU001','PS',0.5,'Typing Speed 6/7',2,'2025-09-02'),(257,'STU001','PS',1,'Productivity Tools 3/7',2,'2025-09-03'),(258,'STU001','PS',1.5,'Typing Speed 6/7',2,'2025-09-04'),(259,'STU001','PS',2,'Circuit Analysis 5/7',2,'2025-09-05'),(260,'STU001','PS',2.5,'Linux Basics 2/7',2,'2025-09-06'),(261,'STU001','PS',3,'Productivity Tools 3/7',2,'2025-09-07'),(262,'STU001','PS',3.33,'Excel 3/7',2,'2025-09-08'),(263,'STU001','PS',0.5,'Electrical Machines 2/7',2,'2025-09-09'),(264,'STU001','PS',1,'Machine Learning 6/7',2,'2025-09-10'),(265,'STU001','PS',1.5,'English Grammar 2/7',2,'2025-09-11'),(266,'STU001','PS',2,'Typing Speed 6/7',2,'2025-09-12'),(267,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',2,'2025-09-13'),(268,'STU001','PS',3,'Machine Learning 6/7',2,'2025-09-14'),(269,'STU001','PS',3.33,'Python 4/7',2,'2025-09-15'),(270,'STU001','PS',0.5,'Embedded Systems 2/7',2,'2025-09-16'),(271,'STU001','PS',1,'Cloud Fundamentals 1/7',2,'2025-09-17'),(272,'STU001','PS',1.5,'Analog Electronics 2/7',2,'2025-09-18'),(273,'STU001','PS',2,'Control Systems 3/7',2,'2025-09-19'),(274,'STU001','PS',2.5,'Algorithms 1/7',2,'2025-09-20'),(275,'STU001','PS',3,'Digital Electronics 5/7',2,'2025-09-21'),(276,'STU001','PS',3.33,'OS 2/7',2,'2025-09-22'),(277,'STU001','PS',0.5,'Excel 3/7',2,'2025-09-23'),(278,'STU001','PS',1,'Time Management 4/7',2,'2025-09-24'),(279,'STU001','PS',1.5,'Productivity Tools 3/7',2,'2025-09-25'),(280,'STU001','PS',2,'Typing Speed 6/7',2,'2025-09-26'),(281,'STU001','PS',2.5,'Machine Learning 6/7',2,'2025-09-27'),(282,'STU001','PS',3,'English Grammar 2/7',2,'2025-09-28'),(283,'STU001','PS',3.33,'Cloud Fundamentals 1/7',2,'2025-09-29'),(284,'STU001','PS',0.5,'Excel 3/7',2,'2025-09-30'),(285,'STU001','PS',1,'Excel 3/7',2,'2025-10-01'),(286,'STU001','PS',1.5,'C 0/7',2,'2025-10-02'),(287,'STU001','PS',2,'Linux Basics 2/7',2,'2025-10-03'),(288,'STU001','PS',2.5,'Time Management 4/7',2,'2025-10-04'),(289,'STU001','PS',3,'Signal Processing 3/7',2,'2025-10-05'),(290,'STU001','PS',3.33,'Time Management 4/7',2,'2025-10-06'),(291,'STU001','PS',0.5,'Time Management 4/7',2,'2025-10-07'),(292,'STU001','PS',1,'Cybersecurity Awareness 3/7',2,'2025-10-08'),(293,'STU001','PS',1.5,'Cloud Fundamentals 1/7',2,'2025-10-09'),(294,'STU001','PS',2,'Analog Electronics 2/7',2,'2025-10-10'),(295,'STU001','PS',2.5,'English Grammar 2/7',2,'2025-10-11'),(296,'STU001','PS',3,'Productivity Tools 3/7',2,'2025-10-12'),(297,'STU001','PS',3.33,'English Grammar 2/7',2,'2025-10-13'),(298,'STU001','PS',0.5,'Productivity Tools 3/7',2,'2025-10-14'),(299,'STU001','PS',1,'Time Management 4/7',2,'2025-10-15'),(300,'STU001','PS',1.5,'Time Management 4/7',2,'2025-10-16'),(301,'STU001','PS',0.5,'Git & GitHub 4/7',1,'2025-05-20'),(302,'STU001','PS',1,'Git & GitHub 4/7',1,'2025-05-21'),(303,'STU001','PS',1.5,'Typing Speed 6/7',1,'2025-05-22'),(304,'STU001','PS',2,'Digital Electronics 5/7',1,'2025-05-23'),(305,'STU001','PS',2.5,'Computer Networks 3/7',1,'2025-05-24'),(306,'STU001','PS',3,'English Grammar 2/7',1,'2025-05-25'),(307,'STU001','PS',3.33,'Instrumentation 4/7',1,'2025-05-26'),(308,'STU001','PS',0.5,'C++ 5/7',1,'2025-05-27'),(309,'STU001','PS',1,'Cybersecurity Awareness 3/7',1,'2025-05-28'),(310,'STU001','PS',1.5,'Git & GitHub 4/7',1,'2025-05-29'),(311,'STU001','PS',2,'Signal Processing 3/7',1,'2025-05-30'),(312,'STU001','PS',2.5,'Analog Electronics 2/7',1,'2025-05-31'),(313,'STU001','PS',3,'Typing Speed 6/7',1,'2025-06-01'),(314,'STU001','PS',3.33,'OS 2/7',1,'2025-06-02'),(315,'STU001','PS',0.5,'C 0/7',1,'2025-06-03'),(316,'STU001','PS',1,'Excel 3/7',1,'2025-06-04'),(317,'STU001','PS',1.5,'Control Systems 3/7',1,'2025-06-05'),(318,'STU001','PS',2,'Algorithms 1/7',1,'2025-06-06'),(319,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',1,'2025-06-07'),(320,'STU001','PS',3,'Analog Electronics 2/7',1,'2025-06-08'),(321,'STU001','PS',3.33,'Time Management 4/7',1,'2025-06-09'),(322,'STU001','PS',0.5,'Power Systems 4/7',1,'2025-06-10'),(323,'STU001','PS',1,'Machine Learning 6/7',1,'2025-06-11'),(324,'STU001','PS',0.5,'Linux Basics 2/7',1,'2025-05-20'),(325,'STU001','PS',1.5,'Power Systems 4/7',1,'2025-06-12'),(326,'STU001','PS',1,'DBMS 4/7',1,'2025-05-21'),(327,'STU001','PS',2,'Control Systems 3/7',1,'2025-06-13'),(328,'STU001','PS',1.5,'Data Structures 2/7',1,'2025-05-22'),(329,'STU001','PS',2.5,'DBMS 4/7',1,'2025-06-14'),(330,'STU001','PS',2,'Time Management 4/7',1,'2025-05-23'),(331,'STU001','PS',3,'English Grammar 2/7',1,'2025-06-15'),(332,'STU001','PS',2.5,'Time Management 4/7',1,'2025-05-24'),(333,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',1,'2025-06-16'),(334,'STU001','PS',3,'Excel 3/7',1,'2025-05-25'),(335,'STU001','PS',0.5,'Embedded Systems 2/7',1,'2025-06-17'),(336,'STU001','PS',3.33,'Excel 3/7',1,'2025-05-26'),(337,'STU001','PS',1,'Embedded Systems 2/7',1,'2025-06-18'),(338,'STU001','PS',0.5,'Excel 3/7',1,'2025-05-27'),(339,'STU001','PS',1.5,'Analog Electronics 2/7',1,'2025-06-19'),(340,'STU001','PS',1,'English Grammar 2/7',1,'2025-05-28'),(341,'STU001','PS',2,'Cloud Fundamentals 1/7',1,'2025-06-20'),(342,'STU001','PS',1.5,'Excel 3/7',1,'2025-05-29'),(343,'STU001','PS',2.5,'Computer Networks 3/7',1,'2025-06-21'),(344,'STU001','PS',0.5,'Cybersecurity Awareness 3/7',1,'2025-05-20'),(345,'STU001','PS',3,'Analog Electronics 2/7',1,'2025-06-22'),(346,'STU001','PS',1,'Circuit Analysis 5/7',1,'2025-05-21'),(347,'STU001','PS',2,'Python 4/7',1,'2025-05-30'),(348,'STU001','PS',3.33,'Analog Electronics 2/7',1,'2025-06-23'),(349,'STU001','PS',1.5,'Algorithms 1/7',1,'2025-05-22'),(350,'STU001','PS',0.5,'Microcontrollers 1/7',1,'2025-06-24'),(351,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',1,'2025-05-31'),(352,'STU001','PS',2,'OS 2/7',1,'2025-05-23'),(353,'STU001','PS',1,'Linux Basics 2/7',1,'2025-06-25'),(354,'STU001','PS',3,'Productivity Tools 3/7',1,'2025-06-01'),(355,'STU001','PS',2.5,'Instrumentation 4/7',1,'2025-05-24'),(356,'STU001','PS',1.5,'English Grammar 2/7',1,'2025-06-26'),(357,'STU001','PS',3.33,'Cloud Fundamentals 1/7',1,'2025-06-02'),(358,'STU001','PS',3,'English Grammar 2/7',1,'2025-05-25'),(359,'STU001','PS',2,'C 0/7',1,'2025-06-27'),(360,'STU001','PS',3.33,'Instrumentation 4/7',1,'2025-05-26'),(361,'STU001','PS',0.5,'Signal Processing 3/7',1,'2025-06-03'),(362,'STU001','PS',2.5,'Power Systems 4/7',1,'2025-06-28'),(363,'STU001','PS',1,'Machine Learning 6/7',1,'2025-06-04'),(364,'STU001','PS',0.5,'Control Systems 3/7',1,'2025-05-27'),(365,'STU001','PS',3,'Typing Speed 6/7',1,'2025-06-29'),(366,'STU001','PS',1.5,'Excel 3/7',1,'2025-06-05'),(367,'STU001','PS',1,'Linux Basics 2/7',1,'2025-05-28'),(368,'STU001','PS',3.33,'Productivity Tools 3/7',1,'2025-06-30'),(369,'STU001','PS',2,'Excel 3/7',1,'2025-06-06'),(370,'STU001','PS',0.5,'Productivity Tools 3/7',1,'2025-05-20'),(371,'STU001','PS',0.5,'Productivity Tools 3/7',1,'2025-07-01'),(372,'STU001','PS',1.5,'Data Structures 2/7',1,'2025-05-29'),(373,'STU001','PS',2.5,'Productivity Tools 3/7',1,'2025-06-07'),(374,'STU001','PS',1,'Embedded Systems 2/7',1,'2025-05-21'),(375,'STU001','PS',1,'English Grammar 2/7',1,'2025-07-02'),(376,'STU001','PS',3,'Power Systems 4/7',1,'2025-06-08'),(377,'STU001','PS',2,'DBMS 4/7',1,'2025-05-30'),(378,'STU001','PS',1.5,'C 0/7',1,'2025-05-22'),(379,'STU001','PS',1.5,'Electrical Machines 2/7',1,'2025-07-03'),(380,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',1,'2025-06-09'),(381,'STU001','PS',2.5,'Data Structures 2/7',1,'2025-05-31'),(382,'STU001','PS',2,'Embedded Systems 2/7',1,'2025-05-23'),(383,'STU001','PS',2,'Machine Learning 6/7',1,'2025-07-04'),(384,'STU001','PS',0.5,'Algorithms 1/7',1,'2025-06-10'),(385,'STU001','PS',3,'Analog Electronics 2/7',1,'2025-06-01'),(386,'STU001','PS',2.5,'C++ 5/7',1,'2025-05-24'),(387,'STU001','PS',2.5,'Analog Electronics 2/7',1,'2025-07-05'),(388,'STU001','PS',1,'Computer Networks 3/7',1,'2025-06-11'),(389,'STU001','PS',3.33,'Analog Electronics 2/7',1,'2025-06-02'),(390,'STU001','PS',3,'English Grammar 2/7',1,'2025-05-25'),(391,'STU001','PS',3,'Algorithms 1/7',1,'2025-07-06'),(392,'STU001','PS',1.5,'OS 2/7',1,'2025-06-12'),(393,'STU001','PS',0.5,'Git & GitHub 4/7',1,'2025-06-03'),(394,'STU001','PS',3.33,'Circuit Analysis 5/7',1,'2025-07-07'),(395,'STU001','PS',3.33,'Analog Electronics 2/7',1,'2025-05-26'),(396,'STU001','PS',2,'Productivity Tools 3/7',1,'2025-06-13'),(397,'STU001','PS',1,'Data Structures 2/7',1,'2025-06-04'),(398,'STU001','PS',0.5,'English Grammar 2/7',1,'2025-07-08'),(399,'STU001','PS',2.5,'Electrical Machines 2/7',1,'2025-06-14'),(400,'STU001','PS',0.5,'Time Management 4/7',1,'2025-05-27'),(401,'STU001','PS',1.5,'Typing Speed 6/7',1,'2025-06-05'),(402,'STU001','PS',1,'Git & GitHub 4/7',1,'2025-07-09'),(403,'STU001','PS',3,'Electrical Machines 2/7',1,'2025-06-15'),(404,'STU001','PS',1,'Embedded Systems 2/7',1,'2025-05-28'),(405,'STU001','PS',2,'Power Systems 4/7',1,'2025-06-06'),(406,'STU001','PS',1.5,'Analog Electronics 2/7',1,'2025-07-10'),(407,'STU001','PS',3.33,'Cloud Fundamentals 1/7',1,'2025-06-16'),(408,'STU001','PS',2.5,'Cloud Fundamentals 1/7',1,'2025-06-07'),(409,'STU001','PS',1.5,'Time Management 4/7',1,'2025-05-29'),(410,'STU001','PS',2,'Python 4/7',1,'2025-07-11'),(411,'STU001','PS',0.5,'Time Management 4/7',1,'2025-06-17'),(412,'STU001','PS',3,'Analog Electronics 2/7',1,'2025-06-08'),(413,'STU001','PS',2,'C 0/7',1,'2025-05-30'),(414,'STU001','PS',2.5,'English Grammar 2/7',1,'2025-07-12'),(415,'STU001','PS',1,'English Grammar 2/7',1,'2025-06-18'),(416,'STU001','PS',3.33,'OS 2/7',1,'2025-06-09'),(417,'STU001','PS',2.5,'Java 3/7',1,'2025-05-31'),(418,'STU001','PS',3,'Cybersecurity Awareness 3/7',1,'2025-07-13'),(419,'STU001','PS',0.5,'Cybersecurity Awareness 3/7',1,'2025-05-20'),(420,'STU001','PS',1.5,'Typing Speed 6/7',1,'2025-06-19'),(421,'STU001','PS',0.5,'Digital Electronics 5/7',1,'2025-06-10'),(422,'STU001','PS',3.33,'C 0/7',1,'2025-07-14'),(423,'STU001','PS',3,'C++ 5/7',1,'2025-06-01'),(424,'STU001','PS',1,'Git & GitHub 4/7',1,'2025-05-21'),(425,'STU001','PS',2,'Power Systems 4/7',1,'2025-06-20'),(426,'STU001','PS',1,'English Grammar 2/7',1,'2025-06-11'),(427,'STU001','PS',0.5,'Embedded Systems 2/7',1,'2025-07-15'),(428,'STU001','PS',3.33,'Embedded Systems 2/7',1,'2025-06-02'),(429,'STU001','PS',1.5,'Time Management 4/7',1,'2025-05-22'),(430,'STU001','PS',2.5,'Embedded Systems 2/7',1,'2025-06-21'),(431,'STU001','PS',1.5,'Circuit Analysis 5/7',1,'2025-06-12'),(432,'STU001','PS',1,'C 0/7',1,'2025-07-16'),(433,'STU001','PS',0.5,'Git & GitHub 4/7',1,'2025-06-03'),(434,'STU001','PS',2,'Typing Speed 6/7',1,'2025-05-23'),(435,'STU001','PS',3,'OS 2/7',1,'2025-06-22'),(436,'STU001','PS',2,'DBMS 4/7',1,'2025-06-13'),(437,'STU001','PS',1.5,'Algorithms 1/7',1,'2025-07-17'),(438,'STU001','PS',2.5,'Typing Speed 6/7',1,'2025-05-24'),(439,'STU001','PS',1,'C 0/7',1,'2025-06-04'),(440,'STU001','PS',3.33,'Productivity Tools 3/7',1,'2025-06-23'),(441,'STU001','PS',2.5,'Excel 3/7',1,'2025-06-14'),(442,'STU001','PS',2,'Data Structures 2/7',1,'2025-07-18'),(443,'STU001','PS',3,'Linux Basics 2/7',1,'2025-05-25'),(444,'STU001','PS',1.5,'Instrumentation 4/7',1,'2025-06-05'),(445,'STU001','PS',0.5,'Excel 3/7',1,'2025-06-24'),(446,'STU001','PS',3,'Signal Processing 3/7',1,'2025-06-15'),(447,'STU001','PS',2.5,'Typing Speed 6/7',1,'2025-07-19'),(448,'STU001','PS',3.33,'Productivity Tools 3/7',1,'2025-05-26'),(449,'STU001','PS',2,'Cybersecurity Awareness 3/7',1,'2025-06-06'),(450,'STU001','PS',1,'Cybersecurity Awareness 3/7',1,'2025-06-25'),(451,'STU001','PS',3.33,'Microcontrollers 1/7',1,'2025-06-16'),(452,'STU001','PS',3,'Productivity Tools 3/7',1,'2025-07-20'),(453,'STU001','PS',0.5,'OS 2/7',1,'2025-05-27'),(454,'STU001','PS',2.5,'Digital Electronics 5/7',1,'2025-06-07'),(455,'STU001','PS',1.5,'Power Systems 4/7',1,'2025-06-26'),(456,'STU001','PS',0.5,'Embedded Systems 2/7',1,'2025-06-17'),(457,'STU001','PS',3.33,'Typing Speed 6/7',1,'2025-07-21'),(458,'STU001','PS',1,'English Grammar 2/7',1,'2025-05-28'),(459,'STU001','PS',3,'Typing Speed 6/7',1,'2025-06-08'),(460,'STU001','PS',2,'Control Systems 3/7',1,'2025-06-27'),(461,'STU001','PS',1,'Productivity Tools 3/7',1,'2025-06-18'),(462,'STU001','PS',0.5,'Control Systems 3/7',1,'2025-07-22'),(463,'STU001','PS',1.5,'DBMS 4/7',1,'2025-05-29'),(464,'STU001','PS',3.33,'Computer Networks 3/7',1,'2025-06-09'),(465,'STU001','PS',2.5,'OS 2/7',1,'2025-06-28'),(466,'STU001','PS',1.5,'Linux Basics 2/7',1,'2025-06-19'),(467,'STU001','PS',1,'Productivity Tools 3/7',1,'2025-07-23'),(468,'STU001','PS',2,'Algorithms 1/7',1,'2025-05-30'),(469,'STU001','PS',0.5,'Microcontrollers 1/7',1,'2025-06-10'),(470,'STU001','PS',3,'Data Structures 2/7',1,'2025-06-29'),(471,'STU001','PS',2,'Time Management 4/7',1,'2025-06-20'),(472,'STU001','PS',1.5,'Power Systems 4/7',1,'2025-07-24'),(473,'STU001','PS',2.5,'Linux Basics 2/7',1,'2025-05-31'),(474,'STU001','PS',1,'Electrical Machines 2/7',1,'2025-06-11'),(475,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',1,'2025-06-30'),(476,'STU001','PS',2.5,'OS 2/7',1,'2025-06-21'),(477,'STU001','PS',2,'English Grammar 2/7',1,'2025-07-25'),(478,'STU001','PS',3,'Power Systems 4/7',1,'2025-06-01'),(479,'STU001','PS',1.5,'Time Management 4/7',1,'2025-06-12'),(480,'STU001','PS',0.5,'Power Systems 4/7',1,'2025-07-01'),(481,'STU001','PS',3,'Excel 3/7',1,'2025-06-22'),(482,'STU001','PS',2.5,'Control Systems 3/7',1,'2025-07-26'),(483,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',1,'2025-06-02'),(484,'STU001','PS',2,'Instrumentation 4/7',1,'2025-06-13'),(485,'STU001','PS',1,'Instrumentation 4/7',1,'2025-07-02'),(486,'STU001','PS',3.33,'Typing Speed 6/7',1,'2025-06-23'),(487,'STU001','PS',3,'Typing Speed 6/7',1,'2025-07-27'),(488,'STU001','PS',0.5,'Algorithms 1/7',1,'2025-06-03'),(489,'STU001','PS',2.5,'Analog Electronics 2/7',1,'2025-06-14'),(490,'STU001','PS',0.5,'Typing Speed 6/7',1,'2025-06-24'),(491,'STU001','PS',1.5,'Machine Learning 6/7',1,'2025-07-03'),(492,'STU001','PS',3.33,'C++ 5/7',1,'2025-07-28'),(493,'STU001','PS',1,'Excel 3/7',1,'2025-06-04'),(494,'STU001','PS',3,'Microcontrollers 1/7',1,'2025-06-15'),(495,'STU001','PS',1,'Linux Basics 2/7',1,'2025-06-25'),(496,'STU001','PS',0.5,'Git & GitHub 4/7',2,'2025-07-29'),(497,'STU001','PS',1.5,'Excel 3/7',1,'2025-06-05'),(498,'STU001','PS',2,'Excel 3/7',1,'2025-07-04'),(499,'STU001','PS',3.33,'Embedded Systems 2/7',1,'2025-06-16'),(500,'STU001','PS',1.5,'Linux Basics 2/7',1,'2025-06-26'),(501,'STU001','PS',1,'Productivity Tools 3/7',2,'2025-07-30'),(502,'STU001','PS',2,'Productivity Tools 3/7',1,'2025-06-06'),(503,'STU001','PS',2.5,'Algorithms 1/7',1,'2025-07-05'),(504,'STU001','PS',0.5,'Digital Electronics 5/7',1,'2025-06-17'),(505,'STU001','PS',2,'Time Management 4/7',1,'2025-06-27'),(506,'STU001','PS',1.5,'Control Systems 3/7',2,'2025-07-31'),(507,'STU001','PS',2.5,'Cloud Fundamentals 1/7',1,'2025-06-07'),(508,'STU001','PS',3,'Typing Speed 6/7',1,'2025-07-06'),(509,'STU001','PS',1,'Instrumentation 4/7',1,'2025-06-18'),(510,'STU001','PS',2.5,'Algorithms 1/7',1,'2025-06-28'),(511,'STU001','PS',2,'Typing Speed 6/7',2,'2025-08-01'),(512,'STU001','PS',3,'Java 3/7',1,'2025-06-08'),(513,'STU001','PS',3.33,'Analog Electronics 2/7',1,'2025-07-07'),(514,'STU001','PS',1.5,'C 0/7',1,'2025-06-19'),(515,'STU001','PS',3,'Productivity Tools 3/7',1,'2025-06-29'),(516,'STU001','PS',2.5,'Instrumentation 4/7',2,'2025-08-02'),(517,'STU001','PS',3.33,'Signal Processing 3/7',1,'2025-06-09'),(518,'STU001','PS',0.5,'Signal Processing 3/7',1,'2025-07-08'),(519,'STU001','PS',2,'OS 2/7',1,'2025-06-20'),(520,'STU001','PS',3.33,'Analog Electronics 2/7',1,'2025-06-30'),(521,'STU001','PS',3,'Cloud Fundamentals 1/7',2,'2025-08-03'),(522,'STU001','PS',0.5,'Data Structures 2/7',1,'2025-06-10'),(523,'STU001','PS',1,'Cloud Fundamentals 1/7',1,'2025-07-09'),(524,'STU001','PS',2.5,'Cloud Fundamentals 1/7',1,'2025-06-21'),(525,'STU001','PS',0.5,'OS 2/7',1,'2025-07-01'),(526,'STU001','PS',3.33,'DBMS 4/7',2,'2025-08-04'),(527,'STU001','PS',1,'Microcontrollers 1/7',1,'2025-06-11'),(528,'STU001','PS',1.5,'C 0/7',1,'2025-07-10'),(529,'STU001','PS',3,'Linux Basics 2/7',1,'2025-06-22'),(530,'STU001','PS',1,'C++ 5/7',1,'2025-07-02'),(531,'STU001','PS',0.5,'Cybersecurity Awareness 3/7',2,'2025-08-05'),(532,'STU001','PS',1.5,'Digital Electronics 5/7',1,'2025-06-12'),(533,'STU001','PS',2,'Productivity Tools 3/7',1,'2025-07-11'),(534,'STU001','PS',3.33,'Cloud Fundamentals 1/7',1,'2025-06-23'),(535,'STU001','PS',1.5,'Time Management 4/7',1,'2025-07-03'),(536,'STU001','PS',1,'DBMS 4/7',2,'2025-08-06'),(537,'STU001','PS',2,'Cybersecurity Awareness 3/7',1,'2025-06-13'),(538,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',1,'2025-07-12'),(539,'STU001','PS',2,'Control Systems 3/7',1,'2025-07-04'),(540,'STU001','PS',0.5,'Cybersecurity Awareness 3/7',1,'2025-06-24'),(541,'STU001','PS',1.5,'Python 4/7',2,'2025-08-07'),(542,'STU001','PS',2.5,'Cloud Fundamentals 1/7',1,'2025-06-14'),(543,'STU001','PS',3,'Machine Learning 6/7',1,'2025-07-13'),(544,'STU001','PS',2.5,'C 0/7',1,'2025-07-05'),(545,'STU001','PS',1,'Python 4/7',1,'2025-06-25'),(546,'STU001','PS',2,'Typing Speed 6/7',2,'2025-08-08'),(547,'STU001','PS',3,'Cybersecurity Awareness 3/7',1,'2025-06-15'),(548,'STU001','PS',3.33,'Power Systems 4/7',1,'2025-07-14'),(549,'STU001','PS',3,'Productivity Tools 3/7',1,'2025-07-06'),(550,'STU001','PS',1.5,'Microcontrollers 1/7',1,'2025-06-26'),(551,'STU001','PS',2.5,'Typing Speed 6/7',2,'2025-08-09'),(552,'STU001','PS',3.33,'Cloud Fundamentals 1/7',1,'2025-06-16'),(553,'STU001','PS',0.5,'Git & GitHub 4/7',1,'2025-07-15'),(554,'STU001','PS',3.33,'Productivity Tools 3/7',1,'2025-07-07'),(555,'STU001','PS',3,'English Grammar 2/7',2,'2025-08-10'),(556,'STU001','PS',2,'C++ 5/7',1,'2025-06-27'),(557,'STU001','PS',0.5,'Linux Basics 2/7',1,'2025-06-17'),(558,'STU001','PS',1,'Computer Networks 3/7',1,'2025-07-16'),(559,'STU001','PS',0.5,'Git & GitHub 4/7',1,'2025-07-08'),(560,'STU001','PS',3.33,'OS 2/7',2,'2025-08-11'),(561,'STU001','PS',2.5,'Time Management 4/7',1,'2025-06-28'),(562,'STU001','PS',1,'English Grammar 2/7',1,'2025-06-18'),(563,'STU001','PS',1.5,'Control Systems 3/7',1,'2025-07-17'),(564,'STU001','PS',1,'OS 2/7',1,'2025-07-09'),(565,'STU001','PS',0.5,'Git & GitHub 4/7',2,'2025-08-12'),(566,'STU001','PS',3,'Cybersecurity Awareness 3/7',1,'2025-06-29'),(567,'STU001','PS',1.5,'Cybersecurity Awareness 3/7',1,'2025-06-19'),(568,'STU001','PS',2,'Excel 3/7',1,'2025-07-18'),(569,'STU001','PS',1,'Power Systems 4/7',2,'2025-08-13'),(570,'STU001','PS',1.5,'Instrumentation 4/7',1,'2025-07-10'),(571,'STU001','PS',3.33,'Microcontrollers 1/7',1,'2025-06-30'),(572,'STU001','PS',2,'Time Management 4/7',1,'2025-06-20'),(573,'STU001','PS',2.5,'Machine Learning 6/7',1,'2025-07-19'),(574,'STU001','PS',1.5,'C++ 5/7',2,'2025-08-14'),(575,'STU001','PS',2,'Typing Speed 6/7',1,'2025-07-11'),(576,'STU001','PS',0.5,'C++ 5/7',1,'2025-07-01'),(577,'STU001','PS',2.5,'Git & GitHub 4/7',1,'2025-06-21'),(578,'STU001','PS',3,'Python 4/7',1,'2025-07-20'),(579,'STU001','PS',2,'OS 2/7',2,'2025-08-15'),(580,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',1,'2025-07-12'),(581,'STU001','PS',1,'Typing Speed 6/7',1,'2025-07-02'),(582,'STU001','PS',3,'Cloud Fundamentals 1/7',1,'2025-06-22'),(583,'STU001','PS',3.33,'Time Management 4/7',1,'2025-07-21'),(584,'STU001','PS',2.5,'Excel 3/7',2,'2025-08-16'),(585,'STU001','PS',3,'Excel 3/7',1,'2025-07-13'),(586,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',1,'2025-06-23'),(587,'STU001','PS',1.5,'Productivity Tools 3/7',1,'2025-07-03'),(588,'STU001','PS',0.5,'Excel 3/7',1,'2025-07-22'),(589,'STU001','PS',3,'OS 2/7',2,'2025-08-17'),(590,'STU001','PS',3.33,'Typing Speed 6/7',1,'2025-07-14'),(591,'STU001','PS',0.5,'Java 3/7',1,'2025-06-24'),(592,'STU001','PS',1,'Machine Learning 6/7',1,'2025-07-23'),(593,'STU001','PS',2,'Java 3/7',1,'2025-07-04'),(594,'STU001','PS',3.33,'OS 2/7',2,'2025-08-18'),(595,'STU001','PS',0.5,'Instrumentation 4/7',1,'2025-07-15'),(596,'STU001','PS',1,'Data Structures 2/7',1,'2025-06-25'),(597,'STU001','PS',1.5,'C++ 5/7',1,'2025-07-24'),(598,'STU001','PS',2.5,'Cloud Fundamentals 1/7',1,'2025-07-05'),(599,'STU001','PS',1,'Cybersecurity Awareness 3/7',1,'2025-07-16'),(600,'STU001','PS',0.5,'Typing Speed 6/7',2,'2025-08-19'),(601,'STU001','PS',1.5,'English Grammar 2/7',1,'2025-06-26'),(602,'STU001','PS',2,'Digital Electronics 5/7',1,'2025-07-25'),(603,'STU001','PS',3,'Data Structures 2/7',1,'2025-07-06'),(604,'STU001','PS',1.5,'Microcontrollers 1/7',1,'2025-07-17'),(605,'STU001','PS',1,'Electrical Machines 2/7',2,'2025-08-20'),(606,'STU001','PS',2,'DBMS 4/7',1,'2025-06-27'),(607,'STU001','PS',2.5,'Linux Basics 2/7',1,'2025-07-26'),(608,'STU001','PS',3.33,'Cloud Fundamentals 1/7',1,'2025-07-07'),(609,'STU001','PS',2,'Microcontrollers 1/7',1,'2025-07-18'),(610,'STU001','PS',1.5,'Excel 3/7',2,'2025-08-21'),(611,'STU001','PS',2.5,'Git & GitHub 4/7',1,'2025-06-28'),(612,'STU001','PS',3,'Computer Networks 3/7',1,'2025-07-27'),(613,'STU001','PS',0.5,'Microcontrollers 1/7',1,'2025-07-08'),(614,'STU001','PS',2.5,'Embedded Systems 2/7',1,'2025-07-19'),(615,'STU001','PS',2,'Microcontrollers 1/7',2,'2025-08-22'),(616,'STU001','PS',3,'C++ 5/7',1,'2025-06-29'),(617,'STU001','PS',1,'Circuit Analysis 5/7',1,'2025-07-09'),(618,'STU001','PS',3.33,'Microcontrollers 1/7',1,'2025-07-28'),(619,'STU001','PS',3,'Cybersecurity Awareness 3/7',1,'2025-07-20'),(620,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',2,'2025-08-23'),(621,'STU001','PS',3.33,'Typing Speed 6/7',1,'2025-06-30'),(622,'STU001','PS',0.5,'Productivity Tools 3/7',2,'2025-07-29'),(623,'STU001','PS',1.5,'Cybersecurity Awareness 3/7',1,'2025-07-10'),(624,'STU001','PS',3.33,'Digital Electronics 5/7',1,'2025-07-21'),(625,'STU001','PS',3,'Linux Basics 2/7',2,'2025-08-24'),(626,'STU001','PS',0.5,'Linux Basics 2/7',1,'2025-07-01'),(627,'STU001','PS',1,'Typing Speed 6/7',2,'2025-07-30'),(628,'STU001','PS',0.5,'Data Structures 2/7',1,'2025-07-22'),(629,'STU001','PS',2,'Time Management 4/7',1,'2025-07-11'),(630,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',2,'2025-08-25'),(631,'STU001','PS',1.5,'Typing Speed 6/7',2,'2025-07-31'),(632,'STU001','PS',1,'Linux Basics 2/7',1,'2025-07-02'),(633,'STU001','PS',1,'Excel 3/7',1,'2025-07-23'),(634,'STU001','PS',2.5,'Analog Electronics 2/7',1,'2025-07-12'),(635,'STU001','PS',0.5,'Analog Electronics 2/7',2,'2025-08-26'),(636,'STU001','PS',2,'Time Management 4/7',2,'2025-08-01'),(637,'STU001','PS',1.5,'Machine Learning 6/7',1,'2025-07-03'),(638,'STU001','PS',1.5,'Embedded Systems 2/7',1,'2025-07-24'),(639,'STU001','PS',3,'Excel 3/7',1,'2025-07-13'),(640,'STU001','PS',1,'Productivity Tools 3/7',2,'2025-08-27'),(641,'STU001','PS',2.5,'Machine Learning 6/7',2,'2025-08-02'),(642,'STU001','PS',2,'Embedded Systems 2/7',1,'2025-07-25'),(643,'STU001','PS',2,'English Grammar 2/7',1,'2025-07-04'),(644,'STU001','PS',3.33,'Circuit Analysis 5/7',1,'2025-07-14'),(645,'STU001','PS',3,'Analog Electronics 2/7',2,'2025-08-03'),(646,'STU001','PS',1.5,'Analog Electronics 2/7',2,'2025-08-28'),(647,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',1,'2025-07-26'),(648,'STU001','PS',2.5,'Typing Speed 6/7',1,'2025-07-05'),(649,'STU001','PS',0.5,'Time Management 4/7',1,'2025-07-15'),(650,'STU001','PS',3.33,'English Grammar 2/7',2,'2025-08-04'),(651,'STU001','PS',2,'Linux Basics 2/7',2,'2025-08-29'),(652,'STU001','PS',3,'Typing Speed 6/7',1,'2025-07-27'),(653,'STU001','PS',3,'Cloud Fundamentals 1/7',1,'2025-07-06'),(654,'STU001','PS',1,'Productivity Tools 3/7',1,'2025-07-16'),(655,'STU001','PS',0.5,'Data Structures 2/7',2,'2025-08-05'),(656,'STU001','PS',2.5,'Microcontrollers 1/7',2,'2025-08-30'),(657,'STU001','PS',3.33,'English Grammar 2/7',1,'2025-07-28'),(658,'STU001','PS',3.33,'Typing Speed 6/7',1,'2025-07-07'),(659,'STU001','PS',1.5,'Cybersecurity Awareness 3/7',1,'2025-07-17'),(660,'STU001','PS',1,'Linux Basics 2/7',2,'2025-08-06'),(661,'STU001','PS',3,'Cloud Fundamentals 1/7',2,'2025-08-31'),(662,'STU001','PS',0.5,'C++ 5/7',2,'2025-07-29'),(663,'STU001','PS',0.5,'Microcontrollers 1/7',1,'2025-07-08'),(664,'STU001','PS',2,'C 0/7',1,'2025-07-18'),(665,'STU001','PS',1.5,'DBMS 4/7',2,'2025-08-07'),(666,'STU001','PS',3.33,'Git & GitHub 4/7',2,'2025-09-01'),(667,'STU001','PS',1,'Java 3/7',2,'2025-07-30'),(668,'STU001','PS',1,'Power Systems 4/7',1,'2025-07-09'),(669,'STU001','PS',2.5,'Circuit Analysis 5/7',1,'2025-07-19'),(670,'STU001','PS',2,'OS 2/7',2,'2025-08-08'),(671,'STU001','PS',0.5,'Power Systems 4/7',2,'2025-09-02'),(672,'STU001','PS',1.5,'English Grammar 2/7',2,'2025-07-31'),(673,'STU001','PS',3,'Circuit Analysis 5/7',1,'2025-07-20'),(674,'STU001','PS',1.5,'Git & GitHub 4/7',1,'2025-07-10'),(675,'STU001','PS',2.5,'Typing Speed 6/7',2,'2025-08-09'),(676,'STU001','PS',1,'Time Management 4/7',2,'2025-09-03'),(677,'STU001','PS',2,'Embedded Systems 2/7',2,'2025-08-01'),(678,'STU001','PS',3.33,'Typing Speed 6/7',1,'2025-07-21'),(679,'STU001','PS',3,'DBMS 4/7',2,'2025-08-10'),(680,'STU001','PS',2.5,'Productivity Tools 3/7',2,'2025-08-02'),(681,'STU001','PS',1.5,'Productivity Tools 3/7',2,'2025-09-04'),(682,'STU001','PS',2,'Git & GitHub 4/7',1,'2025-07-11'),(683,'STU001','PS',0.5,'Control Systems 3/7',1,'2025-07-22'),(684,'STU001','PS',3.33,'DBMS 4/7',2,'2025-08-11'),(685,'STU001','PS',3,'Productivity Tools 3/7',2,'2025-08-03'),(686,'STU001','PS',2.5,'Typing Speed 6/7',1,'2025-07-12'),(687,'STU001','PS',2,'Excel 3/7',2,'2025-09-05'),(688,'STU001','PS',1,'Microcontrollers 1/7',1,'2025-07-23'),(689,'STU001','PS',0.5,'Cloud Fundamentals 1/7',2,'2025-08-12'),(690,'STU001','PS',3.33,'Machine Learning 6/7',2,'2025-08-04'),(691,'STU001','PS',3,'Analog Electronics 2/7',1,'2025-07-13'),(692,'STU001','PS',2.5,'Java 3/7',2,'2025-09-06'),(693,'STU001','PS',1.5,'Electrical Machines 2/7',1,'2025-07-24'),(694,'STU001','PS',1,'Typing Speed 6/7',2,'2025-08-13'),(695,'STU001','PS',0.5,'Microcontrollers 1/7',2,'2025-08-05'),(696,'STU001','PS',3,'Cybersecurity Awareness 3/7',2,'2025-09-07'),(697,'STU001','PS',3.33,'Cloud Fundamentals 1/7',1,'2025-07-14'),(698,'STU001','PS',2,'Typing Speed 6/7',1,'2025-07-25'),(699,'STU001','PS',1.5,'Time Management 4/7',2,'2025-08-14'),(700,'STU001','PS',1,'Cloud Fundamentals 1/7',2,'2025-08-06'),(701,'STU001','PS',3.33,'Cloud Fundamentals 1/7',2,'2025-09-08'),(702,'STU001','PS',0.5,'Circuit Analysis 5/7',1,'2025-07-15'),(703,'STU001','PS',2.5,'Machine Learning 6/7',1,'2025-07-26'),(704,'STU001','PS',2,'OS 2/7',2,'2025-08-15'),(705,'STU001','PS',1.5,'Power Systems 4/7',2,'2025-08-07'),(706,'STU001','PS',0.5,'Microcontrollers 1/7',2,'2025-09-09'),(707,'STU001','PS',1,'Git & GitHub 4/7',1,'2025-07-16'),(708,'STU001','PS',3,'Git & GitHub 4/7',1,'2025-07-27'),(709,'STU001','PS',2.5,'Circuit Analysis 5/7',2,'2025-08-16'),(710,'STU001','PS',2,'Linux Basics 2/7',2,'2025-08-08'),(711,'STU001','PS',1,'Cloud Fundamentals 1/7',2,'2025-09-10'),(712,'STU001','PS',1.5,'Instrumentation 4/7',1,'2025-07-17'),(713,'STU001','PS',3.33,'Circuit Analysis 5/7',1,'2025-07-28'),(714,'STU001','PS',3,'Cybersecurity Awareness 3/7',2,'2025-08-17'),(715,'STU001','PS',2.5,'Signal Processing 3/7',2,'2025-08-09'),(716,'STU001','PS',1.5,'Excel 3/7',2,'2025-09-11'),(717,'STU001','PS',2,'Algorithms 1/7',1,'2025-07-18'),(718,'STU001','PS',0.5,'Cybersecurity Awareness 3/7',2,'2025-07-29'),(719,'STU001','PS',3.33,'C 0/7',2,'2025-08-18'),(720,'STU001','PS',3,'Python 4/7',2,'2025-08-10'),(721,'STU001','PS',2,'Git & GitHub 4/7',2,'2025-09-12'),(722,'STU001','PS',2.5,'Microcontrollers 1/7',1,'2025-07-19'),(723,'STU001','PS',1,'Cloud Fundamentals 1/7',2,'2025-07-30'),(724,'STU001','PS',3.33,'OS 2/7',2,'2025-08-11'),(725,'STU001','PS',0.5,'Electrical Machines 2/7',2,'2025-08-19'),(726,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',2,'2025-09-13'),(727,'STU001','PS',3,'Typing Speed 6/7',1,'2025-07-20'),(728,'STU001','PS',1.5,'Excel 3/7',2,'2025-07-31'),(729,'STU001','PS',1,'Computer Networks 3/7',2,'2025-08-20'),(730,'STU001','PS',3,'Java 3/7',2,'2025-09-14'),(731,'STU001','PS',0.5,'Power Systems 4/7',2,'2025-08-12'),(732,'STU001','PS',3.33,'Time Management 4/7',1,'2025-07-21'),(733,'STU001','PS',2,'Typing Speed 6/7',2,'2025-08-01'),(734,'STU001','PS',1.5,'Algorithms 1/7',2,'2025-08-21'),(735,'STU001','PS',3.33,'Signal Processing 3/7',2,'2025-09-15'),(736,'STU001','PS',1,'Electrical Machines 2/7',2,'2025-08-13'),(737,'STU001','PS',0.5,'Power Systems 4/7',1,'2025-07-22'),(738,'STU001','PS',2.5,'Cybersecurity Awareness 3/7',2,'2025-08-02'),(739,'STU001','PS',2,'Cybersecurity Awareness 3/7',2,'2025-08-22'),(740,'STU001','PS',0.5,'English Grammar 2/7',2,'2025-09-16'),(741,'STU001','PS',1.5,'Excel 3/7',2,'2025-08-14'),(742,'STU001','PS',1,'Instrumentation 4/7',1,'2025-07-23'),(743,'STU001','PS',3,'Linux Basics 2/7',2,'2025-08-03'),(744,'STU001','PS',2.5,'Cloud Fundamentals 1/7',2,'2025-08-23'),(745,'STU001','PS',1,'Signal Processing 3/7',2,'2025-09-17'),(746,'STU001','PS',2,'Power Systems 4/7',2,'2025-08-15'),(747,'STU001','PS',1.5,'OS 2/7',1,'2025-07-24'),(748,'STU001','PS',3.33,'Java 3/7',2,'2025-08-04'),(749,'STU001','PS',3,'Microcontrollers 1/7',2,'2025-08-24'),(750,'STU001','PS',1.5,'Instrumentation 4/7',2,'2025-09-18'),(751,'STU001','PS',2.5,'C 0/7',2,'2025-08-16'),(752,'STU001','PS',2,'Computer Networks 3/7',1,'2025-07-25'),(753,'STU001','PS',0.5,'Linux Basics 2/7',2,'2025-08-05'),(754,'STU001','PS',3.33,'Cloud Fundamentals 1/7',2,'2025-08-25'),(755,'STU001','PS',2,'Time Management 4/7',2,'2025-09-19'),(756,'STU001','PS',3,'English Grammar 2/7',2,'2025-08-17'),(757,'STU001','PS',2.5,'Java 3/7',1,'2025-07-26'),(758,'STU001','PS',1,'Microcontrollers 1/7',2,'2025-08-06'),(759,'STU001','PS',0.5,'Excel 3/7',2,'2025-08-26'),(760,'STU001','PS',2.5,'Python 4/7',2,'2025-09-20'),(761,'STU001','PS',3.33,'Linux Basics 2/7',2,'2025-08-18'),(762,'STU001','PS',3,'Analog Electronics 2/7',1,'2025-07-27'),(763,'STU001','PS',1.5,'Cybersecurity Awareness 3/7',2,'2025-08-07'),(764,'STU001','PS',1,'Cloud Fundamentals 1/7',2,'2025-08-27'),(765,'STU001','PS',3,'Computer Networks 3/7',2,'2025-09-21'),(766,'STU001','PS',0.5,'Productivity Tools 3/7',2,'2025-08-19'),(767,'STU001','PS',3.33,'Circuit Analysis 5/7',1,'2025-07-28'),(768,'STU001','PS',2,'Embedded Systems 2/7',2,'2025-08-08'),(769,'STU001','PS',3.33,'Git & GitHub 4/7',2,'2025-09-22'),(770,'STU001','PS',1.5,'Time Management 4/7',2,'2025-08-28'),(771,'STU001','PS',1,'DBMS 4/7',2,'2025-08-20'),(772,'STU001','PS',0.5,'Digital Electronics 5/7',2,'2025-07-29'),(773,'STU001','PS',2.5,'Computer Networks 3/7',2,'2025-08-09'),(774,'STU001','PS',0.5,'Java 3/7',2,'2025-09-23'),(775,'STU001','PS',2,'Instrumentation 4/7',2,'2025-08-29'),(776,'STU001','PS',1.5,'Computer Networks 3/7',2,'2025-08-21'),(777,'STU001','PS',1,'Typing Speed 6/7',2,'2025-07-30'),(778,'STU001','PS',3,'Linux Basics 2/7',2,'2025-08-10'),(779,'STU001','PS',1,'DBMS 4/7',2,'2025-09-24'),(780,'STU001','PS',2.5,'Git & GitHub 4/7',2,'2025-08-30'),(781,'STU001','PS',2,'Typing Speed 6/7',2,'2025-08-22'),(782,'STU001','PS',1.5,'Power Systems 4/7',2,'2025-07-31'),(783,'STU001','PS',3.33,'Digital Electronics 5/7',2,'2025-08-11'),(784,'STU001','PS',1.5,'Time Management 4/7',2,'2025-09-25'),(785,'STU001','PS',3,'Cybersecurity Awareness 3/7',2,'2025-08-31'),(786,'STU001','PS',2.5,'English Grammar 2/7',2,'2025-08-23'),(787,'STU001','PS',2,'Typing Speed 6/7',2,'2025-08-01'),(788,'STU001','PS',0.5,'Linux Basics 2/7',2,'2025-08-12'),(789,'STU001','PS',2,'Git & GitHub 4/7',2,'2025-09-26'),(790,'STU001','PS',3.33,'Machine Learning 6/7',2,'2025-09-01'),(791,'STU001','PS',3,'Typing Speed 6/7',2,'2025-08-24'),(792,'STU001','PS',2.5,'Microcontrollers 1/7',2,'2025-08-02'),(793,'STU001','PS',1,'Digital Electronics 5/7',2,'2025-08-13'),(794,'STU001','PS',2.5,'Embedded Systems 2/7',2,'2025-09-27'),(795,'STU001','PS',0.5,'Cybersecurity Awareness 3/7',2,'2025-09-02'),(796,'STU001','PS',3.33,'Productivity Tools 3/7',2,'2025-08-25'),(797,'STU001','PS',3,'Analog Electronics 2/7',2,'2025-08-03'),(798,'STU001','PS',1.5,'Typing Speed 6/7',2,'2025-08-14'),(799,'STU001','PS',3,'Analog Electronics 2/7',2,'2025-09-28'),(800,'STU001','PS',1,'Git & GitHub 4/7',2,'2025-09-03'),(801,'STU001','PS',0.5,'Cybersecurity Awareness 3/7',2,'2025-08-26'),(802,'STU001','PS',3.33,'Linux Basics 2/7',2,'2025-08-04'),(803,'STU001','PS',2,'Electrical Machines 2/7',2,'2025-08-15'),(804,'STU001','PS',3.33,'English Grammar 2/7',2,'2025-09-29'),(805,'STU001','PS',1.5,'Cybersecurity Awareness 3/7',2,'2025-09-04'),(806,'STU001','PS',0.5,'Analog Electronics 2/7',2,'2025-08-05'),(807,'STU001','PS',1,'Excel 3/7',2,'2025-08-27'),(808,'STU001','PS',0.5,'English Grammar 2/7',2,'2025-09-30'),(809,'STU001','PS',2.5,'Typing Speed 6/7',2,'2025-08-16'),(810,'STU001','PS',2,'OS 2/7',2,'2025-09-05'),(811,'STU001','PS',1,'Signal Processing 3/7',2,'2025-08-06'),(812,'STU001','PS',1.5,'English Grammar 2/7',2,'2025-08-28'),(813,'STU001','PS',1,'Embedded Systems 2/7',2,'2025-10-01'),(814,'STU001','PS',3,'English Grammar 2/7',2,'2025-08-17'),(815,'STU001','PS',2.5,'DBMS 4/7',2,'2025-09-06'),(816,'STU001','PS',1.5,'Productivity Tools 3/7',2,'2025-08-07'),(817,'STU001','PS',2,'Python 4/7',2,'2025-08-29'),(818,'STU001','PS',1.5,'Excel 3/7',2,'2025-10-02'),(819,'STU001','PS',3.33,'Data Structures 2/7',2,'2025-08-18'),(820,'STU001','PS',3,'Excel 3/7',2,'2025-09-07'),(821,'STU001','PS',2,'Time Management 4/7',2,'2025-08-08'),(822,'STU001','PS',2.5,'Productivity Tools 3/7',2,'2025-08-30'),(823,'STU001','PS',2,'DBMS 4/7',2,'2025-10-03'),(824,'STU001','PS',0.5,'Digital Electronics 5/7',2,'2025-08-19'),(825,'STU001','PS',3.33,'Typing Speed 6/7',2,'2025-09-08'),(826,'STU001','PS',2.5,'Embedded Systems 2/7',2,'2025-08-09'),(827,'STU001','PS',3,'Cybersecurity Awareness 3/7',2,'2025-08-31'),(828,'STU001','PS',2.5,'Control Systems 3/7',2,'2025-10-04'),(829,'STU001','PS',1,'Algorithms 1/7',2,'2025-08-20'),(830,'STU001','PS',0.5,'Analog Electronics 2/7',2,'2025-09-09'),(831,'STU001','PS',3,'C++ 5/7',2,'2025-08-10'),(832,'STU001','PS',3.33,'Typing Speed 6/7',2,'2025-09-01'),(833,'STU001','PS',3,'Cloud Fundamentals 1/7',2,'2025-10-05'),(834,'STU001','PS',1.5,'Productivity Tools 3/7',2,'2025-08-21'),(835,'STU001','PS',1,'OS 2/7',2,'2025-09-10'),(836,'STU001','PS',3.33,'English Grammar 2/7',2,'2025-08-11'),(837,'STU001','PS',0.5,'English Grammar 2/7',2,'2025-09-02'),(838,'STU001','PS',3.33,'Time Management 4/7',2,'2025-10-06'),(839,'STU001','PS',2,'Analog Electronics 2/7',2,'2025-08-22'),(840,'STU001','PS',1.5,'Time Management 4/7',2,'2025-09-11'),(841,'STU001','PS',0.5,'Git & GitHub 4/7',2,'2025-08-12'),(842,'STU001','PS',1,'Electrical Machines 2/7',2,'2025-09-03'),(843,'STU001','PS',0.5,'Excel 3/7',2,'2025-10-07'),(844,'STU001','PS',2.5,'Git & GitHub 4/7',2,'2025-08-23'),(845,'STU001','PS',2,'English Grammar 2/7',2,'2025-09-12'),(846,'STU001','PS',1,'Time Management 4/7',2,'2025-08-13'),(847,'STU001','PS',1.5,'Microcontrollers 1/7',2,'2025-09-04'),(848,'STU001','PS',1,'English Grammar 2/7',2,'2025-10-08'),(849,'STU001','PS',3,'Data Structures 2/7',2,'2025-08-24'),(850,'STU001','PS',2.5,'Java 3/7',2,'2025-09-13'),(851,'STU001','PS',1.5,'English Grammar 2/7',2,'2025-08-14'),(852,'STU001','PS',2,'Typing Speed 6/7',2,'2025-09-05'),(853,'STU001','PS',1.5,'Power Systems 4/7',2,'2025-10-09'),(854,'STU001','PS',3.33,'C++ 5/7',2,'2025-08-25'),(855,'STU001','PS',3,'English Grammar 2/7',2,'2025-09-14'),(856,'STU001','PS',2,'Data Structures 2/7',2,'2025-08-15'),(857,'STU001','PS',2.5,'English Grammar 2/7',2,'2025-09-06'),(858,'STU001','PS',2,'Python 4/7',2,'2025-10-10'),(859,'STU001','PS',0.5,'Analog Electronics 2/7',2,'2025-08-26'),(860,'STU001','PS',3.33,'Microcontrollers 1/7',2,'2025-09-15'),(861,'STU001','PS',2.5,'Time Management 4/7',2,'2025-08-16'),(862,'STU001','PS',2.5,'C 0/7',2,'2025-10-11'),(863,'STU001','PS',3,'Git & GitHub 4/7',2,'2025-09-07'),(864,'STU001','PS',1,'Productivity Tools 3/7',2,'2025-08-27'),(865,'STU001','PS',0.5,'Cloud Fundamentals 1/7',2,'2025-09-16'),(866,'STU001','PS',3,'Time Management 4/7',2,'2025-08-17'),(867,'STU001','PS',3,'Linux Basics 2/7',2,'2025-10-12'),(868,'STU001','PS',3.33,'Java 3/7',2,'2025-09-08'),(869,'STU001','PS',1.5,'Linux Basics 2/7',2,'2025-08-28'),(870,'STU001','PS',1,'Analog Electronics 2/7',2,'2025-09-17'),(871,'STU001','PS',3.33,'Algorithms 1/7',2,'2025-08-18'),(872,'STU001','PS',3.33,'C 0/7',2,'2025-10-13'),(873,'STU001','PS',0.5,'Python 4/7',2,'2025-09-09'),(874,'STU001','PS',2,'Cybersecurity Awareness 3/7',2,'2025-08-29'),(875,'STU001','PS',1.5,'DBMS 4/7',2,'2025-09-18'),(876,'STU001','PS',0.5,'Control Systems 3/7',2,'2025-08-19'),(877,'STU001','PS',0.5,'Cloud Fundamentals 1/7',2,'2025-10-14'),(878,'STU001','PS',1,'Java 3/7',2,'2025-09-10'),(879,'STU001','PS',2.5,'Computer Networks 3/7',2,'2025-08-30'),(880,'STU001','PS',2,'Cybersecurity Awareness 3/7',2,'2025-09-19'),(881,'STU001','PS',1,'Data Structures 2/7',2,'2025-08-20'),(882,'STU001','PS',1.5,'English Grammar 2/7',2,'2025-09-11'),(883,'STU001','PS',1,'Electrical Machines 2/7',2,'2025-10-15'),(884,'STU001','PS',3,'Analog Electronics 2/7',2,'2025-08-31'),(885,'STU001','PS',2.5,'Productivity Tools 3/7',2,'2025-09-20'),(886,'STU001','PS',1.5,'DBMS 4/7',2,'2025-08-21'),(887,'STU001','PS',2,'Time Management 4/7',2,'2025-09-12'),(888,'STU001','PS',1.5,'Productivity Tools 3/7',2,'2025-10-16'),(889,'STU001','PS',3.33,'OS 2/7',2,'2025-09-01'),(890,'STU001','PS',3,'Productivity Tools 3/7',2,'2025-09-21'),(891,'STU001','PS',2,'Excel 3/7',2,'2025-08-22'),(892,'STU001','PS',2.5,'Linux Basics 2/7',2,'2025-09-13'),(893,'STU001','PS',0.5,'Electrical Machines 2/7',2,'2025-09-02'),(894,'STU001','PS',3.33,'Time Management 4/7',2,'2025-09-22'),(895,'STU001','PS',2.5,'Signal Processing 3/7',2,'2025-08-23'),(896,'STU001','PS',3,'Git & GitHub 4/7',2,'2025-09-14'),(897,'STU001','PS',1,'Machine Learning 6/7',2,'2025-09-03'),(898,'STU001','PS',0.5,'Embedded Systems 2/7',2,'2025-09-23'),(899,'STU001','PS',3,'Control Systems 3/7',2,'2025-08-24'),(900,'STU001','PS',3.33,'OS 2/7',2,'2025-09-15'),(901,'STU001','PS',1.5,'Excel 3/7',2,'2025-09-04'),(902,'STU001','PS',1,'Excel 3/7',2,'2025-09-24'),(903,'STU001','PS',3.33,'Data Structures 2/7',2,'2025-08-25'),(904,'STU001','PS',0.5,'Digital Electronics 5/7',2,'2025-09-16'),(905,'STU001','PS',2,'Power Systems 4/7',2,'2025-09-05'),(906,'STU001','PS',1.5,'Java 3/7',2,'2025-09-25'),(907,'STU001','PS',1,'Excel 3/7',2,'2025-09-17'),(908,'STU001','PS',0.5,'Circuit Analysis 5/7',2,'2025-08-26'),(909,'STU001','PS',2.5,'Microcontrollers 1/7',2,'2025-09-06'),(910,'STU001','PS',2,'Git & GitHub 4/7',2,'2025-09-26'),(911,'STU001','PS',1.5,'Analog Electronics 2/7',2,'2025-09-18'),(912,'STU001','PS',1,'Power Systems 4/7',2,'2025-08-27'),(913,'STU001','PS',3,'Time Management 4/7',2,'2025-09-07'),(914,'STU001','PS',2.5,'Git & GitHub 4/7',2,'2025-09-27'),(915,'STU001','PS',2,'Excel 3/7',2,'2025-09-19'),(916,'STU001','PS',3.33,'Power Systems 4/7',2,'2025-09-08'),(917,'STU001','PS',1.5,'Git & GitHub 4/7',2,'2025-08-28'),(918,'STU001','PS',3,'Control Systems 3/7',2,'2025-09-28'),(919,'STU001','PS',2.5,'Algorithms 1/7',2,'2025-09-20'),(920,'STU001','PS',0.5,'English Grammar 2/7',2,'2025-09-09'),(921,'STU001','PS',2,'Excel 3/7',2,'2025-08-29'),(922,'STU001','PS',3.33,'Excel 3/7',2,'2025-09-29'),(923,'STU001','PS',3,'Data Structures 2/7',2,'2025-09-21'),(924,'STU001','PS',1,'Java 3/7',2,'2025-09-10'),(925,'STU001','PS',2.5,'C 0/7',2,'2025-08-30'),(926,'STU001','PS',0.5,'Typing Speed 6/7',2,'2025-09-30'),(927,'STU001','PS',3.33,'Instrumentation 4/7',2,'2025-09-22'),(928,'STU001','PS',3,'Excel 3/7',2,'2025-08-31'),(929,'STU001','PS',1.5,'Typing Speed 6/7',2,'2025-09-11'),(930,'STU001','PS',1,'Java 3/7',2,'2025-10-01'),(931,'STU001','PS',0.5,'Analog Electronics 2/7',2,'2025-09-23'),(932,'STU001','PS',3.33,'OS 2/7',2,'2025-09-01'),(933,'STU001','PS',2,'English Grammar 2/7',2,'2025-09-12'),(934,'STU001','PS',1.5,'Linux Basics 2/7',2,'2025-10-02'),(935,'STU001','PS',1,'C 0/7',2,'2025-09-24'),(936,'STU001','PS',0.5,'C++ 5/7',2,'2025-09-02'),(937,'STU001','PS',2.5,'Typing Speed 6/7',2,'2025-09-13'),(938,'STU001','PS',2,'Electrical Machines 2/7',2,'2025-10-03'),(939,'STU001','PS',1.5,'DBMS 4/7',2,'2025-09-25'),(940,'STU001','PS',1,'Typing Speed 6/7',2,'2025-09-03'),(941,'STU001','PS',3,'Microcontrollers 1/7',2,'2025-09-14'),(942,'STU001','PS',2.5,'Signal Processing 3/7',2,'2025-10-04'),(943,'STU001','PS',2,'Productivity Tools 3/7',2,'2025-09-26'),(944,'STU001','PS',1.5,'Git & GitHub 4/7',2,'2025-09-04'),(945,'STU001','PS',3.33,'Instrumentation 4/7',2,'2025-09-15'),(946,'STU001','PS',3,'Excel 3/7',2,'2025-10-05'),(947,'STU001','PS',2.5,'Java 3/7',2,'2025-09-27'),(948,'STU001','PS',2,'Time Management 4/7',2,'2025-09-05'),(949,'STU001','PS',0.5,'OS 2/7',2,'2025-09-16'),(950,'STU001','PS',3.33,'Typing Speed 6/7',2,'2025-10-06'),(951,'STU001','PS',3,'Linux Basics 2/7',2,'2025-09-28'),(952,'STU001','PS',2.5,'Signal Processing 3/7',2,'2025-09-06'),(953,'STU001','PS',1,'Time Management 4/7',2,'2025-09-17'),(954,'STU001','PS',0.5,'Control Systems 3/7',2,'2025-10-07'),(955,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',2,'2025-09-29'),(956,'STU001','PS',3,'Cloud Fundamentals 1/7',2,'2025-09-07'),(957,'STU001','PS',1.5,'Excel 3/7',2,'2025-09-18'),(958,'STU001','PS',1,'Time Management 4/7',2,'2025-10-08'),(959,'STU001','PS',0.5,'Microcontrollers 1/7',2,'2025-09-30'),(960,'STU001','PS',3.33,'Power Systems 4/7',2,'2025-09-08'),(961,'STU001','PS',2,'Instrumentation 4/7',2,'2025-09-19'),(962,'STU001','PS',1.5,'Productivity Tools 3/7',2,'2025-10-09'),(963,'STU001','PS',1,'Control Systems 3/7',2,'2025-10-01'),(964,'STU001','PS',2.5,'Computer Networks 3/7',2,'2025-09-20'),(965,'STU001','PS',0.5,'Productivity Tools 3/7',2,'2025-09-09'),(966,'STU001','PS',2,'Time Management 4/7',2,'2025-10-10'),(967,'STU001','PS',1.5,'Typing Speed 6/7',2,'2025-10-02'),(968,'STU001','PS',3,'OS 2/7',2,'2025-09-21'),(969,'STU001','PS',1,'Analog Electronics 2/7',2,'2025-09-10'),(970,'STU001','PS',2.5,'Microcontrollers 1/7',2,'2025-10-11'),(971,'STU001','PS',2,'Git & GitHub 4/7',2,'2025-10-03'),(972,'STU001','PS',3.33,'Machine Learning 6/7',2,'2025-09-22'),(973,'STU001','PS',1.5,'Excel 3/7',2,'2025-09-11'),(974,'STU001','PS',2.5,'Productivity Tools 3/7',2,'2025-10-04'),(975,'STU001','PS',3,'Algorithms 1/7',2,'2025-10-12'),(976,'STU001','PS',3.33,'Circuit Analysis 5/7',2,'2025-10-13'),(977,'STU001','PS',3,'English Grammar 2/7',2,'2025-10-05'),(978,'STU001','PS',2,'Embedded Systems 2/7',2,'2025-09-12'),(979,'STU001','PS',0.5,'Data Structures 2/7',2,'2025-09-23'),(980,'STU001','PS',3.33,'Typing Speed 6/7',2,'2025-10-06'),(981,'STU001','PS',2.5,'Time Management 4/7',2,'2025-09-13'),(982,'STU001','PS',1,'Microcontrollers 1/7',2,'2025-09-24'),(983,'STU001','PS',0.5,'Microcontrollers 1/7',2,'2025-10-14'),(984,'STU001','PS',1.5,'OS 2/7',2,'2025-09-25'),(985,'STU001','PS',0.5,'Signal Processing 3/7',2,'2025-10-07'),(986,'STU001','PS',3,'English Grammar 2/7',2,'2025-09-14'),(987,'STU001','PS',1,'Electrical Machines 2/7',2,'2025-10-15'),(988,'STU001','PS',2,'English Grammar 2/7',2,'2025-09-26'),(989,'STU001','PS',1,'C 0/7',2,'2025-10-08'),(990,'STU001','PS',3.33,'Data Structures 2/7',2,'2025-09-15'),(991,'STU001','PS',1.5,'C 0/7',2,'2025-10-16'),(992,'STU001','PS',2.5,'Python 4/7',2,'2025-09-27'),(993,'STU001','PS',1.5,'Productivity Tools 3/7',2,'2025-10-09'),(994,'STU001','PS',0.5,'Linux Basics 2/7',2,'2025-09-16'),(995,'STU001','PS',3,'Data Structures 2/7',2,'2025-09-28'),(996,'STU001','PS',2,'Machine Learning 6/7',2,'2025-10-10'),(997,'STU001','PS',1,'Algorithms 1/7',2,'2025-09-17'),(998,'STU001','PS',3.33,'C 0/7',2,'2025-09-29'),(999,'STU001','PS',2.5,'Cloud Fundamentals 1/7',2,'2025-10-11'),(1001,'STU001','PS',-0.5,'Python 4/7',2,'2025-09-30'),(1002,'STU001','PS',3,'English Grammar 2/7',2,'2025-10-12'),(1003,'STU001','PS',2,'Power Systems 4/7',2,'2025-09-19'),(1004,'STU001','PS',1,'Productivity Tools 3/7',2,'2025-10-01'),(1005,'STU001','PS',3.33,'Microcontrollers 1/7',2,'2025-10-13'),(1006,'STU001','PS',2.5,'Excel 3/7',2,'2025-09-20'),(1007,'STU001','PS',1.5,'Analog Electronics 2/7',2,'2025-10-02'),(1008,'STU001','PS',0.5,'Cybersecurity Awareness 3/7',2,'2025-10-14'),(1009,'STU001','PS',3,'Control Systems 3/7',2,'2025-09-21'),(1010,'STU001','PS',2,'Typing Speed 6/7',2,'2025-10-03'),(1011,'STU001','PS',1,'Signal Processing 3/7',2,'2025-10-15'),(1012,'STU001','PS',3.33,'Linux Basics 2/7',2,'2025-09-22'),(1013,'STU001','PS',2.5,'English Grammar 2/7',2,'2025-10-04'),(1014,'STU001','PS',1.5,'Typing Speed 6/7',2,'2025-10-16'),(1015,'STU001','PS',0.5,'DBMS 4/7',2,'2025-09-23'),(1016,'STU001','PS',3,'Cloud Fundamentals 1/7',2,'2025-10-05'),(1017,'STU001','PS',1,'OS 2/7',2,'2025-09-24'),(1018,'STU001','PS',3.33,'Python 4/7',2,'2025-10-06'),(1019,'STU001','PS',1.5,'English Grammar 2/7',2,'2025-09-25'),(1020,'STU001','PS',0.5,'Data Structures 2/7',2,'2025-10-07'),(1021,'STU001','PS',2,'Cloud Fundamentals 1/7',2,'2025-09-26'),(1022,'STU001','PS',1,'Machine Learning 6/7',2,'2025-10-08'),(1023,'STU001','PS',2.5,'Productivity Tools 3/7',2,'2025-09-27'),(1024,'STU001','PS',1.5,'Python 4/7',2,'2025-10-09'),(1025,'STU001','PS',3,'OS 2/7',2,'2025-09-28'),(1026,'STU001','PS',2,'Excel 3/7',2,'2025-10-10'),(1027,'STU001','PS',3.33,'Cloud Fundamentals 1/7',2,'2025-09-29'),(1028,'STU001','PS',2.5,'Computer Networks 3/7',2,'2025-10-11'),(1029,'STU001','PS',0.5,'C 0/7',2,'2025-09-30'),(1030,'STU001','PS',3,'Analog Electronics 2/7',2,'2025-10-12'),(1031,'STU001','PS',1,'Embedded Systems 2/7',2,'2025-10-01'),(1032,'STU001','PS',3.33,'Java 3/7',2,'2025-10-13'),(1033,'STU001','PS',1.5,'Typing Speed 6/7',2,'2025-10-02'),(1034,'STU001','PS',0.5,'Excel 3/7',2,'2025-10-14'),(1035,'STU001','PS',2,'Git & GitHub 4/7',2,'2025-10-03'),(1036,'STU001','PS',1,'Cloud Fundamentals 1/7',2,'2025-10-15'),(1037,'STU001','PS',2.5,'English Grammar 2/7',2,'2025-10-04'),(1038,'STU001','PS',1.5,'Time Management 4/7',2,'2025-10-16'),(1039,'STU001','PS',3,'Productivity Tools 3/7',2,'2025-10-05'),(1040,'STU001','PS',3.33,'Cybersecurity Awareness 3/7',2,'2025-10-06'),(1041,'STU001','PS',0.5,'English Grammar 2/7',2,'2025-10-07'),(1042,'STU001','PS',1,'Digital Electronics 5/7',2,'2025-10-08'),(1043,'STU001','PS',1.5,'Control Systems 3/7',2,'2025-10-09'),(1044,'STU001','PS',2,'Data Structures 2/7',2,'2025-10-10'),(1045,'STU001','PS',2.5,'Excel 3/7',2,'2025-10-11'),(1046,'STU001','PS',3,'Git & GitHub 4/7',2,'2025-10-12'),(1047,'STU001','PS',3.33,'Electrical Machines 2/7',2,'2025-10-13'),(1048,'STU001','PS',0.5,'Circuit Analysis 5/7',2,'2025-10-14'),(1049,'STU001','PS',1,'Control Systems 3/7',2,'2025-10-15'),(1050,'STU001','PS',1.5,'Git & GitHub 4/7',2,'2025-10-16');
/*!40000 ALTER TABLE `points_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_evaluation`
--

DROP TABLE IF EXISTS `project_evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_evaluation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `changes_from_idea` text,
  `faculty_remarks` text,
  `upload_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_evaluation_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_evaluation`
--

LOCK TABLES `project_evaluation` WRITE;
/*!40000 ALTER TABLE `project_evaluation` DISABLE KEYS */;
INSERT INTO `project_evaluation` VALUES (1,3,'none',NULL,NULL);
/*!40000 ALTER TABLE `project_evaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_files`
--

DROP TABLE IF EXISTS `project_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `github_link` varchar(255) DEFAULT NULL,
  `report_pdf` varchar(255) DEFAULT NULL,
  `demo_video` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_files_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_files`
--

LOCK TABLES `project_files` WRITE;
/*!40000 ALTER TABLE `project_files` DISABLE KEYS */;
INSERT INTO `project_files` VALUES (1,3,'http://localhost:5173/uploadview/project','uploads\\pdf\\Bhavish Nithin.pdf','uploads\\videos\\WIN_20250806_23_54_33_Pro.mp4');
/*!40000 ALTER TABLE `project_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_presentations`
--

DROP TABLE IF EXISTS `project_presentations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_presentations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `presented_externally` tinyint(1) DEFAULT '0',
  `awards_won` text,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_presentations_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_presentations`
--

LOCK TABLES `project_presentations` WRITE;
/*!40000 ALTER TABLE `project_presentations` DISABLE KEYS */;
INSERT INTO `project_presentations` VALUES (1,3,1,'none');
/*!40000 ALTER TABLE `project_presentations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_team_members`
--

DROP TABLE IF EXISTS `project_team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `rollno` varchar(20) NOT NULL,
  `member_name` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_team_members_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_team_members`
--

LOCK TABLES `project_team_members` WRITE;
/*!40000 ALTER TABLE `project_team_members` DISABLE KEYS */;
INSERT INTO `project_team_members` VALUES (1,3,'7376242AL153','Kalif','Computer Science & Engineering'),(2,3,'STU002','Deepak','Computer Science & Engineering');
/*!40000 ALTER TABLE `project_team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_tech_stack`
--

DROP TABLE IF EXISTS `project_tech_stack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_tech_stack` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `tech_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_tech_stack_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_tech_stack`
--

LOCK TABLES `project_tech_stack` WRITE;
/*!40000 ALTER TABLE `project_tech_stack` DISABLE KEYS */;
INSERT INTO `project_tech_stack` VALUES (2,2,'Python'),(3,2,'Go'),(4,3,'Python'),(5,3,'Go');
/*!40000 ALTER TABLE `project_tech_stack` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `upload_type` varchar(255) DEFAULT NULL,
  `rollno` varchar(20) NOT NULL,
  `title_idea` text NOT NULL,
  `summary` text,
  `problem_statement` text,
  `objective` text,
  `start_time` date DEFAULT NULL,
  `end_time` date DEFAULT NULL,
  `is_team_project` tinyint(1) DEFAULT '0',
  `consulted_mentor` tinyint(1) DEFAULT '0',
  `approval_status` tinyint(1) DEFAULT '0',
  `complexity` enum('T1','T2','T3') DEFAULT 'T1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (2,'project','STU001','Test 1','Apple, river, candle, whisper, thunder, marble, lantern, horizon, velvet, galaxy, notebook, breeze, clock, meadow, puzzle, feather, coral, mountain, guitar, compass, shadow, frost, basket, planet, silver, ocean, bamboo, raindrop, cloud, ink, tunnel, garden, key, crystal, forest, bridge, stone, lighthouse, stream, star, book, rose, shell, mirror, nest, sunset, map, leaf, window, road, chair, flame, ship, path, rain, tower, sand, bird, hill, cup, rope, pond, door, moon, ring, glass, ice, tree, smile, sky, bell, wind, starfish, grass, fire, seed, wave, brush, paper, sun, coin, shoe, chain, lamp, flower, snow, song, gate, house, light, dream, pearl, shadow, drift, canyon, spark, echo, cliff, tide, branch, mist, jewel, meadow.','Test','Test','2025-08-08','2025-08-12',1,1,0,'T1','2025-08-08 18:39:39','2025-08-10 10:16:01'),(3,'project','STU001','Test 1','Apple, river, candle, whisper, thunder, marble, lantern, horizon, velvet, galaxy, notebook, breeze, clock, meadow, puzzle, feather, coral, mountain, guitar, compass, shadow, frost, basket, planet, silver, ocean, bamboo, raindrop, cloud, ink, tunnel, garden, key, crystal, forest, bridge, stone, lighthouse, stream, star, book, rose, shell, mirror, nest, sunset, map, leaf, window, road, chair, flame, ship, path, rain, tower, sand, bird, hill, cup, rope, pond, door, moon, ring, glass, ice, tree, smile, sky, bell, wind, starfish, grass, fire, seed, wave, brush, paper, sun, coin, shoe, chain, lamp, flower, snow, song, gate, house, light, dream, pearl, shadow, drift, canyon, spark, echo, cliff, tide, branch, mist, jewel, meadow.','Test','Test','2025-08-08','2025-08-12',1,1,0,'T1','2025-08-08 18:43:00','2025-08-10 10:16:01');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ps_level_status`
--

DROP TABLE IF EXISTS `ps_level_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_level_status` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `rollno` text NOT NULL,
  `skilldomain` text NOT NULL,
  `skillname` text NOT NULL,
  `levels_completed` text NOT NULL,
  `total_levels` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_level_status`
--

LOCK TABLES `ps_level_status` WRITE;
/*!40000 ALTER TABLE `ps_level_status` DISABLE KEYS */;
INSERT INTO `ps_level_status` VALUES (1,'STU001','Non-Technical','Cloud Fundamentals','1',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(2,'STU001','CS','DBMS','4',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(3,'STU001','CS','Computer Networks','3',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(4,'STU001','Soft Skills','Typing Speed','6',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(5,'STU001','Non-Technical','Excel','3',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(6,'STU001','Non-Technical','Cybersecurity Awareness','3',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(7,'STU001','Electrical','Digital Electronics','5',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(8,'STU001','Electrical','Instrumentation','4',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(9,'STU001','Soft Skills','Time Management','4',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(10,'STU001','Electrical','Control Systems','3',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(11,'STU001','Electrical','Analog Electronics','2',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(12,'STU001','Soft Skills','English Grammar','2',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(13,'STU001','CS','C++','5',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(14,'STU001','CS','Algorithms','1',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(15,'STU001','Non-Technical','Linux Basics','2',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(16,'STU001','CS','Python','4',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(17,'STU001','Soft Skills','Productivity Tools','3',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(18,'STU001','CS','Data Structures','2',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(19,'STU001','CS','OS','2',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(20,'STU001','CS','C','0',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(21,'STU001','Electrical','Electrical Machines','2',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(22,'STU001','CS','Java','3',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(23,'STU001','Electrical','Signal Processing','3',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(24,'STU001','Electrical','Embedded Systems','2',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(25,'STU001','Non-Technical','Git & GitHub','4',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(26,'STU001','Electrical','Power Systems','4',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(27,'STU001','Electrical','Microcontrollers','1',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(28,'STU001','Electrical','Circuit Analysis','5',7,'2025-05-19 10:28:40','2025-05-19 10:28:40'),(29,'STU001','CS','Machine Learning','6',7,'2025-05-19 10:28:40','2025-05-19 10:28:40');
/*!40000 ALTER TABLE `ps_level_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ps_status`
--

DROP TABLE IF EXISTS `ps_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_status` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `rollno` varchar(255) NOT NULL,
  `skill_domain` varchar(50) NOT NULL,
  `skill_name` varchar(50) NOT NULL,
  `attempts` int NOT NULL DEFAULT '1',
  `skill_level` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_status`
--

LOCK TABLES `ps_status` WRITE;
/*!40000 ALTER TABLE `ps_status` DISABLE KEYS */;
INSERT INTO `ps_status` VALUES (2,'STU001','CS','DBMS',8,'4','2025-05-19 10:20:31'),(3,'STU001','CS','Computer Networks',7,'3','2025-05-19 10:20:31'),(4,'STU001','Soft Skills','Typing Speed',1,'6','2025-05-19 10:20:31'),(5,'STU001','Non-Technical','Excel',10,'3','2025-05-19 10:20:31'),(6,'STU001','Non-Technical','Cybersecurity Awareness',7,'3','2025-05-19 10:20:31'),(7,'STU001','Electrical','Digital Electronics',10,'5','2025-05-19 10:20:31'),(8,'STU001','Electrical','Instrumentation',10,'4','2025-05-19 10:20:32'),(9,'STU001','Soft Skills','Time Management',10,'4','2025-05-19 10:20:32'),(10,'STU001','Electrical','Control Systems',9,'3','2025-05-19 10:20:32'),(11,'STU001','Electrical','Analog Electronics',1,'2','2025-05-19 10:20:32'),(12,'STU001','Soft Skills','English Grammar',6,'2','2025-05-19 10:20:32'),(13,'STU001','CS','C++',4,'5','2025-05-19 10:20:32'),(14,'STU001','CS','Algorithms',2,'1','2025-05-19 10:20:32'),(15,'STU001','Non-Technical','Linux Basics',6,'2','2025-05-19 10:20:32'),(16,'STU001','CS','Python',9,'4','2025-05-19 10:20:32'),(17,'STU001','Soft Skills','Productivity Tools',2,'3','2025-05-19 10:20:32'),(18,'STU001','CS','Data Structures',1,'2','2025-05-19 10:20:32'),(19,'STU001','CS','OS',8,'2','2025-05-19 10:20:32'),(20,'STU001','CS','C',4,'0','2025-05-19 10:20:32'),(21,'STU001','Electrical','Electrical Machines',3,'2','2025-05-19 10:20:32'),(22,'STU001','CS','Java',7,'3','2025-05-19 10:20:32'),(23,'STU001','Electrical','Signal Processing',9,'3','2025-05-19 10:20:32'),(24,'STU001','Electrical','Embedded Systems',1,'2','2025-05-19 10:20:32'),(25,'STU001','Non-Technical','Git & GitHub',9,'4','2025-05-19 10:20:32'),(26,'STU001','Electrical','Power Systems',1,'4','2025-05-19 10:20:33'),(27,'STU001','Electrical','Microcontrollers',8,'1','2025-05-19 10:20:33'),(28,'STU001','Electrical','Circuit Analysis',4,'5','2025-05-19 10:20:33'),(29,'STU001','CS','Machine Learning',5,'6','2025-05-19 10:20:34'),(30,'STU001','CS','Machine Learning',2,'1','2025-05-20 08:46:33'),(31,'STU001','CS','OS',4,'2','2025-06-03 16:25:20'),(32,'STU001','CS','OS',2,'1','2025-06-03 16:25:20');
/*!40000 ALTER TABLE `ps_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `register_events`
--

DROP TABLE IF EXISTS `register_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `register_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_code` varchar(20) NOT NULL,
  `domain` text,
  `problem_statement` text,
  `state` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `register_events`
--

LOCK TABLES `register_events` WRITE;
/*!40000 ALTER TABLE `register_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `register_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rounds`
--

DROP TABLE IF EXISTS `rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rounds` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `event_id` bigint NOT NULL,
  `round_number` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `reward_points` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_id` (`event_id`,`round_number`),
  CONSTRAINT `rounds_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rounds`
--

LOCK TABLES `rounds` WRITE;
/*!40000 ALTER TABLE `rounds` DISABLE KEYS */;
/*!40000 ALTER TABLE `rounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session_details`
--

DROP TABLE IF EXISTS `session_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_details` (
  `activity_id` int NOT NULL,
  `publishing_department` varchar(255) DEFAULT NULL,
  `host` varchar(255) DEFAULT NULL,
  `description` text,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `date_of_session` date DEFAULT NULL,
  `link_or_location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`activity_id`),
  CONSTRAINT `session_details_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activity_list` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_details`
--

LOCK TABLES `session_details` WRITE;
/*!40000 ALTER TABLE `session_details` DISABLE KEYS */;
INSERT INTO `session_details` VALUES (34,'Department of Student Affairs','Principal','1234','00:17:00','01:17:00','2025-08-06','Auditorium'),(35,'Department of Student Affairs','Principal','1234','00:17:00','01:17:00','2025-08-06','Auditorium'),(36,'Department of Student Affairs','Principal','1234','00:17:00','01:17:00','2025-08-06','Auditorium'),(37,'Department of Student Affairs','Principal','1234','00:17:00','01:17:00','2025-08-06','Auditorium');
/*!40000 ALTER TABLE `session_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session_students`
--

DROP TABLE IF EXISTS `session_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int DEFAULT NULL,
  `student_rollno` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `activity_id` (`activity_id`),
  CONSTRAINT `session_students_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `session_details` (`activity_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_students`
--

LOCK TABLES `session_students` WRITE;
/*!40000 ALTER TABLE `session_students` DISABLE KEYS */;
INSERT INTO `session_students` VALUES (3,37,'STU001','2025-08-05 06:17:16'),(4,37,'STU002','2025-08-05 06:17:16');
/*!40000 ALTER TABLE `session_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_details`
--

DROP TABLE IF EXISTS `survey_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_details` (
  `activity_id` int NOT NULL,
  `publishing_department` varchar(255) DEFAULT NULL,
  `description` text,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `link_or_location` varchar(255) DEFAULT NULL,
  `target_year` varchar(255) DEFAULT NULL,
  `target_department` varchar(255) DEFAULT NULL,
  `all_students` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`activity_id`),
  CONSTRAINT `survey_details_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activity_list` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_details`
--

LOCK TABLES `survey_details` WRITE;
/*!40000 ALTER TABLE `survey_details` DISABLE KEYS */;
INSERT INTO `survey_details` VALUES (2,'Computer Science Department','This is a test','2025-08-02','2025-08-14','Class','1st Year','Computer Science',0),(3,'Computer Science Department','This is a test','2025-08-01','2025-08-02','Class','All Years','Computer Science',0),(25,'Department of Student Affairs','This is a test','2025-08-04','2025-08-04','Auditorium','1st Year','All Departments',0);
/*!40000 ALTER TABLE `survey_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_code` varchar(50) NOT NULL,
  `team_code` varchar(20) NOT NULL,
  `member_rollno` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workshop_details`
--

DROP TABLE IF EXISTS `workshop_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workshop_details` (
  `activity_id` int NOT NULL,
  `publishing_department` varchar(255) DEFAULT NULL,
  `host` varchar(255) DEFAULT NULL,
  `description` text,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `link_or_location` varchar(255) DEFAULT NULL,
  `target_year` varchar(255) DEFAULT NULL,
  `target_department` varchar(255) DEFAULT NULL,
  `all_students` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`activity_id`),
  CONSTRAINT `workshop_details_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activity_list` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workshop_details`
--

LOCK TABLES `workshop_details` WRITE;
/*!40000 ALTER TABLE `workshop_details` DISABLE KEYS */;
INSERT INTO `workshop_details` VALUES (9,'Department of Student Affairs','principal','1234','2025-08-16','2025-08-20','Class','All Years','Electrical Engineering',0),(10,'Computer Science Department','principal','This is a test','2025-08-03','2025-08-06','Class','1st Year','Electrical Engineering',0);
/*!40000 ALTER TABLE `workshop_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workshops`
--

DROP TABLE IF EXISTS `workshops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workshops` (
  `id` int NOT NULL AUTO_INCREMENT,
  `upload_type` varchar(255) DEFAULT NULL,
  `rollno` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `mode_of_delivery` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Offline',
  `event_nature` varchar(255) NOT NULL,
  `organised_by` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `participation_type` enum('Attendee','Presenter','Both') DEFAULT 'Attendee',
  `is_certificate` tinyint(1) DEFAULT '0',
  `certificate` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `topics_covered` varchar(255) NOT NULL,
  `relevence` varchar(255) NOT NULL,
  `skills_gained` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `submitted_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workshops`
--

LOCK TABLES `workshops` WRITE;
/*!40000 ALTER TABLE `workshops` DISABLE KEYS */;
INSERT INTO `workshops` VALUES (1,'workshop','STU001','Workshop 1','seminar','online','technical','Test','Test','2025-08-07','2025-08-12','Attendee',1,'uploads\\workshops\\Importance+of+IT.pdf','https://chatgpt.com/c/68978bfe-0ef8-8333-a02b-34cecf290d6e','https://chatgpt.com/c/68978bfe-0ef8-8333-a02b-34cecf290d6e','https://chatgpt.com/c/68978bfe-0ef8-8333-a02b-34cecf290d6e','https://chatgpt.com/c/68978bfe-0ef8-8333-a02b-34cecf290d6e','2025-08-09 23:49:33',0);
/*!40000 ALTER TABLE `workshops` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-10 22:48:06
