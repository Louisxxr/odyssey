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
    title varchar(100) not null,
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
    content varchar(500) not null,
    issue_time datetime not null,
    foreign key(userid) references user(userid),
    foreign key(answerid) references answer(answerid)
) engine = innodb default charset = utf8;

create table comment_to_article (
    commentid int primary key auto_increment,
    userid int not null,
    articleid int not null,
    content varchar(500) not null,
    issue_time datetime not null,
    foreign key(userid) references user(userid),
    foreign key(articleid) references article(articleid)
) engine = innodb default charset = utf8;

create table follow_user (
    follower_userid int,
    followee_userid int,
    primary key(follower_userid, followee_userid),
    foreign key(follower_userid) references user(userid),
    foreign key(followee_userid) references user(userid)
) engine = innodb default charset = utf8;


-- 索引

create unique index idx_cityname on city(cityname);

create unique index idx_username on user(username);

create index idx_question_userid on question(userid);
create index idx_question_title on question(title);

create index idx_answer_questionid on answer(questionid);
create index idx_answer_userid on answer(userid);

create index idx_article_userid on article(userid);
create index idx_article_title on article(title);

create index idx_comment_to_answer_userid on comment_to_answer(userid);
create index idx_comment_to_answer_answerid on comment_to_answer(answerid);

create index idx_comment_to_article_userid on comment_to_article(userid);
create index idx_comment_to_article_articleid on comment_to_article(articleid);