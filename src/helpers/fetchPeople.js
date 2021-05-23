import axios from 'axios'

export const fetchPeople = (endpoint, resolve, reject) => {
    axios.get(`https://swapi.dev/api/people/${endpoint}`)
    .then(async(response) => {
        let people = response.data.results
        for (let person of people){
            if (person.species.length > 0){
                await axios.get(person.species[0])
                .then(response => {
                    person.icon = response.data.name
                })
                .catch(() => reject(true))
            }
            else{
                person.icon = null
            }
        }
        await resolve(response)
    })
    .catch(() => reject(true))
}