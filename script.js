//Bei Laden der Seite wird die Funktion ausgefüührt
function onloadGetData() {
    //in der Funktion wird eine Funktion aufgerufen, die alle Daten vorerst laden soll
    loadAllPokemons();
};

//Basis URL mit allen Daten und Limitter
const Basic_URL = "https://pokeapi.co/api/v2/pokemon?limit=35&offset=0"

//Array mit Möglichkeit alle Daten zu speichern, für weniger URL aufrufe
let allPkm = [];

function showSpinner() {
    loadingSpinnerOverlay();
    document.getElementById('loadingSpinner').style.display = 'block';
    
}

function hideSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
    
    closeOverlay();
}

//laden der URL-Daten
async function loadAllPokemons() {
    showSpinner();
    //Laden und Warten auf alle Daten aus der URL
    let response = await fetch(Basic_URL);
    //Variable erstellen die das JSON-Format des Inhaltes der URL speichert
    let responseToJson = await response.json();
    //Variable erstellen mit den "results" aus der JSON
    let data = responseToJson.results;
    //Ausgabe alles Daten zu allen geladenen PKM
    // console.log(responseToJson)
    console.log(responseToJson)
    console.log(data)
    //Aufruf zum Ausführen der Funktion zum Laden der Details
    await loadPkmDetails(data);
    hideSpinner();
    //Aufruf zum Ausführen der Erstellung der Karten
    renderPkmCard();
};

//laden der einzelnen Details jedes PKM
async function loadPkmDetails(data) {
    //iterieren durch die "results" von der "data"
    for (let index = 0; index < data.length; index++) {
        const pkm = data[index];
        //warten auf Details aus der "data"
        let detailResponse = await fetch(pkm.url);
        //Umwandeln der Details aus der "data" in JSON
        let detailData = await detailResponse.json();
        //Anzeige der Details für weiter eventuelle Details zum anzeigen
        console.log(detailData);
        //laden der evolutionsbilder
        let evoData = await loadEvoChain(detailData);

        //Speichern der Details für weniger URL-Anfragen
        allPkm.push({
            name: detailData.name,
            image: detailData.sprites.front_default,
            id: detailData.order,
            type: detailData.types,
            abilities: detailData.abilities,
            height: detailData.height,
            weight: detailData.weight,
            base_experience: detailData.base_experience,
            stats: detailData.stats,
            evolutions: evoData
        });
        console.log(allPkm)
    }
};

async function loadEvoChain(detailData) {
    let speciesResponse = await fetch(detailData.species.url);
    let speciesData = await speciesResponse.json();
    console.log(speciesData);
    let chainResponse = await fetch(speciesData.evolution_chain.url)
    let evoData = await chainResponse.json();
    console.log(evoData)
    let evoImages = [];
    await traverseEvoChain(evoData.chain, evoImages);
    console.log(evoImages)
    return evoImages;
};

async function traverseEvoChain(chain, evoImages) {
    if (!chain) return;

    const name = chain.species.name;
    const image = await getPokemonImage(name);
    evoImages.push({ name, image });

    // Nur die erste Evolution in jeder Stufe berücksichtigen (standard)
    if (chain.evolves_to.length > 0) {
        await traverseEvoChain(chain.evolves_to[0], evoImages);
    }
}

async function getPokemonImage(pokeName) {
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
        let data = await response.json();
        return data.sprites.front_default
    } catch (error) {
        console.error("Error loading image for ${pokeName}:", error);
        return
    }
};

//Erstellen der einzelnen Karten
function renderPkmCard() {
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
        contentRef.innerHTML += renderPkmCardTemp(index, pkm);
    };
    scalePkmCards();
};

function scalePkmCards() {
    // Alle Elemente mit Klasse "pkm-cards" auswählen
    let imgPkmCards = document.querySelectorAll(".pkm-cards");
    if (imgPkmCards.length > 0) {
        setTimeout(() => {
            imgPkmCards.forEach(card => {
                card.classList.remove("pkm-hidden");
                card.classList.add("pkm-scale-start");
            });
        }, 200);
    }
};

function scalePkm() {
    let imgInOverlayCard = document.getElementById("imgInOverlayCard");
    if (imgInOverlayCard) {
        setTimeout(() => {
            imgInOverlayCard.classList.add("pkm-scale");
        }, 200);
    }
};

function closeOverlay() {
    const overlay = document.getElementById("overlay");
    const contentRef = document.getElementById("content");
    const isOverlayNotVisible = overlay.classList.contains("d-none");
    if (!isOverlayNotVisible) {
        overlay.classList.add("d-none"); //daher remove
        contentRef.classList.remove("d-none"); // rest verschwinden lassen  
    }
}

