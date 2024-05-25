from flask import request, jsonify, session
from flask.views import MethodView
from redis import StrictRedis
from views.utils.db_operation import *
from views.utils.send_authcode import *
import os
import time
import random

class AuthcodeServiceView(MethodView):
    def get(self):
        email = request.args.get('email')
        authcode = ''
        for i in range(6):
            authcode += str(random.randint(0, 9))
        
        if send_authcode(email, authcode):
            conn = StrictRedis(host = 'localhost', port = 6379, db = 0)
            conn.set(email, authcode, 3600) # 一小时后过期
            return jsonify({ "result": "已发送" }), 200
        return jsonify({ "result": "发送失败，请稍后再试" }), 200

class Verify_emailServiceView(MethodView):
    def get(self):
        email = request.args.get('email')
        
        sql = "select count(*) as 'count' from user where email = %s"
        values = (email) # 避免sql注入
        res = query(sql, values)
        if res and res[0]['count'] > 0:
            return "1", 200 # 提示用户邮箱已注册
        if not res:
            return "2", 200 # 查询失败，提示用户请稍后再试
        return "0", 200 # 邮箱未注册

class Login_stateServiceView(MethodView):
    def get(self):
        username = session.get('username')
        if username is None:
            return "0", 200 # 未登录
        
        sql = "select head from user where username = %s"
        values = (username)
        res = query(sql, values)
        if res:
            return jsonify({ "head": res[0]['head'], "username": username }), 200 # 已登录
        return jsonify({ "head": "/static/img/head/default.jpg", "username": username }), 200 # 数据库错误，暂用默认头像代替

class LogoutServiceView(MethodView):
    def get(self):
        session.pop('username')
        session.pop('userid')
        return '', 200

class UserinfoServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        username = session.get('username')

        sql = "select sex, signature, head from user where userid = %s"
        values = (userid)
        res = query(sql, values)
        if res:
            return jsonify({
                "userid": userid,
                "username": username,
                "sex": res[0]['sex'],
                "signature": res[0]['signature'],
                "head": res[0]['head']
            }), 200
        return jsonify({
            "userid": userid,
            "username": username,
            "sex": null,
            "signature": "",
            "head": "/static/img/head/default.jpg"
        }), 200

class Upload_imgServiceView(MethodView):
    def post(self, item):
        userid = session.get('userid')

        img = None
        if item == 'assets_answer' or item == 'assets_article':
            img = request.files.get('wangeditor-uploaded-image')
        else:
            img = request.files.get('file')

        path = '/static/img/' + item + '/' + str(userid) + '-' + str(time.time()) + '.' + img.content_type.split('/')[1]
        img.save(os.getcwd() + path)
        return jsonify({
            "errno": 0,
            "data": {
                "url": path
            }
        })

class Province_listServiceView(MethodView):
    def get(self):
        sql = "select * from province order by provinceid"
        res = query(sql, ())
        ret = ""
        for item in res:
            ret += str(item['provinceid']) + ' ' + item['provincename'] + ' '
        ret = ret[0 : -1]
        return ret, 200

class City_listServiceView(MethodView):
    def get(self):
        provinceid = int(request.args.get('provinceid'))

        sql = "select cityid, cityname from city where provinceid = %s order by cityid"
        values = (provinceid)
        res = query(sql, values)
        ret = ""
        for item in res:
            ret += str(item['cityid']) + ' ' + item['cityname'] + ' '
        ret = ret[0 : -1]
        return ret, 200

class UserassetServiceView(MethodView):
    def get(self, asset):
        userid = request.args.get('userid')
        if not userid:
            userid = session['userid']

        if asset == "question":
            sql = "select questionid, title, issue_time, views from question where userid = %s order by issue_time"
            values = (userid)
            res = query(sql, values)

            magic_split_flag = '' # 因为title允许各种字符
            for i in range(4):
                magic_split_flag += chr(random.randint(0, 25) + 65)

            ret = magic_split_flag
            for item in res:
                ret += str(item['questionid']) + magic_split_flag + item['title'] + magic_split_flag + str(item['issue_time']) + magic_split_flag + str(item['views']) + magic_split_flag
            ret = ret[0 : -4]
            return ret, 200

class DeleteServiceView(MethodView):
    def get(self, asset):
        if asset == "question":
            questionid = int(request.args.get('questionid'))

            sql = "delete from question where questionid = %s"
            values = (questionid)
            if delete(sql, values):
                return '', 200
            return '', 400

