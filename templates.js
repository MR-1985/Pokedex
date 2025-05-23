function renderPkmCardTemp(pkm, index){
    return `
<div id="poke-card-${index}" class="card">

    <div id="pkm-name-#-${index}" class="bg-secondary pkm-name">
        <div id="">
        </div>
        <div id="name">
        ${pkm.name}
        </div>
    </div>

    <div id="pkm-img">
    <img class="pkm-imgs" src="${pkm.image}"></img>
    </div>

    <div id="pkm-atrb">
        <div>

        </div>
    </div>
</div>
    `
}