function visibilityOverlay(index) {
    const overlay = document.getElementById("overlay");
    const contentRef = document.getElementById("content");
    const isOverlayNotVisible = overlay.classList.contains("d-none"); //Overlay ist unsichtbar durch d-none
    if (isOverlayNotVisible) {
        overlay.classList.remove("d-none"); //daher remove
        contentRef.classList.add("d-none"); // rest verschwinden lassen
        renderOverlayCard(index); //Aufruf die Karte anzuzeigen
        enableFilterTab(index); //die Tabs einstellen, dass Tag 1 standartmäßig angezeigt wird
    } else {
        contentRef.classList.remove("d-none") //ansonsten wenn das Overlay zu sehen ist, dann unsichtbar machen und Content anzeigen
        overlay.classList.add("d-none");
    };
};

function renderOverlayCard(index) {
    const pkm = allPkm[index];
    const contentContainerRef = document.getElementById("overlay-content-container");
    contentContainerRef.innerHTML = renderOverlayCardTemplate(index, pkm);
    scalePkm();
};

function getFilters() { //Funktion um die Filter aufzulisten
    return [
        document.getElementById("main"),
        document.getElementById("stats"),
        document.getElementById("evo")
    ];
};

function enableFilterTab(pkmIndex, filterNumber) {
    const filters = getFilters(); //alle Filter sind nun in der Variable Filters drin
    filters.forEach((filter, index) => {
        const isActivFilter = index === filterNumber;
        if (isActivFilter) {
            filter.classList.remove("d-none");
            renderTempForActivFilter(index, pkmIndex);
        } else {
            filter.classList.add("d-none");
        }
    });
};

function renderTempForActivFilter(index, pkmIndex) {
    switch (index) {
        case 0:
            document.getElementById("main").innerHTML = mainTabTemp(pkmIndex);
            break;
        case 1:
            document.getElementById("stats").innerHTML = statsTabTemp(pkmIndex);
            break;

        default:
            document.getElementById("evo").innerHTML = evoTabTemp(pkmIndex);
            break;
    }

};

async function loadMore() {
    const second_URL = "https://pokeapi.co/api/v2/pokemon?limit=75&offset=35"
    showSpinner();
    //Laden und Warten auf alle Daten aus der URL
    let response = await fetch(second_URL);
    //Variable erstellen die das JSON-Format des Inhaltes der URL speichert
    let responseToJson = await response.json();
    //Variable erstellen mit den "results" aus der JSON
    let data = responseToJson.results;
    //Aufruf zum Ausführen der Funktion zum Laden der Details
    await loadPkmDetails(data);
    hideSpinner();
    //Aufruf zum Ausführen der Erstellung der Karten
    renderPkmCard();

};

async function loadMore2() {
    const second_URL = "https://pokeapi.co/api/v2/pokemon?limit=110&offset=76"
    showSpinner();
    //Laden und Warten auf alle Daten aus der URL
    let response = await fetch(second_URL);
    //Variable erstellen die das JSON-Format des Inhaltes der URL speichert
    let responseToJson = await response.json();
    //Variable erstellen mit den "results" aus der JSON
    let data = responseToJson.results;
    //Aufruf zum Ausführen der Funktion zum Laden der Details
    await loadPkmDetails(data);
    hideSpinner();
    //Aufruf zum Ausführen der Erstellung der Karten
    renderPkmCard();
};
async function loadMore3() {
    const second_URL = "https://pokeapi.co/api/v2/pokemon?limit=145&offset=111"
    showSpinner();
    //Laden und Warten auf alle Daten aus der URL
    let response = await fetch(second_URL);
    //Variable erstellen die das JSON-Format des Inhaltes der URL speichert
    let responseToJson = await response.json();
    //Variable erstellen mit den "results" aus der JSON
    let data = responseToJson.results;
    //Aufruf zum Ausführen der Funktion zum Laden der Details
    await loadPkmDetails(data);
    hideSpinner();
    //Aufruf zum Ausführen der Erstellung der Karten
    renderPkmCard();
};
async function loadAll() {
    const second_URL = "https://pokeapi.co/api/v2/pokemon?limit=1015&offset=146"
    showSpinner();
    //Laden und Warten auf alle Daten aus der URL
    let response = await fetch(second_URL);
    //Variable erstellen die das JSON-Format des Inhaltes der URL speichert
    let responseToJson = await response.json();
    //Variable erstellen mit den "results" aus der JSON
    let data = responseToJson.results;
    //Aufruf zum Ausführen der Funktion zum Laden der Details
    await loadPkmDetails(data);
    hideSpinner();
    //Aufruf zum Ausführen der Erstellung der Karten
    renderPkmCard();
};

function loadingSpinnerOverlay() {
    const overlay = document.getElementById("overlay");
    const contentRef = document.getElementById("content");
    const isOverlayNotVisible = overlay.classList.contains("d-none"); //Overlay ist unsichtbar durch d-none
    if (isOverlayNotVisible) {
        overlay.classList.remove("d-none"); //daher remove
        contentRef.classList.add("d-none"); // rest verschwinden lassen
    } else {
        contentRef.classList.remove("d-none") //ansonsten wenn das Overlay zu sehen ist, dann unsichtbar machen und Content anzeigen
        overlay.classList.add("d-none");
    };
};

function disableButton(index) {
    document.getElementById(`load-more-button-${index}`).disabled = true;
}