class MatchingServiceView(MethodView):
    def get(self, rule):
        if rule == 'hottest':
            res = query('''select user.userid as 'userid', username, head, questionid, title, issue_time, views
            from user, question
            where user.userid = question.userid
            order by views desc limit 20''', ())
            
            res += query('''select user.userid as 'userid', username, head, articleid, title, update_time, views
            from user, article
            where user.userid = article.userid
            order by views desc limit 20''', ())

            magic_split_flag = ''
            for i in range(4):
                magic_split_flag += chr(random.randint(0, 25) + 65)

            ret = magic_split_flag
            items_len = len(res)
            for i in range(items_len):
                item_idx = random.randint(0, len(res) - 1)
                item = res[item_idx]
                if 'questionid' in item:
                    ret += '0' + magic_split_flag
                    ret += str(item['userid']) + magic_split_flag
                    ret += item['username'] + magic_split_flag
                    ret += item['head'] + magic_split_flag
                    ret += str(item['questionid']) + magic_split_flag
                    ret += item['title'] + magic_split_flag
                    ret += str(item['issue_time'].date()) + magic_split_flag
                    ret += str(item['views']) + magic_split_flag
                    answer_num = query("select count(*) as 'answer_num' from answer where questionid = %s", (item['questionid']))[0]['answer_num']
                    ret += str(answer_num) + magic_split_flag
                else:
                    ret += '1' + magic_split_flag
                    ret += str(item['userid']) + magic_split_flag
                    ret += item['username'] + magic_split_flag
                    ret += item['head'] + magic_split_flag
                    ret += str(item['articleid']) + magic_split_flag
                    ret += item['title'] + magic_split_flag
                    ret += str(item['update_time'].date()) + magic_split_flag
                    ret += str(item['views']) + magic_split_flag
                    like_num = query("select count(*) as 'like_num' from like_article where articleid = %s", (item['articleid']))[0]['like_num']
                    ret += str(like_num) + magic_split_flag
                res.pop(item_idx)
            ret = ret[0 : -4]
            return ret, 200
        
        elif rule == 'latest':
            res = query('''select user.userid as 'userid', username, head, questionid, title, issue_time, views
            from user, question
            where user.userid = question.userid
            order by issue_time desc limit 20''', ())
            
            res += query('''select user.userid as 'userid', username, head, articleid, title, update_time, views
            from user, article
            where user.userid = article.userid
            order by update_time desc limit 20''', ())

            magic_split_flag = ''
            for i in range(4):
                magic_split_flag += chr(random.randint(0, 25) + 65)

            ret = magic_split_flag
            items_len = len(res)
            for i in range(items_len):
                item_idx = random.randint(0, len(res) - 1)
                item = res[item_idx]
                if 'questionid' in item:
                    ret += '0' + magic_split_flag
                    ret += str(item['userid']) + magic_split_flag
                    ret += item['username'] + magic_split_flag
                    ret += item['head'] + magic_split_flag
                    ret += str(item['questionid']) + magic_split_flag
                    ret += item['title'] + magic_split_flag
                    ret += str(item['issue_time'].date()) + magic_split_flag
                    ret += str(item['views']) + magic_split_flag
                    answer_num = query("select count(*) as 'answer_num' from answer where questionid = %s", (item['questionid']))[0]['answer_num']
                    ret += str(answer_num) + magic_split_flag
                else:
                    ret += '1' + magic_split_flag
                    ret += str(item['userid']) + magic_split_flag
                    ret += item['username'] + magic_split_flag
                    ret += item['head'] + magic_split_flag
                    ret += str(item['articleid']) + magic_split_flag
                    ret += item['title'] + magic_split_flag
                    ret += str(item['update_time'].date()) + magic_split_flag
                    ret += str(item['views']) + magic_split_flag
                    like_num = query("select count(*) as 'like_num' from like_article where articleid = %s", (item['articleid']))[0]['like_num']
                    ret += str(like_num) + magic_split_flag
                res.pop(item_idx)
            ret = ret[0 : -4]
            return ret, 200

class QuestioninfoServiceView(MethodView):
    def get(self):
        questionid = int(request.args.get('questionid'))

        sql = '''select user.userid as 'userid', username, head, title, description, issue_time, views
        from user, question
        where user.userid = question.userid and questionid = %s'''
        values = (questionid)
        res = query(sql, values)
        follow_num = query("select count(*) as 'follow_num' from follow_question where questionid = %s", (questionid))[0]['follow_num']
        answer_num = query("select count(*) as 'answer_num' from answer where questionid = %s", (questionid))[0]['answer_num']
        return jsonify({
            "userid": res[0]['userid'],
            "username": res[0]['username'],
            "head": res[0]['head'],
            "title": res[0]['title'],
            "description": res[0]['description'],
            "issue_time": str(res[0]['issue_time'].date()),
            "views": res[0]['views'],
            "follow_num": follow_num,
            "answer_num": answer_num
        }), 200

