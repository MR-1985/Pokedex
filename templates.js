function renderPkmCardTemp(pkm, index){
    //Festlegen der Variablen, die eine Eigenschafft wiedergeben
    let type1 = pkm.type[0]?.type.name || "unbekannt";
    let type2 = pkm.type[1]?.type.name || "";
    //das eigentliche HTML wird hier erschaffen
    return `
<div id="poke-card-${index}" class="card type-${type1}">

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
        <img class="pkm-imgs" src="${pkm.image}"></img>
    </div>

    <div id="pkm-atrb">
        <div class="type-badge type-${type1}">
            ${type1}
        </div>
        
        ${type2 ? `<div class="type-badge type-${type2}">${type2}</div>` : ""}
        
    </div>
</div>
    `
}