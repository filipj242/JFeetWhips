window.onload=function(){
    function fetchData(url, callback){
        $.ajax({
            "url":"assets/data/"+url+".json",
            "method":"get",
            "dataType":"json",
            success:function(result){
                callback(result)
            },
            error:function(err){
                console.log(err)
            }
        })
    }
    fetchData("menu", displayMenu);
    function displayMenu(data){
        let html='';
        for(let d of data){
            html+=`<a href="${d.href}" class="nav-item nav-link">${d.name}</a>`
        }
        document.querySelector('.navbar-nav').innerHTML=html;
    }
    fetchData("slider", displaySlider);
    function displaySlider(data){
        let html='';
        data.forEach((d,index) => {
            html+=`<div class="carousel-item position-relative ${index==0?'active':''}" style="height: 430px;">
            <img class="position-absolute w-100 h-100" src="assets/img/${d.img.src}" alt="${d.img.alt}" style="object-fit: cover;">
            <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div class="p-3" style="max-width: 700px;">
                    <h1 class="display-4 text-white mb-3 animate__animated animate__fadeInDown">${d.name}</h1>
                    <p class="mx-md-5 px-5 animate__animated animate__bounceIn">${d.description}</p>
                    <a class="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="#">Shop Now</a>
                </div>
            </div>
        </div>`
          });
        document.querySelector('.carousel-inner').innerHTML=html;
    }
    fetchData("icons", displayIcons);
    function displayIcons(data){
        let html='';
        data.forEach((d) => {
            html+=`<div class="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div class="d-flex align-items-center bg-light mb-4" style="padding: 30px;">
                <h1 class="fa ${d.icon} text-primary m-0 mr-3"></h1>
                <h5 class="font-weight-semi-bold m-0">${d.description}</h5>
            </div>
        </div>`
          });
        document.querySelector('#icons').innerHTML=html;
    }
    fetchData("categories", displayCategories);
    function displayCategories(data){
        let html='';
        data.forEach((d) => {
            html+=` <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
            <a class="text-decoration-none" href="">
                <div class="cat-item d-flex align-items-center mb-4">
                    <div class="overflow-hidden" style="width: 100px; height: 100px;">
                        <img class="img-fluid" src="assets/img/${d.img.src}" alt="${d.name}">
                    </div>
                    <div class="flex-fill pl-3">
                        <h6>${d.name}</h6>
                        <small class="text-body">funkcija za broj proizvoda</small>
                    </div>
                </div>
            </a>
        </div>`
          });
        document.querySelector('#categories').innerHTML=html;
    }

}

(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);

