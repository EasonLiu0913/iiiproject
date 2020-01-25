-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2020 年 01 月 20 日 17:33
-- 伺服器版本： 10.4.11-MariaDB
-- PHP 版本： 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `comment`
--

-- --------------------------------------------------------

--
-- 資料表結構 `reply_comment`
--

CREATE TABLE `reply_comment` (
  `replyId` int(10) NOT NULL,
  `commentId` int(10) NOT NULL,
  `replyText` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `reply_comment`
--

INSERT INTO `reply_comment` (`replyId`, `commentId`, `replyText`, `created_at`, `updated_at`) VALUES
(1, 1, '謝謝你的留言', '2020-01-20 05:37:55', '2020-01-20 09:05:04'),
(2, 2, 'hello', '2020-01-20 08:19:53', '2020-01-20 08:23:17'),
(3, 10, '感謝你的留言', '2020-01-20 09:32:31', '2020-01-20 09:32:31');

-- --------------------------------------------------------

--
-- 資料表結構 `user_comment`
--

CREATE TABLE `user_comment` (
  `commentId` int(10) NOT NULL,
  `productId` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int(10) NOT NULL,
  `userName` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rank` int(5) NOT NULL,
  `commentText` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `user_comment`
--

INSERT INTO `user_comment` (`commentId`, `productId`, `userId`, `userName`, `rank`, `commentText`, `img`, `created_at`, `updated_at`) VALUES
(1, 'pt001', 1, 'yaling999', 5, '很輕，錶帶觸感也不錯', '', '2020-01-20 02:27:14', '2020-01-20 02:30:45'),
(2, 'pt001', 2, 'rick06', 4, 'CP還蠻高的', 'https://cf.shopee.tw/file/48900a5ed610d3c77feb16e280497d6c', '2020-01-20 02:27:18', '2020-01-20 02:30:54'),
(3, 'pt001', 3, 'jolin719', 5, '包裝很精美東西帶齊來很好看⋯⋯⋯👍👍👍', 'https://cf.shopee.tw/file/6e66205dcc029faf33fb49a87b6af4fb', '2020-01-20 02:31:58', '2020-01-20 02:31:58'),
(4, 'pt001', 4, 'roman1', 5, '很輕  功能攜有小米功能 還可以遙控手機拍照', 'https://cf.shopee.tw/file/9f478dcadf42f7b6eb01433f933cbd65', '2020-01-20 02:32:00', '2020-01-20 02:33:07'),
(5, 'pt001', 5, 'alber7', 3, '跟影片有落差', '', '2020-01-20 04:05:46', '2020-01-20 04:05:46'),
(6, 'pt002', 6, 'kittie', 5, '需要先將手表連接WiFi,並在手表上操作升級，要重複升級約3-4次，直到無軟件可升級，才能綁定garmin pay', 'https://cf.shopee.tw/file/7a4501d190d87f8519bf05b0e1549c6a', '2020-01-20 04:56:07', '2020-01-20 04:56:07'),
(7, 'pt002', 7, 'nitos', 5, '老闆太優惹，幫買家設想周到，詢問回答都很詳細，出貨速度也很快！大推！', 'https://cf.shopee.tw/file/d8ddc454b35991f9e89693b95a4284a6', '2020-01-20 04:56:49', '2020-01-20 04:56:49'),
(8, 'pt002', 8, 'arben', 5, '謝謝老闆很有耐心的幫忙我挑選很漂亮，很喜歡喔！', '', '2020-01-20 04:57:44', '2020-01-20 04:57:44'),
(9, 'pt002', 9, 'elfin008', 5, '錶面不會太大，適合低調的女生戴', '', '2020-01-20 04:58:19', '2020-01-20 04:58:19'),
(10, 'pt003', 10, 'yachi55', 5, '出貨速度快，有問題也可以儘快回覆。\r\n會想要再回購。', 'https://cf.shopee.tw/file/a0b8d964d9ba507de5683ffdd25656c9', '2020-01-20 08:28:04', '2020-01-20 08:28:04'),
(11, 'pt003', 11, 'nio5019', 5, '很快就收到了，目前使用上沒太多問題。只有garmin本身錶面軟體有時候會卡然後重開機，就看新韌體是否能解決了', 'https://cf.shopee.tw/file/157851e0d0f771d0bbe02fd058018a38', '2020-01-20 08:28:59', '2020-01-20 08:28:59'),
(12, 'pt003', 12, 'tim067', 4, '操作起來不是很順、有什麼方法較簡單及快速方式可以交我們ㄧ下嗎？', '', '2020-01-20 08:30:01', '2020-01-20 08:30:01'),
(13, 'pt003', 13, 'Imp01', 5, '較其他賣場便宜，但品質無異，出貨快、回應快', 'https://cf.shopee.tw/file/258915768b1f5820e25404df1693a7f4', '2020-01-20 08:30:44', '2020-01-20 08:30:44');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `reply_comment`
--
ALTER TABLE `reply_comment`
  ADD PRIMARY KEY (`replyId`);

--
-- 資料表索引 `user_comment`
--
ALTER TABLE `user_comment`
  ADD PRIMARY KEY (`commentId`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `reply_comment`
--
ALTER TABLE `reply_comment`
  MODIFY `replyId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_comment`
--
ALTER TABLE `user_comment`
  MODIFY `commentId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
