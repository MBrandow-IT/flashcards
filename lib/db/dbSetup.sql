CREATE DATABASE db_GameFlashCards;
GO
CREATE LOGIN admin WITH PASSWORD = '123456'

USE db_GameFlashCards;      

CREATE USER admin FOR LOGIN admin;
ALTER ROLE db_owner ADD MEMBER admin;

-- Go too models and create the tables.