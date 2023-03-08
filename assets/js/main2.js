window.onload=function(){
    function ajaxCallback(file, callback){
        $.ajax({
            "url":"assets/data/"+file+".json",
            "method": "get",
            "dataType": "json",
            success: function(result){
                callback(result)
            },
            error: function(err){
                console.log(err)
            }
        })
    }
    ajaxCallback("pisci", dohvatiPisce);
    function dohvatiPisce(data){
        html='';
        for(let d of data){
            html+=`<li class="list-group-item">
            <input type="checkbox" value="${d.id}" class="pisac" name="pisci"/> ${d.ime+' '+d.prezime}
            </li>`
        }
        document.querySelector("#pisci").innerHTML=html;
        localStorage.setItem("pisci",JSON.stringify(data));
        document.querySelector("#pisci").addEventListener("change", filterChange);
    }
    ajaxCallback("zanrovi", dohvatiZanrove);
    function dohvatiZanrove(data){
        html='';
        for(let d of data){
            html+=`<li class="list-group-item">
            <input type="checkbox" value="${d.id}" class="pisac" name="pisci"/> ${d.naziv}
            </li>`
        }
        localStorage.setItem("zanrovi", JSON.stringify(data));
        document.querySelector("#zanrovi").addEventListener("change", filterChange);
        document.querySelector("#zanrovi").innerHTML=html;
    }
    ajaxCallback("knjige", dohvatiKnjige);
    function dohvatiKnjige(data){
        html='';
        data=filterSort(data);
        data = dostupnostFilter(data);
        data= filterPisci(data);
        data=zanroviFilter(data);
        data=pretraziKnjige(data);
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
        document.querySelector("#knjige").innerHTML=html;
    }
    function dohvatiPiscaKnjige(id){
        let pisci=JSON.parse(localStorage.getItem("pisci"));
        return pisci.filter(x=> x.id==id)[0].ime+" "+pisci.filter(x=> x.id==id)[0].prezime;
    }
    function dohvatiZanroveKnjige(ids){
        let zanrovi=JSON.parse(localStorage.getItem("zanrovi"));
       // console.log(zanrovi);
        let html='';
        let objZanrovi= zanrovi.filter(z=> ids.includes(z.id));
        for(let o in objZanrovi){
            html+=`${objZanrovi[o].naziv}`;
            if(o!=objZanrovi.length-1){
                html+=", ";
            }
        }
        return html;
    }
    document.querySelector("#sort").addEventListener("change", filterChange);
    function filterChange(){
        ajaxCallback("knjige", dohvatiKnjige);
    }
    function filterSort(data){
        let vrednost=document.querySelector("#sort").value;
        if(vrednost=="asc"){
          return  data.sort((a,b)=> parseInt(a.price.novaCena) > parseInt(b.price.novaCena) ? 1 : -1
            )
        }else{
          return  data.sort((a,b)=>parseInt(a.price.novaCena) < parseInt(b.price.novaCena) ? 1 : -1
            )
        }
    }
    $(".stanje").change(filterChange);
    function dostupnostFilter(data){
        let checked= document.querySelector("input[name='stanje']:checked");
        if(checked.value=="dostupno"){
            return data.filter(x=> x.naStanju)
        }
        if(checked.value=="nedostupno"){
            return data.filter(x=> !x.naStanju)
        }
        return data;
        
    }
    function filterPisci(data){
        let pisciID=[];
        let checked= document.querySelectorAll("input[name='pisci']:checked");
        for(let c of checked){
            pisciID.push(parseInt(c.value));
        }
        //console.log(pisciID);
        if(pisciID.length){
            return data.filter(d=> pisciID.includes(d.pisacID));
        }
        return data;
    }
    function zanroviFilter(data){
        
        let selectedCategories = [];
		$('.zanrovi:checked').each(function(el){
			selectedCategories.push(parseInt($(this).val()));
		});
		if(selectedCategories.length != 0){
			return data.filter(x => x.zanrovi.some(y => selectedCategories.includes(y)));	
		}
		return data;
	}
    $("#pretraga").keyup(filterChange);
    function pretraziKnjige(data){
		let pretragaValue = $("#pretraga").val().toLowerCase();
		if(pretragaValue){
			return data.filter(function(el){
				return el.naslov.toLowerCase().indexOf(pretragaValue) !== -1;
			})
		}
		return data;
	}
}