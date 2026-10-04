//스크립트 위로 튕기는 것 방지
$(document).on("click", 'a[href="#"]', function (e) {
  e.preventDefault();
});   

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
// 상단이동 부드럽게
$(function () {
  $(".tel").on("click", function () {
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




  //섹션별 스크롤
  $(document).ready(function() {
      $('#top_group #gnb li a').on('click', function(e) {
          e.preventDefault();
          var targetId = $(this).attr('href');
          var top = $(targetId).offset().top;
          $('html, body').animate({ scrollTop: top }, 400);
      });
  });
 

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



//section.locaInt 슬라이더
// $(function(){
//     $('.locInt #inner .contList ').slick({
//         arrows: true, //화살표
//         dots: false, //인디케이터 해제
//         fade: false, //페이드인 효과
//         autoplay: true, //자동재생
//         autoplaySpeed: 2000, //재생시간
//         pauseOnHover: true, //마우스 오버, 포커스시 멈추는것 해제
//         pauseOnFocus: false,
//         slidesToShow: 3,
//         infinite: true,
//         scroll: true,
//         draggable:true,
//         responsive: [ 
//         {  
//           breakpoint: 769, 
//           settings: {
//             slidesToShow: 2
//           } 
//         },
//         {  
//           breakpoint: 480, 
//           settings: {
//             slidesToShow: 1
//           } 
//         }
//       ]
//     });
// });



$(document).ready(function() {
  // object-fit : IE 대응   
  if($(document).find('.object-fit').length > 0){    
    var objectFitImg = new App.ObjectFit();
    objectFitImg.init('.object-fit');
  }  
  
  $('.gallery-main-swiper').each(function() {
    var thumbSwiper = new Swiper('.gallery-thumb-swiper', {
      spaceBetween: 10,
      slidesPerView: 5,
      loopedSlides: 5,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
      loop: true,
      breakpoints: {
        1024: {
          slidesPerView: 5,
          loopedSlides: 5
        },
        768: {
          slidesPerView: 3.5,
          loopedSlides: 3.5
        },
        480: {
          slidesPerView: 2.5,
          loopedSlides: 2.5
        }
      }
    });
    var mainSwiper = new Swiper('.gallery-main-swiper', {
      effect: 'fade',
      spaceBetween: 10,
      allowTouchMove: false,
      loop: true,
      loopedSlides: 5,
      navigation: {
        nextEl: '.swiper-gallery-next',
        prevEl: '.swiper-gallery-prev'
      },
      breakpoints: {
        1024: {
          loopedSlides: 5
        },
        768: {
          loopedSlides: 3.5
        },
        479: {
          loopedSlides: 2.5
        }
      }
    });
    mainSwiper.controller.control = thumbSwiper;
    thumbSwiper.controller.control = mainSwiper;
  })
})

var App = new Object();

//------------------------------------------------------
//object-fit(IE)
//------------------------------------------------------  
App.ObjectFit = function () {
  var self;
  return {
    init: function (param) {
      if ('objectFit' in document.documentElement.style === false) {
        var container = document.querySelectorAll(param);
        for (var i = 0; i < container.length; i++) {
          var imageSource = container[i].querySelector('img').src;
          container[i].querySelector('img').style.display = 'none';
          container[i].style.backgroundSize = 'cover';
          container[i].style.backgroundImage = 'url(' + imageSource + ')';
          container[i].style.backgroundPosition = '50% 50%';
        }
      }
    }
  }
};  