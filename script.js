//Array mit Möglichkeit alle Daten zu speichern, für weniger URL aufrufe
let allPkm = [];

function showSpinner() {

    document.getElementById('spinner-overlay').classList.remove("d-none");
    document.getElementById('content').classList.add("d-none");
};

function hideSpinner() {

    document.getElementById('spinner-overlay').classList.add("d-none");
    document.getElementById('content').classList.remove("d-none");
};

function hideLoadButton() {
    document.getElementById("load-more-button").classList.add("d-none");
}

function showLoadButton() {
    document.getElementById("load-more-button").classList.remove("d-none");
}

const limit = 20
const maxOffset = 1099;
const urls = [];
for (let offset = 0; offset <= maxOffset; offset += limit) {
    urls.push(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
}
let currentIndex = 0;

//laden der URL-Daten
async function loadPokemons() {

    try {
        hideLoadButton();
        showSpinner();
        const url = urls[currentIndex];
        currentIndex++; // für den nächsten Klick vorbereiten
        //Laden und Warten auf alle Daten aus der URL
        let response = await fetch(url);
        //Variable erstellen die das JSON-Format des Inhaltes der URL speichert
        let responseToJson = await response.json();
        //Variable erstellen mit den "results" aus der JSON
        let data = responseToJson.results; console.log(data)
        //Aufruf zum Ausführen der Funktion zum Laden der Details
        await loadPkmDetails(data);
        //Aufruf zum Ausführen der Erstellung der Karten
        renderPkmCard();
        // switchFooterPosition();
    } catch (error) {
        console.error("Error loading Pokemon", error);
    } finally {
        hideSpinner();
        showLoadButton();

    }
};

//laden der einzelnen Details jedes PKM
async function loadPkmDetails(data) {
    try {
        //iterieren durch die "results" von der "data"
        for (let index = 0; index < data.length; index++) {
            const pkm = data[index];
            //warten auf Details aus der "data"
            let detailResponse = await fetch(pkm.url);
            //Umwandeln der Details aus der "data" in JSON
            let detailData = await detailResponse.json();
            console.log(detailData)
            //Anzeige der Details für weiter eventuelle Details zum anzeigen
            //laden der evolutionsbilder
            // console.log(evoData);
            pushPokemon(detailData);
        };
    } catch (error) {
        console.error("Error loading Pokemon Details", error);
        return
    };
};

function pushPokemon(detailData) {

    //Speichern der Details für weniger URL-Anfragen
    allPkm.push({
        name: detailData.name,
        image: detailData.sprites.front_default,
        id: detailData.id,
        type: detailData.types,
        abilities: detailData.abilities,
        height: detailData.height,
        weight: detailData.weight,
        base_experience: detailData.base_experience,
        stats: detailData.stats,
        species_url: detailData.species.url
    });
};

async function evoTabClicked(index) {
    await enableFilterTab(index, 2);
    const species_url = allPkm[index].species_url;
    await loadEvoChain(species_url, index);
}


async function loadEvoChain(species_url, index) {
    try {
        let speciesResponse = await fetch(species_url);
        let speciesData = await speciesResponse.json();
        let chainResponse = await fetch(speciesData.evolution_chain.url)
        let evoData = await chainResponse.json();
        let evoImages = [];
        await traverseEvoChain(evoData.chain, evoImages);
        allPkm[index].evolutions = evoImages;
        document.getElementById("evo").innerHTML = evoTabTemp(index);
        return evoImages;
    } catch (error) {
        console.error("Error loading Evo Chain", error);
        return
    };
};

async function traverseEvoChain(chain, evoImages) {

    try {
        if (!chain) return;
        const name = chain.species.name;
        const image = await getPokemonImage(name);
        evoImages.push({ name, image });
        // Nur die erste Evolution in jeder Stufe berücksichtigen (standard)
        if (chain.evolves_to.length > 0) {
            await traverseEvoChain(chain.evolves_to[0], evoImages);
        };
    } catch (error) {
        console.error("Error loading evochain:", error);
        return
    };
};

async function getPokemonImage(pokeName) {

    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
        let data = await response.json();
        return data.sprites.front_default
    } catch (error) {
        console.error("Error loading image for ${pokeName}:", error);
        return
    };
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
    };
};

function scalePkm() {

    let imgInOverlayCard = document.getElementById("imgInOverlayCard");
    if (imgInOverlayCard) {
        setTimeout(() => {
            imgInOverlayCard.classList.add("pkm-scale");
        }, 200);
    };
};

function closeOverlay() {

    const overlay = document.getElementById("overlay");
    const contentRef = document.getElementById("content");
    const isOverlayNotVisible = overlay.classList.contains("d-none");
    if (!isOverlayNotVisible) {
        overlay.classList.add("d-none"); //daher remove
        contentRef.classList.remove("d-none"); // rest verschwinden lassen  
    };
};

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
    };
};

function disableButton(index) {
    // disabled einen Button nach dem klick, um nicht die selben Pokemon wieder zu laden
    document.getElementById(`load-more-button-${index}`).disabled = true;
};

function enableNextButton(index) {
    // enabled den nächsten Button
    document.getElementById(`load-more-button-${index}`).disabled = false;
};

function findPokemon() {
    const searchValue = document.getElementById('input').value.toLowerCase();
    const cards = document.querySelectorAll('#content .pokemon-card');
    cards.forEach(card => {
        const nameElement = card.querySelector('#name');
        const name = nameElement.textContent.toLowerCase();

        if (name.includes(searchValue)) {
            card.classList.remove('d-none');
        } else {
            card.classList.add('d-none');
        }
    });
}