var cas = document.getElementById('cas');
var context = cas.getContext("2d");
var _w = cas.width,_h = cas.height,t=0;
var radius = 20; //涂抹的半径
var moveX = 0;
var moveY = 0;
var isMouseDown = false;
//表示鼠标的状态，是否按下，默认为未按下false，按下true

//生成画布上的遮罩，默认为颜色#666
function drawMask(context){
	context.fillStyle="#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation = "destination-out";
}
//在画布上画半径为30的圆
function drawPoint(context,moveX,moveY){
	context.save();
	context.beginPath();
	context.arc(moveX,moveY,radius,0,2*Math.PI);
	context.fillStyle = "red";
	context.fill();
	context.restore();
}
function drawLine(context,x1,y1,x2,y2){
	context.save();
	context.lineCap = "round";
	context.lineWidth = radius*2;	
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
	context.restore();
}
//在canvas画布上监听自定义事件"mousedown"，调用drawPoint函数
cas.addEventListener("mousedown",function(evt){
	isMouseDown = true;
	var event = evt || window.event;
	//获取鼠标在视口的坐标，传递参数到drawPoint
	moveX = event.clientX;
	moveY = event.clientY;
	drawPoint(context,moveX,moveY);
},false);
//增加监听"mousemove",调用drawPoint函数
cas.addEventListener("mousemove",fn1,false);
function fn1(evt){
	//判断，当isMouseDown为true时，才执行下面的操作
	if( !isMouseDown ){
		return false;
	}else{
		var event = evt || window.event;
		var x2 = event.clientX;
		var y2 = event.clientY;
		//drawPoint(context,a,b);
		drawLine(context,moveX,moveY,x2,y2);
		//每次的结束点变成下一次划线的开始点
		moveX = x2;
		moveY = y2;
	}
}
cas.addEventListener("mouseup",function(){
	//还原isMouseDown 为false
	isMouseDown = false;
	if( getTransparencyPercent(context) > 50){
		alert("超过了50%的面积");
		//drawMask(context);
		clearRect(context);
	}
},false);

function clearRect(context){
	context.clearRect(0,0,_w,_h);
}
function getTransparencyPercent(context){
	var imgData = context.getImageData(0,0,_w,_h);	
	for(var i =0; i<imgData.data.length; i+=4){
		var a = imgData.data[i+3];
		if( a === 0 ){
			t++;
		}
	}
	var percent =  (t / (_w*_h) )*100;
	console.log("透明点的个数："+ t );
	console.log("占总面积"+ Math.ceil(percent) +"%" );	
	//return percent.toFixed(2); //截取小数点两位
	return  Math.round( percent );

}
window.onload = function(){
	drawMask(context);
};