# -*- coding:utf-8 -*-
import smtplib
import email
# import json
# import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
# from email.mime.image import MIMEImage
# from email.mime.base import MIMEBase
# from email.mime.application import MIMEApplication
from email.header import Header
from email.utils import formataddr
# import urllib.request
# import ssl

from views.utils.secret import smtp_password

def send_authcode(to_address, authcode):
    # username，通过控制台创建的发信地址
    username = 'verify@louis-odyssey.cn'
    # password，通过控制台创建的SMTP密码
    password = smtp_password
    # 自定义的回信地址，与控制台设置的无关。邮件推送发信地址不收信，收信人回信时会自动跳转到设置好的回信地址。
    replyto = '1846524782@qq.com'
    # 显示的To收信地址
    rcptto = [to_address]
    # 显示的Cc收信地址
    rcptcc = []
    # Bcc收信地址，密送人不会显示在邮件上，但可以收到邮件
    rcptbcc = []
    # 全部收信地址，包含抄送地址，单次发送不能超过60人
    receivers = rcptto + rcptcc + rcptbcc

    # 构建alternative结构
    msg = MIMEMultipart('alternative')
    msg['Subject'] = Header('【Odyssey】验证码')
    msg['From'] = formataddr(["Odyssey verification", username])  # 昵称+发信地址(或代发)
    # list转为字符串
    msg['To'] = ",".join(rcptto)
    msg['Cc'] = ",".join(rcptcc)
    msg['Reply-to'] = replyto  #用于接收回复邮件，需要收信方支持标准协议
    msg['Return-Path'] = '1846524782@qq.com' #用于接收退信邮件，需要收信方支持标准协议
    msg['Message-id'] = email.utils.make_msgid() #message-id 用于唯一地标识每一封邮件，其格式需要遵循RFC 5322标准，通常如 <uniquestring@example.com>，其中uniquestring是邮件服务器生成的唯一标识，可能包含时间戳、随机数等信息。
    msg['Date'] = email.utils.formatdate()

    # 若需要开启邮件跟踪服务，请使用以下代码设置跟踪链接头。
    # 首先域名需要备案，设置且已正确解析了CNAME配置；其次发信需要打Tag，此Tag在控制台已创建并存在，Tag创建10分钟后方可使用；
    # 设置跟踪链接头
    # tagName = 'xxxxxxx'
    #
    # # OpenTrace和LinkTrace的对应值是字符串'1'，固定
    # trace = {
    #     "OpenTrace": '1',  #打开邮件跟踪
    #     "LinkTrace": '1',  #点击邮件里的URL跟踪
    #     "TagName": tagName  # 控制台创建的标签tagname
    # }
    # jsonTrace = json.dumps(trace)
    # base64Trace = str(base64.b64encode(jsonTrace.encode('utf-8')), 'utf-8')
    # # print(base64Trace)
    # msg.add_header("X-AliDM-Trace", base64Trace)


    # 构建alternative的text/plain部分
    # textplain = MIMEText('自定义TEXT纯文本部分', _subtype='plain', _charset='UTF-8')
    # msg.attach(textplain)

    # 构建alternative的text/html部分
    texthtml = MIMEText('【Odyssey】您正在进行邮箱验证，验证码为' + authcode, _subtype='html', _charset='UTF-8')
    msg.attach(texthtml)

    # # 发送本地附件
    # files = [r'C:\Users\Downloads\test1.jpg', r'C:\Users\Downloads\test2.jpg']
    # for t in files:
    #     filename = t.rsplit('/', 1)[1]
    #     part_attach1 = MIMEApplication(open(t, 'rb').read())  # 打开附件
    #     part_attach1.add_header('Content-Disposition', 'attachment', filename=filename)  # 为附件命名
    #     msg.attach(part_attach1)  # 添加附件

    # #发送url附件
    # files = [r'https://example.oss-cn-shanghai.aliyuncs.com/xxxxxxxxxxx.png']
    # for t in files:
    #     filename=t.rsplit('/', 1)[1]
    #     response = urllib.request.urlopen(t)
    #     part_attach1 = MIMEApplication(response.read())  # 打开附件，非本地文件
    #     part_attach1.add_header('Content-Disposition', 'attachment', filename=filename)  # 为附件命名
    #     msg.attach(part_attach1)  # 添加附件


    # 发送邮件
    try:
        # 若需要加密使用SSL，可以这样创建client
        # client = smtplib.SMTP_SSL('smtpdm.aliyun.com', 465)
        
        # python 3.10/3.11新版本若出现ssl握手失败,请使用下列方式处理：
        # ctxt = ssl.create_default_context()
        # ctxt.set_ciphers('DEFAULT')
        # client = smtplib.SMTP_SSL('smtpdm.aliyun.com', 465, context=ctxt)
        
        
        # SMTP普通端口为25或80
        client = smtplib.SMTP('smtpdm.aliyun.com', 80)
        # 开启DEBUG模式
        client.set_debuglevel(0)
        # 发件人和认证地址必须一致
        client.login(username, password)
        # 备注：若想取到DATA命令返回值,可参考smtplib的sendmail封装方法:
        # 使用SMTP.mail/SMTP.rcpt/SMTP.data方法
        # print(receivers)
        client.sendmail(username, receivers, msg.as_string())  # 支持多个收件人，具体数量参考规格清单
        client.quit()
        return True
    except smtplib.SMTPConnectError as e:
        return False
    except smtplib.SMTPAuthenticationError as e:
        return False
    except smtplib.SMTPSenderRefused as e:
        return False
    except smtplib.SMTPRecipientsRefused as e:
        return False
    except smtplib.SMTPDataError as e:
        return False
    except smtplib.SMTPException as e:
        return False
    except Exception as e:
        return False