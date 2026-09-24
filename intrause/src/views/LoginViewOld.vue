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
        let response = await fetch(url + '/intranet/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: user.value,
                pass: pass.value
            })
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
    <div class="container-fluid back-login">
        <div class="row justify-content-center">
            <div class="col-md-2 col-lg-2 mt-3 d-flex justify-content-end show-images">
                <img src="../assets/logo-unsm.png" class="img-fluid logo-unsm" alt="" />
            </div>
            <div class="col-12 col-md-8 col-lg-7 col-xl-6 mt-3">
                <div class="mb-1 d-flex justify-content-center">
                    <span class="unsm-name text-center">UNIVERSIDAD NACIONAL DE SAN MARTÍN</span>
                </div>
                <div class="mb-1 d-flex justify-content-center">
                    <span class="fcs-name text-center">FACULTAD DE CIENCIAS DE LA SALUD</span>
                </div>
                <div class="mb-1 d-flex justify-content-center">
                    <span class="use-name text-center">UNIDAD DE SEGUNDA ESPECIALIDAD</span>
                </div>
            </div>
            <div class="col-md-2 col-lg-2 mt-3 d-flex justify-content-start show-images">
                <img src="../assets/logo-fcs.png" class="img-fluid logo-fcs" alt="" />
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-12 col-sm-8 col-md-5 col-lg-3 px-4 px-md-0 mt-5">
                <div class="card mb-3 bg-transparent">
                    <div class="card-body">
                        <div class="mb-3 d-flex justify-content-center">
                            <span style="font-size: 1.7em">INTRANET</span>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="label-user">Usuario</label>
                            <input
                                type="text"
                                id="label-user"
                                class="form-control"
                                v-model="user"
                            />
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="label-pass">Contraseña</label>
                            <input
                                type="password"
                                id="label-pass"
                                class="form-control"
                                v-model="pass"
                            />
                        </div>
                        <button type="button" class="btn btn-login w-100" @click="login">
                            INGRESAR
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row prompt-install" v-if="isInstallable">
            <div class="col p-2">
                <img src="/pwa-icons/android-chrome-192x192.png" alt="" width="48" height="48" />
                <span class="ms-3 py-2" @click="installApp">
                    <span style="user-select: none;">INSTALAR COMO APLICACIÓN</span>
                </span>
            </div>
            <div class="col-auto d-flex align-items-center px-3" @click="isInstallable = false">
                <span class="fa-solid fa-xmark"></span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.back-login {
    /* background-image: url('../assets/bg-login.png'); */

    background-color: #802434;
    color: white;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-weight: bold;
    width: 100%;
    min-height: 100%;
}
.bg-transparent {
    /* background-color: rgba(255, 255, 255, 0.2) !important; */
    border: none;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
    color: white;

    background-image: url('../assets/bg-login.png');
    background-repeat: no-repeat;
    background-size: cover;
}
input,
input:focus {
    background-color: rgba(128, 36, 51, 0.4) !important;
    color: white !important;
    box-shadow: none !important;
    border: 1px solid rgb(214, 213, 213) !important;
}
.btn-login {
    color: #fff;
    background-color: #802433ea !important;
    border-color: #802434 !important;
    color: white !important;
}
.reset-password:hover {
    cursor: pointer;
    text-decoration: underline;
}
/* .unsm-name {
    font-size: 1.5em;
}
.fcs-name {
    font-size: 1.2em;
}
.use-name {
    font-size: 1.35em;
} */
.unsm-name {
    font-size: 1em;
}
.fcs-name {
    font-size: 0.8em;
}
.use-name {
    font-size: 0.9em;
}
.show-images {
    display: none !important;
}

.prompt-install {
    color: #802434;
    background-color: white;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 0 -3px 3px rgba(15, 15, 15, 0.342);
}
@media only screen and (min-width: 576px) {
    .unsm-name {
        font-size: 1.7em;
    }
    .fcs-name {
        font-size: 1.3em;
    }
    .use-name {
        font-size: 1.5em;
    }
}
@media only screen and (min-width: 768px) {
    .show-images {
        display: flex !important;
    }
    .logo-unsm,
    .logo-fcs {
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.4));
    }
    .unsm-name {
        font-size: 1.6em;
    }
    .fcs-name {
        font-size: 1.3em;
    }
    .use-name {
        font-size: 1.45em;
    }
}
@media only screen and (min-width: 992px) {
    .logo-unsm,
    .logo-fcs {
        max-width: 128px !important;
        max-height: 128px !important;
    }
    .unsm-name {
        font-size: 1.8em;
    }
    .fcs-name {
        font-size: 1.5em;
    }
    .use-name {
        font-size: 1.7em;
    }
}
</style>
