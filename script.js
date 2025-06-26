let currentIndex = 0;
let allPkm = [];
let currentPokemonIndex = 0;
let urls = [];
const limit = 20
const maxOffset = 1099;

function setOffset() {
    for (let offset = 0; offset <= maxOffset; offset += limit) {
        urls.push(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    }
}

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

async function loadPokemons() {
    try {
        hideLoadButton();
        showSpinner();
        const url = urls[currentIndex];
        currentIndex++;
        let response = await fetch(url);
        let responseToJson = await response.json();
        let data = responseToJson.results;
        await loadPkmDetails(data);
        renderPkmCard();
    } catch (error) {
        console.error("Error loading Pokemon", error);
    } finally {
        hideSpinner();
        showLoadButton();
    }
};

async function loadPkmDetails(data) {
    try {
        for (let index = 0; index < data.length; index++) {
            const pkm = data[index];
            let detailResponse = await fetch(pkm.url);
            let detailData = await detailResponse.json();
            pushPokemon(detailData);
        };
    } catch (error) {
        console.error("Error loading Pokemon Details", error);
        return
    };
};

function pushPokemon(detailData) {
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
        console.error(`Error loading image for ${pokeName}:`, error);
        return
    };
};

function renderPkmCard() {
    let contentRef = document.getElementById("content");
    contentRef.innerHTML = "";
    for (let index = 0; index < allPkm.length; index++) {
        const pkm = allPkm[index];
        contentRef.innerHTML += renderPkmCardTemp(index, pkm);
    };
    scalePkmCards();
};

function scalePkmCards() {
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
        overlay.classList.add("d-none");
        contentRef.classList.remove("d-none");
    };
};

// function visibilityOverlay(index) {
//     currentPokemonIndex = index;
//     const overlay = document.getElementById("overlay");
//     const contentRef = document.getElementById("content");
//     const isOverlayNotVisible = overlay.classList.contains("d-none"); //Overlay ist unsichtbar durch d-none
//     if (isOverlayNotVisible) {
//         overlay.classList.remove("d-none");
//         contentRef.classList.add("d-none");
//         renderOverlayCard(index);
//         enableFilterTab(index);
//     } else {
//         contentRef.classList.remove("d-none");
//         overlay.classList.add("d-none");
//     };
// };

function visibilityOverlay(index) {
    currentPokemonIndex = index;
    const overlay = document.getElementById("overlay");
    const contentRef = document.getElementById("content");
    const isOverlayNotVisible = overlay.classList.contains("d-none");

    if (isOverlayNotVisible) {
        overlay.classList.remove("d-none");
        contentRef.classList.add("d-none");
    }

    renderOverlayCard(index);
    enableFilterTab(index);
}

function renderOverlayCard(index) {
    const pkm = allPkm[index];
    const contentContainerRef = document.getElementById("overlay-content-container");
    contentContainerRef.innerHTML = renderOverlayCardTemplate(index, pkm);
    scalePkm();
};

function getFilters() {
    return [
        document.getElementById("main"),
        document.getElementById("stats"),
        document.getElementById("evo")
    ];
};

function enableFilterTab(pkmIndex, filterNumber = 0) {
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
    document.getElementById(`load-more-button-${index}`).disabled = true;
};

function enableNextButton(index) {
    document.getElementById(`load-more-button-${index}`).disabled = false;
};

function findPokemon() {
    const searchValue = document.getElementById('input').value.toLowerCase().trim();
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = "";
    let filteredPkmWithIndex = allPkm
        .map((pkm, index) => ({ pkm, index })).filter(item => item.pkm.name.startsWith(searchValue));
    if (filteredPkmWithIndex.length === 0) {
        alert("No Pokémon found with this letter combination.");
        document.getElementById('input').value = "";
        findPokemon();
        return;
    }
    filteredPkmWithIndex.forEach(({ pkm, index }) => {
        contentRef.innerHTML += renderPkmCardTemp(index, pkm);
    });
    scalePkmCards();
}

function showPreviousPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
    } else {
        currentPokemonIndex = allPkm.length - 1;
    }
    renderOverlayCard(currentPokemonIndex)
    enableFilterTab(currentPokemonIndex)
}

function showNextPokemon() {
    if (currentPokemonIndex < allPkm.length - 1) {
        currentPokemonIndex++;
    } else {
        currentPokemonIndex = 0;
    }
    renderOverlayCard(currentPokemonIndex);
    enableFilterTab(currentPokemonIndex)
}

function openFromEvo(pokeName) {
    const index = allPkm.findIndex(pkm => pkm.name === pokeName);
    if (index !== -1) {
        currentPokemonIndex = index;
        visibilityOverlay(index);
    } else {
        console.error(`Pokémon ${pokeName} nicht im allPkm-Array gefunden.`);
    }
}