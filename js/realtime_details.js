var timeVal = [];
for(var i = 0; i < 24; i++){
	timeVal[i] = i;
}

mui.plusReady(function(){
	var self = plus.webview.currentWebview(),
		data = {
			data : self.info,
			time : self.time,
			city : self.city
		};
	var tpl = document.getElementById('tpl').innerHTML;
	var html = juicer(tpl, data);
	document.getElementById('main').innerHTML = html;
	var userChart = echarts.init(document.getElementById('user_chart'));
	userChart.showLoading('default', {
		text : '',
		color : '#62dcd3'
	})
	mui.ajax(_URL + 'today_detail', {
		data : {
			act : data.data.type,
			city : data.city
		},
		dataType : 'json',
		type : 'post',
		timeout : _OVERTIME,
		headers : {'Content-Type' : 'application/json'},
		success : function(result){
			console.log(result);
			if(result.code === -402){
				mui.alert('请重新登录');
				mui.openWindow({
					url : 'login.html',
					id : 'login.html'
				})
			}
			var opt = {
				userChart : userChart,
				realtime : {
					show : true,
					name : data.data.name
				},
				x_data : {
					name : '时间',
					data : timeVal
				},
				y_data : [
					{
						dataIndex : 0,
						name : '今日实时',
						data : result.data.today
					},
					{
						dataIndex : 1,
						name : '昨日实时',
						data : result.data.last_week_day
					}
				]
			};
			var myEcharts = Echarts(opt);
			userChart.hideLoading();
			userChart.resize();
		},
		error : function(){
			mui.alert('请求失败');
			userChart.hideLoading();
			userChart.resize();
		}
	})
})