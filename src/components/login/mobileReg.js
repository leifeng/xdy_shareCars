var React = require('react');
var Code = require('./../public/code.js').default;
var userManageMixin = require('../ajax/userManage.js').default;
var safeCenterMixin = require('../ajax/safeCenter.js').default;
var mobileReg = React.createClass({
    mixins: [userManageMixin, safeCenterMixin],
    getInitialState(){
        return {
            mobile: '',
            code: '',
            password: '',
            password2: '',

            mobileVerifyMsg: '',
            codeVerifyMsg: '',
            passwordVerifyMsg: '密码长度8~16位，数字、字母、字符至少包含两种',

            isMobileVerify: false,
            isPasswordVerify: false
        }
    },
    onReg(){
        this.state.mobileVerifyMsg = '';
        this.state.codeVerifyMsg = '';
        this.state.passwordVerifyMsg = '';
        if (!this.state.mobile) {
            this.setState({mobileVerifyMsg: '请输入手机号'});

        }
        if (!this.state.code) {
            this.setState({codeVerifyMsg: '请输入验证码'});

        }
        if (!this.state.password) {
            this.setState({passwordVerifyMsg: '请输入密码'});
            return

        }
        if (!this.state.password2) {
            this.setState({passwordVerifyMsg: '请确认密码'});
            return
        }

        if (this.state.password.length < 8 ||
            this.state.password.length > 16 ||
            /^\d+$/.test(this.state.password) ||
            /^[A-Za-z]+$/.test(this.state.password) ||
            /^[^A-Za-z0-9]+$/.test(this.state.password)) {
            this.setState({passwordVerifyMsg: '密码长度8~16位，数字、字母、字符至少包含两种'});
            return
        }

        if (this.state.password2 !== this.state.password) {
            this.setState({passwordVerifyMsg: '密码不一致'});
            return
        }

        if (this.state.isMobileVerify  && this.state.isPasswordVerify) {
            this.registerByMobile(this.state.mobile, this.state.password, this.state.code, function () {
                location.href = "/zd/openService.html";
            });
        }
    },
    onChange(event){
        var target = event.target;
        var name = target.name;
        var value = target.value;
        var newState = {};
        newState[name] = value;
        this.setState(newState);
    },
    onBlurMobile(){
        this.setState({isMobileVerify: false, mobileVerifyMsg: ''});
        if (this.state.mobile.length === 11) {
            this.isMobileExist(this.state.mobile, (data)=> {
                if (data) {
                    this.setState({mobileVerifyMsg: '该手机号已存在', isMobileVerify: false, codeVerifyMsg: ''});
                } else {
                    this.setState({mobileVerifyMsg: '可以使用该号码', isMobileVerify: true, codeVerifyMsg: ''});
                }
            });
        } else {
            this.setState({mobileVerifyMsg: '手机号码格式不正确'});
        }
    },
    onBlurPwd(event){
        var name = event.target.name;
        var val = event.target.value;
        this.state.isPasswordVerify = true;
        this.state.passwordVerifyMsg = '';
        if (name === 'password') {
            if (this.state.password.length < 8 ||
                this.state.password.length > 16 ||
                /^\d+$/.test(this.state.password) ||
                /^[A-Za-z]+$/.test(this.state.password) ||
                /^[^A-Za-z0-9]+$/.test(this.state.password)) {
                this.state.passwordVerifyMsg = '密码长度8~16位，数字、字母、字符至少包含两种';
                this.state.isPasswordVerify = false;
            }
        }
        if (name === 'password2') {
            if (this.state.password2.length < 8 ||
                this.state.password2.length > 16 ||
                /^\d+$/.test(this.state.password2) ||
                /^[A-Za-z]+$/.test(this.state.password2) ||
                /^[^A-Za-z0-9]+$/.test(this.state.password2)) {
                this.state.passwordVerifyMsg = '密码长度8~16位，数字、字母、字符至少包含两种';
                this.state.isPasswordVerify = false;
            }
        }
        this.forceUpdate();
    },
    setCodeVerifyMsg(msg){
        this.setState({codeVerifyMsg: msg})
    },
    render()
    {
        return (
            <div>
                <label>手机号<i>{this.state.mobileVerifyMsg}</i></label>
                <input type="text" name="mobile" value={this.state.mobile} onChange={this.onChange}
                       onBlur={this.onBlurMobile}/>
                <label>验证码<i>{this.state.codeVerifyMsg}</i></label>

                <div className="code"><input type="text" name="code" value={this.state.code}
                                             onChange={this.onChange}/>
                    <Code mobile={this.state.mobile}
                          mobileVerify={this.state.isMobileVerify}
                          handle={this.setCodeVerifyMsg} isReg/>
                </div>
                <label>设置密码<i>{this.state.passwordVerifyMsg}</i></label>
                <input type="password" name="password" value={this.state.password} onChange={this.onChange}
                       onBlur={this.onBlurPwd}/>
                <label>确认密码</label>
                <input type="password" name="password2" value={this.state.password2} onChange={this.onChange}
                       onBlur={this.onBlurPwd}/>
                <a className="regBtn" onClick={this.onReg}>立即注册</a>
            </div>
        )
    }
});
exports['default'] = mobileReg;