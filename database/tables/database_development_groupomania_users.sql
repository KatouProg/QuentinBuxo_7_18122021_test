CREATE DATABASE  IF NOT EXISTS `database_development_groupomania` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `database_development_groupomania`;
-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: database_development_groupomania
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `bgUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@admin.com','Admin','Reseau Social','$2b$15$G2zXd5.oa.U8EVf4t7JA0OMDWf4lRDqze1AZZLvaDClUHI7yFYXha','Je suis l\'admin de ce reseau ;)','http://localhost:3000/images/1646567040832.jpg','http://localhost:3000/images/1646567035396.jpg','2022-03-06 11:43:24','2022-03-06 11:44:19',1),(2,'celinedion@gmail.com','Celine','Dion','$2b$15$OBd.l4PuYss6s2yMeh0lOu29.UUTjQIxqiUuCteiwUPYLp1Z7xEnC','Salut c Celine ;)','http://localhost:3000/images/1646567109120.jpg','http://localhost:3000/images/1646567101014.jpg','2022-03-06 11:44:45','2022-03-06 11:45:22',0),(3,'patrickbruel@gmail.com','Patrick','Bruel','$2b$15$LDFyif7lJ7iDJZEbaCnIB.JbqtBdlU0XUlbxZsuKP2tAtAvDU3YxS','Patriiiick !!','http://localhost:3000/images/1646567179585.jpg','http://localhost:3000/images/1646567172093.jfif','2022-03-06 11:45:52','2022-03-06 11:46:27',0),(4,'michelpolnareff@gmail.com','Michel','Polnareff','$2b$15$Y8ZJJ2zr038CmozwTLemmO4jnk.nIf2aYAftEf3HWu0m7sfDEaxZW','Yooo c\'est Michou !','http://localhost:3000/images/1646567252233.jpg','http://localhost:3000/images/1646567241087.jpg','2022-03-06 11:47:01','2022-03-06 11:47:44',0),(6,'franciscabrel@gmail.com','Francis','Cabrel','$2b$15$5NOLHJLRZWObSeSFWlnBre5f/iqRG4nNZ1MVxd7XCPDM9MxjxZRO2','... sur les cailloux','http://localhost:3000/images/1646567897109.jfif','http://localhost:3000/images/1646567885835.jpg','2022-03-06 11:57:45','2022-03-06 11:58:26',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-07 16:21:26
