export interface Data {
    UID:            string
    iso2:           string
    iso3:           string
    code3:          string
    FIPS:           string
    Admin2:         string
    Province_State: string
    Country_Region: string
    Lat:            string
    Long_:          string
    Combined_Key:   string
    Population:     string
    "1/22/20":      string
    "4/27/21":      string
}
export interface States {
    name: string
    data?: Data[]
    acumDeaths?: number
    acumPopulation?: number
    percentageDeaths?: number
}