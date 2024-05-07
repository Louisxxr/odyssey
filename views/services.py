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
        # authcode = ''
        # for i in range(6):
        #     authcode += str(random.randint(0, 9))
        
        # if send_authcode(email, authcode):
        #     conn = StrictRedis(host = 'localhost', port = 6379, db = 0)
        #     conn.set(email, authcode, 3600) # 一小时后过期
        #     return jsonify({ "result": "已发送" }), 200
        # return jsonify({ "result": "发送失败，请稍后再试" }), 200
        authcode = '123456'
        conn = StrictRedis(host = 'localhost', port = 6379, db = 0)
        conn.set(email, authcode, 3600) # 一小时后过期
        return jsonify({ "result": "已发送" }), 200

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
        username = session.get('username')

        sql = "select sex, signature, head from user where username = %s"
        values = (username)
        res = query(sql, values)
        if res:
            return jsonify({
                "username": username,
                "sex": res[0]['sex'],
                "signature": res[0]['signature'],
                "head": res[0]['head']
            }), 200
        return jsonify({
            "username": username,
            "sex": null,
            "signature": "",
            "head": "/static/img/head/default.jpg"
        }), 200

class Upload_imgServiceView(MethodView):
    def post(self, item):
        userid = session.get('userid')
        img = request.files.get('file')
        path = '/static/img/' + item + '/' + str(userid) + '-' + str(time.time()) + '.' + img.content_type.split('/')[1]
        img.save(os.getcwd() + path)
        return path, 200

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
            "issue_time": res[0]['issue_time'],
            "views": res[0]['views'],
            "follow_num": follow_num,
            "answer_num": answer_num
        }), 200

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
            order by views desc limit 5''', ())
            
            res += query('''select user.userid as 'userid', username, head, articleid, title, update_time, views
            from user, article
            where user.userid = article.userid
            order by views desc limit 5''', ())

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
                    ret += str(item['issue_time']) + magic_split_flag
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
                    ret += str(item['update_time']) + magic_split_flag
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
            order by issue_time desc limit 5''', ())
            
            res += query('''select user.userid as 'userid', username, head, articleid, title, update_time, views
            from user, article
            where user.userid = article.userid
            order by update_time desc limit 5''', ())

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
                    ret += str(item['issue_time']) + magic_split_flag
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
                    ret += str(item['update_time']) + magic_split_flag
                    ret += str(item['views']) + magic_split_flag
                    like_num = query("select count(*) as 'like_num' from like_article where articleid = %s", (item['articleid']))[0]['like_num']
                    ret += str(like_num) + magic_split_flag
                res.pop(item_idx)
            ret = ret[0 : -4]
            return ret, 200