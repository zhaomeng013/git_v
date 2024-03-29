//一、类（轮播图）

class BannerPlayer{
	//构造函数
	constructor(obj,boxDom){
		//1、属性（数据）
		this.boxDom = boxDom;
		this.aDoms = []
		this.imgDoms = [];//存储所有的图片标签
		this.liDoms = [];//存储所有的li标签（豆豆）
		this.arrowBoxDom = null;//存储左右箭头的容器
		let defaultObj = {
			width:400,
			height:300,
			imgs:["img/01.jpg","img/02.jpg","img/03.jpg","img/04.jpg"],
			timeSpace:1000,
			
			douColor:"#c8c8cb",
			douHighColor:"#808080",
			douWidth:50,
			douHeight:30,
			douPos:"下",
			myTimer:null,
			ord:0,
			type:"fade"//切换效果的类型
		}
		for(let key in defaultObj){
			if(obj[key]){
				this[key] = obj[key];
			}else{
				this[key] = defaultObj[key];
			}
		}
		//2、创建外观（把数据应用在外观上）
		this.render();
		this.addEvent();
		this.autoPlay();
	}
	//外观（html和css代码）
	render(){
		this.boxDom.style.position = "relative";
		//创建a标签
		// for(let i=0;i<this.imgs.length;i++){
		// 	let aDom = document.createElement("a");
		// 	aDom.href = "http://www.vhlondon.cn/";
		// 	aDom.style.cssText = `
		// 		position: absolute;
		// 		left:0px;
		// 		top:0px;
		// 		width: 100%;
		// 		height: 100%;	
		// 		z-index: 1;`;
		// 	switch(this.type){
		// 		case "fade":aDom.style.opacity = (i==0?1:0);break;
		// 	}	
		// 	if(i==0){
		// 		aDom.style.zIndex = 2;
		// 	}
		// 	this.boxDom.appendChild(aDom);
		// 	this.aDoms.push(aDom);
		// }
		//1、创建图片
		for(let i=0;i<this.imgs.length;i++){
			let imgDom = document.createElement("img");
			imgDom.src = this.imgs[i];
			imgDom.style.cssText = `
				position: absolute;
				left:0px;
				top:0px;
				width: 100%;
				height: 100%;	
				z-index: 1;`;

			switch(this.type){
				case "fade":imgDom.style.opacity = (i==0?1:0);break;
			}
			if(i==0){
				imgDom.style.zIndex = 2;
			}
			this.boxDom.appendChild(imgDom);
			this.imgDoms.push(imgDom);
		}
		//2、创建豆豆
		//1)、豆豆的容器ul
		let doudouBox = document.createElement("ul");
		doudouBox.style.cssText = `
				padding:0px;
				margin:0px;
				position: absolute;
				list-style: none;
				z-index: 3;`;
		if(this.douPos=="上"){
			console.log((this.width-(this.douSize*(this.imgs.length*2-1)))/2);
			doudouBox.style.left = `${(this.width-(this.douSize*(this.imgs.length*2-1)))/2}px`;
			doudouBox.style.top = "20px";			
		}else if(this.douPos=="下"){
			// doudouBox.style.right = "20px";//
			doudouBox.style.left = `${(this.width-(this.douWidth*this.imgs.length+30))/2}px`;
			doudouBox.style.bottom = "0px";
		}	
		this.boxDom.appendChild(doudouBox);
		//2)、豆豆 li
		for(let i=0;i<this.imgs.length;i++){
			let liDom = document.createElement("li");
			liDom.setAttribute("index",i);
			liDom.style.cssText = `
				float:left;
				width:${this.douWidth}px;
				height: ${this.douHeight}px;
				margin: 0 5px;
				background-color: transparent;
				border-style:solid;
				border-width:2px;
				border-color: transparent;
				border-top-color:${this.douColor}
			`;
			
			if(i==0){
				liDom.style.borderTopColor=this.douHighColor;
			}
			doudouBox.appendChild(liDom);
			this.liDoms.push(liDom);//放在数组里，方便其它函数使用
		}

		//3、创建左右按钮
		//1)、创建左右箭头的容器
		this.arrowBoxDom = document.createElement("div");

		this.arrowBoxDom.style.cssText = `
				padding:0px;
				position: absolute;
				left:0px;
				top:${(this.height-64)/2}px;
				width: 100%;
				height: 64px;
				z-index: 4;
				`;
				
		this.boxDom.appendChild(this.arrowBoxDom);

		//2)、创建左右箭头
		let leftDivDom = document.createElement("div");
		leftDivDom.style.cssText = `
				float:left;
				height: 64px;
				width: 64px;
				border-radius:50%;
				cursor: pointer;
				background: url(img/arrows.png) no-repeat;
				background-position : 20px 15px;
				cursor: pointer;
				`;
		this.arrowBoxDom.appendChild(leftDivDom);


		let rightDivDom = document.createElement("div");
		rightDivDom.style.cssText = `
				float:right;
				height: 64px;
				width: 64px;
				border-radius:50%;
				background: url(img/arrows.png) no-repeat;
				background-position : 20px -75px;
				`;
		this.arrowBoxDom.appendChild(rightDivDom);
	}

