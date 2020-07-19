//API Estado e Cidade
function populateUFs(){
    const ufSelect = document.querySelector("[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json())            
    .then(states =>{
        for(state of states){
                ufSelect.innerHTML += `<option value = "${state.id}">${state.nome}</option>`
            }
        })
}
populateUFs()

function getCities(){
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")
    const ufValue = event.target.value
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    fetch(url)
    .then(res => res.json())            
    .then(cities =>{
        for(city of cities){
                citySelect.innerHTML += `<option value = "${city.nome}">${city.nome}</option>`
            }
            citySelect.disabled = false
        })

}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

//Eff Itens coleta

const itemsToCollect = document.querySelectorAll(".items-grid li")

for( const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event){
    const itemLi = event.target
    itemLi.classList.toggle("selected")
    const itemId = itemLi.dataset.id

//Verificar e pegar itens selecionados, e tirar da seleção caso necessario
    const alreadySelected = selectedItems.findIndex(item =>{
        const itemFound = item == itemId
        return itemFound
    })
    if(alreadySelected >= 0){
        const filteredItems = selectedItems.filter(item=>{
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        selectedItems = filteredItems
    } else {
        selectedItems.push(itemId)
    }
    collectedItems.value = selectedItems
}
