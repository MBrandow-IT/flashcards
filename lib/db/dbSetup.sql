CREATE DATABASE db_GameFlashCards;
GO

-- Create the login. Please change the password to a secure one.
CREATE LOGIN admin WITH PASSWORD = '123456'

USE db_GameFlashCards;      


-- Create the user and add it to the db_owner role.
CREATE USER admin FOR LOGIN admin;
ALTER ROLE db_owner ADD MEMBER admin;

-- Go too models and create the tables.