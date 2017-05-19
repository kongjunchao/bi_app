var FUNC = {
	
	//显示加载框
	showLoading : function(){
		this.hideLoading();
		var div = document.createElement('div');
		var box = document.createElement('div');
		div.appendChild(box);
		div.setAttribute('class', 'loading');
		document.body.appendChild(div);
	},
	
	//移除加载框
	hideLoading : function(){
		var loading = document.getElementsByClassName('loading');
		for(var i = 0, len = loading.length; i < len; i++){
			loading[0].parentNode.removeChild(loading[0]);
		}
	},
	
	//改变单位
	changeUnit : function(num){
		return num / 10000;
	},
	
	//表单验证
	checkForm : {

		//判断是否为空，真为空，假为非空
		isEmpty : function(str){
			return !str.trim() ? true : false;
		},

		//限制长度，真为在范围内，假为不在范围内
		isLength : function(str, min, max){
			var str = str.trim(),
				min = min || 0,
				max = max || 100;
			if(str.length >= min && str.length <= max){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为数字，真为数字，假为非数字
		isNumber : function(num){
			var num = num.trim();
			if(!isNaN(num) && num !== ""){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为手机号，真为手机号，假为非手机号
		isPhone : function(str){
			var str = str.trim();
			if(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/.test(str)){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为邮箱地址，真为邮箱地址，假为非邮箱地址
		isEmail : function(str){
			var str = str.trim();
			if(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(str)){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为QQ号，真为QQ号，假为非QQ号
		isQQ : function(str){
			var str = str.trim();
			if(/^[1-9]\d{4,}$/.test(str)){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为URL地址，真为URL地址，假为非URL地址
		isURL : function(str){
			var str = str.trim();
			if(/^[a-zA-Z]+[://][^\s]*$/.test(str)){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为汉字，真为汉字，假为非汉字
		isChinese : function(str){
			var str = str.trim();
			if(/^[\u4e00-\u9fa5]+$/.test(str)){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为汉字、字母、数字，真为匹配，假为不匹配
		isChineseOrEnglishOrNum : function(str){
			var str = str.trim();
			if(/^([\u4e00-\u9fa5]|[a-zA-Z]|[0-9])+$/.test(str)){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为邮编，真为邮编，假为非邮编
		isPostCode : function(str){
			var str = str.trim();
			if(/^[1-9]\d{5}$/.test(str)){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为身份证号码，真为身份证号码，假为非身份证号码
		isIDNumber : function(str){
			var str = str.trim();
			if(/^\d{15}(\d\d[0-9xX])?$/.test(str)){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为正整数（不包含0），真为正整数，假为非正整数
		isPositiveInteger : function(str){
			var str = str.trim();
			if(/^[0-9]*[1-9][0-9]*$/.test(str)){
				return true;
			}else{
				return false;
			}
		},

		//判断是否为非负整数（正整数或0），真为匹配，假为不匹配
		isPositiveIntegerOrZero : function(str){
			var str = str.trim();
			if(/^\d+$/.test(str)){
				return true;
			}else{
				return false;
			}
		}
	},
	
	//取任意范围内的随机正整数
	getRandomNum : function(min, max){
		var min = min || 0,
			max = max || 10;
		return parseInt(Math.random() * (max - min + 1) + min, 10);
	},
	
	//禁止用户操作
	forbidUserTouch : function(){
		document.addEventListener('touchstart', this.handleTouch, false);
		document.addEventListener('touchmove', this.handleTouch, false);
	},
	
	//取消禁止用户操作
	cancelUserTouch : function(){
		document.removeEventListener('touchstart', this.handleTouch, false);
		document.removeEventListener('touchmove', this.handleTouch, false);
	},
	
	handleTouch : function(e){
		e.preventDefault();
		e.stopPropagation();
	}
}

//绘制Echarts
function Echarts(option){
	var userChart = option.userChart,
		tooltip = {
			show : true,
			triggerOn : 'click',
			formatter : function(data){
				return data.name + '<br>' + data.seriesName + '<br>' + data.value;
			}
		},
		grid = {
			left : '6%',
			right : '5%',
			bottom : '3%',
			containLabel : true
		},
		axisLine = {
			lineStyle : {
				color : '#888888'
			}
		},
		xAxis = {
			type : 'category',
			name : option.x_data.name,
			nameLocation : 'start',
			data : option.x_data.data,
			boundaryGap : ['30%', '30%'],
			axisLine : axisLine,
			splitLine : {
				show : true,
				lineStyle : {
					color : '#f2f5fa'
				}
			}
		},
		lineStyle = {
			normal : {
				color : '#62dcd3'
			}
		},
		itemStyle = {
			normal : {
				color : '#62dcd3',
				borderWidth : '4',
				borderColor : '#62dcd3'
			},
			emphasis : {
				color : '#62dcd3',
				borderWidth : '4',
				borderColor : '#62dcd3'
			}
		},
		lineStyle_1 = {
			normal : {
				color : '#ff6c60'
			}
		},
		itemStyle_1 = {
			normal : {
				color : '#ff6c60',
				borderWidth : '4',
				borderColor : '#ff6c60'
			},
			emphasis : {
				color : '#ff6c60',
				borderWidth : '4',
				borderColor : '#ff6c60'
			}
		},
		splitLine = {
			show : true,
			lineStyle : {
				color : '#f2f5fa'
			}
		},
		textStyle = {
			color : '#888888'
		},
		option_info_two = function(){
			return {
				legend : {
					data : [option.y_data[0].name, option.y_data[1].name],
					textStyle : textStyle
				},
				tooltip : tooltip,
				grid : grid,
				xAxis : xAxis,
				yAxis : [
					{
						type : 'value',
						name : option.y_axis_name + (option.unit !== '' ? '（' + option.unit + '）' : ''),
						splitLine : splitLine,
						axisLine : axisLine
					}
				],
				series : [
					{
						name : option.y_data[0].name,
						type : 'line',
						showAllSymbol : true,
						data : option.y_data[0].data,
						lineStyle : lineStyle,
						itemStyle : itemStyle
					},
					{
						name : option.y_data[1].name,
						type : 'line',
						showAllSymbol : true,
						data : option.y_data[1].data,
						lineStyle : lineStyle_1,
						itemStyle : itemStyle_1
					}
				]
			}
		},
		option_info_one = function(){
			return {
				legend : {
					data : [option.y_data.name],
					textStyle : textStyle
				},
				tooltip : tooltip,
				grid : grid,
				xAxis : xAxis,
				yAxis : [
					{
						type : 'value',
						name : option.y_data.name + (option.y_data.unit !== '' ? '（' + option.y_data.unit + '）' : ''),
						splitLine : splitLine,
						axisLine : axisLine
					}
				],
				series : [
					{
						name : option.y_data.name,
						type : 'line',
						showAllSymbol : true,
						data : option.y_data.data,
						lineStyle : lineStyle,
						itemStyle : itemStyle
					}
				]
			}
		},
		option_info_realtime = function(){
			return {
				legend : {
					data : [option.y_data[0].name, option.y_data[1].name],
					textStyle : textStyle
				},
				tooltip : {
					show : true,
					triggerOn : 'click',
					formatter : function(data){
						return data.name + ':00<br>' + data.seriesName + '<br>' + data.value;
					}
				},
				grid : grid,
				xAxis : {
					type : 'category',
					name : option.x_data.name,
					nameLocation : 'start',
					data : option.x_data.data,
					boundaryGap : false,
					splitLine : {
						show : true,
						lineStyle : {
							color : '#f2f5fa'
						}
					},
					axisLine : axisLine
				},
				yAxis : [
					{
						type : 'value',
						name : option.realtime.name,
						splitLine : splitLine,
						axisLine : axisLine
					}
				],
				series : [
					{
						name : option.y_data[0].name,
						type : 'line',
						showAllSymbol : true,
						data : option.y_data[0].data,
						z : 4,
						lineStyle : lineStyle_1,
						itemStyle : itemStyle_1
					},
					{
						name : option.y_data[1].name,
						type : 'line',
						showAllSymbol : true,
						data : option.y_data[1].data,
						z : 3,
						lineStyle : lineStyle,
						itemStyle : itemStyle
					}
				]
			}
		};
	if(option.realtime && option.realtime.show === true){
		drawEcharts(userChart, option_info_realtime());
	}else if(Object.prototype.toString.call(option.y_data) === '[object Array]'){
		drawEcharts(userChart, option_info_two());
	}else{
		drawEcharts(userChart, option_info_one());
	}
}

function drawEcharts(o, option){
	o.setOption(option, true);
}