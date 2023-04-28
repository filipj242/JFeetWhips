window.onload=function(){
    var url = window.location.pathname;
    url=url.substring(url.lastIndexOf("/"));
    function fetchData(url1, callback){
        $.ajax({
            "url":"assets/data/"+url1+".json",
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
    if(url=="/shop.html"){
                     fetchData("products",displayProducts);
                    document.querySelector('#formControlRange').addEventListener("change", ispisVrednosti);
                    document.querySelector('#formControlRange').addEventListener("change", filterChange);
                    document.querySelector('#rangeValue').innerHTML="$"+document.querySelector('#formControlRange').getAttribute("min")+"-$"+document.querySelector('#formControlRange').getAttribute("max");
                    document.querySelector('#brands').addEventListener("change",filterChange);
                    function displayProducts(data){
                        localStorage.setItem("products",JSON.stringify(data));
                        data=filterCategories(data);
                        data=filterBrands(data);
                        data=filterPrice(data);
                        data=filterSearch(data);
                        data=filterFashion(data);
                        data=filterCollection(data);
                        data=sortProducts(data);
                        let html='';
                        data.forEach((d) => {
                            html+=`<div class="col-lg-3 col-md-6 col-sm-6 pb-1 product">
                                    <div class="product-item bg-light mb-4 position-relative">
                                            ${d.price.discount ? `<div class='col-3 text-center bg-primary position-absolute p-3 mt-0 discount'>${d.price.discount.value}%</div>`:``}
                                                <div class="product-img position-relative overflow-hidden">
                                            <img class="img-fluid w-100" src="assets/img/${d.img.src}" alt="${d.name}">
                                            <div class="product-action">
                                                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                                            </div>
                                        </div>
                                        <div class="text-center py-4">
                                            <p class="h5 text-decoration-none text-truncate" >${d.name}</p>
                                            <p class="h6 text-decoration-none text-truncate text-muted" >${productBrand(d.brandId)}</p>
                                            <div class="d-flex align-items-center justify-content-center mt-2">
                                                ${d.price.discount?`<h5>$${priceWithDiscount(d.price.old,d.price.discount.value)}</h5><h6 class="text-muted ml-2"><del>$${d.price.old}</del></h6>`:`<h5>$${d.price.old}</h5>`}
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center mb-1">
                                                ${returnRatings(d.rating)}
                                    </div>
                                </div>
                            </div>
                        </div>`
                        });
                        document.querySelector('#products').innerHTML=html;
                    }   
                    fetchData("brands", displayBrands);
            
                    function displayBrands(data){
                        let html='';
                        data.forEach((d) => {
                            html+=`<div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                            <input type="checkbox" class="custom-control-input" id="brand-${d.id}" value="${d.id}" name="brands">
                            <label class="custom-control-label" for="brand-${d.id}">${d.name}</label>
                            <span class="badge border font-weight-normal">${ProductsNumber(d.id,"brands")}</span>
                        </div>`
                        });
                        //document.querySelector('#brands').innerHTML=html;
                        $('#brands').html(html);
                       
                        localStorage.setItem("brands", JSON.stringify(data));
                        
                    }  
                    function ispisVrednosti(){
                        let vrednost=document.querySelector('#formControlRange').value;
                        document.querySelector('#rangeValue').innerHTML="$"+vrednost+"-"+document.querySelector('#formControlRange').getAttribute("max");
                    }
                fetchData("fashion",displayFashion);
                    function displayFashion(data){
                        let html='';
                        for(d of data){
                            html+=`<div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                            <input type="checkbox" class="custom-control-input" id="fashion-${d.id}" value="${d.id}" name="fashion">
                            <label class="custom-control-label" for="fashion-${d.id}">${d.name}</label>
                            <span class="badge border font-weight-normal">${ProductsNumber(d.id,"fashion")}</span>
                        </div>`;
                        }
                        document.querySelector("#fashion").innerHTML=html;
                       
                            if(localStorage.getItem("fashion")){
                                if(JSON.parse(localStorage.getItem("fashion"))=="Men"){
                                    var br=1;
                                }
                                else if(JSON.parse(localStorage.getItem("fashion"))=="Women"){
                                    var br=2;
                                }
                                else{
                                    var br=3;
                                }
                                let prom="fashion-"+br;
                                document.getElementById(prom).setAttribute("checked","checked");
                                localStorage.removeItem("fashion");
                        }
                        
                        
                        document.querySelector("#fashion").addEventListener("change",filterChange);
                    }
                    fetchData("collection", displayCollections)
                    function displayCollections(data){
                        let html='';
                        data.forEach((d) => {
                            html+=`<div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                            <input type="checkbox" class="custom-control-input" id="collection-${d.id}" value="${d.id}" name="collection">
                            <label class="custom-control-label" for="collection-${d.id}">${d.name}</label>
                            <span class="badge border font-weight-normal">${ProductsNumber(d.id,"collection")}</span>
                        </div>`
                        });
                        document.querySelector('#collection').innerHTML=html;
                        if(localStorage.getItem("period")){
                            if(JSON.parse(localStorage.getItem("period"))=="Winter"){
                                var br=1;
                            }
                            else if(JSON.parse(localStorage.getItem("period"))=="Summer"){
                                var br=2;
                            }
                            let prom="collection-"+br;
                            document.getElementById(prom).setAttribute("checked","checked");
                            localStorage.removeItem("period");
                    }
                        
                         
                        document.querySelector('#collection').addEventListener("change", filterChange);
                    }
                     
                    function filterChange(){
                        fetchData("products", displayProducts);
                    }
                    function filterCategories(data){
                        let catIds=[];
                        let checked=document.querySelectorAll('input[name="categories"]:checked');
                        for(let c of checked){
                            catIds.push(parseInt(c.value));
                        }
                        if(catIds.length){
                            return data.filter(x=>x.categoryIds.some(y=> catIds.includes(y)));
                        }
                        return data;
                    }
                    function filterBrands(data){
                        let brandIds=[];
                        let checked=document.querySelectorAll("input[name='brands']:checked");
                        for(let c of checked){
                            brandIds.push(parseInt( c.value));
                        }
                        if(brandIds.length){
                            return data.filter(x=> brandIds.includes(x.brandId));
                        }
                        return data;
                    }
                    function filterPrice(data){
                        let priceValue=document.querySelector('#formControlRange').value;   
                        return data.filter(function(x){
                            if(x.price.discount){
                                return priceWithDiscount(x.price.old,x.price.discount.value)>priceValue;
                            }
                                return x.price.old>priceValue;
                        }
                        );
                    }
                    function filterCollection(data){
                        collectionIds=[];
                        let checked=document.querySelectorAll("input[name='collection']:checked");
                        for(let c of checked){
                            collectionIds.push(parseInt(c.value));
                        }
                        if(collectionIds.length){
                            return data.filter(x=>collectionIds.includes(x.collectionId));
                        }
                        return data;
                    }
                    function filterFashion(data){
                        fashionIds=[];
                        let checked=document.querySelectorAll("input[name='fashion']:checked");
                        for(c of checked){
                            fashionIds.push(parseInt(c.value));
                        }
                        if(fashionIds.length){
                            return data.filter(x=>fashionIds.includes(x.fashionId));
                        }
                        return data;
                    }
                    document.querySelector('#search').addEventListener("keyup",filterChange);
                    function filterSearch(data){
                        let serachValue=document.querySelector('#search').value.toLowerCase();
                        if(serachValue){
                            return data.filter(function(x){
                                return x.name.toLowerCase().indexOf(serachValue)!==-1;
                            })
                        }
                        return data;
                    }
                    document.querySelector("#sort").addEventListener("change",filterChange);
                    function sortProducts(data){
                        let sortType=document.querySelector("#sort").value;
                        switch (sortType){
                            case "nameDesc":
                                return data.sort((a,b)=> a.name>b.name?-1:1);
                            case "nameAsc":
                                return data.sort((a,b)=> a.name>b.name?1:-1);   
                            case "priceAsc":
                                return data.sort(function(a,b){ if(a.price.discount){
                                    var vrednost =priceWithDiscount(a.price.old,a.price.discount.value)}
                                    else{var vrednost =a.price.old}
                                    if(b.price.discount){
                                        var vrednost2=priceWithDiscount(b.price.old,b.price.discount.value)}
                                        else{
                                            vrednost2=b.price.old
                                        }
                                    if(parseInt(vrednost)<parseInt(vrednost2)){
                                        return -1
                                    }
                                    else{
                                        return 1
                                    }
                                    }) 
                            case "priceDesc":   
                                return data.sort(function(a,b){ if(a.price.discount){
                                    var vrednost =priceWithDiscount(a.price.old,a.price.discount.value)}
                                    else{var vrednost =a.price.old}
                                    if(b.price.discount){
                                        var vrednost2=priceWithDiscount(b.price.old,b.price.discount.value)}
                                        else{
                                            vrednost2=b.price.old
                                        }
                                    if(parseInt(vrednost)>parseInt(vrednost2)){
                                        return -1
                                    }
                                    else{
                                        return 1
                                    }
                                    }) 
                            case "newest":
                                
                                return data.sort((a,b)=> new Date(a.date)> new Date(b.date)?-1:1)
                            case "rating":
                                return data.sort((a,b)=> a.rating>b.rating?-1:1)
                            default:
                                return data        
                        }
                
                    }
                    let changeRowsBtns=document.getElementsByClassName("btn-rows");
                    let arrayChangeRowsBtns=Array.from(changeRowsBtns);
                    for(b of arrayChangeRowsBtns){
                        b.addEventListener("click",changeRows);
                    
                    }
                    function changeRows(br){
                            let attr=this.getAttribute("data-row");
                            let product=document.getElementsByClassName('product');
                            let arrayProducts=Array.from(product);
                            for(p of arrayProducts){
                                if(attr==3){
                                    p.classList.remove("col-lg-4");
                                }
                                else{
                                    p.classList.remove("col-lg-3");
                                }
                                p.classList.add("col-lg-"+attr);
                            }
                        
                        
                    }

    }
    fetchData("menu", displayMenu);
    function displayMenu(data){
        let html='';
        for(let d of data){
            if(url=='/'+d.href){
                html+=`<a href="${d.href}" id="FASHION" class="nav-item nav-link active">${d.name}</a>`
            }else{
            html+=`<a href="${d.href}" id="FASHION" class="nav-item nav-link">${d.name}</a>`
        }
        }
        document.querySelector('.navbar-nav').innerHTML=html;
    }
    console.log(url);
    /////////////////////// index funkcije
    
        function displaySlider(data){
            let html='';
            data.forEach((d,index) => {
                html+=`<div class="carousel-item position-relative ${index==0?'active':''}" style="height: 430px;">
                <img class="position-absolute w-100 h-100" src="assets/img/${d.img.src}" alt="${d.img.alt}" style="object-fit: cover;">
                <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                    <div class="p-3" style="max-width: 700px;" >
                        <h1 class="display-4 text-white mb-3 animate__animated animate__fadeInDown">${d.name}</h1>
                        <p class="mx-md-5 px-5 animate__animated animate__bounceIn">${d.description}</p>
                        <a class="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="shop.html" id="btnFashion${d.id}" data-fashion='${d.name}'>Shop Now</a>
                    </div>
                </div>
            </div>`
            });

            //document.querySelector('.carousel-inner').innerHTML=html;
            
            $('.carousel-inner').html(html);
            for(i=1;i<4;i++){
            let dugme=document.querySelector(`#btnFashion`+i);
            dugme.addEventListener("click",function(){
                let dataFashion=dugme.getAttribute("data-fashion");
                let fashion=dataFashion.split(" ");
                localStorage.setItem("fashion",JSON.stringify(fashion[0]));
            });
            }
            
        
        }
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
            //$('#icons').html(html);
        }
        function displayPeriods(data){
            let html='';
            for (d of data){
                html+=`<div class="col-md-6">
                        <div class="product-offer mb-30" style="height: 300px;">
                            <img class="img-fluid" src="assets/img/${d.src}" alt="${d.name}">
                            <div class="offer-text">
                                <h6 class="text-white text-uppercase">Special Offer</h6>
                                <h3 class="text-white mb-3">${d.name}</h3>
                                <a href="shop.html" class="period btn btn-primary" id="period-${d.id}" data-period="${d.name}">Shop Now</a>
                            </div>
                        </div>
                    </div>`   
            }
            document.getElementById("periods").innerHTML=html;
            for(i=1; i<3; i++){
                let dugme=document.querySelector(`#period-`+i);
                dugme.addEventListener("click", function(){
                    let period=dugme.getAttribute("data-period");
                    console.log(period);
                    localStorage.setItem("period", JSON.stringify(period));
                });
            }
        }
        function displayFeatured(data){
            data=sortFeatured(data);
            let html='';
            let index=0;
            for(d of data) {
                html+=`<div class="col-lg-3 col-md-6 col-sm-6 pb-1">
                    <div class="product-item bg-light mb-4 position-relative">
                    ${d.price.discount ? `<div class='col-3 text-center bg-primary position-absolute p-3 mt-0 discount'>${d.price.discount.value}%</div>`:``}
                        <div class="product-img position-relative overflow-hidden">
                            <img class="img-fluid w-100" src="assets/img/${d.img.src}" alt="${d.name}">
                            <div class="product-action">
                                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                            </div>
                        </div>
                        <div class="text-center py-4">
                            <p class="h5 text-decoration-none text-truncate" >${d.name}</p>
                            <p class="h6 text-decoration-none text-truncate text-muted" >${productBrand(d.brandId)}</p>
                            <div class="d-flex align-items-center justify-content-center mt-2">
                                ${d.price.discount?`<h5>$${priceWithDiscount(d.price.old,d.price.discount.value)}</h5><h6 class="text-muted ml-2"><del>$${d.price.old}</del></h6>`:`<h5>$${d.price.old}</h5>`}
                            </div>
                            <div class="d-flex align-items-center justify-content-center mb-1">
                                ${returnRatings(d.rating)}
                            </div>
                        </div>
                    </div>
                </div>`;
                index++;
                if(index>7){
                    break;
                }
            };
            document.querySelector("#featuredProducts").innerHTML=html;
        
        }
        function sortFeatured(data) {
            return data.sort((a,b)=> a.rating>b.rating?-1:1);
        } 
        function displayRecent(data){
            
            data=sortRecent(data);
            let html='';
            let index=0;
            for(d of data) {
                html+=`<div class="col-lg-3 col-md-6 col-sm-6 pb-1">
                    <div class="product-item bg-light mb-4 position-relative">
                    ${d.price.discount ? `<div class='col-3 text-center bg-primary position-absolute p-3 mt-0 discount'>${d.price.discount.value}%</div>`:``}
                        <div class="product-img position-relative overflow-hidden">
                            <img class="img-fluid w-100" src="assets/img/${d.img.src}" alt="${d.name}">
                            <div class="product-action">
                                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                            </div>
                        </div>
                        <div class="text-center py-4">
                            <p class="h5 text-decoration-none text-truncate" >${d.name}</p>
                            <p class="h6 text-decoration-none text-truncate text-muted" >${productBrand(d.brandId)}</p>
                            <div class="d-flex align-items-center justify-content-center mt-2">
                                ${d.price.discount?`<h5>$${priceWithDiscount(d.price.old,d.price.discount.value)}</h5><h6 class="text-muted ml-2"><del>$${d.price.old}</del></h6>`:`<h5>$${d.price.old}</h5>`}
                            </div>
                            <div class="d-flex align-items-center justify-content-center mb-1">
                                ${returnRatings(d.rating)}
                            </div>
                        </div>
                    </div>
                </div>`;
                index++;
                if(index>7){
                    break;
                }
            };
            document.querySelector("#recentProducts").innerHTML=html;
        }
        function sortRecent(data){
            return data.sort((a,b)=> new Date(a.date)> new Date(b.date)?-1:1)
        }
       
    
         fetchData("slider", displaySlider);

        fetchData("icons", displayIcons);
        
        fetchData("collection", displayPeriods);
        
        fetchData("products",displayFeatured);
        
        fetchData("products",displayRecent);
        
        
       
        
    
    //////////////////////------ kraj index funkcija
    function productBrand(id){
        let brands= JSON.parse(localStorage.getItem("brands"));
        return brands.filter(x=>x.id==id)[0].name;
    }
    ////////////////// shop i index funkcije    
    function priceWithDiscount(price,discount){
        return price-price/100*discount;
    }
    function returnRatings(rating){
        let html='';
        for(let i=0; i<rating; i++){
            html+='<small class="fa fa-star text-primary mr-1"></small>'
        }
        for(let i=rating; i<5; i++){
            html+='<small class="fa fa-star mr-1"></small>';
        }
        return html;
    }  
    fetchData("categories", displayCategories);
    function displayCategories(data){
        let html='';
        if(url=='/' || url=='/index.html'){
        data.forEach((d) => {
            html+=` <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
            <a class="text-decoration-none" data-category="${d.name}" href="shop.html">
                <div class="cat-item d-flex align-items-center mb-4">
                    <div class="overflow-hidden" style="width: 100px; height: 100px;">
                        <img class="img-fluid w-100" src="assets/img/${d.img.src}" alt="${d.name}">
                    </div>
                    <div class="flex-fill pl-3">
                        <h6>${d.name}</h6>
                        <small class="text-body">${ProductsNumber(d.id,"categories")}</small>
                    </div>
                </div>
            </a>
        </div>`
          });
        }
        else if(url=='/shop.html'){
            data.forEach((d) => {
                html+=` <div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                <input type="checkbox" class="custom-control-input" id="category-${d.id}" value="${d.id}" name="categories">
                <label class="custom-control-label" for="category-${d.id}">${d.name}</label>
                <span class="badge border font-weight-normal">${ProductsNumber(d.id,"categories")}</span>
            </div>`
              });
        }
       
        document.querySelector('#categories').innerHTML=html;
       document.querySelector("#categories").addEventListener("change", filterChange);
     
    }
    function ProductsNumber(id, kriterijum){
        let products=JSON.parse(localStorage.getItem("products"));
        if(kriterijum=="brands"){
            return products.filter(x=> x.brandId==id).length
        }
        else if(kriterijum=="collection"){
            return products.filter(x=> x.collectionId==id).length
        }
        else if(kriterijum=="fashion"){
            return products.filter(x=> x.fashionId==id).length
        }
        return products.filter(x=> x.categoryIds.includes(id)).length
    }
    //////////////////////-----kraj shop index funkcija
    ////////////////// shop funkcije

   ////////////////------ kraj shop funkcija
 
   ////////// contact 
   var emailRegex=/^[a-z0-9][\w\.\+\-]*\@[a-z0-9]{3,20}(\.[a-z]{3,5})?(\.[a-z]{2,3})$/;
   var newsLetter=document.querySelector("#Newsletter");
   
    newsLetter.addEventListener("blur",function(){
        if(!emailRegex.test(newsLetter.value)){
            //poljeGreska.innerHTML("Wrong email format!");
            console.log(newsLetter.value);
            newsLetter.classList.add('border-danger');
            document.querySelector(".greska").innerHTML="wrong email format!"
            document.querySelector(".greska").style.color="red";
        }
        else{
            newsLetter.classList.remove('border-danger');
            document.querySelector(".greska").innerHTML=""
        }
   })
    if(url=='/contact.html'){
        var name=document.querySelector("#name");
        var email=document.querySelector("#email");
        var nameRegex=/^[A-Z][a-z]{2,15}$/;
        function ValidateOnBlur(polje,regex,poljegreske){
                 polje.addEventListener("blur",function(){
                    if(!regex.test(polje.value)){
                        console.log(polje)
                        document.getElementById(poljegreske).innerHTML=`Wrong ` +polje.getAttribute("id")+ ` format!`;
                        if(polje.value==""){    
                        document.getElementById(poljegreske).innerHTML=`Field ` +polje.getAttribute("id")+ ` can not be empty!`;  
                     }
                     dodajGresku(polje,poljegreske);   
                    }
                     else{
                        skloniGresku(polje,poljegreske);
                     }
              })
         }
         
         function dodajGresku(polje,poljegreske){
            polje.classList.add('border-danger');
            document.getElementById(poljegreske).classList.remove("d-none");
         }
         function skloniGresku(polje,poljegreske){
            polje.classList.remove('border-danger');
            document.getElementById(poljegreske).classList.add("d-none");
         }
         ValidateOnBlur(name,nameRegex,"errorName");
         ValidateOnBlur(email,emailRegex,"errorEmail");
    }
   /* document.getElementById("sendMessageButton").addEventListener("click",function(){
        if(name.value==""){
            dodajGresku(name,"errorName");
            document.getElementById("errorName").innerHTML="Field name can not be empty!";
            if(!regex.test(name.value)){
                        dodajGresku(name,"errorName");
                        document.getElementById("errorName").innerHTML='wrong name format!';     
                    }
        }
        else{
            skloniGresku(name,"errorName");
        }
        if(email.value==""){
            dodajGresku(email,"errorEmail");
            document.getElementById("errorEmail").innerHTML="Field email can not be empty!";
            
        }if(!regex.test(email.value)){
                dodajGresku(email,"errorEmail");
                document.getElementById("errorEmail").innerHTML='wrong email format!(example:user@gmail.com)';
        }
        else{
             skloniGresku(email,"errorEmail");
        }

    });*/
}
/*
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
    
})(jQuery);*/