class Check_follow_questionServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        questionid = int(request.args.get('questionid'))

        res = query("select count(*) as 'count' from follow_question where userid = %s and questionid = %s", (userid, questionid))[0]['count']
        if res == 1:
            return "1", 200
        else:
            return "0", 200

class Follow_questionServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        questionid = int(request.args.get('questionid'))

        if insert("insert into follow_question values (%s, %s, now())", (userid, questionid)):
            return "", 200
        else:
            return "", 400

class Unfollow_questionServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        questionid = int(request.args.get('questionid'))

        if delete("delete from follow_question where userid = %s and questionid = %s", (userid, questionid)):
            return "", 200
        else:
            return "", 400

class Get_my_answerServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        questionid = int(request.args.get('questionid'))

        res = query("select content from answer where userid = %s and questionid = %s", (userid, questionid))
        if res:
            return res[0]['content'], 200
        else:
            return "", 200

class Get_all_answerServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        questionid = int(request.args.get('questionid'))

        magic_split_flag = ''
        for i in range(4):
            magic_split_flag += chr(random.randint(0, 25) + 65)
        ret = magic_split_flag

        if userid:
            res = query('''select user.userid as 'userid', username, head, answerid, content, update_time
            from user, answer
            where user.userid = answer.userid and answer.userid = %s and answer.questionid = %s''', (userid, questionid))
            if res:
                ret += str(res[0]['userid']) + magic_split_flag
                ret += res[0]['username'] + magic_split_flag
                ret += res[0]['head'] + magic_split_flag
                ret += str(res[0]['answerid']) + magic_split_flag
                ret += res[0]['content'] + magic_split_flag
                ret += str(res[0]['update_time'].date()) + magic_split_flag
                answerid = res[0]['answerid']
                res = query("select count(*) as 'like_num' from like_answer where answerid = %s", (answerid))
                ret += str(res[0]['like_num']) + magic_split_flag
                res = query("select count(*) as 'comment_num' from comment_to_answer where answerid = %s", (answerid))
                ret += str(res[0]['comment_num']) + magic_split_flag

        res = []
        if userid:
            res = query('''select user.userid as 'userid', username, head, answerid, content, update_time
            from user, answer
            where user.userid = answer.userid and answer.userid <> %s and answer.questionid = %s
            order by update_time desc''', (userid, questionid))
        else:
            res = query('''select user.userid as 'userid', username, head, answerid, content, update_time
            from user, answer
            where user.userid = answer.userid and answer.questionid = %s
            order by update_time desc''', (questionid))
        for item in res:
            ret += str(item['userid']) + magic_split_flag
            ret += item['username'] + magic_split_flag
            ret += item['head'] + magic_split_flag
            ret += str(item['answerid']) + magic_split_flag
            ret += item['content'] + magic_split_flag
            ret += str(item['update_time'].date()) + magic_split_flag
            answerid = item['answerid']
            res = query("select count(*) as 'like_num' from like_answer where answerid = %s", (answerid))
            ret += str(res[0]['like_num']) + magic_split_flag
            res = query("select count(*) as 'comment_num' from comment_to_answer where answerid = %s", (answerid))
            ret += str(res[0]['comment_num']) + magic_split_flag

        ret = ret[0 : -4]
        return ret, 200

class Check_like_answerServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        answerid = int(request.args.get('answerid'))

        res = query("select count(*) as 'count' from like_answer where userid = %s and answerid = %s", (userid, answerid))[0]['count']
        if res == 1:
            return "1", 200
        else:
            return "0", 200

class Like_answerServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        answerid = int(request.args.get('answerid'))

        if insert("insert into like_answer values (%s, %s, now())", (userid, answerid)):
            return "", 200
        else:
            return "", 400

class Unlike_answerServiceView(MethodView): # poor grammar..
    def get(self):
        userid = session.get('userid')
        answerid = int(request.args.get('answerid'))

        if delete("delete from like_answer where userid = %s and answerid = %s", (userid, answerid)):
            return "", 200
        else:
            return "", 400

