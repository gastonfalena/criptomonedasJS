const criptomonedasSelect = document.querySelector('#criptomonedas')
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')

const objBusqueda = {
    moneda:'',
    criptomoneda:''
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
    formulario.addEventListener('submit',submitFormulario)
    criptomonedasSelect.addEventListener('change',leerValor)
    monedaSelect.addEventListener('change',leerValor)
})
document.addEventListener('DOMContentLoaded',() => {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'
    fetch(url).then( respuesta => respuesta.json())
    .then(resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas))
})

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
    const {FullName,Name} = cripto.CoinInfo
    const option = document.createElement('option')
    option.value = Name
    option.textContent = FullName 
    criptomonedasSelect.appendChild(option)  
    });
}
function submitFormulario(e) {
    e.preventDefault()
    const {moneda,criptomoneda} = objBusqueda
    
    if(moneda ==='' || criptomoneda === '' ){
        mostrarAlerta('Ambos campos son obligatorios')
        return
    }
    consultarApi()
}
function leerValor(e){
    objBusqueda[e.target.name] = e.target.value
}
function mostrarAlerta(mensaje){
    const existeError = document.querySelector('.error')
    if(!existeError){    const divMensaje = document.createElement('div')
    divMensaje.classList.add('error')
    divMensaje.textContent = mensaje
    formulario.appendChild(divMensaje)
    setTimeout(() =>{
        divMensaje.remove()
    },3000)}

}
function consultarApi(){
    const {moneda,criptomoneda} = objBusqueda
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarSpinner()
    fetch(url).then(respuesta => respuesta.json()).then(cotizacion =>{mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])})
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML()
    const {PRICE, HIGHDAY,LOWDAY, CHANGEPCT24HOUR,LASTUPDATE} = cotizacion
    const precio = document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p')
    precioAlto.innerHTML = `Precío más alto del día:<span>${HIGHDAY}</span>`

    const precioBajo = document.createElement('p')
    precioBajo.innerHTML = `Precío más bajo del día:<span>${LOWDAY}</span>`

    const ultimasHoras = document.createElement('p')
    ultimasHoras.innerHTML = `Variación últimas 24 horas:<span>${CHANGEPCT24HOUR}%</span>`
    
    const ultimaActualizacion = document.createElement('p')
    ultimaActualizacion.innerHTML = `Última Actualizacion:<span>${LASTUPDATE}</span>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActualizacion)
}
function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}
function mostrarSpinner(){
    limpiarHTML()
    const spinner = document.createElement('div')
    spinner.classList.add('spinner')
    spinner.innerHTML = `
  <div class="sk-circle3 sk-circle"></div>
  <div class="sk-circle4 sk-circle"></div>
  <div class="sk-circle5 sk-circle"></div>
  <div class="sk-circle6 sk-circle"></div>
  <div class="sk-circle7 sk-circle"></div>
  <div class="sk-circle8 sk-circle"></div>
  <div class="sk-circle9 sk-circle"></div>
  <div class="sk-circle10 sk-circle"></div>
  <div class="sk-circle11 sk-circle"></div>
  <div class="sk-circle12 sk-circle"></div>
</div>`
resultado.appendChild(spinner)
}