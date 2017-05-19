var index = 0,
	subpages = ['realtime.html', 'order.html', 'user.html', 'car.html', 'charge_back.html'],
	activeTab = subpages[index],
	title = document.getElementById('title'),
	city = document.getElementById('pick_city_btn'),
	city_realtime = '全国',
	city_order = '全国',
	city_user = '全国',
	city_car = '全国',
	city_charge_back = '全国',
	isAddressWebview = false;
	
mui.plusReady(function(){
	var self = plus.webview.currentWebview();
	for(var i = 0; i < 5; i++){
		var sub = plus.webview.create(
			subpages[i],
			subpages[i],
			{
				top : '46px',
				bottom : '46px'
			}
		)
		if(i !== index){
			sub.hide();
		}
		self.append(sub);
	}
	mui('.footer').on('tap', 'a', function(e){
		var targetTab = this.getAttribute('href'),
			animateShow = '',
			animateHide = '',
			nowIndex;
		if(targetTab === activeTab){
			return;
		}
		switch(targetTab){
			case 'realtime.html' : nowIndex = 0;
								   break;
			case 'order.html' : nowIndex = 1;
								break;
			case 'user.html' : nowIndex = 2;
							   break;
			case 'car.html' : nowIndex = 3;
							  break;
			case 'charge_back.html' : nowIndex = 4;
							  break;				  
		}
		if(nowIndex > index){
			animateShow = 'slide-in-right';
			animateHide = 'slide-out-left';
		}else{
			animateShow = 'slide-in-left';
			animateHide = 'slide-out-right';
		}
		title.innerHTML = this.lastChild.innerHTML;
		this.parentNode.getElementsByTagName('a')[index].className = "iconfont";
		this.className = "iconfont active";
		plus.webview.show(targetTab, animateShow, 300);
		plus.webview.hide(activeTab, animateHide, 300);
		activeTab = targetTab;
		index = nowIndex;
		changeAddress();
	})
	var page_1 = plus.webview.getWebviewById('realtime.html'),
		page_2 = plus.webview.getWebviewById('order.html'),
		page_3 = plus.webview.getWebviewById('user.html'),
		page_4 = plus.webview.getWebviewById('car.html'),
		page_5 = plus.webview.getWebviewById('charge_back.html');
	window.addEventListener('getAddress', function(ev){
		var address = ev.detail.address;
		if(address){
			if(index === 0){
				city_realtime = city_order = city_user = city_car = city_charge_back = address.city_name;
				mui.fire(page_1, 'changeAddress', {
					address : address,
					type : 'all'
				})
				mui.fire(page_2, 'changeAddress', {
					address : address,
					type : 'all'
				})
				mui.fire(page_3, 'changeAddress', {
					address : address,
					type : 'all'
				})
				mui.fire(page_4, 'changeAddress', {
					address : address,
					type : 'all'
				})
				mui.fire(page_5, 'changeAddress', {
					address : address,
					type : 'all'
				})
			}else if(index === 1){
				city_order = address.city_name;
				mui.fire(page_2, 'changeAddress', {
					address : address,
					type : 'single'
				})
			}else if(index === 2){
				city_user = address.city_name;
				mui.fire(page_3, 'changeAddress', {
					address : address,
					type : 'single'
				})
			}else if(index === 3){
				city_car = address.city_name;
				mui.fire(page_4, 'changeAddress', {
					address : address,
					type : 'single'
				})
			}else if(index === 4){
				city_charge_back = address.city_name;
				mui.fire(page_5, 'changeAddress', {
					address : address,
					type : 'single'
				})
			}
			changeAddress();
		}
		isAddressWebview = false;
	}, false)
})

mui('.header').on('tap', '#pick_city_btn', function(){
	if(!isAddressWebview){
		isAddressWebview = true;
		mui.openWindow({
			url : 'address.html',
			id : 'address.html',
			styles : {
				top : '46px',
				bottom : '0px'
			},
			show : {
				aniShow : 'slide-in-bottom'
			}
		})
	}else{
		isAddressWebview = false;
		plus.webview.close('address.html', 'slide-out-bottom');
	}
})

function changeAddress(){
	if(index === 0){
		city.innerHTML = city_realtime;
	}else if(index === 1){
		city.innerHTML = city_order;
	}else if(index === 2){
		city.innerHTML = city_user;
	}else if(index === 3){
		city.innerHTML = city_car;
	}else if(index === 4){
		city.innerHTML = city_charge_back;
	}
}

window.addEventListener('getAddressError', function(ev){
	var page = ev.detail.page;
	var city = ev.detail.city;
	if(page === 'realtime.html'){
		city_realtime = city.city_name;
	}else if(page === 'order.html'){
		city_order = city.city_name;
	}else if(page === 'user.html'){
		city_user = city.city_name;
	}else if(page === 'car.html'){
		city_car = city.city_name;
	}else if(page === 'charge_back.html'){
		city_charge_back = city.city_name;
	}
	changeAddress();
})