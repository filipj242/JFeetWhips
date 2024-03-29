
    var url = window.location.pathname;
    url=url.substring(url.lastIndexOf("/"));

    var ProductsArray;
    var BrandsArray;
    function fetchData(url1, callback){
        $.ajax({
            "url":"assets/data/"+url1+".json",
            "method":"get",
            "dataType":"json",
            success:function(result){
                callback(result);
            },
            error:function(err){
                console.log(err)
            }
        })
    }
    
    
    fetchData("brands", displayBrands);
    
    function displayBrands(data){
        localStorage.setItem("brands", JSON.stringify(data));
        BrandsArray=data;
        console.log(BrandsArray);
        let html='';
        if(url=='/shop.html'){
        data.forEach((d) => {
            html+=`<div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
            <input type="checkbox" class="custom-control-input" id="brand-${d.id}" value="${d.id}" name="brands">
            <label class="custom-control-label" for="brand-${d.id}">${d.name}</label>
            <span class="badge border font-weight-normal">${ProductsNumber(d.id,"brands")}</span>
        </div>`
        });
        //document.querySelector('#brands').innerHTML=html;
        if(url=='/shop.html'){
            $('#brands').html(html); 
        }
         
        }
    }  
    fetchData("products",displayProducts);
    function displayProducts(data){
        localStorage.setItem("products",JSON.stringify(data));
        ProductsArray=data;
        console.log(ProductsArray);
        if(url=='/shop.html'){
            data=filterFashion(data);
            data=filterCollection(data);
            data=filterCategories(data);
            data=filterBrands(data);
            data=filterPrice(data);
            data=filterSearch(data);
            data=sortProducts(data);
            let html='';
            data.forEach((d) => {
                
                html+=returnProducts(d);
            });
            document.querySelector('#products').innerHTML=html;
            let btncart=document.querySelectorAll(".btn-cart");
            let arrBtnCart=Array.from(btncart);
            for(b of arrBtnCart){
                b.addEventListener("click",Cart);
            }
        }
        
    }   
   
    
    if(url=="/shop.html"){
                     
                    document.querySelector('#formControlRange').addEventListener("change", ispisVrednosti);
                    document.querySelector('#formControlRange').addEventListener("change", filterChange);
                    document.querySelector('#rangeValue').innerHTML="$"+document.querySelector('#formControlRange').getAttribute("min")+"-$"+document.querySelector('#formControlRange').getAttribute("max");
                    document.querySelector('#brands').addEventListener("change",filterChange);
                    
                    
                    fetchData("fashion",displayFashion);
                    fetchData("collection", displayCollections);
                    
            
                    function ispisVrednosti(){
                        let vrednost=document.querySelector('#formControlRange').value;
                        document.querySelector('#rangeValue').innerHTML="$"+vrednost+"-"+document.querySelector('#formControlRange').getAttribute("max");
                    }
                
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
                    function changeRows(){
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
                html+=`<a href="${d.href}" id="${d.name}" class="nav-item nav-link active">${d.name}</a>`
            }else{
            html+=`<a href="${d.href}" id="${d.name}" class="nav-item nav-link">${d.name}</a>`
        }
        
        }html+=`<a href="cart.html" class=" nav-item nav-link d-lg-none">
                <i class="fas fa-shopping-cart text-primary"></i>
                <span class="badge text-secondary border border-secondary rounded-circle" id="cart-count" style="padding-bottom: 2px;">0</span>
              </a>`
        document.querySelector('.navbar-nav').innerHTML=html;
    }
    /////////////////////// index funkcije
    fetchData("slider", displaySlider);

    fetchData("icons", displayIcons);
    
    fetchData("collection", displayPeriods);
    
    fetchData("products",displayFeatured);
    
    fetchData("products",displayRecent);
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
            if(url=='/'|| url=='/index.html'){
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
            if(url=='/' || url=='/index.html'){
            document.querySelector('#icons').innerHTML=html;
           }
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
            if(url=='/' || url=='/index.html'){
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
        }
        function displayFeatured(data){
            data=sortFeatured(data);
            let html='';
            let index=0;
            for(d of data) {
                html+=returnProducts(d);
                index++;
                if(index>7){
                    break;
                }
            }; if(url=='/' || url=='/index.html'){
            document.querySelector("#featuredProducts").innerHTML=html;
            }
        }
        function sortFeatured(data) {
            return data.sort((a,b)=> a.rating>b.rating?-1:1);
        } 
        function displayRecent(data){
            
            data=sortRecent(data);
            let html='';
            let index=0;
            for(d of data) {
                html+=returnProducts(d);
                index++;
                if(index>7){
                    break;
                }
            };
            if(url=='/' || url=='/index.html'){
            document.querySelector("#recentProducts").innerHTML=html;
            }
            let btncart=document.querySelectorAll(".btn-cart");
            let arrBtnCart=Array.from(btncart);
            for(b of arrBtnCart){
                b.addEventListener("click",Cart);
            }
        }
        function sortRecent(data){
            return data.sort((a,b)=> new Date(a.date)> new Date(b.date)?-1:1)
        }
       
       
    
    //////////////////////------ kraj index funkcija
    ////////////////// shop i index funkcije   
    function productBrand(id){
        //let brands= JSON.parse(localStorage.getItem("brands"));
        return BrandsArray.filter(x=>x.id==id)[0].name;
    }
    function returnProducts(d){
        return `<div class="col-lg-3 col-md-6 col-sm-6 pb-1 product">
        <div class="product-item bg-light mb-4 position-relative">
        ${d.price.discount ? `<div class='col-3 text-center bg-primary position-absolute p-3 mt-0 discount'>${d.price.discount.value}%</div>`:``}
            <div class="product-img position-relative overflow-hidden">
                <img class="img-fluid w-100" src="assets/img/${d.img.src}" alt="${d.name}">
                <div class="product-action">
                    <a class="btn btn-outline-dark btn-square btn-cart" href="#" data-id="${d.id}"><i class="fa fa-shopping-cart"></i></a>
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
    } 
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
          document.querySelector('#categories').innerHTML=html;
        }
        else if(url=='/shop.html'){
            data.forEach((d) => {
                html+=` <div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                <input type="checkbox" class="custom-control-input" id="category-${d.id}" value="${d.id}" name="categories">
                <label class="custom-control-label" for="category-${d.id}">${d.name}</label>
                <span class="badge border font-weight-normal">${ProductsNumber(d.id,"categories")}</span>
            </div>`
              });
              document.querySelector('#categories').innerHTML=html;
              document.querySelector("#categories").addEventListener("change", filterChange);
        }
     
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
    function dodajGresku(polje,poljegreske){
        console.log(polje)
        polje.classList.add('border-danger');
        document.getElementById(poljegreske).classList.remove("d-none");
     }
     function skloniGresku(polje,poljegreske){
        polje.classList.remove('border-danger');
        document.getElementById(poljegreske).classList.add("d-none");
     }
     //ValidateOnBlur(name1,nameRegex,"errorName");
    if(url=='/contact.html'){
        var name1=document.querySelector("#name");
        var email=document.querySelector("#email");
        var message=document.querySelector("#message");
        var nameRegex=/^[A-Z][a-z]{2,15}$/; 
         ValidateOnBlur(name1,nameRegex,"errorName");
         ValidateOnBlur(email,emailRegex,"errorEmail");
         //ValidateOnBlur(message,emailRegex,"errorEmail");
         document.getElementById("sendMessageButton").addEventListener("click",function(){
        if(name1.value==""){
            dodajGresku(name1,"errorName");
            document.getElementById("errorName").innerHTML="Field name can not be empty!";
        }
        else{
            if(!nameRegex.test(name1.value)){
                        dodajGresku(name1,"errorName");
                        document.getElementById("errorName").innerHTML='wrong name format!(max 15)';     
                    }
            skloniGresku(name1,"errorName");
        }
        if(email.value==""){
            console.log("aa");
            dodajGresku(email,"errorEmail");
            document.getElementById("errorEmail").innerHTML="Field email can not be empty!";
            
        }
        else{
             if(!emailRegex.test(email.value)){
                dodajGresku(email,"errorEmail");
                document.getElementById("errorEmail").innerHTML='wrong email format!(example:user@gmail.com)';
            }else{
                skloniGresku(email,"errorEmail");
           }
        }
        if(message.value==''){
            dodajGresku(message,"errorMessage");
        }
        else{
            skloniGresku(message,"errorMessage");
        }

    });
    }
    
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
    /////////////////////////////// cart
    function reloadCartcount(){
        document.querySelector("#cart-count").innerHTML=JSON.parse(localStorage.getItem("cart-count"));
    } 
    if(JSON.parse(localStorage.getItem("cart-count")) && JSON.parse(localStorage.getItem("cart")).length){
        reloadCartcount();
    }
    reloadCartcount();
    function Cart(){
        event.preventDefault();
        let id=$(this).data("id");
        console.log(id);
        let cartItems=localStorage.getItem("cart");
        console.log(cartItems);
        if(!cartItems){
            let products=JSON.parse(localStorage.getItem("products")); 
            console.log(products);
            //let product=products.find(x=>x.id==id);
            addToCart(id);
            console.log(JSON.parse(localStorage.getItem("cart")).length);
            document.querySelector("#cart-count").innerHTML=JSON.parse(localStorage.getItem("cart")).length;
        }
        else{
            let products=JSON.parse(localStorage.getItem("cart")); 
            console.log(products.find(x=>x.id==id));
            let p=products.filter(x=>x.id==id);
            if(p[0]){
                //postoji produkt
                increaseQuantity(id);
                console.log("bb");
                
            }
            else{//ne postoji produkt
                addToCart(id);
                console.log("aa");
                console.log(JSON.parse(localStorage.getItem("cart")).length);
                document.querySelector("#cart-count").innerHTML=JSON.parse(localStorage.getItem("cart")).length;
            }

        }
        localStorage.setItem("cart-count",JSON.parse(localStorage.getItem("cart")).length);
        popUp();
        
    }
    function addToCart(id){
        let productsArray=[];
        if(localStorage.getItem("cart")){
            productsArray=JSON.parse(localStorage.getItem("cart"));
        }
        productsArray.push({"id":id,"quantity":1});
        localStorage.setItem("cart",JSON.stringify(productsArray));
    }
    function increaseQuantity(id){
        let productsArray=JSON.parse(localStorage.getItem("cart"));
        let product=productsArray.find(x=>x.id==id);
        product["quantity"]++;
        localStorage.setItem("cart",JSON.stringify(productsArray));
    }
    function popUp(){
       $("#popup").fadeIn(500);
       $("#popup").fadeOut(500);
    }
    if(url=='/cart.html'){
        let cart=JSON.parse(localStorage.getItem("cart"));
        let products=JSON.parse(localStorage.getItem("products"));
        let cartIds=[];
        if(cart){
            for(c of cart){
                cartIds.push(c.id)
            }
            let cartProducts=products.filter(x=>cartIds.includes(x.id))
            console.log(cartProducts);
            displayCartProducts(cartProducts);
            
            
        }
        function displayCartProducts(data){
            displayTotal(data)
            localStorage.setItem("cartProducts",JSON.stringify(data));
            let html='';
            for(d of data){
                html+=`<tr>
                <td class="align-middle"><img src="assets/img/${d.img.src}" alt="${d.name}" style="width: 50px;"/> ${d.name}</td>
                <td class="align-middle">${d.price.discount?`$${priceWithDiscount(d.price.old,d.price.discount.value)}`:`$${d.price.old}`}</td>
                <td class="align-middle">
                    <div class="input-group quantity mx-auto" style="width: 100px;">
                        <div class="input-group-btn">
                            <button class="btn btn-sm btn-primary btn-minus" data-id='${d.id}' >
                            <i class="fa fa-minus"></i>
                            </button>
                        </div>
                        <input type="text" class="form-control form-control-sm bg-secondary border-0 text-center" value="${returnQuantity(d.id)}">
                        <div class="input-group-btn">
                            <button class="btn btn-sm btn-primary btn-plus" data-id='${d.id}'>
                                <i class="fa fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </td>
                <td class="align-middle">${d.price.discount?`$${priceWithDiscount(d.price.old,d.price.discount.value)*returnQuantity(d.id)}`:`$${d.price.old*returnQuantity(d.id)}`}</td>
                <td class="align-middle"><button class="btn btn-sm btn-danger btn-delete" data-id='${d.id}'><i class="fa fa-times"></i></button></td>
            </tr>`
            }
            document.querySelector("#cart-products").innerHTML=html;
            let btn=document.querySelectorAll(".btn-plus");
            let nizBtnPlus=Array.from(btn);
            for(p of nizBtnPlus){
               p.addEventListener("click",increaseQuantityCart);
            }
            let btn1=document.querySelectorAll(".btn-minus");
            let nizBtnPlus1=Array.from(btn1);
            for(p of nizBtnPlus1){
               p.addEventListener("click",decreaseQuantityCart);
            }
            let btndel=document.querySelectorAll(".btn-delete");
            let nizDel=Array.from(btndel);
            for(p of nizDel){
               p.addEventListener("click",deleteFromCart);
            }
            localStorage.setItem("cart-count",JSON.stringify(data.length));
            console.log(data.length);
            reloadCartcount();
        }
        function returnQuantity(id){
            let cart1= JSON.parse(localStorage.getItem("cart"));
            let cprod=cart1.filter(x=>x.id==id);
            return cprod[0].quantity;
        }
        function increaseQuantityCart(){
            let id=$(this).data("id");
           increaseQuantity(id);
           let cartItems=JSON.parse(localStorage.getItem("cartProducts"));
           displayCartProducts(cartItems);
        }
        function decreaseQuantityCart(){
            let id=$(this).data("id");
            let productsArray=JSON.parse(localStorage.getItem("cart"));
            let product=productsArray.find(x=>x.id==id);
            product["quantity"]--;
            console.log(product["quantity"]);
            if(product["quantity"]<1){
                product["quantity"]++;
            }
            localStorage.setItem("cart",JSON.stringify(productsArray));
            let cartItems=JSON.parse(localStorage.getItem("cartProducts"));
            displayCartProducts(cartItems);
        }
        function deleteFromCart(){
           let id=$(this).data("id");
           let productsArray=JSON.parse(localStorage.getItem("cart"));
           let product=productsArray.find(x=>x.id==id);
           let newProductArray=[]
           for(p of productsArray){
                if(p!=product){
                    newProductArray.push(p);
                }
           }
           localStorage.setItem("cart",JSON.stringify(newProductArray));
           let cartIds=[];
           for(c of newProductArray){
            cartIds.push(c.id)
           }
          let cartProducts=products.filter(x=>cartIds.includes(x.id));
          
           displayCartProducts(cartProducts);
        }
        function displayTotal(data){
            let html=`<div class="border-bottom">
            <h6 class="mb-3">Products</h6>`;
            let total=0;
            for(d of data){
                html+=`
                        <div class="d-flex justify-content-between">
                            <p>${d.name}</p>
                            <p>${d.price.discount?`$${priceWithDiscount(d.price.old,d.price.discount.value)*returnQuantity(d.id)}`:`$${d.price.old*returnQuantity(d.id)}`}</p>
                        </div>`;
                        total+=d.price.discount? priceWithDiscount(d.price.old,d.price.discount.value)*returnQuantity(d.id):d.price.old*returnQuantity(d.id);
            }
            html+=`</div>
            <div class="pt-2">
                <div class="d-flex justify-content-between mt-2">
                    <h5>Total</h5>
                    <h5>$${total}</h5>
                </div>
            </div>
            <a class="btn btn-block btn-primary font-weight-bold py-3 " href="#checkout">Go to checkout</a>`
            document.querySelector("#cart-total").innerHTML=html;
        }
        var name1=document.querySelector("#name");
        var email=document.querySelector("#email");
        var nameRegex=/^[A-Z][a-zA-Z\s]+$/;
        var surname=document.querySelector("#surname");
        var surnameRegex=/^[A-Z][a-zA-Z\s]+$/;
        var phone=document.querySelector("#phone");
        var phoneRegex=/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        var address1=document.querySelector("#address");
        var addressRegex=/^[A-Z][a-zA-Z0-9\s]+(\d{1,})$/;
        var city=document.querySelector("#city");
        var cityRegex=/^[A-Z][a-zA-Z\s]+$/;
        var zip=document.querySelector("#zip");
        var zipRegex=/^[0-9]{5,6}$/;
        ValidateOnBlur(name1,nameRegex,"errorName");
        ValidateOnBlur(email,emailRegex,"errorEmail");
        ValidateOnBlur(surname,surnameRegex,"errorSurname");
        ValidateOnBlur(phone,phoneRegex,"errorPhone");
        ValidateOnBlur(address1,addressRegex,"errorAddress1");
        ValidateOnBlur(city,cityRegex,"errorCity");
        ValidateOnBlur(zip,zipRegex,"errorZip");
        document.getElementById("placeOrder").addEventListener("click",function(){
            let radiobtns=document.querySelectorAll("input[name='payment']:checked");
            let ddlCourier=document.querySelector("#ddlCourier");
            if(ddlCourier.value==0){
                document.getElementById("errorCourier").classList.remove("d-none");
            }
            else if(ddlCourier.value){
                document.getElementById("errorCourier").classList.add("d-none");
            }
            if(!radiobtns.length){
                document.getElementById("radio-greska").classList.remove("d-none");
            }
            else{
                document.getElementById("radio-greska").classList.add("d-none");
            }
            testRegex(name1,nameRegex,"errorName");
            testRegex(email,emailRegex,"errorEmail");
            testRegex(surname,surnameRegex,"errorSurname");
            testRegex(phone,phoneRegex,"errorPhone");
            testRegex(address1,addressRegex,"errorAddress1");
            testRegex(city,cityRegex,"errorCity");
            testRegex(zip,zipRegex,"errorZip");
        })
        function testRegex(polje,regex,poljegreske){
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
            }
        }
   