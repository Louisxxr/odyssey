from socket import *
from views.utils.secret import qqsmtp_password

def send_authcode(to_address, authcode):
    from_address = '1846524782@qq.com'
    subject = 'Odyssey邮箱验证码'
    message = authcode
    message = "from: " + from_address + "\r\nto: " + to_address + "\r\nsubject: " + subject + "\r\n\r\n" + message + "\r\n.\r\n"

    server_address = "smtp.qq.com"
    server_port = 25
    username = "MTg0NjUyNDc4MkBxcS5jb20="
    password = qqsmtp_password

    client_socket = socket(AF_INET, SOCK_STREAM)
    client_socket.connect((server_address, server_port))
    recv = client_socket.recv(1024).decode()
    if recv[:3] != "220":
        return False

    client_socket.sendall("HELO localhost\r\n".encode())
    recv = client_socket.recv(1024).decode()
    if recv[:3] != "250":
        return False

    client_socket.sendall("AUTH LOGIN\r\n".encode())
    recv = client_socket.recv(1024).decode()
    if recv[:3] != "334":
        return False

    client_socket.sendall((username + "\r\n").encode())
    recv = client_socket.recv(1024).decode()
    if recv[:3] != "334":
        return False

    client_socket.sendall((password + "\r\n").encode())
    recv = client_socket.recv(1024).decode()
    if recv[:3] != "235":
        return False

    client_socket.sendall(("MAIL FROM: <" + from_address + ">\r\n").encode())
    recv = client_socket.recv(1024).decode()
    if recv[:3] != "250":
        return False

    client_socket.sendall(("RCPT TO: <" + from_address + ">\r\n").encode())
    recv = client_socket.recv(1024).decode()
    if recv[:3] != "250":
        return False

    client_socket.sendall("DATA\r\n".encode())
    recv = client_socket.recv(1024).decode()
    if recv[:3] != "354":
        return False

    client_socket.sendall(message.encode())
    recv = client_socket.recv(1024).decode()
    if recv[:3] != "250":
        return False

    client_socket.sendall("QUIT\r\n".encode())
    client_socket.close()
    return True