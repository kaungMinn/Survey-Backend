CREATE TABLE `surveys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`company` varchar(255) NOT NULL,
	`designation` varchar(255) NOT NULL,
	`token` varchar(6) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `surveys_id` PRIMARY KEY(`id`),
	CONSTRAINT `surveys_token_unique` UNIQUE(`token`)
);
