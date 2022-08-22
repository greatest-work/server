-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2022-08-21 23:35:21
-- 服务器版本： 5.6.50-log
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blog`
--

-- --------------------------------------------------------

--
-- 表的结构 `ARTICLE`
--

CREATE TABLE IF NOT EXISTS `ARTICLE` (
  `id` varchar(200) DEFAULT NULL,
  `title` text NOT NULL COMMENT '标题',
  `createTime` timestamp NOT NULL,
  `updateTime` timestamp NOT NULL,
  `content` text NOT NULL,
  `userId` varchar(50) DEFAULT NULL,
  `siteId` varchar(50) NOT NULL,
  `tags` text NOT NULL,
  `status` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='id';

-- --------------------------------------------------------

--
-- 表的结构 `BLOG_CONFIG`
--

CREATE TABLE IF NOT EXISTS `BLOG_CONFIG` (
  `id` text NOT NULL,
  `field` text NOT NULL,
  `value` text NOT NULL,
  `detail` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------


-- --------------------------------------------------------

--
-- 表的结构 `COMMAND`
--

CREATE TABLE IF NOT EXISTS `COMMAND` (
  `name` text NOT NULL,
  `id` text NOT NULL,
  `value` text NOT NULL,
  `detail` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `LOG`
--

CREATE TABLE IF NOT EXISTS `LOG` (
  `userId` varchar(50) NOT NULL,
  `time` timestamp NOT NULL,
  `sentence` varchar(500) NOT NULL,
  `ip` varchar(100) NOT NULL,
  `reslut` int(5) NOT NULL DEFAULT '200',
  `content` varchar(1000) NOT NULL,
  `id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `LOG`
--

-------------------------------------------------------

--
-- 表的结构 `ROOT`
--

CREATE TABLE IF NOT EXISTS `ROOT` (
  `roleName` text NOT NULL,
  `import` tinyint(10) NOT NULL DEFAULT '0',
  `download` tinyint(10) NOT NULL DEFAULT '0',
  `increase` tinyint(10) NOT NULL DEFAULT '0',
  `edit` tinyint(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `SITE`
--

CREATE TABLE IF NOT EXISTS `SITE` (
  `name` text NOT NULL,
  `description` varchar(200) NOT NULL,
  `logo` varchar(1000) NOT NULL DEFAULT 'https://avatars.githubusercontent.com/u/108932724?s=400&u=b10bf7bb6984b255e81dde608745594edd0266c5&v=4',
  `id` varchar(50) NOT NULL,
  `status` int(1) NOT NULL,
  `theme` varchar(50) NOT NULL,
  `path` text NOT NULL,
  `createTime` timestamp NOT NULL,
  `updateTime` timestamp NOT NULL,
  `siteLink` varchar(500) NOT NULL COMMENT '站点链接'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `USER`
--

CREATE TABLE IF NOT EXISTS `USER` (
  `id` varchar(300) NOT NULL COMMENT '用户id',
  `username` text NOT NULL COMMENT '用户昵称',
  `email` text NOT NULL COMMENT '邮箱',
  `role` text NOT NULL COMMENT '角色',
  `password` varchar(50) NOT NULL,
  `nickname` varchar(200) NOT NULL,
  `createTime` timestamp NOT NULL,
  `updateTime` timestamp NOT NULL,
  `authorizerId` varchar(50) NOT NULL DEFAULT 'root'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

-----------------------------------------------------

--
-- 表的结构 `_mysql_session_store`
--

CREATE TABLE IF NOT EXISTS `_mysql_session_store` (
  `id` varchar(255) NOT NULL,
  `expires` bigint(20) DEFAULT NULL,
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `SITE`
--
ALTER TABLE `SITE`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `_mysql_session_store`
--
ALTER TABLE `_mysql_session_store`
  ADD PRIMARY KEY (`id`);
