function renderPkmCardTemp(pkm, index) {
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

function renderOverlayCardTemplate(pkm, index) {
    const type1 = pkm.type[0]?.type.name || "unbekannt";
    const type2 = pkm.type[1]?.type.name || "";

    return `
    <div onclick="event.stopPropagation()" id="poke-card-${index}" class="card mt-5 w-50 h-500 type-${type1}">

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

            <div onclick="enableFilter(1)" id="filter-${index}" class="badge  border mt-1">
                main
            </div>
            <div onclick="enableFilter(2)" id="filter-${index}" class="badge  border mt-1">
                Stats
            </div>
            <div onclick="enableFilter(3)" id="filter-${index}" class="badge  border mt-1">
                evo
            </div>

        </div>

        <div>

            <div id="filter-1" class="">
                1
            </div>
            <div id="filter-2" class="">
                2
            </div>
            <div id="filter-3" class="">
                3
            </div>

        </div>
                
    </div>
    `
};