class Get_all_commentServiceView(MethodView):
    def get(self, item):
        if item == 'answer':
            answerid = int(request.args.get('answerid'))

            magic_split_flag = ''
            for i in range(4):
                magic_split_flag += chr(random.randint(0, 25) + 65)
            ret = magic_split_flag

            res = query('''select user.userid as 'userid', username, head, content, issue_time
            from user, comment_to_answer
            where user.userid = comment_to_answer.userid and comment_to_answer.answerid = %s
            order by issue_time desc''', (answerid))
            for item in res:
                ret += str(item['userid']) + magic_split_flag
                ret += item['username'] + magic_split_flag
                ret += item['head'] + magic_split_flag
                ret += item['content'] + magic_split_flag
                ret += str(item['issue_time'].date()) + magic_split_flag
            
            ret = ret[0 : -4]
            return ret, 200
        
        elif item == 'article':
            articleid = int(request.args.get('articleid'))

            magic_split_flag = ''
            for i in range(4):
                magic_split_flag += chr(random.randint(0, 25) + 65)
            ret = magic_split_flag

            res = query('''select user.userid as 'userid', username, head, content, issue_time
            from user, comment_to_article
            where user.userid = comment_to_article.userid and comment_to_article.articleid = %s
            order by issue_time desc''', (articleid))
            for item in res:
                ret += str(item['userid']) + magic_split_flag
                ret += item['username'] + magic_split_flag
                ret += item['head'] + magic_split_flag
                ret += item['content'] + magic_split_flag
                ret += str(item['issue_time'].date()) + magic_split_flag

            ret = ret[0 : -4]
            return ret, 200

class Submit_commentServiceView(MethodView):
    def post(self, item):
        userid = session.get('userid')

        if item == 'answer':
            answerid = int(request.form.get('answerid'))
            content = request.form.get('content')

            if insert("insert into comment_to_answer(userid, answerid, content, issue_time) values (%s, %s, %s, now())", (userid, answerid, content)):
                return "", 200
            return "", 400
        
        elif item == 'article':
            articleid = int(request.form.get('articleid'))
            content = request.form.get('content')

            if insert("insert into comment_to_article(userid, articleid, content, issue_time) values (%s, %s, %s, now())", (userid, articleid, content)):
                return "", 200
            return "", 400

class ArticleinfoServiceView(MethodView):
    def get(self):
        articleid = int(request.args.get('articleid'))

        sql = '''select user.userid as 'userid', username, head, title, content, issue_time, update_time, views
        from user, article
        where user.userid = article.userid and articleid = %s'''
        values = (articleid)
        res = query(sql, values)
        like_num = query("select count(*) as 'like_num' from like_article where articleid = %s", (articleid))[0]['like_num']
        comment_num = query("select count(*) as 'comment_num' from comment_to_article where articleid = %s", (articleid))[0]['comment_num']
        return jsonify({
            "userid": res[0]['userid'],
            "username": res[0]['username'],
            "head": res[0]['head'],
            "title": res[0]['title'],
            "content": res[0]['content'],
            "issue_time": str(res[0]['issue_time'].date()),
            "update_time": str(res[0]['update_time'].date()),
            "views": res[0]['views'],
            "like_num": like_num,
            "comment_num": comment_num
        }), 200

class Check_like_articleServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        articleid = int(request.args.get('articleid'))

        res = query("select count(*) as 'count' from like_article where userid = %s and articleid = %s", (userid, articleid))[0]['count']
        if res == 1:
            return "1", 200
        else:
            return "0", 200

class Like_articleServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        articleid = int(request.args.get('articleid'))

        if insert("insert into like_article values (%s, %s, now())", (userid, articleid)):
            return "", 200
        else:
            return "", 400

class Unlike_articleServiceView(MethodView):
    def get(self):
        userid = session.get('userid')
        articleid = int(request.args.get('articleid'))

        if delete("delete from like_article where userid = %s and articleid = %s", (userid, articleid)):
            return "", 200
        else:
            return "", 400

class Check_follow_userServiceView(MethodView):
    def get(self):
        follower_userid = session.get('userid')
        followee_userid = int(request.args.get('followee_userid'))

        res = query("select count(*) as 'count' from follow_user where follower_userid = %s and followee_userid = %s", (follower_userid, followee_userid))[0]['count']
        if res == 1:
            return "1", 200
        else:
            return "0", 200

class Follow_userServiceView(MethodView):
    def get(self):
        follower_userid = session.get('userid')
        followee_userid = int(request.args.get('followee_userid'))

        if insert("insert into follow_user values (%s, %s, now())", (follower_userid, followee_userid)):
            return "", 200
        else:
            return "", 400

class Unfollow_userServiceView(MethodView):
    def get(self):
        follower_userid = session.get('userid')
        followee_userid = int(request.args.get('followee_userid'))

        if delete("delete from follow_user where follower_userid = %s and followee_userid = %s", (follower_userid, followee_userid)):
            return "", 200
        else:
            return "", 400