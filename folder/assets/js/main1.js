window.onload= () =>{
    var pisci=[];
    var zanrovi=[];
    function fetchData(file, callback){
        $.ajax({
            url: "assets/data/"+file+".json",
            dataType: "json",
            method: "get",
            success: function(result){
                callback(result);
            },
            error: function(err){
                console.log(err);
            }
        })
    }
    fetchData("zanrovi", dohvatiZanrove);

    function dohvatiZanrove(data){
        let html=""
       // console.log(data);
        for(let d of data){
            html+=`<li class="list-group-item">
            <input type="checkbox" value="1" class="${d.id}" name="zanrovi"/> ${d.naziv}
             </li>`
        }
       // zanrovi=data;
        zanrovi=localStorage.setItem("zanrovi", JSON.stringify(data));
        document.querySelector("#zanrovi").innerHTML=html;
       // document.querySelector("#zanrovi").addEventListener("change", 
      //  });
    }
    fetchData("pisci", dohvatiPisce);
    function dohvatiPisce(data){
        let html='';
        for(let d of data){
            html+=`<li class="list-group-item">
                  <input type="checkbox" value="${d.id}" class="pisac" name="pisci"/> ${d.ime+' '+d.prezime}
                  </li>`
        }
      //  pisci=data;
        localStorage.setItem("pisci", JSON.stringify(data));
        document.querySelector("#pisci").innerHTML=html;
    }
    fetchData("knjige", dohvatiKnjige);
    function dohvatiKnjige(data){
        html='';
        for(let knjiga of data){
            html+=`<div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100">
              <a href="#"><img class="card-img-top" src="assets/img/${knjiga.slika.src}" alt="${knjiga.slika.alt}"></a>
              <div class="card-body">
                <h4 class="card-title">
                  <a href="#">${knjiga.naslov}</a>
                </h4>
				<h6>${dohvatiPiscaKnjige(knjiga.pisacID)}</h6>
                <h5>$${knjiga.price.novaCena}</h5>
                ${knjiga.price.staraCena ? "<s>$" + knjiga.price.staraCena + "</s>" : ""}
                <p style="color: blue;">${knjiga.naStanju ? "Knjiga je dostupna" : "Knjiga nije dostupna"}</p>
				<p class="card-text" id="categories">
					${dohvatiZanroveKnjige(knjiga.zanrovi)}
				</p>
              </div>
            </div>
          </div>`
        }
         document.querySelector('#knjige').innerHTML=html;
    }
    function dohvatiPiscaKnjige(id){
        var pisci1=JSON.parse(localStorage.getItem("pisci"));
        return pisci1.filter(p=> p.id==id)[0].ime +' '+pisci1.filter(p=> p.id==id)[0].prezime;
    }
    function dohvatiZanroveKnjige(zanroviNiz){
       zanrovi=JSON.parse(localStorage.getItem("zanrovi"));
        let html='';
        let zanroviKnjiga=zanrovi.filter(z=>zanroviNiz.includes(z.id));
        for(let zan in zanroviKnjiga){
                html+=zanroviKnjiga[zan].naziv;
            if(zan!=zanroviKnjiga.length-1){
                html+=', ';
            }
        }
        return html;
      
    }
   
}