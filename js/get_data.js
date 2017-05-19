var lock = false;
var city = {
	city : '',
	city_name : '全国'
};
var cache_city = {
	city : '',
	city_name : '全国'
};
var tpl = document.getElementById('tpl').innerHTML;
var isFirstShow = true;

mui.plusReady(function(){
	var nw = plus.webview.getWebviewById(_webview);
	nw.addEventListener('show', function(e){
		if(isFirstShow){
			updateData('', function(){
				mui.alert(_name + '请求失败');
			});
		}else{
			return;
		}
	}, false)
})

//更新数据
function updateData(successCallback, errorCallback, type){
	var successCallback = successCallback || function(){};
	var errorCallback = errorCallback || function(){};
	var type = type || '';
	if(lock){
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
		return;
	}
	lock = true;
	FUNC.forbidUserTouch();
	if(type !== 'refreshData'){
		FUNC.showLoading();
	}
	mui.ajax(_URL + _api, {
		data : {
			action : 'list',
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
				dataTop : data.data.top,
				dataNormal : data.data.normal
			}
			var html = juicer(tpl, data);
			document.getElementById('main').innerHTML = html;
			//初始化图表
			var dataName_1 = mui('.title-box')[0].getAttribute('data-name');
			var dataType_1 = mui('.title-box')[0].getAttribute('data-type');
			//充返页面两个维度需要做对比
			if(_webview === 'charge_back.html'){
				var dataName_2 = mui('.title-box')[1].getAttribute('data-name');
				var dataType_2 = mui('.title-box')[1].getAttribute('data-type');
				setTimeout(function(){
					changeDataType([{dataName : dataName_1, dataType : dataType_1}, {dataName : dataName_2, dataType : dataType_2}]);
				}, 500)
				mui('.box-1').on('tap', '.title-box', function(){
					changeDataType([{dataName : dataName_1, dataType : dataType_1}, {dataName : dataName_2, dataType : dataType_2}]);
				})
			}else{
				setTimeout(function(){
					changeDataType({dataName : dataName_1, dataType : dataType_1});
				}, 500)
				mui('.box-1').on('tap', '.title-box', function(){
					getInfo(this, 'changeDataType');
				})
			}
			//点击切换图表
			mui('.data-list').on('tap', 'li', function(){
				getInfo(this, 'changeDataType');
			})
			//长按显示数据详情
			mui('.data-list').on('longtap', 'li', function(){
				getInfo(this, 'showDataDetails');
			})
			mui('.box-1').on('longtap', '.title-box', function(){
				getInfo(this, 'showDataDetails');
			})
			successCallback();
			if(type !== 'refreshData'){
				FUNC.hideLoading();
			}
			FUNC.cancelUserTouch();
			isFirstShow = false;
			lock = false;
		},
		error : function(){
			errorCallback();
			if(type !== 'refreshData'){
				FUNC.hideLoading();
			}
			FUNC.cancelUserTouch();
			lock = false;
		}
	})
}

juicer.register('regName', function(data){
	return data.replace(/^昨日/g, '');
})

mui.init({
	gestureConfig : {
		longtap : true
	},
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
					mui.alert(_name + '请求失败');
				}, 'refreshData');
			}
		}
	}
})

function getInfo(o, type){
	if(lock || !o || !type){
		return;
	}
	if(!o.getAttribute('data-name') || !o.getAttribute('data-type')){
		return;
	}
	lock = true;
	var dataName = o.getAttribute('data-name');
	var dataType = o.getAttribute('data-type');
	if(type === 'changeDataType'){
		changeDataType({dataName : dataName, dataType : dataType});
	}else if(type === 'showDataDetails'){
		showDataDetails({dataName : dataName, dataType : dataType});
	}
}

function showDataDetails(o){
	if(!o){
		return;
	}
	FUNC.showLoading();
	mui.ajax(_URL + _api, {
		data : {
			action : 'detail',
			field : o.dataType,
			city : city.city
		},
		dataType : 'json',
		type : 'post',
		timeout : _OVERTIME,
		headers : {'Content-Type' : 'application/json'},
		success : function(data){
			var data = data.data;
			var str = '<ul class="data-details-ul"><li><span>日期</span><span>' + o.dataName + '</span><a href="javascript:void(0);" class="iconfont" id="close">&#xe611;</a></li>';
			for(var i = 0, len = data.date.length; i < len; i++){
				str += '<li><span>' + data.date[i] + '</span><span>' + data.nums[i] + '</span></li>';
			}
			str += '</ul>';
			FUNC.hideLoading();
			$('body').append(str);
			$('#close').on('tap', function(e){
				e.stopPropagation();
				$('.data-details-ul').remove();
				$('#close').off('tap');
				lock = false;
			})
		},
		error : function(){
			FUNC.hideLoading();
			mui.alert(o.dataName + '请求失败');
			lock = false;
		}
	})
}