	//添加事件
	addEvent(){
		//2、鼠标放在轮播图上会停止
		this.boxDom.onmouseover = ()=>{
			this.stopPlay();	
		}

		//3、鼠标离开轮播图会继续播放
		this.boxDom.onmouseout = ()=>{
			this.autoPlay();	
		}

		let obj = this;
		//4、点击豆豆，跳转到对应的图片
		for(var i=0;i<this.liDoms.length;i++){
			this.liDoms[i].onclick = function(){
				obj.goImg(parseInt(this.getAttribute("index")));
			};
		}

		//5、左右按钮
		let leftBtn = this.arrowBoxDom.firstElementChild;
		leftBtn.onclick = ()=>{
			this.preImg();
		}
		let rightBtn = this.arrowBoxDom.lastElementChild;
		rightBtn.onclick = ()=>{
			this.nextImg();
		}
	}

	//自动播放
	autoPlay(){
		if(this.myTimer!=null){//如果有定时器，就不再启动新的定时器了
			return;//
		}

		this.myTimer = setInterval(()=>{
			//一、改变数据
			//1、计算数据（改变图片的下标）
			var preOrd = this.ord;//上一张的序号 4
			this.ord++;//5

			//2、边界
			if(this.ord>this.imgs.length-1){
				this.ord = 0;
			}

			//二、改变外观
			this.reRender(preOrd,this.ord);
		},this.timeSpace)

	}
	
	//停止播放
	stopPlay(){
		window.clearInterval(this.myTimer);//根据定时器编号，找到定时器对象，进行清除
		this.myTimer = null;//把定时器编号清除掉
	}

	//跳转到对应的图片上
	//参数：图片的下标
	// goImg(3);
	goImg(transOrd){
		//一、改变数据
		//1、计算数据（改变图片的下标）
		var preOrd = this.ord;//上一张的序号 
		this.ord = transOrd;//5

		//2、边界
		if(this.ord>this.imgs.length-1){
			this.ord = 0;
		}else if(this.ord<0){
			this.ord = this.imgs.length-1;
		}

		//二、改变外观
		this.reRender(preOrd,this.ord);
	}

	//改变外观的函数(重新渲染)
	reRender(preOrd,ord){
		// //1)、改图片
		// this.imgDoms[preOrd].style.opacity = 1;
		this.imgDoms[ord].style.opacity = 0;		
		this.fadeInOut(this.imgDoms[ord],this.imgDoms[preOrd],this.timeSpace/2);
		
		//2)、改豆豆的颜色
		this.liDoms[preOrd].style.borderTopColor=this.douColor;
		this.liDoms[ord].style.borderTopColor= this.douHighColor;
	}

	preImg(){
		this.goImg(this.ord-1);
	}

	nextImg(){
		this.goImg(this.ord+1);
	}

	//两个dom元素的淡入和淡出
	//参数：
	//domObjIn
	//domObjOut
	//时长
	fadeInOut(domObjIn,domObjOut,timeLong){
		var currOpacity = 0;
		var step = 1/(timeLong/10);
		var myTimer = setInterval(function(){
			//一、改变数据（逻辑）
			//1、修改数据
			currOpacity+=step;//
			//2、边界处理
			if(currOpacity>=1){
				currOpacity=1;
				window.clearInterval(myTimer);
			}
			//二、改变外观（呈现）
			domObjIn.style.opacity = currOpacity;
			domObjOut.style.opacity = 1- currOpacity;
		},10);
	}

}
jQuery.fn.extend({
	// 商品划过效果
	huoguo: function(uldom) {
		let liDoms = $(uldom).children()
		for(let i=0;i<liDoms.length;i++){
			$(liDoms[i]).bind({
				mouseover:function(){$(liDoms[i]).css("box-shadow","0px 0px 20px #d9d9d9");},  
				mouseout:function(){$(liDoms[i]).css("box-shadow","none");}  
			})
		
		}
  }
  
  
});
//商品划过效果

