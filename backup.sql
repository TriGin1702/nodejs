CREATE DATABASE  IF NOT EXISTS `web2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `web2`;
DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id_address` int NOT NULL AUTO_INCREMENT,
  `id_district` int NOT NULL,
  `ip_address` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  PRIMARY KEY (`id_address`),
  KEY `fk_address_district` (`id_district`),
  CONSTRAINT `fk_address_district` FOREIGN KEY (`id_district`) REFERENCES `district` (`id_district`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,1,'38 Hai Bà Trưng','Hưng','0123456789'),(2,4,'28A2','Phúc','0987654321'),(7,1,'36A9','Trí','0948500165'),(8,1,'12A3','Hưng mập','1237894560'),(9,2,'29 Nguyễn Tri Phương','hưng','0123456789');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authority`
--

DROP TABLE IF EXISTS `authority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authority` (
  `id_au` int NOT NULL AUTO_INCREMENT,
  `id_role` int NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id_au`,`id_role`) USING BTREE,
  KEY `fk_authority_role` (`id_role`),
  CONSTRAINT `fk_authority_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authority`
--

LOCK TABLES `authority` WRITE;
/*!40000 ALTER TABLE `authority` DISABLE KEYS */;
INSERT INTO `authority` VALUES (1,1,'buy product'),(2,2,'add product'),(2,7,'add product'),(2,9,'add product'),(3,2,'update product'),(3,7,'update product'),(3,8,'update product'),(3,9,'update product'),(4,2,'delete product'),(4,8,'delete product'),(4,9,'delete product'),(5,2,'reset product'),(5,8,'reset product');
/*!40000 ALTER TABLE `authority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill`
--

DROP TABLE IF EXISTS `bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill` (
  `id_bill` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_pay` int NOT NULL,
  `price` double NOT NULL DEFAULT '0',
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) NOT NULL DEFAULT 'Not yet',
  PRIMARY KEY (`id_bill`),
  KEY `fk_bill_payment` (`id_pay`),
  KEY `fk_bill_user` (`id_user`),
  CONSTRAINT `fk_bill_payment` FOREIGN KEY (`id_pay`) REFERENCES `payment` (`id_pay`),
  CONSTRAINT `fk_bill_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill`
--

LOCK TABLES `bill` WRITE;
/*!40000 ALTER TABLE `bill` DISABLE KEYS */;
INSERT INTO `bill` VALUES (7,1,1,1794,'2024-11-21 02:17:19','Confirm'),(10,1,1,3300,'2024-11-21 02:24:10','Confirm'),(12,1,1,1197,'2024-11-23 13:04:26','Confirm'),(16,1,1,3297,'2024-11-26 11:09:23','Confirm'),(17,1,1,1496,'2024-12-01 15:00:16','Pending');
/*!40000 ALTER TABLE `bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill_address`
--

DROP TABLE IF EXISTS `bill_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill_address` (
  `id_billaddress` int NOT NULL AUTO_INCREMENT,
  `id_bill` int NOT NULL,
  `id_useraddress` int NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ttnh` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_billaddress`),
  UNIQUE KEY `id_bill` (`id_bill`),
  KEY `fk_bill_address_useraddress` (`id_useraddress`),
  CONSTRAINT `fk_bill_address_bill` FOREIGN KEY (`id_bill`) REFERENCES `bill` (`id_bill`),
  CONSTRAINT `fk_bill_address_useraddress` FOREIGN KEY (`id_useraddress`) REFERENCES `user_address` (`id_useraddress`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_address`
--

LOCK TABLES `bill_address` WRITE;
/*!40000 ALTER TABLE `bill_address` DISABLE KEYS */;
INSERT INTO `bill_address` VALUES (7,7,1,'2024-11-21 02:17:19',0),(10,10,2,'2024-11-21 02:24:10',0),(12,12,1,'2024-11-23 13:04:26',0),(16,16,1,'2024-11-26 11:09:23',0),(17,17,2,'2024-12-01 15:00:16',0);
/*!40000 ALTER TABLE `bill_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill_detail`
--

DROP TABLE IF EXISTS `bill_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill_detail` (
  `id_billdetail` int NOT NULL AUTO_INCREMENT,
  `id_bill` int NOT NULL,
  `id_cart` int NOT NULL,
  `price` double NOT NULL,
  `quantity` int NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_billdetail`),
  UNIQUE KEY `id_cart` (`id_cart`),
  KEY `fk_bill_detail_bill` (`id_bill`),
  CONSTRAINT `fk_bill_detail_bill` FOREIGN KEY (`id_bill`) REFERENCES `bill` (`id_bill`),
  CONSTRAINT `fk_billdetail_cart` FOREIGN KEY (`id_cart`) REFERENCES `cart` (`id_cart`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_detail`
--

LOCK TABLES `bill_detail` WRITE;
/*!40000 ALTER TABLE `bill_detail` DISABLE KEYS */;
INSERT INTO `bill_detail` VALUES (8,7,4,1794,5,'2024-11-21 02:17:19'),(12,10,9,3300,5,'2024-11-21 02:24:11'),(14,12,16,1197,2,'2024-11-23 13:04:26'),(20,16,20,2100,5,'2024-11-26 11:09:23'),(21,16,19,1197,2,'2024-11-26 11:09:23'),(22,17,25,299,1,'2024-12-01 15:00:16'),(23,17,24,1197,2,'2024-12-01 15:00:16');
/*!40000 ALTER TABLE `bill_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand` (
  `id_brand` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `image` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_brand`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'Bomber',NULL),(6,'polo',NULL),(7,'Basic',NULL);
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id_cart` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `price` double NOT NULL,
  `addbill` tinyint(1) NOT NULL DEFAULT '0',
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cart`),
  KEY `fk_cart_user` (`id_user`),
  KEY `fk_cart_product` (`id_product`),
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,11,14,8250,1,'2024-11-16 00:00:00'),(2,1,11,11,6600,1,'2024-11-17 00:00:00'),(3,1,13,12,4550,1,'2024-11-20 01:06:27'),(4,1,14,9,2990,1,'2024-11-20 01:06:29'),(5,1,12,11,6480,1,'2024-11-20 01:06:35'),(6,1,13,11,4200,1,'2024-11-21 02:13:52'),(7,1,12,11,6480,1,'2024-11-21 02:13:53'),(8,1,15,5,2394,1,'2024-11-21 02:13:55'),(9,1,11,10,6050,1,'2024-11-21 02:13:56'),(10,1,12,9,5400,1,'2024-11-21 02:17:01'),(11,1,15,4,1995,1,'2024-11-21 02:17:05'),(12,1,13,9,3500,1,'2024-11-21 02:17:09'),(14,1,13,9,3500,1,'2024-11-21 14:35:33'),(15,1,12,8,4860,1,'2024-11-21 14:35:35'),(16,1,15,4,1995,1,'2024-11-22 01:52:54'),(17,1,11,6,3850,1,'2024-11-23 13:02:40'),(19,1,15,3,1596,1,'2024-11-23 13:36:10'),(20,1,13,5,2100,1,'2024-11-23 13:39:27'),(21,1,12,5,3240,1,'2024-11-23 13:39:28'),(22,1,11,5,3300,1,'2024-11-23 13:39:29'),(23,1,12,2,1080,1,'2024-11-26 11:04:03'),(24,1,15,2,1197,1,'2024-12-01 15:00:01'),(25,1,14,1,299,1,'2024-12-01 15:00:05');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `id_city` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_city`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'Hồ Chí Minh'),(2,'Đà Nẵng');
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id_cmt` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_product` int NOT NULL,
  `description` varchar(500) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_rep` int DEFAULT NULL,
  PRIMARY KEY (`id_cmt`),
  KEY `fk_comment_user` (`id_user`),
  KEY `fk_comment_product` (`id_product`),
  KEY `fk_comment_rep` (`id_rep`),
  CONSTRAINT `fk_comment_product` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`),
  CONSTRAINT `fk_comment_rep` FOREIGN KEY (`id_rep`) REFERENCES `comment` (`id_cmt`),
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `district`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `district` (
  `id_district` int NOT NULL AUTO_INCREMENT,
  `id_city` int NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_district`),
  KEY `fk_district_city` (`id_city`),
  CONSTRAINT `fk_district_city` FOREIGN KEY (`id_city`) REFERENCES `city` (`id_city`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `district`
--

LOCK TABLES `district` WRITE;
/*!40000 ALTER TABLE `district` DISABLE KEYS */;
INSERT INTO `district` VALUES (1,1,'quận 1'),(2,1,'quận 3'),(3,2,'Hải Châu'),(4,2,'Ngũ Hành Sơn');
/*!40000 ALTER TABLE `district` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_order`
--

DROP TABLE IF EXISTS `import_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_order` (
  `id_import_order` int NOT NULL AUTO_INCREMENT,
  `id_manufacturer` int NOT NULL,
  `date_imported` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id_import_order`),
  KEY `id_manufacturer` (`id_manufacturer`),
  CONSTRAINT `import_order_ibfk_1` FOREIGN KEY (`id_manufacturer`) REFERENCES `manufacturer` (`id_manufacturer`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_order`
--

LOCK TABLES `import_order` WRITE;
/*!40000 ALTER TABLE `import_order` DISABLE KEYS */;
INSERT INTO `import_order` VALUES (1,7,'2024-11-09 00:00:00',81.00,'Đã nhận hàng và thanh toán'),(4,7,'2024-11-23 13:18:02',50.00,'Đã nhận hàng và thanh toán'),(5,2,'2024-11-23 13:20:12',350.00,'Đã nhận hàng và thanh toán'),(6,2,'2024-11-23 13:20:12',90.00,'Đã nhận hàng và thanh toán'),(7,2,'2024-11-23 13:23:09',200.00,'Đã nhận hàng và thanh toán'),(8,2,'2024-11-28 01:46:15',300.00,'Đã nhận hàng và thanh toán'),(9,1,'2024-11-28 01:46:41',200.00,'Đã nhận hàng và thanh toán'),(10,7,'2024-12-02 01:00:54',50.00,'Đã nhận hàng và thanh toán'),(11,7,'2024-12-02 01:00:54',70.00,'Đã nhận hàng và thanh toán'),(12,1,'2024-12-02 01:17:29',56.00,'Đã nhận hàng và thanh toán');
/*!40000 ALTER TABLE `import_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_order_detail`
--

DROP TABLE IF EXISTS `import_order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_order_detail` (
  `id_import_detail` int NOT NULL AUTO_INCREMENT,
  `id_import_order` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_import_detail`),
  KEY `id_import_order` (`id_import_order`),
  KEY `id_product` (`id_product`),
  CONSTRAINT `import_order_detail_ibfk_1` FOREIGN KEY (`id_import_order`) REFERENCES `import_order` (`id_import_order`),
  CONSTRAINT `import_order_detail_ibfk_2` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_order_detail`
--

LOCK TABLES `import_order_detail` WRITE;
/*!40000 ALTER TABLE `import_order_detail` DISABLE KEYS */;
INSERT INTO `import_order_detail` VALUES (1,1,11,9,9.00,81.00),(2,4,12,10,5.00,50.00),(3,5,13,50,7.00,350.00),(4,6,14,9,10.00,90.00),(5,7,15,20,10.00,200.00),(6,8,12,30,10.00,300.00),(7,9,14,20,10.00,200.00),(8,10,14,10,5.00,50.00),(9,11,15,10,7.00,70.00),(10,12,12,4,7.00,28.00),(11,12,13,4,7.00,28.00);
/*!40000 ALTER TABLE `import_order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturer`
--

DROP TABLE IF EXISTS `manufacturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturer` (
  `id_manufacturer` int NOT NULL AUTO_INCREMENT,
  `id_address` int DEFAULT NULL,
  PRIMARY KEY (`id_manufacturer`),
  KEY `fk_adress_manf` (`id_address`),
  CONSTRAINT `fk_adress_manf` FOREIGN KEY (`id_address`) REFERENCES `address` (`id_address`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturer`
--

LOCK TABLES `manufacturer` WRITE;
/*!40000 ALTER TABLE `manufacturer` DISABLE KEYS */;
INSERT INTO `manufacturer` VALUES (1,1),(2,2),(7,7);
/*!40000 ALTER TABLE `manufacturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id_pay` int NOT NULL AUTO_INCREMENT,
  `name_pay` varchar(50) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `link` varchar(300) NOT NULL,
  PRIMARY KEY (`id_pay`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,'momo','2024-11-17 00:00:00','123456'),(2,'Thanh toán khi nhận hàng','2024-11-17 00:00:00','không có');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id_product` int NOT NULL AUTO_INCREMENT,
  `id_brand` int NOT NULL,
  `id_type` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `price` int NOT NULL,
  `image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `description` varchar(500) NOT NULL,
  `is_hidden` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_product`),
  KEY `fk_product_brand` (`id_brand`),
  KEY `fk_product_type` (`id_type`),
  CONSTRAINT `fk_product_brand` FOREIGN KEY (`id_brand`) REFERENCES `brand` (`id_brand`),
  CONSTRAINT `fk_product_type` FOREIGN KEY (`id_type`) REFERENCES `product_type` (`id_type`),
  CONSTRAINT `product_chk_1` CHECK (json_valid(`image`))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (11,6,5,'Áo polo nam',550,'[\"1731958630476-20221017_2YtRxFFrzpM7s8togqLztVIO.jpg\",\"1731958630476-20221017_24bPxTkuEa6ugAjCRSMy30fH.jpg\",\"1731958630476-20221017_c5zWpt0rdbkMKfxM1zg8RCPv.jpg\",\"1731958630476-20221017_q2FaCPCjk4z6sHzcLdCH0kvD.jpg\",\"1731958630476-20221017_xWEfqIXkZlwRcfoWVfcYuhCt.jpg\"]',9,'Áo Polo Nam Ngắn Tay, thoải mái và dễ dàng cử động, là một chân ái của các chàng trai năng động. Phần cổ áo được thiết kế sâu, có khuy cài có thể đóng mở để điều chỉnh độ rộng của cổ áo. Ngoài ra, ở phần ngực còn được thiết kế thêm hai chiếc túi hộp vô cùng tiện lợi và đầy phong cách. Đây là một chiếc áo đa năng giúp bạn có thể dễ dàng mix cùng nhiều loại trang phục để tạo ra nhiều phong cách khác nhau. Bên cạnh đó, với ưu điểm rộng rãi còn có thể giúp bạn dễ dàng che đi các khuyết điểm về body',0),(12,6,1,'Áo khoác nam Basic',540,'[\"1732009477540-20221017_3zd1Ef5W366CdmOZrhrlk6qW.jpg\",\"1732009477540-20221017_9uPvfH210Vwj9ufDQ3LJGvRv.jpg\",\"1732009477540-20221017_cguUlw0aYYqsWZbbPRwyM7b0.jpg\",\"1732009477540-20221017_CKizryce9eWWfU8oFkx3DLEm.jpg\",\"1732009477540-20221017_KQOPNzlIRaKw7rhxT1pldQVr.jpg\"]',44,'Ngày nay, áo polo nam là loại trang phục không thể không có trong tủ đồ của các chàng trai. Nó luôn là món trang phục lý tưởng cho những ngày hè oi bức nhưng bên cạnh đó chúng ta cũng có thể sử dụng áo polo linh hoạt vào bất cứ mùa nào trong năm. Chính vì vậy, áo polo nam hội tụ đủ những yếu tố mà các chàng trai cần: lịch sự, chỉnh chu nhưng lại không quá formal.',0),(13,6,5,'Áo Polo nhiều size',350,'[\"1731957069244-20221017_4rh4E3EKf0FCeTl4XapeqWnS.jpg\",\"1731957069244-20221017_4yh4MpBN9lI80qgkzoxhADH7.jpg\",\"1731957069244-20221017_G3NUuzpusEnEA9RmmOULQyCW.jpg\",\"1731957069244-20221017_mxpMajSdAi6Bq4l6aLWt3Bf5.jpg\",\"1731957069244-20221017_Vis4fE28X8AEsw2AyZEOYlU2.jpg\"]',54,'Ngày nay, áo polo nam là loại trang phục không thể không có trong tủ đồ của các chàng trai. Nó luôn là món trang phục lý tưởng cho những ngày hè oi bức nhưng bên cạnh đó chúng ta cũng có thể sử dụng áo polo linh hoạt vào bất cứ mùa nào trong năm. Chính vì vậy, áo polo nam hội tụ đủ những yếu tố mà các chàng trai cần: lịch sự, chỉnh chu nhưng lại không quá formal.',0),(14,7,6,'Quần Jogger Nam',299,'[\"1732039439637-20221017_596hS6g3Ss8jnsm7sKYtx06O.jpg\",\"1732039439637-20221017_e5OhjhhJdO3XQszqaWOTSreZ.jpg\",\"1732039439637-20221017_hrG8oFzDv3HZ13KeoFTmlySQ.jpg\",\"1732039439637-20221017_n3PlBUM9jfgVU7uY1YS19L34.jpg\",\"1732039439637-20221017_R6FLLfBcw0iEPpEsHxVCuTDM.jpg\"]',39,'quần jean hay còn gọi là quần bò đã trở thành một món đồ rất thông dụng trong tủ quần áo của mỗi người. Bất kể ở đâu, bất kể tầng lớp hay nền văn hóa nào chúng ta đều có thể bắt gặp những chiếc quần này. Bởi quần jean luôn mang lại sự trẻ trung, năng động và tiện dụng cho người mặc',0),(15,7,7,'Quần Jogger Nam Trơn',399,'[\"1732039439637-20221017_03vCTsNVCpHZIjqdqQWTe0ON.jpg\",\"1732039439637-20221017_C9AHT7iDEwHOcjxVhxAQH3Qk.jpg\",\"1732039439637-20221017_Hr3LXNaZrw5mpOCILrANBsTv.jpg\",\"1732039439637-20221017_HYKACMmH5D45du81IGqBtdzC.jpg\",\"1732039439637-20221017_pIsiCfBHsPU179MQiIyfk7rB.jpg\"]',30,'Quần được thiết kế với chất liệu Denim giúp cho vải quần dày dặn, bền lâu và giữ form tốt hơn. Với kiểu dáng Slim fit, quần có phần đùi và mông thoải mái, rộng rãi nhưng ôm dần từ trên xuống phía dưới. Tuy nhiên, không quá ôm sát vào phần cơ thể mà ôm vừa vặn,dễ chịu cho người mặc. Ngoài ra, quần cũng có những ưu điểm như co giãn ít, thoáng khí tốt, độ bền cao và giữ form lâu hơn',0);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_event`
--

DROP TABLE IF EXISTS `product_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_event` (
  `id_event` int NOT NULL AUTO_INCREMENT,
  `id_product` int NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_at` datetime NOT NULL,
  `image` varchar(50) NOT NULL,
  `discount` double NOT NULL,
  PRIMARY KEY (`id_event`),
  KEY `fk_event_product` (`id_product`),
  CONSTRAINT `fk_event_product` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_event`
--

LOCK TABLES `product_event` WRITE;
/*!40000 ALTER TABLE `product_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_type`
--

DROP TABLE IF EXISTS `product_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_type` (
  `id_type` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `gender` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_type`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_type`
--

LOCK TABLES `product_type` WRITE;
/*!40000 ALTER TABLE `product_type` DISABLE KEYS */;
INSERT INTO `product_type` VALUES (1,'Áo khoác nam',''),(5,'Áo nam',NULL),(6,'Quần Jogger Nam',NULL),(7,'Kaki',NULL);
/*!40000 ALTER TABLE `product_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'user'),(2,'admin'),(7,'vip'),(8,'Tu'),(9,'ABC');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `id_role` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `gender` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `account` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `is_ban` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_user`),
  KEY `fk_user_role` (`id_role`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'Hưng','Male','hung123@gmail.com','hung123','hung123',0),(2,2,'Trí','Male','minhtri1702@gmail.com','minhtri123','minhtri123',0),(4,2,'Tường','Male','tuong@gmail.com','tuong123','tuong123',0),(5,7,'Trung','Nam','trung@gmail.com','trung123','trung123',0),(6,9,'Tú','Nam','tu@gmail.com','tu123456','tu123456',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `id_useraddress` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_address` int NOT NULL,
  PRIMARY KEY (`id_useraddress`),
  KEY `fk_user_address_user` (`id_user`),
  KEY `fk_user_address` (`id_address`),
  CONSTRAINT `fk_user_address` FOREIGN KEY (`id_address`) REFERENCES `address` (`id_address`),
  CONSTRAINT `fk_user_address_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (1,1,8),(2,1,9);
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddComment`(IN `id_user` INT, IN `id_product` INT, IN `description` VARCHAR(500), IN `id_rep` INT)
BEGIN
    -- Khai báo biến để lưu trữ id_cmt
    DECLARE last_insert_id INT;

    -- Kiểm tra xem id_rep đã được truyền giá trị hay không
    IF id_rep IS NULL THEN
        -- Nếu không có giá trị, sử dụng NULL mặc định
        INSERT INTO comment (id_user, id_product, description, date)  -- Thay id_kh thành id_user
        VALUES (id_user, id_product, description, CURRENT_DATE());

        -- Lấy id_cmt của hàng vừa được chèn
        SET last_insert_id = LAST_INSERT_ID();
    ELSE
        -- Nếu có giá trị, sử dụng giá trị đó
        INSERT INTO comment (id_user, id_product, description, date, id_rep)  -- Thay id_kh thành id_user
        VALUES (id_user, id_product, description, CURRENT_DATE(), id_rep);

        -- Lấy id_cmt của hàng vừa được chèn
        SET last_insert_id = LAST_INSERT_ID();
    END IF;

    -- Trả về id_cmt
    SELECT last_insert_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddImportOrder` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddImportOrder`(
    IN `p_id_import_order` INT, 
    IN `p_id_product` INT, 
    IN `p_quantity` INT, 
    IN `p_unit_price` DECIMAL(10,2)
)
BEGIN
    DECLARE v_total_price DECIMAL(10, 2);

    -- Tính tổng giá trị cho sản phẩm trong đơn nhập
    SET v_total_price = p_quantity * p_unit_price;

    -- Thêm chi tiết hóa đơn nhập
    INSERT INTO import_order_detail (id_import_order, id_product, quantity, unit_price, total_price)
    VALUES (p_id_import_order, p_id_product, p_quantity, p_unit_price, v_total_price);

    -- Cập nhật tổng giá trị của hóa đơn nhập
    UPDATE import_order
    SET total_price = (SELECT SUM(total_price) 
                       FROM import_order_detail 
                       WHERE id_import_order = p_id_import_order)
    WHERE id_import_order = p_id_import_order;

    -- Cập nhật số lượng sản phẩm trong bảng product
    UPDATE product
    SET quantity = (
        SELECT SUM(quantity)
        FROM import_order_detail
        WHERE id_product = p_id_product
    )
    WHERE id_product = p_id_product;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddOrUpdateManufacturerAddress` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddOrUpdateManufacturerAddress`(IN `p_id_manufacturer` INT, IN `p_name` VARCHAR(255), IN `p_phone` VARCHAR(20), IN `p_ip_address` VARCHAR(50), IN `p_id_district` INT)
BEGIN
    DECLARE v_id_address INT;

    -- Kiểm tra nếu cần tạo manufacturer mới
    IF p_id_manufacturer = 0 THEN
        -- Thêm mới địa chỉ cho manufacturer với id_district
        INSERT INTO address (name, phone, ip_address, id_district)
        VALUES (p_name, p_phone, p_ip_address, p_id_district);
        SET v_id_address = LAST_INSERT_ID();

        -- Thêm mới manufacturer với địa chỉ mới
        INSERT INTO manufacturer (id_address)
        VALUES (v_id_address);

        -- Trả về id_manufacturer mới
        SELECT LAST_INSERT_ID() AS success;
    ELSE
        -- Lấy id_address hiện tại của manufacturer
        SELECT id_address INTO v_id_address 
        FROM manufacturer 
        WHERE id_manufacturer = p_id_manufacturer;

        -- Kiểm tra nếu dữ liệu địa chỉ hiện tại khác với dữ liệu đầu vào
        IF EXISTS (
            SELECT 1
            FROM address
            WHERE id_address = v_id_address
              AND (name != p_name OR phone != p_phone OR ip_address != p_ip_address OR id_district != p_id_district)
        ) THEN
            -- Cập nhật địa chỉ nếu có thay đổi
            UPDATE address
            SET name = p_name,
                phone = p_phone,
                ip_address = p_ip_address,
                id_district = p_id_district
            WHERE id_address = v_id_address;
        END IF;

        -- Trả về id_manufacturer hiện tại
        SELECT p_id_manufacturer AS success;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddOrUpdateUserAddress` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddOrUpdateUserAddress`(IN `p_id_useraddress` INT, IN `p_id_user` INT, IN `p_name` VARCHAR(50), IN `p_phone` VARCHAR(50), IN `p_ip_address` VARCHAR(50), IN `p_id_district` INT)
BEGIN
    DECLARE v_id_address INT;

    -- Kiểm tra nếu có id_useraddress: nếu không có thì thêm mới, nếu có thì cập nhật
    IF p_id_useraddress = 0 THEN
        -- Thêm mới địa chỉ cho người dùng
        INSERT INTO address (name, phone, ip_address, id_district)
        VALUES (p_name, p_phone, p_ip_address, p_id_district);
        SET v_id_address = LAST_INSERT_ID();

        -- Thêm mới vào bảng user_address
        INSERT INTO user_address (id_user, id_address)
        VALUES (p_id_user, v_id_address);

        -- Trả về id_useraddress mới
        SELECT LAST_INSERT_ID() AS success;
    ELSE
        -- Lấy id_address hiện tại của người dùng từ bảng user_address
        SELECT id_address INTO v_id_address 
        FROM user_address 
        WHERE id_useraddress = p_id_useraddress AND id_user = p_id_user;

        -- Kiểm tra nếu không tìm thấy địa chỉ cho user_address
        IF v_id_address IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy địa chỉ cho người dùng này.';
        ELSE
            -- Kiểm tra nếu dữ liệu địa chỉ hiện tại khác với dữ liệu đầu vào
            IF EXISTS (
                SELECT 1
                FROM address
                WHERE id_address = v_id_address
                  AND (name != p_name OR phone != p_phone OR ip_address != p_ip_address OR id_district != p_id_district)
            ) THEN
                -- Cập nhật địa chỉ nếu có thay đổi
                UPDATE address
                SET name = p_name,
                    phone = p_phone,
                    ip_address = p_ip_address,
                    id_district = p_id_district
                WHERE id_address = v_id_address;
            END IF;
        END IF;

        -- Trả về id_useraddress hiện tại
        SELECT p_id_useraddress AS success;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddToBillDetailAndUpdatePrice` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddToBillDetailAndUpdatePrice`(IN `p_id_bill` INT, IN `p_id_cart` INT)
BEGIN
    DECLARE v_price INT;
    DECLARE v_quantity INT;
    DECLARE v_total_price INT;

    -- Lấy thông tin từ bảng cart
    SELECT price, quantity INTO v_price, v_quantity
    FROM cart
    WHERE id_cart = p_id_cart;

    -- Chèn dữ liệu vào bảng bill_address
    INSERT INTO bill_detail (id_bill,id_cart, price, quantity)
    VALUES (p_id_bill,p_id_cart ,v_price, v_quantity);

    -- Tính tổng giá trị price cho tất cả các mục có id_bill giống nhau
    SELECT SUM(price) INTO v_total_price
    FROM bill_detail
    WHERE id_bill = p_id_bill;
	-- Cập nhật giá trị addbill trong bảng cart
    UPDATE cart
    SET addbill = true
    WHERE id_cart = p_id_cart;
    -- Cập nhật giá trị price trong bảng bill
    UPDATE bill
    SET price = v_total_price
    WHERE id_bill = p_id_bill;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddToCart` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddToCart`(IN `p_id_user` INT, IN `p_id_product` INT, IN `p_quantity` INT)
BEGIN
    DECLARE current_quantity INT;
    DECLARE product_price DECIMAL(10, 2);
    
    -- Lấy giá của sản phẩm từ bảng product
    SELECT price INTO product_price
    FROM product
    WHERE id_product = p_id_product;
    
    -- Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    SELECT quantity INTO current_quantity
    FROM cart
    WHERE id_user = p_id_user AND id_product = p_id_product and addbill=0;
    
    -- Nếu sản phẩm đã tồn tại trong giỏ hàng
    IF current_quantity IS NOT NULL THEN
        -- Cập nhật số lượng và giá
        UPDATE cart
        SET quantity = quantity + p_quantity,
            price = (quantity + p_quantity) * product_price
        WHERE id_user = p_id_user AND id_product = p_id_product;
    ELSE
        -- Thêm sản phẩm mới vào giỏ hàng
        INSERT INTO cart (id_user, id_product, quantity, price)
        VALUES (p_id_user, p_id_product, p_quantity, p_quantity * product_price);
    END IF;
    SELECT 1 AS success;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteBillData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteBillData`(IN id_user2 INT, IN id_bill2 INT)
BEGIN
    -- Kiểm tra xem id_bill có tồn tại trong bảng bill và có id_user khớp không
    IF EXISTS (SELECT 1 FROM bill WHERE id_bill = id_bill2 AND id_user = id_user2) THEN
        -- Kiểm tra xem trạng thái của bill có phải là 'Pending' không
        IF EXISTS (SELECT 1 FROM bill WHERE id_bill = id_bill2 AND status = 'Pending') THEN
            -- Xóa dữ liệu ở bảng bill_address
            DELETE FROM bill_address WHERE id_bill = id_bill2;

            -- Xóa dữ liệu ở bảng bill_detail
            DELETE FROM bill_detail WHERE id_bill = id_bill2;

            -- Xóa dữ liệu ở bảng bill
            DELETE FROM bill WHERE id_bill = id_bill2;
        ELSE
            -- Nếu không phải status 'Pending'
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bill status is not Pending';
        END IF;
    ELSE
        -- Nếu không tồn tại id_user tương ứng với id_bill
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bill or user does not exist';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteComment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteComment`(IN `id_cmt_in` INT, IN `id_user_in` INT)
BEGIN
    -- Xóa các bình luận có id_rep trùng với id_cmt và thuộc người dùng có id_user
    DELETE FROM comment WHERE id_rep = id_cmt_in;

    -- Xóa bình luận gốc có id_cmt và id_user trùng với id_cmt và id_user
    DELETE FROM comment WHERE id_cmt = id_cmt_in AND id_user = id_user_in;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAddressByBillId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAddressByBillId`(IN `p_id_bill` INT)
BEGIN
    SELECT a.*, ua.*, d.name AS district_name, c.name AS city_name
    FROM bill b
    JOIN bill_address ba ON b.id = ba.id_bill
    JOIN user_address ua ON ba.id_useraddress = ua.id
    JOIN address a ON ua.id_address = a.id
    JOIN district d ON ua.id_district = d.id
    JOIN city c ON d.id_city = c.id
    WHERE b.id = p_id_bill;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetALLimportBill` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetALLimportBill`()
BEGIN
	SELECT 
    io.id_import_order AS import_order_id, -- Mã hóa đơn nhập
    io.total_price AS import_order_total_price, -- Tổng giá trị hóa đơn nhập
    io.status,
    JSON_ARRAYAGG(
        JSON_OBJECT(
			'id_product', p.id_product,
            'product_image', JSON_UNQUOTE(JSON_EXTRACT(p.image, '$[0]')), -- Hình ảnh đầu tiên của sản phẩm
            'product_name', p.name, -- Tên sản phẩm
            'brand_name', b.name, -- Tên thương hiệu
            'type_name', pt.name, -- Loại sản phẩm
            'import_quantity', iod.quantity, -- Số lượng nhập hàng
            'unit_price', iod.unit_price, -- Giá mỗi sản phẩm nhập
            'total_price', iod.total_price -- Tổng giá sản phẩm nhập
        )
    ) AS products, -- Mảng sản phẩm trong hóa đơn nhập
    a.name AS manf_name, -- Tên địa chỉ nhà cung cấp
    a.id_address,
    a.ip_address,
    a.phone AS phone -- Số điện thoại nhà cung cấp
FROM import_order io
JOIN import_order_detail iod ON io.id_import_order = iod.id_import_order
JOIN product p ON iod.id_product = p.id_product
JOIN brand b ON p.id_brand = b.id_brand
JOIN product_type pt ON p.id_type = pt.id_type
JOIN manufacturer m ON io.id_manufacturer = m.id_manufacturer
JOIN address a ON m.id_address = a.id_address
JOIN district d ON a.id_district = d.id_district
JOIN city c ON d.id_city = c.id_city
GROUP BY io.id_import_order, io.total_price, a.name, a.phone,a.ip_address;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBillDetailsByUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBillDetailsByUser`(IN `p_user_id` INT)
BEGIN
    SELECT 
        bi.id_bill,
        bi.create_at,
        bi.status,
        bi.price AS total_price,
        a.name AS user_name,
        a.phone AS address_phone,
        a.ip_address,
        d.name AS district_name,
        ci.name AS city_name,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_name', p.name,
                'image', p.image,
                'brand_name', b.name,
                'cart_quantity', c.quantity,
                'id_cart', c.id_cart,
                'id_billdetail', bd.id_billdetail
            )
        ) AS products
    FROM 
        bill bi
        INNER JOIN bill_detail bd ON bi.id_bill = bd.id_bill
        INNER JOIN cart c ON c.id_cart = bd.id_cart
        INNER JOIN product p ON p.id_product = c.id_product
        INNER JOIN brand b ON b.id_brand = p.id_brand
        INNER JOIN bill_address ba ON ba.id_bill = bi.id_bill
        INNER JOIN user_address ua ON ua.id_useraddress = ba.id_useraddress
        INNER JOIN address a ON a.id_address = ua.id_address
        LEFT JOIN district d ON d.id_district = a.id_district
        LEFT JOIN city ci ON ci.id_city = d.id_city
    WHERE 
        bi.id_user = p_user_id
    GROUP BY 
        bi.id_bill;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetLatestPendingBill` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLatestPendingBill`(IN `p_id_user` INT, OUT `p_id_bill` INT)
BEGIN
    -- Tìm kiếm id_bill mới nhất của user với cột tttt là 'Pending'
    SELECT id_bill
    INTO p_id_bill
    FROM bill
    WHERE id_user = p_id_user
      AND tttt = 'Pending'
    ORDER BY create_at DESC
    LIMIT 1;

    -- Nếu không tìm thấy bill nào, trả về NULL
    IF p_id_bill IS NULL THEN
        SET p_id_bill = 0;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetManufacturerInfo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetManufacturerInfo`(IN `p_id_manufacturer` INT)
BEGIN
    IF p_id_manufacturer = 0 THEN
        -- Lấy toàn bộ nhà sản xuất và thông tin liên quan
        SELECT 
            m.id_manufacturer,
            a.name,
            a.phone,
            a.ip_address,
            c.id_city,
            c.name AS city_name,
            d.name AS district_name
        FROM 
            manufacturer m
        LEFT JOIN address a ON m.id_address = a.id_address
        LEFT JOIN district d ON a.id_district = d.id_district
        LEFT JOIN city c ON d.id_city = c.id_city;
    ELSE
        -- Lấy thông tin của một nhà sản xuất cụ thể
        SELECT 
            m.id_manufacturer,
            a.name AS address_name,
            a.phone AS address_phone,
            a.ip_address,
            c.id_city,
            c.name AS city_name,
            d.name AS district_name
        FROM 
            manufacturer m
        LEFT JOIN address a ON m.id_address = a.id_address
        LEFT JOIN district d ON a.id_district = d.id_district
        LEFT JOIN city c ON d.id_city = c.id_city
        WHERE 
            m.id_manufacturer = p_id_manufacturer;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserAddresses` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserAddresses`(IN `p_id_user` INT)
BEGIN
    SELECT 
        a.id_address,
        a.ip_address,  -- Thêm cột ip_address
        a.name AS address_name,
        a.phone AS address_phone,
        d.name AS district_name,
        c.name AS city_name
    FROM 
        user_address ua
    JOIN 
        address a ON ua.id_address = a.id_address
    JOIN 
        district d ON a.id_district = d.id_district
    JOIN 
        city c ON d.id_city = c.id_city
    WHERE 
        ua.id_user = p_id_user;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserInformation` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserInformation`(IN `user_account` VARCHAR(50), IN `user_password` VARCHAR(50))
BEGIN
    SELECT 
        u.id_user, 
        u.account, 
        u.name, 
        u.gender,
        u.email,  
        r.name AS role_name
    FROM 
        user AS u
    JOIN 
        role AS r ON u.id_role = r.id_role
    JOIN 
        authority AS a ON r.id_role = a.id_role
    WHERE 
        u.account = user_account
        AND u.password = user_password;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `new_procedure` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `new_procedure`()
BEGIN
	SELECT 
    io.id_import_order AS import_order_id, -- Mã hóa đơn nhập
    io.total_price AS import_order_total_price, -- Tổng giá trị hóa đơn nhập
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'product_image', JSON_UNQUOTE(JSON_EXTRACT(p.image, '$[0]')), -- Hình ảnh đầu tiên của sản phẩm
            'product_name', p.name, -- Tên sản phẩm
            'brand_name', b.name, -- Tên thương hiệu
            'type_name', pt.name, -- Loại sản phẩm
            'quantity', iod.quantity, -- Số lượng
            'unit_price', iod.unit_price, -- Giá mỗi sản phẩm
            'total_price', iod.total_price -- Tổng giá sản phẩm
        )
    ) AS products, -- Danh sách sản phẩm trong hóa đơn
    a.name AS address_name, -- Tên địa chỉ
    a.phone AS phone -- Số điện thoại
FROM import_order io
JOIN import_order_detail iod ON io.id_import_order = iod.id_import_order
JOIN product p ON iod.id_product = p.id_product
JOIN brand b ON p.id_brand = b.id_brand
JOIN product_type pt ON p.id_type = pt.id_type
JOIN manufacturer m ON io.id_manufacturer = m.id_manufacturer
JOIN address a ON m.id_address = a.id_address
JOIN district d ON a.id_district = d.id_district
JOIN city c ON d.id_city = c.id_city
GROUP BY io.id_import_order, io.total_price, a.name, a.phone;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateCart` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateCart`(IN `p_id_user` INT, IN `p_id_cart` INT, IN `p_quantity` INT)
BEGIN
    DECLARE product_price DECIMAL(10, 2);

    -- Kiểm tra nếu quantity không hợp lệ
    IF p_quantity < 1 OR p_quantity > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng không hợp lệ. Phải nằm trong khoảng từ 1 đến 50.';
    END IF;

    -- Kiểm tra tính hợp lệ của id_user đối với id_cart
    IF NOT EXISTS (
        SELECT 1 
        FROM cart 
        WHERE id_cart = p_id_cart AND id_user = p_id_user AND addbill = 0
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Giỏ hàng không hợp lệ hoặc không thuộc người dùng này.';
    END IF;

    -- Lấy giá của sản phẩm
    SELECT p.price INTO product_price
    FROM cart c
    JOIN product p ON c.id_product = p.id_product
    WHERE c.id_cart = p_id_cart;

    -- Nếu quantity = 0: Xóa dòng cart
    IF p_quantity = 0 THEN
        DELETE FROM cart WHERE id_cart = p_id_cart;
    ELSE
        -- Trường hợp quantity > 0: Cập nhật số lượng và giá
        UPDATE cart
        SET quantity = p_quantity,
            price = p_quantity * product_price
        WHERE id_cart = p_id_cart;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-03  1:38:30
