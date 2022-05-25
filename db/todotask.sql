/*
Navicat MySQL Data Transfer

Source Server         : maoyelin
Source Server Version : 50515
Source Host           : localhost:3306
Source Database       : my_db_01

Target Server Type    : MYSQL
Target Server Version : 50515
File Encoding         : 65001

Date: 2022-05-25 10:02:01
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for todotask
-- ----------------------------
DROP TABLE IF EXISTS `todotask`;
CREATE TABLE `todotask` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `completed` tinyint(255) NOT NULL DEFAULT '0' COMMENT '0  false未完成， 1 true 完成',
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of todotask
-- ----------------------------
INSERT INTO `todotask` VALUES ('48', '1', '吃饭');
INSERT INTO `todotask` VALUES ('49', '0', '睡觉');
INSERT INTO `todotask` VALUES ('56', '0', '打游戏');
INSERT INTO `todotask` VALUES ('57', '0', '玩滑板');
INSERT INTO `todotask` VALUES ('58', '0', '唱歌');
INSERT INTO `todotask` VALUES ('59', '1', '跳舞');
