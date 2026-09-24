<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePerson } from '../composables/person'

const router = useRouter()
const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))

// COMPOSABLES
const { personName } = usePerson(url, token)

let goProgram = (id) => {
    localStorage.setItem('student', id)
    router.push({
        name: 'dashboard'
    })
}

let studentProgramsList = ref([])
let getStudentProgramsList = async () => {
    let response = await fetch(url + '/intranet/student-programs-list', {
        headers: {
            'X-Accesss-Token': token
        }
    })
    let data = await response.json()
    studentProgramsList.value = data
}
getStudentProgramsList()
</script>

<template>
    <div class="bg-welcome">
        <div>
            <div class="mb-4 title-welcome">INTRANET</div>
            <div class="mb-4 person-welcome">{{ personName }}</div>
            <div class="program-welcome">
                <div class="list-group">
                    <button
                        type="button"
                        class="list-group-item list-group-item-action py-3 px-4"
                        aria-current="true"
                        v-for="ep in studentProgramsList"
                        :key="ep.id"
                        @click="goProgram(ep.id)"
                    >
                        Ir al programa de {{ ep.Program.abbreviation }}
                        <i class="fa-solid fa-arrow-right-to-bracket ms-2 ms-md-5"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg-welcome {
    align-items: center;
    background-color: #802434;
    color: white;
    display: flex;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: bold;
    justify-content: center;
    min-height: 100%;
    width: 100%;
}

.bg-welcome > div {
    padding: 15px;
}

.title-welcome {
    display: flex;
    font-size: 1.5em;
    justify-content: center;
}

.person-welcome {
    font-size: 1em;
    text-align: center
}

.program-welcome {
    font-size: 1.3em;
    font-weight: bold;
    text-align: center;
}

.program-welcome button {
    align-items: center;
    display: flex;
    justify-content: space-between;
}

@media only screen and (min-width: 992px) {
    .title-welcome {
        font-size: 3em;
    }

    .person-welcome {
        font-size: 2em;
    }

    .program-welcome {
        font-size: 1.6em;
        padding-left: 100px;
        padding-right: 100px;
    }
}
</style>
