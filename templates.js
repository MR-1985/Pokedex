function renderPkmCardTemp(index, pkm) {
    //Festlegen der Variablen, die eine Eigenschafft wiedergeben

    let type1 = pkm.type[0]?.type.name || "unbekannt";
    let type2 = pkm.type[1]?.type.name || "";
    //das eigentliche HTML wird hier erschaffen
    return `
<div onclick="visibilityOverlay(${index})" id="poke-card-${index}" class="card pokemon-card type-${type1}">
    <div id="pkm-name-id-${index}">
        <div class="pkm-name">
            <div id="id">
                #${pkm.id}
            </div>

            <div id="name">
              ${pkm.name}
            </div>
        </div>
    </div>
    <div id="pkm-img-container">
        <img id="pkm-cards" class="pkm-imgs pkm-cards" src="${pkm.image}"></img>
    </div>
    <div id="pkm-atrb">
        <div class="type-badge type-${type1}">
            ${type1}
        </div>
        ${type2 ? `<div class="type-badge type-${type2}">${type2}</div>` : ""}  
    </div>
</div>
    `
};

function renderOverlayCardTemplate(index, pkm, detailData) {
    const type1 = pkm.type[0]?.type.name || "unbekannt";
    const type2 = pkm.type[1]?.type.name || "";
    return `
    <div onclick="event.stopPropagation()" id="poke-card-${index}" class="rounded-4 mt-5 h-600 type-${type1}">
        <div id="pkm-name-id-${index}" class="pkm-name-id-overlay-card">
            <div class="pkm-name-overlay-card">
                <div class="pkm-id-overlay-card">
                    #${pkm.id}
                </div>
                <div class="pkm-name-overlay-card">
                  ${pkm.name}
                </div>
            </div>
        </div>
        <div id="pkm-img-container">
            <button onclick="showPreviousPokemon()" class="btn btn-left">
                <img class="arrow-left" src="./imgs/doodle-1388119_1280.png" alt="arrow left">
            </button>
            <img id="imgInOverlayCard" class="pkm-imgs no-hover" src="${pkm.image}"></img>
            <button onclick="showNextPokemon()" class="btn btn-right">
                <img class="arrow-right" src="./imgs/doodle-1388119_1280.png" alt="arrow right">
            </button>
        </div>
        <div id="pkm-atrb">
            <div class="type-badge type-${type1}">
                ${type1}
            </div>
            ${type2 ? `<div class="type-badge type-${type2}">${type2}</div>` : ""}
        </div>
        <div id="filter-container" class="d-flex justify-content-between ">
            <div onclick="enableFilterTab(${index}, 0)" id="filter-tab-(1)" class="badge  border mt-1">
                main
            </div>
            <div onclick="enableFilterTab(${index}, 1)" id="filter-tab-(2)" class="badge  border mt-1">
                stats
            </div>
            <div onclick="evoTabClicked(${index}, 2, ${JSON.stringify(detailData)})" id="filter-tab-(3)" class="badge  border mt-1">
                evo
            </div>
        </div>
        <div>
            <div id="main" class="">      
            </div>
            <div id="stats" class="">     
            </div>
            <div id="evo" class="">   
            </div>
        </div>   
    </div>
    `
};

function mainTabTemp(index) {
    const pkm = allPkm[index];
    //.map durchsucht alle objekte im Array. a = Platzhalter und wird zu allen Namen des Objektes ability.
    //.join schreibt alles als Text in den p-tag. 
    //(", ") trennt die Wörter mit einem Komma
    return `   
    <p>Abilities: ${pkm.abilities.map(a => a.ability.name).join(', ')}</p>
        <p>Height: ${pkm.height}</p>
        <p>Weight: ${pkm.weight}</p>
        <p>Base Experience: ${pkm.base_experience}</p>
        `
}

function statsTabTemp(index) {
    const pkm = allPkm[index];

    const statsForStatsTab = pkm.stats.map(statObj => {
        const statName = statObj.stat.name;
        const baseStat = statObj.base_stat;
        return `<p>${statName}: ${baseStat}</p>`;
    }).join('');

    return statsForStatsTab;
}


function evoTabTemp(index) {

    const pkm = allPkm[index];
    const evolutions = pkm.evolutions;
    if (!evolutions) {
        return `<div id="evo-mini-spinner" class="mini-spinner-ball ">    
        </div>`;
    }
    if (evolutions.length === 0) {
        return `<p>${pkm.name} has no evolutions.</p>`;  // Wirklich KEINE vorhanden
    }
    return evolutions.map(evo => `
        <div class=" evo-container" id="evo-container">
            <img src="${evo.image}" alt="${evo.name}" class="evo-img">
            <p>${evo.name}</p>
        </div>
    `).join('');
}