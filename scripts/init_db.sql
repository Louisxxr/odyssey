-- 表

create table province (
    provinceid int primary key,
    provincename varchar(20) unique not null
) engine = innodb default charset = utf8;

create table city (
    cityid int primary key,
    cityname varchar(20) unique not null,
    provinceid int,
    foreign key(provinceid) references province(provinceid)
) engine = innodb default charset = utf8;

create table user (
    userid int primary key auto_increment,
    username varchar(30) unique not null,
    email varchar(325) unique not null,
    password varchar(50) not null,
    sex char(1),
    birthday date,
    signature varchar(255) not null default '这个家伙很懒，什么都没有留下',
    city int,
    job varchar(20),
    head varchar(50) not null default '/static/img/head/default.jpg',
    foreign key(city) references city(cityid)
) engine = innodb default charset = utf8;

create table question (
    questionid int primary key auto_increment,
    userid int not null,
    title varchar(105) not null,
    description varchar(505) not null default '',
    issue_time datetime not null,
    views int not null default 0,
    foreign key(userid) references user(userid)
) engine = innodb default charset = utf8;

create table answer (
    answerid int primary key auto_increment,
    questionid int not null,
    userid int not null,
    content text not null,
    issue_time datetime not null,
    update_time datetime not null,
    views int not null default 0,
    foreign key(questionid) references question(questionid),
    foreign key(userid) references user(userid)
) engine = innodb default charset = utf8;

create table article (
    articleid int primary key auto_increment,
    userid int not null,
    title varchar(105) not null,
    content text not null,
    issue_time datetime not null,
    update_time datetime not null,
    views int not null default 0,
    foreign key(userid) references user(userid)
) engine = innodb default charset = utf8;

create table follow_question (
    userid int,
    questionid int,
    issue_time datetime not null,
    primary key(userid, questionid),
    foreign key(userid) references user(userid),
    foreign key(questionid) references question(questionid)
) engine = innodb default charset = utf8;

create table like_answer (
    userid int,
    answerid int,
    issue_time datetime not null,
    primary key(userid, answerid),
    foreign key(userid) references user(userid),
    foreign key(answerid) references answer(answerid)
) engine = innodb default charset = utf8;

create table like_article (
    userid int,
    articleid int,
    issue_time datetime not null,
    primary key(userid, articleid),
    foreign key(userid) references user(userid),
    foreign key(articleid) references article(articleid)
) engine = innodb default charset = utf8;

create table comment_to_answer (
    commentid int primary key auto_increment,
    userid int not null,
    answerid int not null,
    content text not null,
    issue_time datetime not null,
    foreign key(userid) references user(userid),
    foreign key(answerid) references answer(answerid)
) engine = innodb default charset = utf8;

create table comment_to_article (
    commentid int primary key auto_increment,
    userid int not null,
    articleid int not null,
    content text not null,
    issue_time datetime not null,
    foreign key(userid) references user(userid),
    foreign key(articleid) references article(articleid)
) engine = innodb default charset = utf8;

create table follow_user (
    follower_userid int,
    followee_userid int,
    issue_time datetime not null,
    primary key(follower_userid, followee_userid),
    foreign key(follower_userid) references user(userid),
    foreign key(followee_userid) references user(userid)
) engine = innodb default charset = utf8;


-- 索引

create unique index idx_username on user(username);

create index idx_question_userid on question(userid);
create index idx_question_issue_time on question(issue_time);
create index idx_question_views on question(views);

create index idx_answer_questionid on answer(questionid);
create index idx_answer_userid on answer(userid);
create index idx_answer_update_time on answer(update_time);

create index idx_article_userid on article(userid);
create index idx_article_update_time on article(update_time);
create index idx_article_views on article(views);

create index idx_follow_question_issue_time on follow_question(issue_time);

create index idx_like_answer_issue_time on like_answer(issue_time);

create index idx_like_article_issue_time on like_article(issue_time);

create index idx_comment_to_answer_userid on comment_to_answer(userid);
create index idx_comment_to_answer_answerid on comment_to_answer(answerid);
create index idx_comment_to_answer_issue_time on comment_to_answer(issue_time);

create index idx_comment_to_article_userid on comment_to_article(userid);
create index idx_comment_to_article_articleid on comment_to_article(articleid);
create index idx_comment_to_article_issue_time on comment_to_article(issue_time);


-- 触发器（delimiter ;;）

create trigger after_insert_question after insert on question
for each row
begin
declare userid int;
declare questionid int;
set userid = new.userid;
set questionid = new.questionid;
insert into follow_question values (userid, questionid, now());
end;;

create trigger before_update_article before update on article
for each row
begin
set new.update_time = now();
end;;


-- 补充

ALTER TABLE `answer` DROP FOREIGN KEY `answer_ibfk_1`;
ALTER TABLE `answer` ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`questionid`) REFERENCES `question` (`questionid`) ON DELETE CASCADE;

ALTER TABLE `follow_question` DROP FOREIGN KEY `follow_question_ibfk_2`;
ALTER TABLE `follow_question` ADD CONSTRAINT `follow_question_ibfk_2` FOREIGN KEY (`questionid`) REFERENCES `question` (`questionid`) ON DELETE CASCADE;

ALTER TABLE answer CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE article CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE comment_to_answer CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE comment_to_article CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;