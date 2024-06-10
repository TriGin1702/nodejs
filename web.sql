-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 09, 2024 lúc 09:09 PM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `web`
--

DELIMITER $$
--
-- Thủ tục
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddComment` (IN `id_kh` INT, IN `id_product` INT, IN `description` VARCHAR(500), IN `id_rep` INT)  BEGIN
    -- Khai báo biến để lưu trữ id_cmt
    DECLARE last_insert_id INT;

    -- Kiểm tra xem id_rep đã được truyền giá trị hay không
    IF id_rep IS NULL THEN
        -- Nếu không có giá trị, sử dụng NULL mặc định
        INSERT INTO comment (id_kh, id_product, description, date) 
        VALUES (id_kh, id_product, description, CURRENT_DATE());

        -- Lấy id_cmt của hàng vừa được chèn
        SET last_insert_id = LAST_INSERT_ID();
    ELSE
        -- Nếu có giá trị, sử dụng giá trị đó
        INSERT INTO comment (id_kh, id_product, description, date, id_rep) 
        VALUES (id_kh, id_product, description, CURRENT_DATE(), id_rep);

        -- Lấy id_cmt của hàng vừa được chèn
        SET last_insert_id = LAST_INSERT_ID();
    END IF;

    -- Trả về id_cmt
    SELECT last_insert_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddProductToCart` (IN `customerId` INT, IN `productId` INT)  BEGIN
    DECLARE existingBillId INT;
    DECLARE existingPrice INT;

    -- Kiểm tra xem sản phẩm đã có trong hóa đơn của khách hàng chưa
    SELECT id_dh, price INTO existingBillId, existingPrice
    FROM bill
    WHERE id_kh = customerId AND id_product = productId AND tttt = 0;

    IF existingBillId IS NOT NULL THEN
        -- Nếu sản phẩm đã có trong hóa đơn và chưa thanh toán
        -- Thì cập nhật số lượng và giá mới
        UPDATE bill
        SET quantity = quantity + 1,
            price = (SELECT gia FROM product WHERE id_product = productId) * (quantity + 1)
        WHERE id_dh = existingBillId;

        SELECT 1 AS success;
    ELSE
        -- Nếu sản phẩm chưa có trong hóa đơn hoặc đã được thanh toán
        -- Tạo một đơn hàng mới
        INSERT INTO bill (id_kh, id_product, quantity, date, price, tttt)
        VALUES (customerId, productId, 1, CURRENT_DATE(), (SELECT gia FROM product WHERE id_product = productId), 0);

        SELECT 1 AS success;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteComment` (IN `id_cmt_in` INT, IN `id_kh_in` INT)  BEGIN
    -- Xóa các bình luận có id_rep trùng với id_cmt và thuộc khách hàng có id_kh
    DELETE FROM comment WHERE id_rep = id_cmt_in;

    -- Xóa bình luận gốc có id_cmt, id_kh trùng với id_cmt, id_kh
    DELETE FROM comment WHERE id_cmt = id_cmt_in AND id_kh = id_kh_in;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBillDetailsByUserId` (IN `userId` INT)  BEGIN
    SELECT ba.id_dh, ua.id_ad, p.brands, p.name AS product_name, p.image,
           b.quantity, ba.date AS bill_date, b.price,
           ua.name AS user_name, ua.phone AS user_phone,
           a.address, a.city, a.district
    FROM bill_address ba
    INNER JOIN bill b ON ba.id_dh = b.id_dh
    INNER JOIN product p ON b.id_product = p.id_product
    INNER JOIN user_address ua ON ba.id_ad = ua.id_ad
    INNER JOIN address a ON ua.id_ad = a.id_ad
    WHERE ua.id_kh = userId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCustomerCartDetails` (IN `userId` INT)  BEGIN
    -- Lấy thông tin các mục trong giỏ hàng của người dùng bao gồm cả hình ảnh, ngày và id_dh
    SELECT b.id_dh, p.brands, p.name, b.quantity, b.price, p.image, b.date, p.id_product
    FROM bill b
    INNER JOIN product p ON b.id_product = p.id_product
    WHERE b.id_kh = userId AND b.tttt = 0;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertOrUpdateAddressAndSetBillStatus` (IN `userId` INT, IN `productId` INT, IN `city` VARCHAR(50), IN `district` VARCHAR(50), IN `addr` VARCHAR(70), IN `customerName` VARCHAR(100), IN `phoneNumber` VARCHAR(20))  BEGIN
    DECLARE addressId INT;
    DECLARE existingAddressId INT;
    DECLARE existingBillId INT;

    -- Kiểm tra xem địa chỉ của khách hàng đã tồn tại và khớp với dữ liệu đã lưu chưa
    SELECT ua.id_ad INTO existingAddressId
    FROM user_address ua
    INNER JOIN address a ON ua.id_ad = a.id_ad
    WHERE ua.id_kh = userId AND a.city = city AND a.district = district AND a.address = addr;

    -- Kiểm tra xem sản phẩm đã có trong hóa đơn của khách hàng chưa
    SELECT id_dh INTO existingBillId
    FROM bill
    WHERE id_kh = userId AND id_product = productId AND tttt = 0;

    IF existingAddressId IS NOT NULL THEN
        -- Nếu địa chỉ đã tồn tại và khớp với dữ liệu đã lưu
        -- Cập nhật cột tttt của hóa đơn thành true
        IF existingBillId IS NOT NULL THEN
            UPDATE bill
            SET tttt = 1
            WHERE id_kh = userId AND id_product = productId AND tttt = 0;
        END IF;

        SELECT 1 AS success;
    ELSE
        -- Nếu địa chỉ chưa tồn tại hoặc không khớp với dữ liệu đã lưu
        -- Thực hiện chèn địa chỉ mới và cập nhật cột tttt của hóa đơn
        -- Chèn dữ liệu về địa chỉ cho khách hàng
        INSERT INTO address (city, district, address)
        VALUES (city, district, addr);

        -- Lấy id của địa chỉ mới chèn vào
        SELECT LAST_INSERT_ID() INTO addressId;

        -- Chèn dữ liệu về địa chỉ của khách hàng vào bảng user_address
        INSERT INTO user_address (id_kh, id_ad, date, name, phone)
        VALUES (userId, addressId, CURRENT_DATE(), customerName, phoneNumber);

        -- Cập nhật cột tttt của hóa đơn thành true
        IF existingBillId IS NOT NULL THEN
            UPDATE bill
            SET tttt = 1
            WHERE id_kh = userId AND id_product = productId AND tttt = 0;
            INSERT INTO bill_address (id_dh, id_kh, id_ad, date, ttnh)
            VALUES (existingBillId, userId, addressId, CURRENT_DATE(), 0);
        END IF;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateAddressAndUserAddressWithDate` (IN `p_user_id` INT, IN `p_id_ad` INT, IN `p_firstName` VARCHAR(255), IN `p_phoneNumber` VARCHAR(20), IN `p_selectedCity` VARCHAR(100), IN `p_selectedDistrict` VARCHAR(100), IN `p_address` VARCHAR(255))  BEGIN
-- Cập nhật thông tin người dùng - địa chỉ và ngày mới nhất
    UPDATE user_address
    SET date = CURRENT_DATE(),
    	name = p_firstName,
        phone = p_phoneNumber
    WHERE id_ad = p_id_ad AND id_kh = p_user_id;
    -- Cập nhật thông tin địa chỉ
    UPDATE address
    SET address = p_address,
        city = p_selectedCity,
        district = p_selectedDistrict
    WHERE id_ad = p_id_ad;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateQuantityAndPrice` (IN `p_product_id` INT, IN `p_user_id` INT, IN `p_quantity` INT)  BEGIN
    DECLARE v_price DECIMAL(10, 2);

    -- Lấy giá từ bảng product
    SELECT gia INTO v_price
    FROM product
    WHERE id_product = p_product_id;

    -- Cập nhật quantity và price trong bảng bill
    UPDATE bill
    SET quantity = p_quantity,
        price = v_price * p_quantity
    WHERE id_product = p_product_id AND id_kh = p_user_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `address`
