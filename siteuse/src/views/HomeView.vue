<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import ModalInscription from '@/components/ModalInscription.vue'

const showModal = ref(false)
const counter = ref(0)
const today = new Date()

const year = computed(() => today.getFullYear())

onMounted(() => {
  window.addEventListener('resize', onResize)

  return () => {
    window.removeEventListener('resize', onResize)
  }
})

let showMenu = ref(false)
const onResize = () => {
  let windowWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth

  if (windowWidth >= 992) {
    showMenu.value = true
  } else {
    showMenu.value = false
  }
}
onResize()
</script>

<template>
  <nav>
    <div class="container">
      <div class="row align-items-stretch">
        <div class="col-auto social-article">
          <a
            href="https://www.facebook.com/UnidaddeSegundaEspecialidad?locale=es_LA"
            target="_blank"
            title="social-facebook"
          >
            <img
              src="../assets/img/facebook.svg"
              alt="Icono de acceso a la páginda de Facebook"
              width="28"
              height="28"
          /></a>
        </div>
        <div class="col p-0">
          <div id="menu" v-show="showMenu">
            <ul class="menu-lista" @click="onResize">
              <li>
                <RouterLink to="/" class="exact-active">INICIO</RouterLink>
              </li>
              <li><RouterLink to="/nosotros">NOSOTROS</RouterLink></li>
              <li><RouterLink to="/admision">ADMISIÓN</RouterLink></li>
              <li>
                <RouterLink to="/obstetricia-de-alto-riesgo">ALTO RIESGO</RouterLink>
              </li>
              <li>
                <RouterLink to="/ecografia-obstetrica">ECOGRAFÍA OBSTÉTRICA</RouterLink>
              </li>
              <li>
                <RouterLink to="/salud-reproductiva">SALUD REPRODUCTIVA</RouterLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-auto d-flex justify-content-end align-items-center">
          <a href="https://usefcs.unsm.edu.pe/aulavirtual/" target="_blank" class="me-2 btn-admin"
            >AULA VIRTUAL</a
          >
          <a href="https://usefcs.unsm.edu.pe/intranet/" target="_blank" class="btn-intranet"
            >INTRANET</a
          >
        </div>
      </div>
    </div>
  </nav>

  <main>
    <RouterView />
  </main>

  <footer>
    <section class="parent-container">
      <div class="container">
        <div class="row">
          <div class="col footer-title"><span>Contacto</span></div>
        </div>
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col contacto">
                <span>Contactos:</span><br />
                <span class="d-block">Administrativo: +51 989 032 962</span>
                <span class="d-block">Administrativo: +51 942 495 332</span>
                <span>Contabilidad: +51 921 677 431</span>
              </div>
              <div class="col contacto">
                <span>Ubicación</span><br />
                <span>Jr. Maynas N° 177 Tarapoto - Ciudad Universitaria: Bloque C Facultad de Ciencias de la Salud</span>
              </div>
            </div>
            <div class="row align-items-stretch">
              <div class="col contacto">
                <span>Correo</span><br />
                <span>usefcs@unsm.edu.pe</span>
              </div>
              <div class="col d-flex align-items-end">
                <a
                  href="https://www.facebook.com/UnidaddeSegundaEspecialidad?locale=es_LA"
                  target="_blank"
                  title="Acceso a la página de Facebook"
                >
                  <img
                    src="../assets/img/facebook.svg"
                    alt="Icóno de facebook"
                    width="32"
                    height="32"
                /></a>
                <a href="https://unsm.edu.pe/" target="_blank" title="social-unsm">
                  <img
                    src="../assets/img/unsm.webp"
                    alt="Icono de acceso a la página de la universidad"
                    width="32"
                    height="32"
                /></a>
              </div>
            </div>
          </div>
          <div
            class="col-sm-12 col-md d-flex justify-content-center justify-content-md-end align-items-end mt-5 mt-md-0"
          >
            <img src="../assets/img/sunedu.webp" alt="Logo de la SUNEDU" height="64" />
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="row">
          <div class="col d-flex justify-content-center">
            UNIDAD DE SEGUNDA ESPECIALIDAD - FCS/UNSM {{ year }}
          </div>
        </div>
      </div>
    </section>
  </footer>

  <a
    href="https://forms.gle/nmCRL66m2EfQrPY8A"
    class="btn-inscription"
    target="_blank"
  >
    <i class="fa-solid fa-angle-right"></i>
    <i class="fa-solid fa-angle-right"></i>
    <i class="fa-solid fa-angle-right"></i>
    <i><span class="mx-2">REGÍSTRATE</span></i>
    <i class="fa-solid fa-angle-left"></i>
    <i class="fa-solid fa-angle-left"></i>
    <i class="fa-solid fa-angle-left"></i>
  </a>

  <button class="btn-menu" type="button" title="show-menu" @click="showMenu = !showMenu">
    <span class="fa-solid fa-bars fa-fw" v-if="!showMenu"></span>
    <span class="fa-solid fa-xmark fa-fw" v-else></span>
  </button>

  <!-- <ModalInscription :show-modal="showModal" :key="counter" /> -->
</template>

<style lang="css">
@import url('../assets/movil.css');
@import url('../assets/screens.css');
</style>
