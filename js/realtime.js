var time = '';
var city = {
	city : '',
	city_name : '全国'
};
var cache_city = {
	city : '',
	city_name : '全国'
};
var tpl = document.getElementById('tpl').innerHTML;

updateData();
function updateData(successCallback, errorCallback, type){
	var successCallback = successCallback || function(){};
	var errorCallback = errorCallback || function(){};
	var type = type || '';
	FUNC.forbidUserTouch();
	if(type !== 'refreshData'){
		FUNC.showLoading();
	}
	mui.ajax(_URL + 'today', {
		data : {
			city : city.city
		},
		dataType : 'json',
		type : 'post',
		timeout : _OVERTIME,
		headers : {'Content-Type' : 'application/json'},
		success : function(data){
			console.log(data);
			if(data.code === -402){
				mui.alert('请重新登录');
				mui.openWindow({
					url : 'login.html',
					id : 'login.html'
				})
			}
			var data = {
				data : data.data
			}
			time = data.data.date_time;
			//完成订单
			var realtime_details_data_finish = {
				name : '完成订单',
				type : 'finish',
				today_realtime_data : data.data.finish,
				last_week_data : data.data.finishy,
				day_change_data : data.data.finish_change,
				day_balance_data : data.data.finish_balance,
				today_expect_data : data.data.finish_expect
			}
			//有效订单
			var realtime_details_data_valid = {
				name : '有效订单',
				type : 'valid',
				today_realtime_data : data.data.valid,
				last_week_data : data.data.validy,
				day_change_data : data.data.valid_change,
				day_balance_data : data.data.valid_balance,
				today_expect_data : data.data.valid_expect
			}
			//派单成功数
			var realtime_details_data_allocSuccess = {
				name : '派单成功数',
				type : 'allocSuccess',
				today_realtime_data : data.data.allocSuccess,
				last_week_data : data.data.allocSuccessy,
				day_change_data : data.data.allocSuccess_change,
				day_balance_data : data.data.allocSuccess_balance,
				today_expect_data : data.data.allocSuccess_expect
			}
			//注册用户
			var realtime_details_data_reg = {
				name : '注册用户',
				type : 'reg',
				today_realtime_data : data.data.reg,
				last_week_data : data.data.regy,
				day_change_data : data.data.reg_change,
				day_balance_data : data.data.reg_balance,
				today_expect_data : data.data.reg_expect
			}
			//订单收入
			var realtime_details_data_price = {
				name : '订单收入',
				type : 'price',
				today_realtime_data : data.data.price,
				last_week_data : data.data.pricey,
				day_change_data : data.data.price_change,
				day_balance_data : data.data.price_balance,
				today_expect_data : data.data.price_expect
			}
			//单均
			var realtime_details_data_average_price = {
				name : '单均',
				type : 'average_price',
				today_realtime_data : data.data.average_price,
				last_week_data : data.data.average_pricey,
				day_change_data : data.data.average_change,
				day_balance_data : data.data.average_balance,
				today_expect_data : data.data.average_expect
			}
			var html = juicer(tpl, data);
			document.getElementById('main').innerHTML = html;
			drawChart('order_num_chart', data.data.finish_rate, '#55cbf8');
			drawChart('order_money_chart', data.data.valid_rate, '#99d250');
			function getDataType(name){
				var data = {};
				switch(name){
					case '完成订单' : data = realtime_details_data_finish;
						break;
					case '有效订单' : data = realtime_details_data_valid;
						break;
					case '派单成功数' : data = realtime_details_data_allocSuccess;
						break;
					case '注册用户' : data = realtime_details_data_reg;
						break;
					case '订单收入' : data = realtime_details_data_price;
						break;
					case '单均' : data = realtime_details_data_average_price;
						break;
				}
				return data;
			}
			mui('.data-box').on('tap', 'li', function(){
				openRealtimeDetails(getDataType(this.getAttribute('data-name')));
			})
			mui('.box-1').on('tap', '.title-box', function(){
				openRealtimeDetails(getDataType(this.getAttribute('data-name')));
			})
			successCallback();
			if(type !== 'refreshData'){
				FUNC.hideLoading();
			}
			FUNC.cancelUserTouch();
		},
		error : function(){
			errorCallback();
			if(type !== 'refreshData'){
				FUNC.hideLoading();
			}
			FUNC.cancelUserTouch();
			mui.alert('请求失败');
		}
	})
}

mui.init({
	pullRefresh : {
		container : '#refreshContainer',
		down : {
			height : 50,	//下拉刷新拖动距离
			auto : false,	//自动下拉刷新一次
			contentdown : '下拉刷新页面',
			contentover : '释放更新数据',
			contentrefresh : '正在刷新',
			callback : function(){
				updateData(function(){
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				}, function(){
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				}, 'refreshData');
			}
		}
	}
})
	
//绘制圆环图
var drawChart = function(id, val, color){
	var orderNumChart = echarts.init(document.getElementById(id)),
		val = val,
		option = {
			toolbox : {
				show : false
			},
			series : [{
				type : 'pie',
				center : ['50%', '50%'],
				radius: ['100%', '85%'],
				data : [
					{
						value : val,
						itemStyle : {
							normal : {
								color : color,
								labelLine : {
									show : false
								}
							}
						}
					},
					{
						value : 100 - val,
						itemStyle : {
							normal : {
								color : '#f2f5fa',
								labelLine : {
									show : false
								}
							}
						}
					}
				]
			}]
		};
	orderNumChart.setOption(option);
}

function openRealtimeDetails(info){
	if(!info){
		return;
	}
	var webview = mui.openWindow({
		url : 'realtime_details.html',
		id : 'realtime_details',
		extras : {
			info : info,
			time : time,
			city : city.city
		}
	})
}

window.addEventListener('changeAddress', function(ev){
	var address = ev.detail.address;
	if(address){
		city.city = address.city;
		city.city_name = address.city_name;
		updateData(function(){
			cache_city.city = city.city;
			cache_city.city_name = city.city_name;
		}, function(){
			city.city = cache_city.city;
			city.city_name = cache_city.city_name;
			var page = plus.webview.getWebviewById('index.html');
			mui.fire(page, 'getAddressError', {
				page : 'realtime.html',
				city : cache_city
			})
		});
	}
}, false)