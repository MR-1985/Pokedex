//Bei Laden der Seite wird die Funktion ausgefüührt
function onloadGetData(){
    //in der Funktion wird eine Funktion aufgerufen, die alle Daten vorerst laden soll
    loadAllPokemons();
};

//Basis URL mit allen Daten und Limitter
const Basic_URL = "https://pokeapi.co/api/v2/pokemon?limit=50&offset=0"

//Array mit Möglichkeit alle Daten zu speichern, für weniger URL aufrufe
let allPkm = [];

//laden der URL-Daten
async function loadAllPokemons(){
    //Laden und Warten auf alle Daten aus der URL
    let response = await fetch(Basic_URL);
    //Variable erstellen die das JSON-Format des Inhaltes der URL speichert
    let responseToJson = await response.json();
    //Variable erstellen mit den "results" aus der JSON
    let data = responseToJson.results;
    //Ausgabe alles Daten zu allen geladenen PKM
    console.log(responseToJson)
    console.log(data)
    //Aufruf zum Ausführen der Funktion zum Laden der Details
    await loadPkmDetails(data);
    //Aufruf zum Ausführen der Erstellung der Karten
    renderPkmCard();
};  

//laden der einzelnen Details jedes PKM
async function loadPkmDetails(data){
    //iterieren durch die "results" von der "data"
    for (let index = 0; index < data.length; index++) {
        const pkm = data[index];
        //warten auf Details aus der "data"
        let detailResponse = await fetch(pkm.url);
        //Umwandeln der Details aus der "data" in JSON
        let detailData = await detailResponse.json();
        //Anzeige der Details für weiter eventuelle Details zum anzeigen
        console.log(detailData);
        //Speichern der Details für weniger URL-Anfragen
        allPkm.push({
            name: detailData.name,
            image: detailData.sprites.front_default,
            id: detailData.order,
            type: detailData.types
        });
    }
};

//Erstellen der einzelnen Karten
function renderPkmCard(){
//Festlegen des Ortes für die Kartenerstellung
  let contentRef = document.getElementById("content");
  //Leerung des Ortes
  contentRef.innerHTML = "";
  //for-schleife für Namen Bilder ID etc
  //Schleife iteriert durch oben angelegtes Array und spart Serveranfragen
    for (let index = 0; index < allPkm.length; index++) {
        //Festleger der Variable die alle Indexe verkörpern soll
        const pkm = allPkm[index];
        //Aufruf an dem festgelegten Ort ein TemplateLiteral auszuführen
        //mitgegeben wird die Variable, die den Index verkörpert und der Index
        //der Stelle, wo er sich gerade befindet.
        contentRef.innerHTML += renderPkmCardTemp(pkm, index); 
    };
    scalePkmCards();
};

function scalePkmCards(){
    // Alle Elemente mit Klasse "pkm-cards" auswählen
    let imgPkmCards = document.querySelectorAll(".pkm-cards");
    if(imgPkmCards.length > 0){
        setTimeout(() => {
            imgPkmCards.forEach(card => {
                card.classList.remove("pkm-hidden");
                card.classList.add("pkm-scale-start");
            });
        }, 900);
    }
};

function scalePkm(){
    let imgInOverlayCard = document.getElementById("imgInOverlayCard");
    if(imgInOverlayCard){
        setTimeout(() => {
            imgInOverlayCard.classList.remove("pkm-hidden");
            imgInOverlayCard.classList.add("pkm-scale");
        }, 900);
    } 
};

function visibilityOverlay(index){
    const overlay = document.getElementById("overlay");
    const contentRef = document.getElementById("content");
    const isOverlayNotVisible = overlay.classList.contains("d-none");
    if(isOverlayNotVisible){
        overlay.classList.remove("d-none");
        contentRef.classList.add("d-none");
        renderOverlayCard(index);
        enableFilter(1);
    }else{
        contentRef.classList.remove("d-none")
        overlay.classList.add("d-none");
    };
};

function renderOverlayCard(index){
    const pkm = allPkm[index];
    const contentContainerRef = document.getElementById("overlay-content-container");
    contentContainerRef.innerHTML = renderOverlayCardTemplate(pkm);
    scalePkm();
};

function enableFilter(filterNumber) {
    const filters = [
        document.getElementById("filter-1"),
        document.getElementById("filter-2"),
        document.getElementById("filter-3")
    ];

    filters.forEach((filter, index) => {
        if (index === filterNumber - 1) {
            filter.classList.remove("d-none");
        } else {
            filter.classList.add("d-none");
        }
    });
};

// function enableFilter1(){
//     const filter1 = document.getElementById("filter-1");
//     const filter2 = document.getElementById("filter-2");
//     const filter3 = document.getElementById("filter-3");

//     filter1.classList.remove("d-none");
//     filter2.classList.add("d-none");
//     filter3.classList.add("d-none");
// };

// function enableFilter2(){
//     const filter1 = document.getElementById("filter-1");
//     const filter2 = document.getElementById("filter-2");
//     const filter3 = document.getElementById("filter-3");

//     filter1.classList.add("d-none");
//     filter2.classList.remove("d-none");
//     filter3.classList.add("d-none");
// };

// function enableFilter3(){
//     const filter1 = document.getElementById("filter-1");
//     const filter2 = document.getElementById("filter-2");
//     const filter3 = document.getElementById("filter-3");

//     filter1.classList.add("d-none");
//     filter2.classList.add("d-none");
//     filter3.classList.remove("d-none");
// };