<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { usePerson } from '../composables/person'

const router = useRouter()
const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))

// COMPOSABLES
const { personName } = usePerson(url, token)

let menu = ref(false)
let menuClose = ref(false)

// CERRAR LA SESION ACTUAL
let closeSession = async () => {
    localStorage.clear()
    router.push({ name: 'login' })
}

// CAMBIAR LA CONTRASEÑA
let modalPassword = ref(false)
let passNew = ref(null)
let passNewRepeat = ref(null)
let changePassword = async () => {
    if (passNew.value === null || passNew.value === '' || passNew.value !== passNewRepeat.value) {
        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Las contraseñas no coinciden',
            showConfirmButton: false,
            timer: 1000
        })
        return false
    }
    let response = await fetch(url + '/intranet/change-password', {
        method: 'PATCH',
        headers: new Headers({
            'Content-Type': 'application/json',
            'X-Accesss-Token': token
        }),
        body: JSON.stringify({ password: passNew.value })
    })
    let data = await response.json()
    if (data) {
        modalPassword.value = false
        passNew.value = null
        passNewRepeat.value = null
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Su contraseña ha cambiado',
            showConfirmButton: false,
            timer: 1000
        })
    } else {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error al guardar',
            showConfirmButton: false,
            timer: 1000
        })
    }
}
</script>

<template>
    <!-- fixed top bar -->
    <div class="app-bar" :class="{ 'app-bar-close': menuClose }">
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div class="col d-flex align-items-center">
                    <ul class="nav nav-pills w-100 d-flex justify-content-between">
                        <li class="nav-item">
                            <span
                                class="fas fa-bars fa-2x me-3 p-2 cursor-pt btn-menu-md"
                                @click="(menu = !menu), (menuClose = !menuClose)"
                            ></span>
                        </li>
                        <li class="nav-item">
                            <span class="p-2 cursor-pt opciones-cuenta">
                                <span class="fas fa-user-circle fa-2x me-2"></span>
                                <span class="align-self-center">{{ personName }}</span>
                            </span>
                            <ul>
                                <li class="cursor-pt" @click="router.push('/welcome')">
                                    Cambiar programa
                                </li>
                                <li class="cursor-pt" @click="modalPassword = true">
                                    Cambiar contraseña
                                </li>

                                <li class="cursor-pt" @click="closeSession">Salir</li>
                            </ul>
                            <!-- Boton de menu -->
                            <span
                                class="fas fa-bars fa-2x ms-4 p-2 cursor-pt btn-menu"
                                @click="menu = !menu"
                            ></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- menu app -->
    <div
        class="app-menu"
        :class="{ 'app-menu-close': menuClose }"
        @click="menu = false"
        v-show="menu"
    >
        <div class="menu-bg">
            <div>
                <div class="col app-brand">
                    <!-- <img src="../assets/logo-fcs.webp" alt="" width="37" height="37" /> -->
                    <span class="app-menu-title ms-2">USE - FCS</span>
                </div>
                <ul class="menu-body nav flex-column mx-3 mt-4">
                    <li class="mb-1">
                        <RouterLink to="/home">
                            <span class="pe-7s-home fa-fw fa-2x"></span>Inicio
                        </RouterLink>
                    </li>
                    <li class="mb-1">
                        <RouterLink to="/marks">
                            <span class="pe-7s-ribbon fa-fw fa-2x"></span>Notas
                        </RouterLink>
                    </li>
                    <li class="mb-1">
                        <RouterLink to="/payments">
                            <span class="pe-7s-cash fa-fw fa-2x"></span>Pagos
                        </RouterLink>
                    </li>
                    <li class="mb-1">
                        <RouterLink to="/documents">
                            <span class="pe-7s-file fa-fw fa-2x"></span>Documentos
                        </RouterLink>
                    </li>
                    <li class="mb-1">
                        <a href="https://usefcs.unsm.edu.pe/aulavirtual/login/index.php" target="_blank">
                            <span class="pe-7s-browser fa-fw fa-2x"></span>Aula virtual
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- body app -->
    <div class="app-body" :class="{ 'app-body-close': menuClose }">
        <div class="container-fluid">
            <RouterView />
        </div>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <teleport to="body">
        <div class="modal fade show d-block" v-if="modalPassword">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header bg-random d-flex justify-content-center">
                        <h6 class="modal-title">CAMBIO DE CONTRASEÑA</h6>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <label for="password_new" class="silver-text-2"
                                    >Nueva contraseña</label
                                >
                                <input
                                    type="password"
                                    class="password_new form-control"
                                    v-model="passNew"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col mt-3">
                                <label for="password_repeat" class="silver-text-2"
                                    >Repetir contraseña</label
                                >
                                <input
                                    type="password"
                                    class="password_repeat form-control"
                                    v-model="passNewRepeat"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-light me-1"
                            @click="modalPassword = false"
                        >
                            <span class="far fa-times-circle me-1"></span>Cancelar
                        </button>
                        <button
                            type="button"
                            class="btn btn-random ms-1 px-3"
                            @click="changePassword"
                        >
                            <span class="far fa-check-circle me-1"></span>Cambiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<style>
