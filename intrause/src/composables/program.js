import { ref, watchEffect } from 'vue'

function useProgram(url, token, student) {
    let programName = ref('')

    watchEffect(() => {
        fetch(url + '/intranet/student-program', {
            headers: {
                'X-Accesss-Token': token,
                'X-Student-Id': student
            }
        })
            .then((response) => response.json())
            .then((data) => {
                programName.value = data.Program.denomination.toUpperCase()
            })
    })

    return { programName }
}

export { useProgram }