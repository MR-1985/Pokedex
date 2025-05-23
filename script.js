function onloadGetData(){
    loadAllPokemons();
    
};

const Basic_URL = "https://pokeapi.co/api/v2/pokemon?limit=130&offset=0"

let allPkm = [];

//laden der URL
async function loadAllPokemons(){
    let response = await fetch(Basic_URL);
    let responseToJson = await response.json();
    let data = responseToJson.results;
    console.log(data)
    for (let index = 0; index < data.length; index++) {
        const pkm = data[index];
        let detailResponse = await fetch(pkm.url);
        let detailData = await detailResponse.json();
        console.log(detailData);
        allPkm.push({
            name: detailData.name,
            image: detailData.sprites.front_default,
            id: detailData.order
        });
        console.log(allPkm)
    }
    renderPkmCard();
};   

// function getDataOfPkm(){

// };

function renderPkmCard(){
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  
  //for schleife für namen bilder etc
    for (let index = 0; index < allPkm.length; index++) {
        const pkm = allPkm[index];
        contentRef.innerHTML += renderPkmCardTemp(pkm, index);
    };
};