/* --- HOME STYLES --- */

/* app bar */
.app-bar {
    background-color: rgb(255, 255, 255);
    border-bottom: 1px solid rgb(200, 200, 200);
    color: rgb(130, 130, 130);
    height: 60px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99;
}
.app-bar .nav-pills > li {
    align-items: center;
    display: flex;
    height: 40px;
}
.app-title {
    color: rgb(120, 120, 130);
    font-weight: 600;
    font-size: 1.1em;
}
.opciones-cuenta {
    align-items: center;
    display: flex;
    height: 60px;
    position: absolute;
    right: 80px;
    top: 0;
}
.opciones-cuenta + ul {
    background-color: rgb(255, 255, 255);
    border-radius: 0 0 5px 5px;
    box-shadow: -2px 2px 6px rgb(200, 200, 200);
    display: none;
    list-style: none;
    padding: 7px 14px 7px 14px;
    position: absolute;
    right: 5px;
    top: 60px;
}
.opciones-cuenta:hover + ul {
    display: block;
}
.opciones-cuenta + ul:hover {
    display: block;
}
.opciones-cuenta + ul > li {
    padding: 10px 5px 10px 5px;
}
.btn-menu-md {
    display: none !important;
}

/* app menu */
.app-menu {
    background-color: rgba(0, 0, 0, 0.2);
    height: 100%;
    position: fixed;
    width: 100%;
    z-index: 100;
}
.menu-bg {
    /* background-color: rgb(51, 51, 51); */
    background-image: url('../assets/sidebar.jpg');
    height: 100%;
    min-height: 100%;
    overflow-y: auto;
    width: 75%;
}
.menu-bg > div {
    background-color: #802433f6;
    min-height: 100%;
}
.app-brand {
    align-items: center;
    color: lavender;
    border-bottom: 1px solid #ccc;
    display: flex;
    height: 60px;
    justify-content: center;
}
.app-menu-title {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
        sans-serif;
    font-weight: bold;
    font-size: 1.1em;
}
.menu-head {
    background-color: rgb(51, 51, 51);
    box-shadow: 0 -1px 1px rgb(100, 100, 100) inset;
    color: rgb(201, 201, 201);
    font-size: 0.95em;
    min-height: 110px;
    position: relative;
}
.menu-head > .ddown {
    background-color: rgb(81, 81, 81);
    border-radius: 0 0 0.25em 0.25em;
    position: absolute;
    width: 100%;
}
.menu-body > li,
.submenu > li {
    border-radius: 3px;
    min-height: 50px;
}
.menu-body > li:hover {
    background-color: rgba(255, 255, 255, 0.2);
}
.menu-body > li > a,
.menu-body > li > span {
    align-items: center;
    border-radius: 3px;
    color: rgb(230, 230, 230);
    cursor: pointer;
    display: flex;
    font-weight: 600;
    height: 50px;
    padding-left: 15px;
    width: 100%;
    text-decoration: none;
}
.submenu > li > a {
    align-items: center;
    border-radius: 3px;
    color: rgb(230, 230, 230);
    display: flex;
    height: 45px;
    padding-left: 15px;
    width: 100%;
    text-decoration: none;
}
.router-link-exact-active {
    background-color: rgba(200, 200, 200, 0.5);
}

.menu-body span {
    margin-right: 15px;
}

/* app body */
.app-body {
    background-color: rgb(250, 250, 245);
    min-height: 100%;
    padding-top: 60px;
    z-index: 0;
}

/* --- COMPONENTS AND VIEWS STYLES --- */

/* page bar */
.page-bar {
    min-height: 50px;
}
.page-title {
    color: rgb(130, 130, 150);
    font-size: 1.4em;
}

/* modal */
.modal {
    background-color: rgba(0, 0, 0, 0.5) !important;
    overflow-y: auto !important;
}
.modal-title {
    color: rgb(248, 248, 248) !important;
}

/* input */
input:focus,
select:focus,
textarea:focus {
    border: 1px solid rgb(170, 170, 170) !important;
    box-shadow: 0 0 3px rgba(170, 170, 170, 0.35) !important;
}

input::placeholder,
textarea::placeholder {
    color: rgb(180, 180, 180) !important;
}

/* button */
button:active {
    box-shadow: none !important;
    transform: scale(1.05);
}
button:focus {
    box-shadow: none !important;
}

/* text */
.silver-text-1 {
    color: rgb(100, 100, 100);
}
.silver-text-2 {
    color: rgb(130, 130, 130);
}

/* background */
.bg-random {
    /* background-color: rgb(0, 123, 255) !important; */
    /* background-color: rgb(108, 117, 125) !important; */
    /* background-color: rgb(25, 135, 84) !important; */
    /* background-color: rgb(220, 53, 69) !important; */
    /* background-color: rgb(255, 193, 7) !important; */
    /* background-color: rgb(23, 162, 184) !important; */
    /* background-color: rgb(52, 58, 64) !important; */
    /* background-color: rgb(248, 249, 250) !important; */
    background-color: rgb(128, 36, 52) !important;
}

