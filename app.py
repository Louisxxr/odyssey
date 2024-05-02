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
app.add_url_rule('/', view_func = MainPageView.as_view('mainpage')) # to be finished
app.add_url_rule('/login', view_func = LoginPageView.as_view('loginpage'))
app.add_url_rule('/register', view_func = RegisterPageView.as_view('registerpage'))
app.add_url_rule('/reset_password', view_func = Reset_passwordPageView.as_view('resetpasswordpage'))
app.add_url_rule('/homepage', view_func = HomePageView.as_view('homepage')) # to be finished
app.add_url_rule('/update_userinfo', defaults = { 'item': None }, view_func = Update_userinfoPageView.as_view('updateuserinfopage'))
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

if __name__ == '__main__':
    app.run()