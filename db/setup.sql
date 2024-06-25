DROP DATABASE movie_collection;
CREATE DATABASE IF NOT EXISTS movie_collection;

USE movie_collection;
CREATE USER IF NOT EXISTS 'webuser'@'localhost' IDENTIFIED BY 'webprog44';
GRANT ALL PRIVILEGES ON * . * TO 'webuser'@'localhost';