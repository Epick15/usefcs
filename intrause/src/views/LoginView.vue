<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const url = import.meta.env.VITE_API_URL

let user = ref('')
let pass = ref('')
let login = async () => {
    try {
        const formData = new FormData()
        formData.set('user', user.value)
        formData.set('pass', pass.value)

        let response = await fetch(`${url}/intranet/login`, {
            method: 'POST',
            body: formData
        })
        let data = await response.json()
        if (data.message === 'Access') {
            localStorage.setItem('use', JSON.stringify(data.token))
            router.push({ name: 'welcome' })
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Datos incorrectos',
                showConfirmButton: false,
                timer: 1000
            })
        }
    } catch (error) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Datos incorrectos',
            showConfirmButton: false,
            timer: 1000
        })
    }

    user.value = ''
    pass.value = ''
}

let isInstallable = ref(false)
const deferredPrompt = ref(null)
const handleBeforeInstallPrompt = (event) => {
    event.preventDefault()
    deferredPrompt.value = event
    isInstallable.value = true
}

onMounted(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

const installApp = () => {
    if (deferredPrompt.value) {
        deferredPrompt.value.prompt()
        deferredPrompt.value.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt')
            } else {
                console.log('User dismissed the A2HS prompt')
            }
            deferredPrompt.value = null
        })
    }
}
</script>

<template>
    <div class="bg-login">
        <div class="bg-img">
            <div class="bg-name">
                <div>
                    <span>UNIDAD DE</span><br />
                    <span>SEGUNDA</span><br />
                    <span>ESPECIALIDAD</span><br />
                    <span>FCS</span>
                </div>
            </div>
            <img src="../assets/mujer-emb.webp" alt="" />
        </div>
        <div class="bg-form">
            <div class="form-container">
                <div class="mb-3 logo-container">
                    <img src="../assets/logo-fcs.webp" alt="logo-fcs" width="140" />
                </div>
                <div class="mb-4 iniciar-container">
                    <span class="me-2">Iniciar</span>
                    <span>Sesión</span>
                </div>
                <div class="mb-4 field-container">
                    <span>Usuario</span>
                    <input
                        type="text"
                        id="label-user"
                        class="form-control"
                        v-model="user"
                    />
                </div>
                <div class="mb-4 field-container">
                    <span>Contraseña</span>
                    <input
                        type="password"
                        id="label-pass"
                        class="form-control"
                        v-model="pass"
                    />
                </div>
                <button type="button" class="btn btn-login w-100" @click="login">INGRESAR</button>
            </div>
            <div class="prompt-install" v-if="isInstallable">
                <div class="col p-2">
                    <img
                        src="/pwa-icons/android-chrome-192x192.png"
                        alt=""
                        width="48"
                        height="48"
                    />
                    <span class="ms-3 py-2" @click="installApp">
                        <span style="user-select: none">INSTALAR COMO APP</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg-login {
    background-color: #802434;
    display: flex;
    height: 100%;
    min-height: 100%;
    width: 100%;
}

.bg-img {
    display: none;
}

.bg-form {
    align-items: center;
    background-color: white;
    display: flex;
    justify-content: center;
    min-height: 100%;
    width: 100%;
}

.form-container {
    padding: 40px;
    width: 100%;
}

.logo-container {
    display: flex;
    justify-content: center;
}

.iniciar-container {
    display: flex;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
        sans-serif;
    font-size: 1.7em;
    font-weight: bold;
    justify-content: center;
}

.iniciar-container span:nth-child(2) {
    color: #802434;
}

.field-container {
    border: 1px solid rgb(133, 133, 133);
    padding-top: 12px;
    padding-bottom: 5px;
    position: relative;
}

.field-container > span {
    background-color: white;
    color: rgb(133, 133, 133);
    font-size: 0.9em;
    left: 12px;
    padding: 0 9px 0 9px;
    position: absolute;
    top: -12px;
}

input,
input:focus {
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
}


.btn-login {
    background-color: #802433 !important;
    border-color: #802434 !important;
    border-radius: 0 !important;
    color: #fff;
}

.prompt-install {
    background-color: white;
    bottom: 0;
    box-shadow: 0 -2px 3px rgba(15, 15, 15, 0.342);
    color: #802434;
    font-weight: bold;
    position: fixed;
    width: 100%;
}

@media only screen and (min-width: 512px) {
    .form-container {
        width: 400px;
    }

    .prompt-install {
        border-radius: 15px 15px 0 0;
        width: 320px;
    }
}

@media only screen and (min-width: 992px) {
    .bg-img {
        align-items: center;
        display: flex;
        justify-content: space-between;
        width: calc(100% - 400px);
    }

    .bg-name {
        display: flex;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
            sans-serif;
        justify-content: center;
        width: 100%;
    }

    .bg-name div {
        color: white;
        display: block;
        font-size: 4em;
    }

    .bg-img img {
        height: 95%;
    }

    .bg-form {
        width: 400px;
    }

    .prompt-install {
        border-radius: 0;
        width: 400px;
    }
}
</style>
