let currentIndex = 0;
let allPkm = [];
let currentPokemonIndex = 0;
let urls = [];
const limit = 7;
const maxOffset = 1099;

function setOffset() {
    for (let offset = 0; offset <= maxOffset; offset += limit) {
        urls.push(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    };
}

function showSpinner() {
    document.getElementById('spinner-overlay').classList.remove("d-none");
    document.getElementById('content').classList.add("d-none");
}

function hideSpinner() {
    document.getElementById('spinner-overlay').classList.add("d-none");
    document.getElementById('content').classList.remove("d-none");
}

function hideLoadButton() {
    document.getElementById("load-more-button").classList.add("d-none");
}

function showLoadButton() {
    document.getElementById("load-more-button").classList.remove("d-none");
}

async function loadPokemons() {
    try {
        prepareLoadingUI()
        const url = urls[currentIndex];
        currentIndex++;
        let response = await fetch(url);
        let responseToJson = await response.json();
        let data = responseToJson.results;
        await loadPkmDetails(data);
        renderPkmCard();
        closeLoadingUI()
    } catch (error) {
        console.error("Error loading Pokemon", error);
    };
}

function prepareLoadingUI() {
    hideLoadButton();
    showSpinner();
}

function closeLoadingUI() {
    hideSpinner();
    showLoadButton();
}

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
}

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
}

async function evoTabClicked(index) {
    const species_url = allPkm[index].species_url;
    await loadEvoChain(species_url, index);
    enableFilterTab(index, 2);
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
        return evoImages;
    } catch (error) {
        console.error("Error loading Evo Chain", error);
        return
    };
}

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
}

async function getPokemonImage(pokeName) {
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
        let data = await response.json();
        return data.sprites.front_default
    } catch (error) {
        console.error(`Error loading image for ${pokeName}:`, error);
        return
    };
}

function renderPkmCard() {
    let contentRef = document.getElementById("content");
    contentRef.innerHTML = "";
    for (let index = 0; index < allPkm.length; index++) {
        const pkm = allPkm[index];
        let type1 = pkm.type[0]?.type.name || "unbekannt";
        let type2 = pkm.type[1]?.type.name || "";
        contentRef.innerHTML += renderPkmCardTemp(type1, type2, index, pkm);
    };
    scalePkmCards();
}

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
}

function scalePkm() {
    let imgInOverlayCard = document.getElementById("imgInOverlayCard");
    if (imgInOverlayCard) {
        setTimeout(() => {
            imgInOverlayCard.classList.add("pkm-scale");
        }, 200);
    };
}

function closeOverlay() {
    const overlay = document.getElementById("overlay");
    const contentRef = document.getElementById("content");
    const isOverlayNotVisible = overlay.classList.contains("d-none");
    if (!isOverlayNotVisible) {
        overlay.classList.add("d-none");
        contentRef.classList.remove("d-none");
    };
}

function visibilityOverlay(index) {
    currentPokemonIndex = index;
    const overlay = document.getElementById("overlay");
    const contentRef = document.getElementById("content");
    const isOverlayNotVisible = overlay.classList.contains("d-none");
    if (isOverlayNotVisible) {
        overlay.classList.remove("d-none");
        contentRef.classList.add("d-none");
    };
    renderOverlayCard(index);
    enableFilterTab(index);
}

function renderOverlayCard(index) {
    const pkm = allPkm[index];
    const contentContainerRef = document.getElementById("overlay-content-container");
    const type1 = pkm.type[0]?.type.name || "unbekannt";
    const type2 = pkm.type[1]?.type.name || "";
    contentContainerRef.innerHTML = renderOverlayCardTemplate(type1, type2, index, pkm);
    scalePkm();
}

function getFilters() {
    return [
        document.getElementById("main"),
        document.getElementById("stats"),
        document.getElementById("evo")
    ];
}

function enableFilterTab(pkmIndex, filterNumber = 0) {
    const filters = getFilters();
    filters.forEach((filter, index) => {
        const isActivFilter = index === filterNumber;
        if (isActivFilter) {
            filter.classList.remove("d-none");
            renderTempForActivFilter(index, pkmIndex);
        } else {
            filter.classList.add("d-none");
        };
    });
}

function renderTempForActivFilter(index, pkm) {
    pkm = allPkm[pkm];
    let html = ""
    workWithSwitchCase(index, pkm, html);
}

function workWithSwitchCase(index, pkm, html) {
    switch (index) {
        case 0:
            html = mainTabTemp(pkm);
            document.getElementById("main").innerHTML = html;
            break;
        case 1:
            html = preparingForStatsTabTemp(pkm);
            document.getElementById("stats").innerHTML = html;
            break;
        default:
            html = preparingForEvoTabTemp(pkm);
            document.getElementById("evo").innerHTML = html;
            break;
    };
}

