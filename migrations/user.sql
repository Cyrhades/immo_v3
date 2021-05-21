DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(120) NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Hash',
  `civility` enum('1','2') NOT NULL COMMENT '1=Homme, 2=Femme',
  `lastname` varchar(40) NOT NULL,
  `firstname` varchar(40) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `role` varchar(40) NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime NOT NULL,
  `updated_by` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;