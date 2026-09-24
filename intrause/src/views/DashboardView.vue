<script setup>
import { usePerson } from '../composables/person'
import { useProgram } from '../composables/program'

const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))
const student = localStorage.getItem('student')

// COMPOSABLES
const { personName, personDocument } = usePerson(url, token)
const { programName } = useProgram(url, token, student)
</script>

<template>
    <div class="row">
        <div class="col d-flex justify-content-center mt-3">
            <h1 class="text-random text-center">USE-FCS</h1>
        </div>
    </div>
    <div class="row">
        <div class="col d-flex justify-content-center mt-3">
            <h2 class="text-dark text-center">{{ personName }}</h2>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col col-md-10 mt-3">
            <h2 class="text-dark text-center">
                {{ personDocument }}
            </h2>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col col-md-10 mt-3">
            <h3 class="text-random text-center">
                {{ programName }}
            </h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-5 col-md-3 image-unsm"></div>
        <div class="col-5 col-md-3 image-fcs"></div>
    </div>
</template>

<style scoped>
.image-unsm,
.image-fcs {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    height: 300px;
}
.image-unsm {
    background-image: url('../assets/logo-unsm.webp');
}
.image-fcs {
    background-image: url('../assets/logo-fcs.webp');
}
p {
    font-size: 1.5em;
    font-weight: 600;
}
</style>
