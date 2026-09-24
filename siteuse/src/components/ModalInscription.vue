<script setup>
import { ref } from 'vue'

import Swal from 'sweetalert2'

const props = defineProps(["showModal"])

const programs = ref([])
const getPrograms = async () => {
    // const response = await fetch('http://localhost:8899/api/web/programs')
    const response = await fetch('https://usefcs.unsm.edu.pe/api/web/programs')
    const responseData = await response.json()
    programs.value = responseData.programs
}
getPrograms()

const isDisabled = ref(false)
let registerModal = ref(props.showModal)
const id_program = ref('')
const document = ref('')
const first_name = ref('')
const last_name = ref('')
const email = ref('')
const phone = ref('')

const apiUrl = 'https://dniruc.apisperu.com/api/v1/dni/'
const apiToken =
    '?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNvcG9ydGVAdW5zbS5lZHUucGUifQ.0_GDfGtk3rl0ScfpZ1NUfOMUr-Zqe8o1oy2lQtbTJiQ'
const searchPerson = async () => {
    if (![8].includes(document.value.length)) {
        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Datos no encontrados',
            showConfirmButton: false,
            timer: 1000
        })
        return false
    }
    const response = await fetch(apiUrl + document.value + apiToken)
    const responseData = await response.json()
    if (responseData.success) {
        first_name.value = responseData.nombres
        last_name.value = responseData.apellidoPaterno + ' ' + responseData.apellidoMaterno
    } else {
        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Datos no encontrados',
            showConfirmButton: false,
            timer: 1000
        })
    }
}

// REGISTER
const register = async () => {
    if (
        id_program.value == '' ||
        document.value == '' ||
        first_name.value == '' ||
        last_name.value == '' ||
        email.value == '' ||
        phone.value == ''
    ) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Llenar todos los campos',
            showConfirmButton: false,
            timer: 2500
        })
        return false
    }
    isDisabled.value = true
    // let response = await fetch('http://localhost:8899/api/web/inscriptions', {
    let response = await fetch('https://usefcs.unsm.edu.pe/api/web/inscriptions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Asegura que los datos se envíen como JSON
        },
        body: JSON.stringify({
            id_program: id_program.value,
            document: document.value,
            first_name: first_name.value,
            last_name: last_name.value,
            email: email.value,
            phone: phone.value
        })
    })
    // console.log(response)
    let responseData = await response.json()
    if (responseData.valid) {
        Swal.fire({
            title: '¡Registro exitoso!, un asesor se contactará con usted',
            showClass: {
                popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
            },
            hideClass: {
                popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
            }
        })
        registerModal.value = false
        id_program.value = ''
        document.value = ''
        first_name.value = ''
        last_name.value = ''
        email.value = ''
        phone.value = ''
        isDisabled.value = false
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor inténtelo nuevamente'
        })
    }
}
</script>

<template>
    <Teleport to="body">
        <div
            class="modal d-block"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            v-if="registerModal"
        >
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">ADMISIÓN 2026-I</h1>
                        <button
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            @click="registerModal = false"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <div class="mb-3">
                                    <label for="document">PROGRAMA:</label>
                                    <select
                                        name=""
                                        id=""
                                        class="form-control form-control-lg"
                                        v-model="id_program"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option
                                            v-for="program in programs"
                                            :key="program.id"
                                            :value="program.id"
                                            v-text="program.name"
                                        ></option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <div class="row gx-1">
                                        <div class="col">
                                            <label for="document">DNI:</label>
                                            <input
                                                type="text"
                                                class="form-control form-control-lg"
                                                v-model="document"
                                            />
                                        </div>
                                        <div class="col-auto">
                                            <label for="" style="color: transparent; display: block"
                                                >.</label
                                            >
                                            <button
                                                class="btn btn-lg btn-primary"
                                                @click="searchPerson"
                                            >
                                                Buscar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="first_name">NOMBRES:</label>
                                    <input
                                        type="text"
                                        class="form-control form-control-lg"
                                        v-model="first_name"
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="last_name">APELLIDOS:</label
                                    ><input
                                        type="text"
                                        class="form-control form-control-lg"
                                        v-model="last_name"
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="last_name">CORREO:</label
                                    ><input
                                        type="email"
                                        class="form-control form-control-lg"
                                        v-model="email"
                                    />
                                </div>
                                <div class="">
                                    <label for="last_name">CELULAR:</label
                                    ><input
                                        type="text"
                                        class="form-control form-control-lg"
                                        v-model="phone"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-lg btn-secondary"
                            @click="registerModal = false"
                        >
                            Cerrar
                        </button>
                        <button type="button" class="btn btn-lg btn-enviar" @click="register" :disabled="isDisabled">
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modal {
    background-color: rgba(50, 50, 50, 0.8) !important;
}

.modal-header {
    background-color: #811632;
    color: white;
    font-size: 1.1em;
}

input {
    box-shadow: none !important;
    border-width: 2px !important;
}

input:focus {
    border: 2px solid #811632;
}

.btn-enviar {
    background-color: #811633de;
    border: 1px solid #811633de;
    color: white;
}

.btn-enviar:hover {
    background-color: #811632;
    border: 1px solid #811632;
    color: white;
}

label {
    margin-bottom: 5px;
}
</style>
