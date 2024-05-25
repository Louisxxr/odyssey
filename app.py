from flask import Flask
from datetime import timedelta
from views.pages_request import *
from views.services import *
from views.utils.secret import session_secret_key

app = Flask(__name__)
app.secret_key = session_secret_key
app.permanent_session_lifetime = timedelta(days = 30) # session_id在30天后过期

# 注册视图
# 页面
app.add_url_rule('/', view_func = MainPageView.as_view('mainpage'))
app.add_url_rule('/login', view_func = LoginPageView.as_view('loginpage'))
app.add_url_rule('/register', view_func = RegisterPageView.as_view('registerpage'))
app.add_url_rule('/reset_password', view_func = Reset_passwordPageView.as_view('resetpasswordpage'))
app.add_url_rule('/homepage', view_func = HomePageView.as_view('homepage')) # to be finished
app.add_url_rule('/update_userinfo', defaults = { 'item': None }, view_func = Update_userinfoPageView.as_view('updateuserinfopage'))
app.add_url_rule('/edit_question', view_func = Edit_questionPageView.as_view('editquestionpage'))
app.add_url_rule('/question/<questionid>', view_func = QuestionPageView.as_view('questionpage'))
app.add_url_rule('/edit_article', view_func = Edit_articlePageView.as_view('editarticlepage'))
app.add_url_rule('/article/<articleid>', view_func = ArticlePageView.as_view('articlepage'))
app.add_url_rule('/update_article/<articleid>', view_func = Update_articlePageView.as_view('updatearticlepage'))
app.add_url_rule('/user/<userid>', view_func = UserPageView.as_view('userpage')) # to be finished
# 服务
app.add_url_rule('/service/authcode', view_func = AuthcodeServiceView.as_view('authcodeservice'))
app.add_url_rule('/service/verifyemail', view_func = Verify_emailServiceView.as_view('verifyemailservice'))
app.add_url_rule('/service/loginstate', view_func = Login_stateServiceView.as_view('loginstateservice'))
app.add_url_rule('/service/logout', view_func = LogoutServiceView.as_view('logoutservice'))
app.add_url_rule('/service/userinfo', view_func = UserinfoServiceView.as_view('userinfoservice'))
app.add_url_rule('/service/uploadimg/<item>', view_func = Upload_imgServiceView.as_view('uploadimgservice'))
app.add_url_rule('/update_userinfo/<item>', view_func = Update_userinfoPageView.as_view('updateuserinfoservice'))
app.add_url_rule('/service/provincelist', view_func = Province_listServiceView.as_view('provincelistservice'))
app.add_url_rule('/service/citylist', view_func = City_listServiceView.as_view('citylistservice'))
app.add_url_rule('/service/userasset/<asset>', view_func = UserassetServiceView.as_view('userassetservice'))
app.add_url_rule('/service/delete/<asset>', view_func = DeleteServiceView.as_view('deleteservice'))
app.add_url_rule('/service/matching/<rule>', view_func = MatchingServiceView.as_view('matchingservice'))
app.add_url_rule('/service/questioninfo', view_func = QuestioninfoServiceView.as_view('questioninfoservice'))
app.add_url_rule('/service/checkfollowquestion', view_func = Check_follow_questionServiceView.as_view('checkfollowquestionservice'))
app.add_url_rule('/service/followquestion', view_func = Follow_questionServiceView.as_view('followquestionservice'))
app.add_url_rule('/service/unfollowquestion', view_func = Unfollow_questionServiceView.as_view('unfollowquestionservice'))
app.add_url_rule('/service/getmyanswer', view_func = Get_my_answerServiceView.as_view('getmyanswerservice'))
app.add_url_rule('/service/getallanswer', view_func = Get_all_answerServiceView.as_view('getallanswerservice'))
app.add_url_rule('/service/checklikeanswer', view_func = Check_like_answerServiceView.as_view('checklikeanswerservice'))
app.add_url_rule('/service/likeanswer', view_func = Like_answerServiceView.as_view('likeanswerservice'))
app.add_url_rule('/service/unlikeanswer', view_func = Unlike_answerServiceView.as_view('unlikeanswerservice'))
app.add_url_rule('/service/getallcomment/<item>', view_func = Get_all_commentServiceView.as_view('getallcommentservice'))
app.add_url_rule('/service/submitcomment/<item>', view_func = Submit_commentServiceView.as_view('submitcommentservice'))
app.add_url_rule('/service/articleinfo', view_func = ArticleinfoServiceView.as_view('articleinfoservice'))
app.add_url_rule('/service/checklikearticle', view_func = Check_like_articleServiceView.as_view('checklikearticleservice'))
app.add_url_rule('/service/likearticle', view_func = Like_articleServiceView.as_view('likearticleservice'))
app.add_url_rule('/service/unlikearticle', view_func = Unlike_articleServiceView.as_view('unlikearticleservice'))
app.add_url_rule('/service/checkfollowuser', view_func = Check_follow_userServiceView.as_view('checkfollowuserservice'))
app.add_url_rule('/service/followuser', view_func = Follow_userServiceView.as_view('followuserservice'))
app.add_url_rule('/service/unfollowuser', view_func = Unfollow_userServiceView.as_view('unfollowuserservice'))

if __name__ == '__main__':
    app.run()