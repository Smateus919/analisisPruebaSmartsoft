const csv = require('csv-parser')
const fs = require('fs')
import { Data, States } from "./models/data.model";
import { getStates, calcTotalDeaths, groupByState, calcTotalPopulation } from "./states.service";

const result: Data[] = []
let states: States[] = [] 


fs.createReadStream('./data/time_series_covid19_deaths_US.csv')
.pipe(
    csv({
        delimiter: ','
    })
)
.on('data', (data: Data) => result.push(data))
.on('end', ()=>{
    const aStates = getStates(result)
    const dataByState = groupByState(result, aStates)
    calcTotalDeaths(dataByState)   
    const highestState = highestCumulative(dataByState)
    lowestCumulative(dataByState, highestState.cant)
    states = calcTotalPopulation(dataByState)
    states = percentageOfDeaths(states)
    higherPercent(states)
// 
})

//Obtener el estado con mayor cantidad de muertes acumuladas
function highestCumulative(data:States[]) {
    let highestState = {
        name: '',
        cant: 0
    }
    const acumDeaths = calcTotalDeaths(data)
    for (let i = 0; i < acumDeaths.length; i++) {
        const element = acumDeaths[i];      
        if (element.acumDeaths >= highestState.cant) {
            highestState.name = element.name 
            highestState.cant = element.acumDeaths 
        }
    }
    console.log('El estado de mayor muertes acumuladas a la fecha (4/27/21) fue:', highestState.name, 'con un total de muertes de:', highestState.cant);
    return highestState                
}

//Obtener el estado con menor cantidad de muertes acumuladas
function lowestCumulative(data:States[], CantHighestState:number) {
    let lowestState = {
        name: '',
        cant: CantHighestState
    }
    const acumDeaths = calcTotalDeaths(data)
    for (let i = 0; i < acumDeaths.length; i++) {
        const element = acumDeaths[i];      
        if (element.acumDeaths <= lowestState.cant && element.acumDeaths != 0) {
            lowestState.name = element.name 
            lowestState.cant = element.acumDeaths 
        }
    }
    console.log('El de menor muertes acumuladas (diferente a cero) a la fecha fue: ',lowestState.name, ' con un total de muertes de: ', lowestState.cant);    
    return lowestState  
}

//Obtener porcentaje de muertes vs poblacion
function percentageOfDeaths(data:States[]) {
    console.log('-----------------------------------------------------------------------------------------------------------------------');               
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let percentage
        element.acumPopulation != 0
            ? percentage = element.acumDeaths/element.acumPopulation
            : percentage = 0
        
        element.percentageDeaths = percentage*100        
        console.log(`El estado de ${data[i].name} tuvo un porcentaje de ${element.percentageDeaths.toFixed(2)}% de muertes vs su población total`);
    }
    return data
}

// Obtener el porcentaje mas alto
function higherPercent(data:States[]) {
    let higher = {
        name: '',
        percentage: 0
    }
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.percentageDeaths>=higher.percentage) {
            higher.name = element.name
            higher.percentage = element.percentageDeaths
        }
    }
    console.log('----------------------------------------------------------------------------------------------------------------------------------');               
    console.log(`El estado más afectado fue ${higher.name}, ya que fue el que tuvo un mayor porcentaje de muertes de todos los estados, con un porcentaje de ${higher.percentage.toFixed(2)}% con respecto a su población, lo que muestra que fue el que peor manejo la situación de la pandemia`);
    
}