-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2014 年 09 月 17 日 06:41
-- 服务器版本: 5.5.24-log
-- PHP 版本: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `db_danfei`
--

-- --------------------------------------------------------

--
-- 表的结构 `tb_company`
--

DROP TABLE IF EXISTS `tb_company`;
CREATE TABLE IF NOT EXISTS `tb_company` (
  `company_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '公司ID',
  `company_size` varchar(200) CHARACTER SET utf8 DEFAULT NULL COMMENT '公司规模',
  `company_intro` text CHARACTER SET utf8 COMMENT '公司简介',
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `tb_events`
--

DROP TABLE IF EXISTS `tb_events`;
CREATE TABLE IF NOT EXISTS `tb_events` (
  `events_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '活动id',
  `events_title` varchar(255) NOT NULL COMMENT '活动标题',
  `events_user_id` int(11) NOT NULL COMMENT '用户ID',
  `events_organizer` int(11) NOT NULL COMMENT '发起人',
  `events_city` int(11) NOT NULL COMMENT '活动所在城市',
  `events_add_time` datetime NOT NULL COMMENT '活动录入时间',
  `events_start_time` datetime NOT NULL COMMENT '活动时间',
  `events_end_time` datetime NOT NULL COMMENT '报名截止',
  `events_quota` varchar(200) NOT NULL COMMENT '活动名额',
  `events_users_num` int(11) NOT NULL COMMENT '报名人数',
  `events_detail` text NOT NULL COMMENT '活动详情',
  `events_zan` int(11) NOT NULL COMMENT '赞的个数',
  PRIMARY KEY (`events_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `tb_jobs`
--

DROP TABLE IF EXISTS `tb_jobs`;
CREATE TABLE IF NOT EXISTS `tb_jobs` (
  `jobs_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '工作ID',
  `jobs_add_time` datetime NOT NULL COMMENT '添加时间',
  `jobs_company_id` int(11) NOT NULL COMMENT '公司ID',
  `jobs_city` varchar(10) CHARACTER SET utf8 NOT NULL COMMENT '工作城市',
  `jobs_title` varchar(200) CHARACTER SET utf8 NOT NULL COMMENT '工作职位',
  `jobs_salary_start` tinyint(4) NOT NULL COMMENT '薪酬范围-最低',
  `jobs_salary_end` tinyint(4) NOT NULL COMMENT '薪酬范围-最高',
  `jobs_intro` text CHARACTER SET utf8 NOT NULL COMMENT '一句话介绍',
  `jobs_experience` int(11) NOT NULL COMMENT '最低工作经验',
  `jobs_education` int(11) NOT NULL COMMENT '最低学历',
  `jobs_users_num` int(11) NOT NULL COMMENT '该职位的招聘人数',
  `jobs_detail` text CHARACTER SET utf8 NOT NULL COMMENT '职位详细信息',
  `jobs_zan` int(11) NOT NULL COMMENT '多少个赞',
  PRIMARY KEY (`jobs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `tb_users`
--

DROP TABLE IF EXISTS `tb_users`;
CREATE TABLE IF NOT EXISTS `tb_users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `user_name` varchar(200) NOT NULL COMMENT '用户名',
  `user_password` varchar(35) NOT NULL COMMENT '2次md5',
  `user_power` varchar(200) NOT NULL DEFAULT '1' COMMENT '用户权限',
  `user_email` varchar(100) DEFAULT NULL COMMENT '用户邮箱',
  `user_phone` varchar(20) NOT NULL COMMENT '用户手机',
  `user_qq` varchar(15) DEFAULT NULL COMMENT 'QQ',
  `user_jobs_time` int(11) DEFAULT NULL COMMENT '工作年限',
  `user_education` tinyint(4) DEFAULT NULL COMMENT '学历',
  `user_city` varchar(200) DEFAULT NULL COMMENT '城市',
  `user_title` varchar(200) DEFAULT NULL COMMENT '职位',
  `user_salary` varchar(200) DEFAULT NULL COMMENT '期望薪酬',
  `user_intro` text COMMENT '个人简介',
  `user_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '用户加入时间',
  `user_ip` varchar(20) DEFAULT NULL COMMENT '用户注册ip',
  `user_state` tinyint(4) NOT NULL DEFAULT '1' COMMENT '用户状态，1是正常，0是无法使用',
  `user_api_key` varchar(32) NOT NULL COMMENT '调用API的KEY',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `user_phone` (`user_phone`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- 转存表中的数据 `tb_users`
--

INSERT INTO `tb_users` (`user_id`, `user_name`, `user_password`, `user_power`, `user_email`, `user_phone`, `user_qq`, `user_jobs_time`, `user_education`, `user_city`, `user_title`, `user_salary`, `user_intro`, `user_time`, `user_ip`, `user_state`, `user_api_key`) VALUES
(1, 'hugo', 'dadsa', '1', NULL, '13964332', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2014-09-17 05:27:26', NULL, 1, ''),
(2, 'hugo', '$2a$10$09c628fa1832c7bd60d77uKt8q1h', '1', NULL, '139643322', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2014-09-17 06:30:04', NULL, 1, 'b140f6000d9c6df861bfbcfc80a14700'),
(3, 'hugo', '$3LLzdEJWIEXc', '1', NULL, '1396433222', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2014-09-17 06:39:42', NULL, 1, 'a244ad4c855516aedfc3b59520742849'),
(4, 'hugo', '$3LLzdEJWIEXc', '1', NULL, '13964', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2014-09-17 06:40:03', NULL, 1, '64be87d6937f11912a881430a0950023'),
(5, 'hugo', '$3fDJeYrnc1zc', '1', NULL, '139642', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2014-09-17 06:40:33', NULL, 1, '24c58c53d2cdd25c5293a5763dbb8b11'),
(6, 'hugo', '$2a$10$f24c158ebc33d76cc7148ePgL/oE', '1', NULL, '1396420', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2014-09-17 06:41:14', NULL, 1, '5a7ae441af79cdad32b275e41a94e288');

-- --------------------------------------------------------

--
-- 表的结构 `tb_zan`
--

DROP TABLE IF EXISTS `tb_zan`;
CREATE TABLE IF NOT EXISTS `tb_zan` (
  `zan_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '赞id',
  `zan_events_id` int(11) DEFAULT NULL,
  `zan_users_id` int(11) DEFAULT NULL,
  `zan_jobs_id` int(11) DEFAULT NULL,
  `zan_company_id` int(11) DEFAULT NULL,
  `zan_project_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`zan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
