function journeyToMoon(n, astronaut) {
    
    let countries = new Map();
    let countryId = 0;
    const astronautByCountry = new Map();
    
    astronaut.forEach((row) => {
         
        let { astronautsToAdd, country, groupsToMerge } = processRow(row, astronautByCountry);

        if (country === null) {
            country = ++countryId;
            countries.set(country, []);
        }

        addAstronautsToCountry(country, countries, astronautsToAdd, astronautByCountry);
        
        if (groupsToMerge.length) {
            groupsToMerge.sort(sortByNumbersAsc);
            addAstronautsToCountry(groupsToMerge[0], countries, countries.get(groupsToMerge[1]), astronautByCountry) 
            countries.delete(groupsToMerge[1])
        }
        
    })
    
    addMissingCountries(astronautByCountry, countries, countryId, n);
    
    return getNumberOfValidPairs(Array.from(countries.values()), n);

}

function processRow(row, astronautByCountry) {

    let astronautsToAdd = [];
    let groupsToMerge = [];

    let country = row.reduce((country, astronautId) => {
        const astronautContry = astronautByCountry.get(astronautId);
        if (astronautContry === undefined) {
            astronautsToAdd.push(astronautId);
            return country;
        }
        if (country !== null && astronautContry !== country) {
            groupsToMerge = [astronautContry, country];
        } 
        return astronautContry;
    }, null)
    
    return { country, astronautsToAdd, groupsToMerge }
}

function addAstronautsToCountry(country, countries, astronauts, astronautByCountry) {
    countries.set(country, countries.get(country).concat(astronauts));

    astronauts.forEach((astronautId) => {
        astronautByCountry.set(astronautId, country) 
    });
}

function addMissingCountries(astronautByCountry, countries, countryId, totalOfAstronauts) {
    const unAssociatedAstronouts = new Array(totalOfAstronauts-astronautByCountry.size).fill(0);
        
    unAssociatedAstronouts.forEach((astronout) => {
        countries.set(++countryId, [astronout]);
    })
}

function getNumberOfValidPairs(countries, astronauts) {
    let remainedAstronauts = astronauts;
    return countries.reduce((validPairs, country) => {
        remainedAstronauts = remainedAstronauts - country.length;
        return validPairs + country.length * remainedAstronauts
    }, 0);
}

function sortByNumbersAsc(a, b) {
    return a-b
}