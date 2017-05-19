//返回登录页
mui('body').on('tap', '.login_btn', function(){
	mui.openWindow({
		url : 'login.html',
		id : 'login.html',
		show : {
			aniShow : 'slide-in-left'
		}
	})
})