function preparingForStatsTabTemp(index) {
    // const pkm = allPkm[index];
    if (!pkm) {
        console.error("Fehler: Kein Pokémon an diesem Index.");
        return;
    }
    const statsContainer = document.getElementById("stats");
    const statsForStatsTab = allPkm.stats.map(statObj => {
        const statName = statObj.stat.name;
        const baseStat = statObj.base_stat;
        return statsContainer.innerHTML = statsTabTemp(statName, baseStat)
    }).join('');
    return statsForStatsTab;
}

// function preparingForStatsTabTemp(index) {
//     const pkm = allPkm[index];
//     const statsHtml = pkm.stats.map(statObj => {
//         const statName = statObj.stat.name;
//         const baseStat = statObj.base_stat;
//         return statsTabTemp(statName, baseStat);
//     }).join('');
//     return statsHtml;
// }

function preparingForEvoTabTemp() {
    for (let i = 0; i < allPkm.length; i++) {
        const evolutions = allPkm[i].evolutions;
        const evoContainer = document.getElementById("evo");
        if (!evolutions) {
            return evoContainer.innerHTML = showMiniSpinnerTemp();
        }
        if (evolutions.length === 0) {
            evoContainer.innerHTML = showErrorTextTemp(pkm);
            return;
        }
        return evolutions.map(evo => {
            return evoContainer.innerHTML = showEvolutionsTemp(evo);
        }).join('');
    }




    // const pkm = allPkm[index];
    // const evolutions = pkm.evolutions;
    // const evoContainer = document.getElementById("evo");

    // if (!evolutions) {
    //     evoContainer.innerHTML = showMiniSpinnerTemp();
    //     return;
    // }

    // if (evolutions.length === 0) {
    //     evoContainer.innerHTML = showErrorTextTemp(pkm);
    //     return;
    // }

    // const html = evolutions.map(evo => showEvolutionsTemp(evo)).join('');
    // evoContainer.innerHTML = html;


    // const evoContainer = document.getElementById("evo");
    // const allEntries = Object.values(allPkm);
    // for (let i = 0; i < allEntries.length; i++) {
    //     const pkm = allEntries[i];
    //     if (!Array.isArray(pkm.evolutions)) {
    //         evoContainer.innerHTML = showMiniSpinnerTemp();
    //         return;
    //     }
    //     const evo = pkm.evolutions[i];
    //     if (!evo) {
    //         evoContainer.innerHTML = showErrorTextTemp(pkm);
    //         return;
    //     }
    //     evoContainer.innerHTML = showEvolutionsTemp(evo);
    // }

}

function findPokemon() {
    const searchValue = document.getElementById('input').value.toLowerCase().trim();
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = "";
    let filteredPkmWithIndex = allPkm.map((pkm, index) => ({ pkm, index })).filter(item => item.pkm.name.startsWith(searchValue));
    if (filteredPkmWithIndex.length === 0) {
        styleTheButton();
        return;
    }
    workWithFiltertPokemon(filteredPkmWithIndex, contentRef);
    scalePkmCards();
}

function workWithFiltertPokemon(filteredPkmWithIndex, contentRef) {
    filteredPkmWithIndex.forEach(({ pkm, index }) => {
        const type1 = pkm.type[0]?.type.name || "unbekannt";
        const type2 = pkm.type[1]?.type.name || "";
        contentRef.innerHTML += renderPkmCardTemp(type1, type2, index, pkm);
    });
}

function styleTheButton() {
    document.getElementById('input').value = "";
    let styledButton = document.getElementById("load-more-button")
    styledButton.disabled = true;
    let buttonText = "loading".toUpperCase();
    styledButton.innerHTML = buttonText;
    styledButton.classList.add("loading-animation");
    document.getElementById("content").innerHTML += renderNothingFoundTemp();
    setTimeout(() => {
        styledButton.classList.remove("loading-animation")
        resetStyledButton(styledButton);
        findPokemon();
    }, 1500);
}

function resetStyledButton(styledButton) {
    oldButtonText = "load more pokemon";
    styledButton.disabled = false;
    styledButton.innerHTML = oldButtonText;
}

function showPreviousPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
    } else {
        currentPokemonIndex = allPkm.length - 1;
    };
    renderOverlayCard(currentPokemonIndex)
    enableFilterTab(currentPokemonIndex)
}

function showNextPokemon() {
    if (currentPokemonIndex < allPkm.length - 1) {
        currentPokemonIndex++;
    } else {
        currentPokemonIndex = 0;
    };
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
    };
}