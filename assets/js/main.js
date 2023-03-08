window.onload = () => {
	
	let zanrovi = [];
	let pisci = [];

	dohvatiPodatke("zanrovi", prikaziZanrove);

	$("#sort").change(filterChange);
	$(".stanje").change(filterChange);
	$("#pretraga").keyup(filterChange);
	
	function dohvatiPodatke(file, callback){
		$.ajax({
			url: "assets/data/" + file + ".json",
			method: "get",
			dataType: "json",
			success: function(response){
				callback(response);
			},
			error: function(err){
				console.log(err);
			}
		});
	}
	
	function prikaziZanrove(data){
		let html = "";
		data.forEach(zanr => {
			html += `<li class="list-group-item">
					   <input type="checkbox" value="${zanr.id}" class="zanr" name="zanrovi"/> ${zanr.naziv}
					</li>`;
		});
		document.getElementById('zanrovi').innerHTML = html;
		zanrovi = data;
		$('.zanr').change(filterChange);
		
		dohvatiPodatke("pisci", prikaziPisce);
	}
	
	function prikaziPisce(data){
		let html = "";
		data.forEach(pisac => {
			html += `<li class="list-group-item">
					   <input type="checkbox" value="${pisac.id}" class="pisac" name="pisci"/> ${pisac.ime} ${pisac.prezime}
					</li>`;
		});
		document.getElementById('pisci').innerHTML = html;
		pisci = data;
		$('.pisac').change(filterChange);
		
		dohvatiPodatke("knjige", prikaziKnjige);
	}
	
	function prikaziKnjige(data){
		data = pisacFilter(data);
		data = zanroviFilter(data);
		data = dostupnostFilter(data);
		data = pretraziKnjige(data);
		data = sort(data);
		let html = "";
		for(let knjiga of data){
			html+= `
			<div class="col-lg-4 col-md-6 mb-4">
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
          </div>`;
		}
		if(!data.length){
			html = "Nema dostupnih knjiga.";
		}
		$("#knjige").html(html);
	}
	function dohvatiPiscaKnjige(id){
		let imePisca = pisci.filter(b => b.id == id)[0].ime;
		let prezimePisca = pisci.filter(b => b.id == id)[0].prezime;
		return imePisca + " " + prezimePisca;
	}
	
	function dohvatiZanroveKnjige(ids){
		let html = "";
		let zanroviKnjige = zanrovi.filter(c => ids.includes(c.id));
		for(let i in zanroviKnjige){
			html += zanroviKnjige[i].naziv;
			if(i != zanroviKnjige.length - 1){
				html += ", ";
			}
		}
		return html;
	}
	
	function sort(data){
		const sortType = document.getElementById('sort').value;
		if(sortType == 'asc'){
			return data.sort((a,b) => a.price.novaCena > b.price.novaCena ? 1 : -1);
		}
		return data.sort((a,b) => a.price.novaCena < b.price.novaCena ? 1 : -1);
	}
	
	function pisacFilter(data){
		let selectedPisci = [];
		$('.pisac:checked').each(function(el){
			selectedPisci.push(parseInt($(this).val()));
		});
		if(selectedPisci.length != 0){
			return data.filter(x => selectedPisci.includes(x.pisacID));	
		}
		return data;
	}
	
	function zanroviFilter(data){
		let selectedZanrovi = [];
		$('.zanr:checked').each(function(el){
			selectedZanrovi.push(parseInt($(this).val()));
		});
		if(selectedZanrovi.length != 0){
			return data.filter(x => x.zanrovi.some(y => selectedZanrovi.includes(y)));	
		}
		return data;
	}
	function dostupnostFilter(data){
		var dostupnost = $("input[name='stanje']:checked").val();
		if(dostupnost == "dostupno"){
			return data.filter(x => x.naStanju);
		}if(dostupnost == "nedostupno"){
			return data.filter(x => !x.naStanju);
		}
		return data;
	}
	function pretraziKnjige(data){
		let pretragaValue = $("#pretraga").val().toLowerCase();
		if(pretragaValue){
			return data.filter(function(el){
				return el.naslov.toLowerCase().indexOf(pretragaValue) !== -1;
			})
		}
		return data;
	}
	function filterChange(){
		dohvatiPodatke("knjige", prikaziKnjige);
	}
}