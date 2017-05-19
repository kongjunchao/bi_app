var APP = {
	phone : $('#phone'),
	password : $('#password'),
	loginBtn : $('#login_btn'),
	lock : false,
	init : function(){
		var that = this;
		if(localStorage['login_phone']){
			that.phone.val(localStorage['login_phone']);
		}
		if(localStorage['login_password']){
			that.password.val(localStorage['login_password']);
			that.loginBtn.addClass('active');
		}
		//版本更新
		$('.version_btn').on('tap', function(){
			mui.openWindow({
				url : 'version.html',
				id : 'version.html'
			})
		})
		//监听输入框
		$('.input-box input').on('input', function(){
			if(FUNC.checkForm.isPhone(that.phone.val()) && !FUNC.checkForm.isEmpty(that.password.val())){
				that.loginBtn.addClass('active');
			}else{
				that.loginBtn.removeClass('active');
			}
		})
		//点击登录
		mui('.login-box').on('tap', '#login_btn', function(){
			if(!that.loginBtn.hasClass('active') || that.lock){
				return;
			}
			that.lock = true;
			var phoneVal = $.trim(that.phone.val()),
				passwordVal = $.trim(that.password.val());
			FUNC.showLoading();
			$.ajax({
				url : _URL + 'login',
				type : 'post',
				data : {
					mobile : phoneVal,
					password : passwordVal
				},
				timeout : _OVERTIME,
				success : function(data){
					var data = JSON.parse(data);
					if(data.code === 1){
						localStorage['login_phone'] = phoneVal;
						localStorage['login_password'] = passwordVal;
						//判断版本
						if(!data.data.version || data.data.version !== _VERSION){
							//判断设备
							if(window.navigator.userAgent.indexOf('Android') !== -1){
								mui.confirm('当前不是最新版本，是否需要下载', '', ['取消', '下载'], function(e){
									if(e.index === 1){
										var dtask = plus.downloader.createDownload('http://kongjunchao.com/app/bi_app/release/YIDAO_BI_ANDROID.apk', {}, function(d, status){
											if(status === 200){
												mui.alert("下载成功，请先移除该APP，然后安装" + d.filename + '文件');
											}else{
												mui.alert("下载失败");
											}
											that.lock = false;
											FUNC.hideLoading();
										})
										dtask.start();
									}else{
										that.lock = false;
										FUNC.hideLoading();
										mui.openWindow({
											url : 'index.html',
											id : 'index.html'
										})
									}
								});
							}else{
								mui.confirm('当前不是最新版本，由于设备限制，请前往http://kongjunchao.com/app/bi_app/地址下载，并通过iTunes安装', '', ['取消', '知道了'], function(e){
									that.lock = false;
									FUNC.hideLoading();
									mui.openWindow({
										url : 'index.html',
										id : 'index.html'
									})
								});
							}
						}else{
							that.lock = false;
							FUNC.hideLoading();
							//跳转到首页
							mui.openWindow({
								url : 'index.html',
								id : 'index.html'
							})
						}
					}else{
						mui.alert('登录失败');
						that.lock = false;
						FUNC.hideLoading();
					}
				},
				error : function(){
					mui.alert('网络出错了');
					that.lock = false;
					FUNC.hideLoading();
				}
			})
		})
	}
}

mui.plusReady(function(){
	APP.init();
})