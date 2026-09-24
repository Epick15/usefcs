import { ref, watchEffect } from 'vue'

function usePerson(url, token) {
    let person = ref({})
    let personName = ref('')
    let personDocument = ref('')

    watchEffect(() => {
        fetch(url + '/intranet/person/profile', {
            headers: {
                'X-Accesss-Token': token
            }
        })
            .then((response) => response.json())
            .then((data) => {
                person.value = data
                personName.value = data.paternal + ' ' + data.maternal + ' ' + data.name
                personDocument.value = data.document_number
            })
    })

    return { person, personName, personDocument }
}

export { usePerson }