.text-random {
    /* color: rgb(0, 123, 255) !important; */
    /* color: rgb(108, 117, 125) !important; */
    /* color: rgb(25, 135, 84) !important; */
    /* color: rgb(220, 53, 69) !important; */
    /* color: rgb(255, 193, 7) !important; */
    /* color: rgb(23, 162, 184) !important; */
    /* color: rgb(52, 58, 64) !important; */
    /* color: rgb(248, 249, 250) !important; */
    color: rgb(128, 36, 52) !important;
}
/* border top */
.top-primary {
    border-top: solid 3px rgb(0, 123, 255) !important;
}
.top-secondary {
    border-top: solid 3px rgb(108, 117, 125) !important;
}
.top-success {
    border-top: solid 3px rgb(25, 135, 84) !important;
}
.top-danger {
    border-top: solid 3px rgb(220, 53, 69) !important;
}
.top-warning {
    border-top: solid 3px rgb(255, 193, 7) !important;
}
.top-info {
    border-top: solid 3px rgb(23, 162, 184) !important;
}
.top-dark {
    border-top: solid 3px rgb(52, 58, 64) !important;
}
.top-light {
    border-top: solid 3px rgb(248, 249, 250) !important;
}

.top-random {
    /* border-top: solid 3px rgb(0, 123, 255) !important; */
    /* border-top: solid 3px rgb(108, 117, 125) !important; */
    /* border-top: solid 3px rgb(25, 135, 84) !important; */
    /* border-top: solid 3px rgb(220, 53, 69) !important; */
    /* border-top: solid 3px rgb(255, 193, 7) !important; */
    /* border-top: solid 3px rgb(23, 162, 184) !important; */
    /* border-top: solid 3px rgb(52, 58, 64) !important; */
    /* border-top: solid 3px rgb(248, 249, 250) !ismportant; */
    border-top: solid 3px rgb(128, 36, 52) !important;
}

/* buttons */
.btn-random {
    color: #fff;
    /* color button */
    /* background-color: #0d6efd;
    border-color: #0d6efd; */
    /* background-color: #6c757d;
    border-color: #6c757d; */
    /* background-color: #198754;
    border-color: #198754; */
    /* background-color: #dc3545;
    border-color: #dc3545; */
    /* background-color: #ffc107;
    border-color: #ffc107; */
    /* background-color: #0dcaf0;
    border-color: #0dcaf0; */
    /* background-color: #f8f9fa;
    border-color: #f8f9fa; */
    /* background-color: #212529;
    border-color: #212529; */
    background-color: #802434 !important;
    border-color: #802434 !important;
    color: white !important;
}
.btn-random:hover {
    color: #fff;
    /* color buttom */
    /* background-color: #0b5ed7;
    border-color: #0a58ca; */
    /* background-color: #5c636a;
    border-color: #565e64; */
    /* background-color: #157347;
    border-color: #146c43; */
    /* background-color: #bb2d3b;
    border-color: #b02a37; */
    /* background-color: #ffca2c;
    border-color: #ffc720; */
    /* background-color: #31d2f2;
    border-color: #25cff2; */
    /* background-color: #31d2f2;
    border-color: #25cff2; */
    /* background-color: #1c1f23;
    border-color: #1a1e21; */
    background-color: #802434 !important;
    border-color: #802434 !important;
}
.btn-light {
    background-color: rgb(226, 230, 234) !important;
    border-color: rgb(218, 224, 229) !important;
    color: rgb(110, 110, 110) !important;
}
.btn-outline-light {
    color: rgb(110, 110, 110) !important;
}

/* table */
table {
    /* color: rgb(221, 35, 35) !important; */
    white-space: nowrap !important;
}

/* iconos */
.cursor-pt:hover {
    cursor: pointer;
}

/* ScrollBar */
/* width */
::-webkit-scrollbar {
    height: 7px;
    width: 7px;
}
/* Track */
::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}
/* Handle */
::-webkit-scrollbar-thumb {
    background-color: rgb(131, 131, 131);
}

/* RESPONSIVE STYLES */

@media only screen and (max-width: 768px) {
    .slide-fade-enter-active {
        transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
        transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateX(20px);
        opacity: 0;
    }
}

@media only screen and (min-width: 480px) {
    .menu-bg {
        width: 50%;
    }
}

@media only screen and (min-width: 768px) {
    .app-bar {
        margin-left: 260px;
        width: calc(100% - 260px);
    }
    .btn-menu {
        display: none !important;
    }
    .btn-menu-md {
        display: block !important;
    }

    .app-menu {
        display: block !important;
        width: 260px;
    }
    .menu-bg {
        width: 100%;
    }
    .opciones-cuenta {
        right: 12px;
    }

    .app-body {
        margin-left: 260px;
    }

    .app-bar-close,
    .app-body-close {
        width: 100% !important;
        margin-left: 0;
    }
    .app-menu-close {
        width: 0 !important;
    }
}
</style>
