const User = require('../models/User');
const passport = require("passport");

class AuthenController {

    register(req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        const retypePassword = req.body.retypePassword;
        const mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!username) {
            return res.json({success: false, message: "Vui lòng nhập email"})
        }
        if(!username.match(mailFormat)) {
            return res.json({success: false, message: "Định dạng email không hợp lệ"})
        }
        if (!password) {
            return res.json({success: false, message: "Vui lòng nhập mật khẩu"})
        }
        if(password.length < 8) {
            return res.json({success: false, message: 'Mật khẩu phải ít nhất có 8 ký tự'})
        }
        if (retypePassword !== password) {
            return res.json({success: false, message: "Mật khẩu nhập lại không chính xác"})
        }
        User.findOne({username: username}, (err, user) => {
            if (err) {
                return res.json({success: false, err})
            }
            if (user) {
                return res.json({success: false, message: 'Email đã tồn tại'})
            } else {
                User.register(new User({username: username}), password, (err, user) => {
                    if (err) {
                        return res.json({success: false, err})
                    }
                    return res.json({success: true, message: 'Đăng ký thành công'})
                })
            }
        })

    }

    login(req, res, next) {
        if (!req.body.username) {
            return res.json({success: false, message: "Vui lòng nhập email"})
        } else {
            if (!req.body.password) {
                return res.json({success: false, message: "Vui lòng nhập mật khẩu"})
            } else {
                passport.authenticate('local', (err, user, info) => {
                    if (err) {
                        return res.json({success: false, message: err})
                    } else if (!user) {
                        return res.json({success: false, message: 'Tài khoản hoặc mật khẩu không chính xác'})
                    } else {
                        return req.logIn(user, (err) => {
                            if (err) {
                                return res.json({success: false, message: err})
                            } else {
                                return res.json({success: true, message: "Authentication successful", user});
                            }

                        })
                    }
                })(req, res, next);
            }
        }
    }

    logout(req, res, next) {
        req.logOut();
        req.session.destroy(function (err) {
            if (err) {
                return res.json(err)
            }
            res.clearCookie('connect.sid');
            return res.json({success: true})
        });

    }

}

module.exports = new AuthenController();