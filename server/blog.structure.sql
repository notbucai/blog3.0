CREATE TABLE `article`  (
  `id` varchar(64) NOT NULL,
  `create_at` timestamp(255) NULL DEFAULT CURRENT_TIMESTAMP(255),
  `update_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `delete_at` timestamp(0) NULL,
  `title` varchar(255) NULL,
  `summary` text NULL,
  `content` longtext NULL,
  `html_content` longtext NULL,
  `cover_url` varchar(255) NULL,
  `status` enum('Verifying','VerifySuccess','VerifyFail') NULL,
  `user_id` varchar(64) NULL,
  `up` enum('Default','Up') NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id`(`id`),
  INDEX `title`(`title`)
);

CREATE TABLE `article_menu`  (
  `id` varchar(64) NOT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `article_id` varchar(64) NULL,
  `title` varchar(255) NULL,
  `type` varchar(255) NULL,
  `target` varchar(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id`(`id`)
);

CREATE TABLE `article_tag`  (
  `id` varchar(64) NOT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `article_id` varchar(64) NULL,
  `tag_id` varchar(64) NULL,
  PRIMARY KEY (`id`, `name`),
  UNIQUE INDEX `map_id`(`id`)
);

CREATE TABLE `tag`  (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `icon` varchar(255) NULL,
  PRIMARY KEY (`id`, `name`),
  UNIQUE INDEX `id`(`id`),
  UNIQUE INDEX `name`(`name`)
);

CREATE TABLE `user`  (
  `id` varchar(64) NOT NULL,
  `create_at` timestamp(255) NULL DEFAULT CURRENT_TIMESTAMP(255),
  `update_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `delete_at` timestamp(0) NULL,
  `activate_at` timestamp(0) NULL,
  `username` varchar(128) NOT NULL,
  `email` varchar(255) NULL,
  `phone` varchar(64) NOT NULL,
  `pass` varchar(255) NULL,
  `status` enum('InActive','Actived','Frozen') NULL,
  `avatar_url` varchar(255) NULL,
  `sex` enum('Male','Female','Unknown') NULL DEFAULT Unknown,
  `job` varchar(255) NULL,
  `company` varchar(255) NULL,
  `introduce` varchar(255) NULL,
  `website` varchar(255) NULL,
  `location` varchar(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id`(`id`)
);

CREATE TABLE `user_link`  (
  `id` varchar(64) NOT NULL,
  `create_at` timestamp(255) NULL DEFAULT CURRENT_TIMESTAMP(255),
  `update_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `type` varchar(255) NOT NULL,
  `user_id` varchar(64) NULL,
  `login_id` int NOT NULL,
  `login_name` varchar(255) NOT NULL,
  `login_avatar` varchar(255) NULL,
  `login_email` varchar(255) NULL,
  `login_openid` varchar(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id`(`id`),
  INDEX `find_user`(`user_id`, `login_id`)
);

ALTER TABLE `article` ADD CONSTRAINT `user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `article_menu` ADD CONSTRAINT `article` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `article_tag` ADD CONSTRAINT `map_article` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `article_tag` ADD CONSTRAINT `map_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `user_link` ADD CONSTRAINT `u_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

