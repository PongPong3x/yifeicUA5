

create schema if not exists imagequiz;

drop table if exists imagequiz.customer;
drop table if exists imagequiz.question;
drop table if exists imagequiz.category;
drop table if exists imagequiz.quiz;
drop table if exists imagequiz.quiz_question;
drop table if exists imagequiz.flower;

create table imagequiz.customer
(
	id bigserial primary key,
	name text not null,
	email text not null unique,
	password text not null
);
/*
select * from imagequiz.customer;
insert into imagequiz.customer (name,email,password)
values('Yifei','napicchen@gmail.com','123')
*/
create table imagequiz.question
(
	id int primary key,
	picture text not null,
	choices text not null,
	answer text not null
);
select * from imagequiz.question;

create table imagequiz.category
(
	id int primary key,
	name text not null
);
select * from imagequiz.category;


create table imagequiz.quiz
(
	id int primary key,
	name text not null,
	category_id int not null
);
select * from imagequiz.quiz;



create table imagequiz.quiz_question
(
	quiz_id int primary key,
	question_id int not null
);
select * from imagequiz.quiz_question;


create table imagequiz.flower
(
	id bigserial primary key,
	name text not null,
	picture text not null
);
select * from imagequiz.flower;
