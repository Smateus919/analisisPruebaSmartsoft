import { Data, States } from "./models/data.model"

//Obtener array de estados
export function getStates(data: Data[]) {
    const rStates: States[] = []

    for (let i = 0; i < data.length; i++) {
        rStates.push({name: data[i].Province_State})
    }    
    let nrStates: States[] = [{name:  data[1].Province_State, data: [], acumDeaths: 0, acumPopulation: 0}]

    return filterRepeatedArray(rStates, nrStates)
}

//Fitrar datos repetidos de array status
export function filterRepeatedArray(rStates: States[], nrStates: States[]){
    
    for (let i = 0; i < rStates.length; i++) {
        let hasRepeated = 0
        const element = rStates[i].name;
        for (let i = 0; i < nrStates.length; i++) {
            const state = nrStates[i].name;
            state == element ? hasRepeated += 1 : hasRepeated += 0
        }
        if(hasRepeated === 0 ) {
            nrStates.push({name: element, data: [], acumDeaths: 0, acumPopulation: 0})
        }
    }
    return nrStates   
}

//Agrupar data por estado
export function groupByState(data: Data[], aStates: States[]){          
    for (let i = 0; i < data.length; i++){
        const element = data[i];
        for (let i = 0; i < aStates.length; i++) {
            const state = aStates[i];
            switch (element.Province_State) {
                case state.name:
                    state.data?.push(element)
                    break;            
                default:
                    break;
            }
            
        }
    }
    return aStates
}

// Calcular total de muertes por estado 
export function calcTotalDeaths(data:States[]) {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];        
        for (let i = 0; i < element.data?.length; i++) {
            const dataByState = element.data[i];
            let data = parseInt(dataByState["4/27/21"])
            element.acumDeaths += data            
        }
    }
    return data
}

// Calcular total de muertes por estado 
export function calcTotalPopulation(data:States[]) {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];  
        for (let i = 0; i < element.data.length; i++) {
            const dataByState = element.data[i];
            let data = parseInt(dataByState.Population)
            element.acumPopulation += data            
        }
    } 
    return data
}