function changeDataType(o){
	var userChart = echarts.init(document.getElementById('user_chart'));
	userChart.showLoading('default', {
		text : '',
		color : '#62dcd3'
	})
	if(typeof(o) === 'object' && Object.prototype.toString.call(o) !== '[object Array]'){
		mui.ajax(_URL + _api, {
			data : {
				action : 'detail',
				field : o.dataType,
				city : city.city
			},
			dataType : 'json',
			type : 'post',
			timeout : _OVERTIME,
			headers : {'Content-Type' : 'application/json'},
			success : function(data){
				console.log(data);
				var newDataArr = [];
				var unit = '';
				if(data.data.nums[0] > 100000 || data.data.nums[0] < -100000){
					newDataArr = data.data.nums.map(FUNC.changeUnit);
					unit = '万';
				}
				var opt = {
					userChart : userChart,
					x_data : {
						name : '日期',
						data : data.data.date
					},
					y_data : {
						name : o.dataName,
						unit : unit,
						data : newDataArr.length !== 0 ? newDataArr : data.data.nums
					}
				};
				var myEcharts = Echarts(opt);
				lock = false;
				userChart.hideLoading();
				userChart.resize();
			},
			error : function(){
				mui.alert(_name + '请求失败');
				lock = false;
				userChart.hideLoading();
				userChart.resize();
			}
		})
	}else{
		mui.ajax(_URL + _api, {
			data : {
				action : 'detail',
				field : o[0].dataType,
				city : city.city
			},
			dataType : 'json',
			type : 'post',
			timeout : _OVERTIME,
			headers : {'Content-Type' : 'application/json'},
			success : function(data_1){
				console.log(data_1);
				mui.ajax(_URL + _api, {
					data : {
						action : 'detail',
						field : o[1].dataType,
						city : city.city
					},
					dataType : 'json',
					type : 'post',
					timeout : _OVERTIME,
					headers : {'Content-Type' : 'application/json'},
					success : function(data_2){
						console.log(data_2);
						var newDataArr_1 = [];
						var newDataArr_2 = [];
						var unit = '';
						if(data_1.data.nums[0] > 100000 || data_1.data.nums[0] < -100000 || data_2.data.nums[0] > 100000 || data_2.data.nums[0] < -100000){
							newDataArr_1 = data_1.data.nums.map(FUNC.changeUnit);
							newDataArr_2 = data_2.data.nums.map(FUNC.changeUnit);
							unit = '万';
						}
						if(data_1.data.date[0] !== data_2.data.date[0]){
							mui.alert('出错了');
							return;
						}
						var opt = {
							userChart : userChart,
							x_data : {
								name : '日期',
								data : data_2.data.date
							},
							y_axis_name : '金额',
							unit : unit,
							y_data : [
								{
									name : o[0].dataName,
									data : newDataArr_1.length !== 0 ? newDataArr_1 : data_1.data.nums
								},
								{
									name : o[1].dataName,
									data : newDataArr_2.length !== 0 ? newDataArr_2 : data_2.data.nums
								}
							]
						};
						var myEcharts = Echarts(opt);
						lock = false;
						userChart.hideLoading();
						userChart.resize();
					},
					error : function(){
						mui.alert(_name + '请求失败');
						lock = false;
						userChart.hideLoading();
						userChart.resize();
					}
				})
			},
			error : function(){
				mui.alert(_name + '请求失败');
				lock = false;
				userChart.hideLoading();
				userChart.resize();
			}
		})
	}
}

window.addEventListener('changeAddress', function(ev){
	var address = ev.detail.address;
	var type = ev.detail.type;
	if(address){
		city.city = address.city;
		city.city_name = address.city_name;
		updateData(function(){
			cache_city.city = city.city;
			cache_city.city_name = city.city_name;
		}, function(){
			if(type === 'single'){
				mui.alert(_name + '请求失败');
			}
			city.city = cache_city.city;
			city.city_name = cache_city.city_name;
			var page = plus.webview.getWebviewById('index.html');
			mui.fire(page, 'getAddressError', {
				page : _webview,
				city : cache_city
			})
		});
	}
}, false)