$(".list_ul_1").huoguo($(".list_ul_1"))


//  导航栏划过效果
window.onmousewheel= function(event){
	var evt = event || window.event;
	if(evt.pageY > evt.clientY){
		$(".vh_header_active").addClass("vh_header_fixed")
		$(".vh_header_top").hide()
		$(".nav_search").hide()
		$(".vh_logo").show()
		$(".vh_user").show()
		$(".nav_contain").css('margin-top','10px')
	}else{
		$(".vh_header_active").removeClass("vh_header_fixed")
		$(".vh_header_top").show()
		$(".vh_logo").hide()
		$(".nav_search").show()
		$(".vh_user").hide()
		$(".nav_contain").css('margin-top','0')

	}
}
//划过鼠标出现隐藏导航栏
$("#li_focus").mouseenter(function(){
	$(".nav_contain").show()
	
})
$(".nav_contain").mouseenter(function(){
	$(".nav_contain").show()
})
$(".nav_contain").mouseleave(function(){
		$(".nav_contain").hide()
	
	})
$("#li_focus").mouseleave(function(){
	$(".nav_contain").hide()
	
})
//视频播放

$("#video_img").click(function(){
	$("video").show()
	$("#close").show()
})
$("#close").click(function(){
	$("video").hide()
	$("#close").hide()
})







//注册登录方式变化
$(document).ready(function(){
	$("#currenMethod").click(function(){
		$(this).css("color","#333")
		$(this).next().css("color","#999")
		$(".quick_login").css("display","block")
		$(".account_login").css("display","none")

	})
	$("#activeMethod").click(function(){
		$(this).css("color","#333")
		$(this).prev().css("color","#999")
		$(".quick_login").css("display","none")
		$(".account_login").css("display","block")
	
	})
	
});
//放大镜
$(".mirror_pic").bind({
	mousemove:function(e){
		$(".mirror_box").show()
		$(".mirror_show").show()
		let mouseX = e.pageX - $(".mirror_pic").offset().left-$(".mirror_box").width()/2;
		let mouseY = e.pageY - $(".mirror_pic").offset().top-$(".mirror_box").height()/2;
		
		// 判断边界
		if(mouseX<0){
			mouseX = 0
		}else if(mouseX>250){
			mouseX =250
		}
		if(mouseY<0){
			mouseY = 0
		}else if(mouseY>250){
			mouseY =250
		}
		
		$(".mirror_box").css({left:mouseX+"px",top:mouseY+"px"})
		$(".mirror_show").css({
			backgroundPositionX:-2*mouseX+"px",
			backgroundPositionY:-2*mouseY+"px"
			})
		
		// console.log("x:"-1*mouseX)
		// console.log(-1*mouseY)
	},
	mouseleave:function(){
		$(".mirror_box").hide()
		$(".mirror_show").hide()

	}

})


//  放大镜底部轮播图
$(document).ready(function(){
	$(".arrow_r").click(function(){
		movenext();
	});
	function movenext(){
	$(".pro_list div:first-child").animate({marginLeft:"-120px"},100,function(){
		var temp=$(this).clone();
			$(this).remove();
			temp.css({marginLeft:"0"});
		$(".pro_list").append(temp);
	});
	}
		
});
$(document).ready(function(){
	$(".arrow_l").click(function(){
		moveprev();
	});
	function moveprev(){
		var temp=$(".pro_list div:last-child").clone();
		$(".pro_list div:last-child").remove();
		temp.css({marginLeft:"120px"});
		$(".pro_list").prepend(temp);
		$(".pro_list div:first-child").animate({marginLeft:"0px"},100);
	}
});


// 详情页底部轮播图
	$(document).ready(function show(){
		$(".show_pictures div:first-child").animate({marginLeft:"-318px"},500,function(){
			let temp = $(this).clone();
			$(this).remove();
			temp.css({marginLeft:"0px"});
			$(".show_pictures").append(temp);
			setTimeout(function(){
				show()
			},2000)
		})
		
	})




