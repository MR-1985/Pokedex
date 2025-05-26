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
};

function visibilityOverlay(index){
    // const overlay = document.getElementById("overlay");
    // const contentContainer = document.getElementById("overlay-content-container");
    document.getElementById("overlay").classList.toggle("d-none");
    renderOverlayCard(index); 
    
};

function renderOverlayCard(index){
    const pkm = allPkm[index];
    const contentContainerRef = document.getElementById("overlay-content-container");
    contentContainerRef.innerHTML = renderOverlayCardTemplate(pkm);
};
