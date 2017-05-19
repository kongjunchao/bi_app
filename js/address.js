var address_result = {city : '', city_name : '全国'},
	currentCity = document.getElementById('currentCity');

FUNC.showLoading();
mui.ajax('./json/city.json', {
//mui.ajax(_URL + 'api_city', {
	data : {
		
	},
	dataType : 'json',
	type : 'post',
	timeout : _OVERTIME,
	headers : {'Content-Type' : 'application/json'},
	success : function(data){
		console.log(data);
		var data = {
			city : data.data.city_list,
			hotCity : data.data.hot_city
		}
		var tpl = document.getElementById('tpl').innerHTML;
		var html = juicer(tpl, data);
		document.getElementById('main').innerHTML = html;
		var hot_city_list = document.getElementsByClassName('hot-city-list')[0].childNodes[1];
		var data_list = document.getElementsByClassName('data-list')[0].childNodes[1];
		//监测搜索框
		document.getElementsByClassName('search-address-input')[0].addEventListener('change', function(){
			var input_val = this.value.trim(),
				str = '';
			for(var i = 0, len = data.city.length; i < len; i++){
				if(data.city[i].city_name.indexOf(input_val) !== -1){
					str += '<li data-city="' + data.city[i].city + '">' + data.city[i].city_name + '</li>';
				}
			}
			data_list.innerHTML = str;
		}, false)
		//点击城市列表
		data_list.addEventListener('tap', function(ev){
			if(ev.target.toString() === '[object HTMLLIElement]'){
				address_result.city_name = ev.target.innerHTML;
				address_result.city = ev.target.getAttribute('data-city') || '';
				mui.back();
			}else{
				return;
			}
		}, false)
		//点击热门城市
		hot_city_list.addEventListener('tap', function(ev){
			if(ev.target.toString() === '[object HTMLLIElement]'){
				address_result.city_name = ev.target.innerHTML;
				address_result.city = ev.target.getAttribute('data-city') || '';
				mui.back();
			}else{
				return;
			}
		}, false)
		//点击地理定位城市
//		mui('p').on('tap', '#currentCity', function(ev){
//			var city = this.getAttribute('data-city');
//			if(!city || city === ''){
//				return;
//			}else{
//				address_result.city_name = city;
//				mui.back();
//			}
//		}, false)
		FUNC.hideLoading();
	},
	error : function(){
		FUNC.hideLoading();
		mui.alert('请求失败');
	}
})

mui.init({
	beforeback : function(){
		var page = plus.webview.getWebviewById('index.html');
		mui.fire(page, 'getAddress', {
			address : address_result
		})
	}
})

//获取地理位置
mui.plusReady(function(){
	plus.geolocation.getCurrentPosition(function(loc){
		//调用高德地图API
		mui.ajax('http://restapi.amap.com/v3/geocode/regeo', {
			data : {
				key : '53d84c4a58090a91662e21cf117619d0',
				location : loc.coords.longitude + ',' + loc.coords.latitude
			},
			type : 'get',
			timeout : _OVERTIME,
			success : function(data){
				var addressComponent = data.regeocode.addressComponent,
					city = '';
				if(Object.prototype.toString.call(addressComponent.city) === '[object Array]' && addressComponent.city.length === 0){
					city = addressComponent.province;
				}else{
					city = addressComponent.city;
				}
				city = city.replace(/市$/gi, '');
				currentCity.innerHTML = city;
				currentCity.setAttribute('data-city', city);
			},
			error : function(){
				currentCity.innerHTML = '未获取到城市信息';
			}
		})
	})
})