

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

insert into imagequiz.customer (name,email,password)
values('Yifei','napicchen@gmail.com','123');

create table imagequiz.question
(
	id bigserial primary key,
	picture text not null,
	choices text not null,
	answer text not null
);

create table imagequiz.category
(
	id bigserial primary key,
	name text not null
);


create table imagequiz.quiz
(
	id bigserial primary key,
	name text not null,
	category_id int not null
);



create table imagequiz.quiz_question
(
	quiz_id int not null,
	question_id int not null
);


create table imagequiz.flower
(
	id bigserial primary key,
	name text not null,
	picture text not null
);
