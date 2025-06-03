function renderPkmCardTemp(index, pkm) {
    //Festlegen der Variablen, die eine Eigenschafft wiedergeben

    let type1 = pkm.type[0]?.type.name || "unbekannt";
    let type2 = pkm.type[1]?.type.name || "";
    //das eigentliche HTML wird hier erschaffen
    return `
<div onclick="visibilityOverlay(${index})" id="poke-card-${index}" class="card type-${type1}">

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

function renderOverlayCardTemplate(index, pkm) {
    const type1 = pkm.type[0]?.type.name || "unbekannt";
    const type2 = pkm.type[1]?.type.name || "";

    return `
    <div onclick="event.stopPropagation()" id="poke-card-${index}" class=" mt-5 h-600 type-${type1}">

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
            <img id="imgInOverlayCard" class="pkm-imgs no-hover" src="${pkm.image}"></img>
        </div>

        <div id="pkm-atrb">
            <div class="type-badge type-${type1}">
                ${type1}
            </div>
        
            ${type2 ? `<div class="type-badge type-${type2}">${type2}</div>` : ""}
        
        </div>

        
        <div id="filter-container" class="d-flex justify-content-between pe-4 ps-4">

            <div onclick="enableFilterTab(1)" id="filter-tab-(1)" class="badge  border mt-1">
                main
            </div>
            <div onclick="enableFilterTab(2)" id="filter-tab-(2)" class="badge  border mt-1">
                stats
            </div>
            <div onclick="enableFilterTab(3)" id="filter-tab-(3)" class="badge  border mt-1">
                evo
            </div>

        </div>

        <div>

            <div id="main" class="">
                1
            </div>
            <div id="stats" class="">
                2
            </div>
            <div id="evo" class="">
                3
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

    }