--

CREATE TABLE `address` (
  `id_ad` int(11) NOT NULL,
  `city` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `district` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(70) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `address`
--

INSERT INTO `address` (`id_ad`, `city`, `district`, `address`) VALUES
(15, 'Hồ Chí Minh', 'Quận 12', '21312'),
(16, 'Hồ Chí Minh', 'Quận 1', '201A1'),
(18, 'Hồ Chí Minh', 'Quận 1', '20'),
(19, 'Hồ Chí Minh', 'Quận 1', ''),
(20, 'Hồ Chí Minh', 'Quận 1', '12A'),
(25, 'Quảng Ngãi', 'Quận 12', '208/A1'),
(26, 'Hà Nội', 'Quận 1', '201A3'),
(27, 'Hồ Chí Minh', 'Quận 10', '123A2'),
(28, 'Hồ Chí Minh', 'Quận 12', '2A1'),
(29, 'Hồ Chí Minh', 'Quận 1', '2a2'),
(30, 'Hồ Chí Minh', 'Quận 1', '20A');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bill`
--

CREATE TABLE `bill` (
  `id_dh` int(11) NOT NULL,
  `id_kh` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date` date NOT NULL,
  `price` int(11) NOT NULL,
  `tttt` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bill`
--

INSERT INTO `bill` (`id_dh`, `id_kh`, `id_product`, `quantity`, `date`, `price`, `tttt`) VALUES
(1, 1, 1, 2, '2024-03-26', 22000000, 1),
(2, 1, 2, 5, '2024-03-26', 22600000, 1),
(3, 1, 3, 5, '2024-03-26', 7250000, 0),
(4, 1, 4, 3, '2024-03-26', 8000000, 1),
(22, 1, 2, 5, '2024-04-07', 22600000, 1),
(23, 1, 5, 2, '2024-04-07', 1400000, 1),
(24, 1, 6, 1, '2024-04-08', 5000000, 1),
(25, 1, 2, 5, '2024-04-09', 22600000, 0),
(41, 24, 4, 1, '2024-04-23', 4500000, 1),
(43, 28, 2, 50, '2024-05-02', 226000000, 1),
(44, 28, 3, 50, '2024-05-02', 72500000, 0),
(45, 28, 2, 5, '2024-05-02', 27120000, 0),
(46, 28, 1, 2, '2024-05-02', 33000000, 0),
(47, 24, 1, 3, '2024-05-05', 44000000, 1),
(48, 24, 7, 2, '2024-05-05', 4000000, 1),
(54, 24, 2, 2, '2024-05-12', 9040000, 1),
(55, 24, 7, 1, '2024-05-12', 2000000, 1),
(57, 24, 6, 2, '2024-05-12', 15000000, 1),
(58, 2, 3, 1, '2024-06-02', 456000, 0),
(59, 24, 2, 2, '2024-06-05', 9040000, 0),
(60, 24, 4, 3, '2024-06-05', 18000000, 0),
(61, 24, 3, 1, '2024-06-05', 456000, 0);

--
-- Bẫy `bill`
--
DELIMITER $$
CREATE TRIGGER `check_quantity_before_update` BEFORE UPDATE ON `bill` FOR EACH ROW BEGIN
    DECLARE totalQuantity INT;
    
    -- Tính tổng số lượng sau khi cập nhật
    SET totalQuantity = NEW.quantity;

    -- Kiểm tra xem số lượng mới sau khi cập nhật có nằm trong khoảng từ 1 đến 50 không
    IF totalQuantity <= 0 OR totalQuantity > 50 THEN
        -- Nếu số lượng không nằm trong khoảng từ 1 đến 50, hủy bỏ cập nhật và thông báo lỗi
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số lượng sản phẩm trong hóa đơn phải nằm trong khoảng từ 1 đến 50.';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `limit_quantity_per_bill` BEFORE INSERT ON `bill` FOR EACH ROW BEGIN
    DECLARE productQuantity INT;
    DECLARE totalQuantity INT;

    -- Lấy số lượng sản phẩm hiện có trong hóa đơn
    SELECT quantity INTO productQuantity
    FROM bill
    WHERE id_product = NEW.id_product AND id_dh = NEW.id_dh and tttt = 0;

    IF productQuantity IS NOT NULL THEN
        -- Tính tổng số lượng sau khi thêm số lượng mới
        SET totalQuantity = productQuantity + NEW.quantity;

        -- Nếu tổng số lượng vượt quá 50, từ chối thêm số lượng mới
        IF totalQuantity > 50 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Số lượng sản phẩm trong hóa đơn vượt quá giới hạn (50).';
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bill_address`
--

CREATE TABLE `bill_address` (
  `id_dh` int(11) NOT NULL,
  `id_kh` int(11) NOT NULL,
  `id_ad` int(11) NOT NULL,
  `date` date NOT NULL,
  `ttnh` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bill_address`
--

INSERT INTO `bill_address` (`id_dh`, `id_kh`, `id_ad`, `date`, `ttnh`) VALUES
(1, 1, 16, '2024-04-08', 0),
(2, 1, 15, '2024-03-31', 0),
(4, 1, 20, '2024-04-09', 0),
(23, 1, 19, '2024-04-09', 0),
(24, 1, 18, '2024-04-09', 0),
(41, 24, 26, '2024-05-05', 0),
(43, 28, 25, '2024-05-02', 0),
(47, 24, 28, '2024-05-12', 0),
(48, 24, 27, '2024-05-05', 0),
(54, 24, 29, '2024-05-12', 0),
(55, 24, 30, '2024-05-12', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brand`
--

CREATE TABLE `brand` (
  `brand_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `sdt` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `brand`
--

INSERT INTO `brand` (`brand_id`, `name`, `sdt`, `email`) VALUES
('anpha', 'anpha', '0987654979', 'taiyeu99@gmail.com'),
('Bandai Namco.', 'Bandai Namco.', '0987364365', 'tai99@gmail.com'),
('GoodSmile', 'Good Smile', '0987369367', 'taiyeu99@gmail.com'),
('MegaHouse', 'MegaHouse', '0987361234', 'ptk95@gmail.com');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comment`
--

CREATE TABLE `comment` (
  `id_cmt` int(11) NOT NULL,
  `id_kh` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `id_rep` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `comment`
--

INSERT INTO `comment` (`id_cmt`, `id_kh`, `id_product`, `description`, `date`, `id_rep`) VALUES
(0, 24, 3, 'đồn như lời', '2024-06-07', NULL),
(83, 2, 2, 'cc gì', '2024-06-09', NULL),
(85, 2, 2, 'sss', '2024-06-09', NULL),
(86, 2, 2, 'sssssaaaa', '2024-06-09', NULL),
(116, 2, 3, 'cc', '2024-06-10', 0),
(117, 2, 3, 'cc', '2024-06-10', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer`
--

CREATE TABLE `customer` (
  `id_kh` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `gender` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `age` int(11) NOT NULL,
  `account` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `customer`
--

INSERT INTO `customer` (`id_kh`, `name`, `gender`, `age`, `account`, `password`) VALUES
(1, 'KingKong', 'Female', 10, 'kingkong', 'kingkong1702'),
(2, 'Tài', 'female', 20, 'tai', 'tai123'),
(22, 'king', 'male', 18, 'king456', 'king456'),
(23, 'Quang Vinh', 'male', 22, 'vinhle', 'vinh123456'),
(24, 'Hưng', 'male', 25, 'hung123', 'hung123'),
(25, 'hung', 'male', 18, 'hung23', 'hung23'),
(27, 'Quang Vinh', 'male', 22, 'vinhle2', 'vinh123456'),
(28, 'Minh', 'male', 15, 'vuong123', 'vuong123');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id_product` int(11) NOT NULL,
  `brands` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `gia` int(11) NOT NULL,
  `image` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id_product`, `brands`, `name`, `description`, `type`, `gia`, `image`) VALUES
(1, 'anpha', 'Miku version 2', 'mô hình đẹp và số lượng có hạn', 'normal', 11000000, '1712465386287-gg2.png'),
(2, 'anpha', 'POP UP Yukino Yukinoshita 2', 'Chất liệu: ABS&PVC, Kích thước: Cao 24cm, rộng 24cm, sâu 23cmSản phẩm dự kiến sẽ được ra mắt vào tháng 3 năm 2022Các bạn quan tâm tới bé nhanh tay ibox cho shop nha Chất liệu: ABS&PVC, Kích thước: Cao 24cm, rộng 24cm, sâu 23cm,Sản phẩm dự kiến sẽ được ra mắt vào tháng 6 năm 2022', 'normal', 4520000, '1714916430063-yuiandyukino.jpg'),
(3, 'anpha', 'black miku', 'sản phẩm đẹp, chi tiết, nhân vật đang được yêu thích', 'normal', 456000, '1714921432581-blackmiku.jpg'),
(4, 'GoodSmile', 'EMILIA NEON CITY VER (RE:ZERO)', 'Chất liệu: ABS&PVC, Kích thước: Cao 24cm, rộng 24cm, sâu 23cmSản phẩm dự kiến sẽ được ra mắt vào tháng 3 năm 2022Các bạn quan tâm tới bé nhanh tay ibox cho shop nha Chất liệu: ABS&PVC, Kích thước: Cao 24cm, rộng 24cm, sâu 23cm,Sản phẩm dự kiến sẽ được ra mắt vào tháng 6 năm 2022', 'normal', 4500000, '1689780759882-emilia.jpg'),
(5, 'GoodSmile', 'Kikyo', 'mô hình đẹp có sức hút mãnh liệt và có giới hạn', 'good', 700000, '1712427271115-kikyo.jpg'),
(6, 'GoodSmile', 'POP UP Yui Yuigahama', 'My Teen Romantic Comedy SNAFU 3\r\nHeight: 160MM, Sản phẩm dự kiến sẽ được ra mắt vào tháng 8 năm 2021 Các bạn quan tâm tơi sản phẩm có thể ibox cho shop để biết thêm nhiều thông tin của sản phẩm', 'good', 5000000, '1689780759882-yui.jpg'),
(7, 'GoodSmile', 'SAKURA YAE KIRA NO GENSOU VER', 'Tỉ lệ: 1/7, Chiều cao: 380mm, Chất liệu: PVC ABS,Sản phẩm dự kiến phát hành vào tháng 3 năm 2022, Các bạn quan tâm tới bé nhên nhanh tay ibox cho shop nha', 'good', 2000000, '1689780759882-gg3.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_address`
--

CREATE TABLE `user_address` (
  `id_kh` int(11) NOT NULL,
  `id_ad` int(11) NOT NULL,
  `date` date NOT NULL,
  `name` varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_address`
--

INSERT INTO `user_address` (`id_kh`, `id_ad`, `date`, `name`, `phone`) VALUES
(1, 15, '2024-04-09', 'Trí', '0948500165'),
(1, 16, '2024-04-08', 'uchiha', '1523456789'),
(1, 18, '2024-04-09', 'heo', '098785165'),
(1, 19, '2024-04-09', '', ''),
(1, 20, '2024-04-09', 'Tri', '1234567890'),
(24, 26, '2024-06-06', 'hưng lzz', '0945551659'),
(24, 27, '2024-06-06', 'hjhj', '1234567890'),
(24, 28, '2024-05-12', 'wefewf', '1234567891'),
(24, 29, '2024-05-12', 'df', '4567891230'),
(24, 30, '2024-05-12', 'promise', '7894561235'),
(28, 25, '2024-05-02', 'vuong', '0948500165');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id_ad`);

--
-- Chỉ mục cho bảng `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`id_dh`),
  ADD UNIQUE KEY `id_dh` (`id_dh`),
  ADD KEY `FK_KH` (`id_kh`),
  ADD KEY `FK_PRODUCT` (`id_product`);

--
-- Chỉ mục cho bảng `bill_address`
--
ALTER TABLE `bill_address`
  ADD PRIMARY KEY (`id_dh`,`id_kh`,`id_ad`),
  ADD KEY `FK_USER_ADDRESS` (`id_ad`,`id_kh`);

--
-- Chỉ mục cho bảng `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`brand_id`);

--
-- Chỉ mục cho bảng `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id_cmt`),
  ADD KEY `FK_CMTSP` (`id_product`),
  ADD KEY `FK_CMTKH` (`id_kh`),
  ADD KEY `FK_REPCMT` (`id_rep`);

--
-- Chỉ mục cho bảng `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id_kh`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id_product`);

--
-- Chỉ mục cho bảng `user_address`
--
ALTER TABLE `user_address`
  ADD PRIMARY KEY (`id_kh`,`id_ad`),
  ADD KEY `FK_AD` (`id_ad`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `address`
--
ALTER TABLE `address`
  MODIFY `id_ad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `bill`
--
ALTER TABLE `bill`
  MODIFY `id_dh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT cho bảng `comment`
--
ALTER TABLE `comment`
  MODIFY `id_cmt` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT cho bảng `customer`
--
ALTER TABLE `customer`
  MODIFY `id_kh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `FK_KH` FOREIGN KEY (`id_kh`) REFERENCES `customer` (`id_kh`),
  ADD CONSTRAINT `FK_PRODUCT` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`);

--
-- Các ràng buộc cho bảng `bill_address`
--
ALTER TABLE `bill_address`
  ADD CONSTRAINT `FK_BILL` FOREIGN KEY (`id_dh`) REFERENCES `bill` (`id_dh`),
  ADD CONSTRAINT `FK_USER_ADDRESS` FOREIGN KEY (`id_ad`,`id_kh`) REFERENCES `user_address` (`id_ad`, `id_kh`);

--
-- Các ràng buộc cho bảng `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FK_CMTKH` FOREIGN KEY (`id_kh`) REFERENCES `customer` (`id_kh`),
  ADD CONSTRAINT `FK_CMTSP` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`),
  ADD CONSTRAINT `FK_REPCMT` FOREIGN KEY (`id_rep`) REFERENCES `comment` (`id_cmt`);

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`brands`) REFERENCES `brand` (`brand_id`);

--
-- Các ràng buộc cho bảng `user_address`
--
ALTER TABLE `user_address`
  ADD CONSTRAINT `FK_AD` FOREIGN KEY (`id_ad`) REFERENCES `address` (`id_ad`),
  ADD CONSTRAINT `FK_USER` FOREIGN KEY (`id_kh`) REFERENCES `customer` (`id_kh`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
