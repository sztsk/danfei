-- phpMyAdmin SQL Dump
-- version 3.5.3
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2014 年 09 月 16 日 11:53
-- 服务器版本: 5.0.26-log
-- PHP 版本: 5.3.6

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
-- 表的结构 `tb_events`
--

DROP TABLE IF EXISTS `tb_events`;
CREATE TABLE IF NOT EXISTS `tb_events` (
  `events_id` int(11) NOT NULL auto_increment COMMENT '活动id',
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
  PRIMARY KEY  (`events_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `tb_jobs`
--

DROP TABLE IF EXISTS `tb_jobs`;
CREATE TABLE IF NOT EXISTS `tb_jobs` (
  `jobs_id` int(11) NOT NULL auto_increment COMMENT '工作ID',
  `jobs_add_time` datetime NOT NULL COMMENT '添加时间',
  `jobs_company_id` int(11) NOT NULL COMMENT '公司ID',
  `jobs_city` varchar(10) NOT NULL COMMENT '工作城市',
  `jobs_title` varchar(200) NOT NULL COMMENT '工作职位',
  `jobs_salary_start` tinyint(4) NOT NULL COMMENT '薪酬范围-最低',
  `jobs_salary_end` tinyint(4) NOT NULL COMMENT '薪酬范围-最高',
  `jobs_intro` text NOT NULL COMMENT '一句话介绍',
  `jobs_experience` int(11) NOT NULL COMMENT '最低工作经验',
  `jobs_education` int(11) NOT NULL COMMENT '最低学历',
  `jobs_users_num` int(11) NOT NULL COMMENT '该职位的招聘人数',
  `jobs_detail` text NOT NULL COMMENT '职位详细信息',
  `jobs_zan` int(11) NOT NULL COMMENT '多少个赞',
  PRIMARY KEY  (`jobs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `tb_users`
--

DROP TABLE IF EXISTS `tb_users`;
CREATE TABLE IF NOT EXISTS `tb_users` (
  `user_id` int(11) NOT NULL auto_increment COMMENT '用户id',
  `user_name` varchar(200) NOT NULL COMMENT '用户名',
  `user_password` varchar(35) NOT NULL COMMENT '2次md5',
  `user_power` varchar(200) NOT NULL COMMENT '用户权限',
  `user_email` int(11) NOT NULL COMMENT '用户邮箱',
  `user_jobs_time` int(11) NOT NULL COMMENT '工作年限',
  `user_education` tinyint(4) NOT NULL COMMENT '学历',
  `user_city` varchar(200) NOT NULL COMMENT '城市',
  `user_title` varchar(200) NOT NULL COMMENT '职位',
  `user_salary` varchar(200) NOT NULL COMMENT '期望薪酬',
  `user_intro` text NOT NULL COMMENT '个人简介',
  `user_time` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '用户加入时间',
  `user_ip` varchar(20) NOT NULL COMMENT '用户注册ip',
  PRIMARY KEY  (`user_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
