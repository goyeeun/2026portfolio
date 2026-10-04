//스크립트 위로 튕기는 것 방지
$(document).on("click", 'a[href="#"]', function (e) {
    e.preventDefault();
  });   
  

// nav-active  
document.addEventListener('DOMContentLoaded', function(){
	document.querySelector(".total").addEventListener("click", function(){
		if( document.querySelector('#m-gnb').classList.contains('on') ){
		
		document.querySelector('#m-gnb').classList.remove('on');
	} else {
		document.querySelector('#m-gnb').classList.add('on');
	}
	});
});


 //모바일화면 버튼on
 $(document).ready(function(){
  //logo 눌렀을때, 탑으로 이동
  $("#logo").on("click", function(){
      $("html, body").stop().animate({"scrollTop":0},1000);
  });

  //모바일화면 버튼on
  $('.total').click(function(){
      $(this).toggleClass('on');
  });
});

//섹션별 스크롤
$(document).ready(function() {
    $('#top_group #gnb li a').on('click', function(e) {
        e.preventDefault();
        var targetId = $(this).attr('href');
        var top = $(targetId).offset().top;
        $('html, body').animate({ scrollTop: top }, 400);
    });
});
$(document).ready(function() {
  $('#top_group #m-gnb li a').on('click', function(e) {
      e.preventDefault();
      var targetId = $(this).attr('href');
      var top = $(targetId).offset().top;
      $('html, body').animate({ scrollTop: top }, 400);
  });
});


  // 상단이동 부드럽게
$(function () {
    $(".goTop").on("click", function () {
        let top = $("body").offset().top;
        $("html, body").animate({ scrollTop: top }, 800);
    });
  });
  // 상단이동 부드럽게
  $(function () {
    $(".bIcon").on("click", function () {
        let top = $("body").offset().top;
        $("html, body").animate({ scrollTop: top }, 700);
    });
  });

   //visual 이미지슬라이드
   $(function () {
    $(".visual .slide").slick({
        arrows: true, //화살표
        dots: true, //인디케이터 해제 
        fade: true, //페이드인 효과
        autoplay: true, //자동재생
        autoplaySpeed: 4000, //재생시간
        pauseOnHover: false, //마우스 오버, 포커스시 멈추는것 해제
        pauseOnFocus: false,
    });
  });
  $('.slick-prev').text("prev");
       
  //fixHeader
var scrollFix = 0;
scrollFix = $(document).scrollTop();
fixHeader();

$(window).on('scroll resize', function(){
    scrollFix = $(document).scrollTop();
    fixHeader();
});

//fixHeader();
function fixHeader(){
    if(scrollFix > 150){
        $('header').addClass("on");
    }else{
        $('header').removeClass();
    }
}

//화면 리사이즈
$(window).on("resize",
function(){
    arrPos=[];
    for(var i=1; i<11; i++){
        arrPos.push($('#section'+i).offset().top);
    }
}
)


//스크롤애니메이션
$(function(){
    $('.animate').scrolla({
        mobile: true,
        once: false
    });
  });

//   ABOUTUS-Slide
  var text = ['정문찬 원장','정문찬원장'];
		
			var bottomSwiper = new Swiper('.swiper-bottom', {
				slidesPerView: '1',
				pagination: {
					el: ".swiper-pagination-custom",
						clickable: true,
						bulletClass:"custom_bullet",
						bulletActiveClass: "swiper-pagination-custom-bullet-active",
          
           renderBullet: function (index, className) {
             return '<div class="'+className+'"><span>'+ (text[index]) +'</span></div>'
           },
				},

				autoplay: {
					delay: false,
					disableOnInteraction:false,
				},
				speed: false,
				loop: true,
				touchRatio: 0.2,
				observer: true,
				observeParents: true
			});
// 시설둘러보기 slide