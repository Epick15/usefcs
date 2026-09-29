<script setup>
import { useSeoMeta } from '@unhead/vue'
import { onMounted, ref } from 'vue'

useSeoMeta({
  title: 'Inicio | Segunda Especialidad - FCS',
  description:
    'Alcanza el título de Especialista en uno de los programas de Segunda Especialidad en Obstetricia de la Universidad Nacional de San Martín, Tarapoto.',
  ogTitle: 'Inicio | Segunda Especialidad - FCS',
  ogDescription:
    'Alcanza el título de Especialista en uno de los programas de Segunda Especialidad en Obstetricia - UNSM.'
})

let preventClick = (e) => {
  e.preventDefault()
}

const api = import.meta.env.VITE_API_URL || 'http://localhost:8899/api'
const admission = ref(null)
const process = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(`${api}/web/admission`)
    if (!response.ok) return
    const data = await response.json()
    admission.value = data.admission
    process.value = data.process
  } catch (_) {}
})
</script>

<template>
  <section class="parent-container header-section">
    <div class="container">
      <div class="row">
        <div class="col-auto ms-auto">
          <img
            src="../assets/img/unsm.webp"
            alt="Logo de la Universidad Nacional de San Martín"
            class="logo"
          />
        </div>
        <div class="col col-md">
          <div class="mb-3 unsm-name">UNIVERSIDAD NACIONAL DE SAN MARTÍN</div>
          <div class="mb-3 fcs-name">FACULTAD DE CIENCIAS DE LA SALUD</div>
        </div>
        <div class="col-auto me-auto">
          <img
            src="../assets/img/fcs.webp"
            alt="Logo de la Facultad de Ciencias de la Salud"
            class="logo"
          />
        </div>
      </div>
    </div>
  </section>

  <section class="img-fondo">
    <video autoplay loop muted playsinline width="100%" @contextmenu="preventClick">
      <source src="../assets/img/bg_animation_50.webm" type="video/webm" />
    </video>
    <div class="use-name"><h1>UNIDAD DE SEGUNDA ESPECIALIDAD</h1></div>
  </section>

  <section class="parent-container admision-section" v-if="admission || process">
    <div class="container">
      <div class="row">
        <div class="col d-flex align-items-center justify-content-center">
          <div class="text-center admission-panel">
            <div class="section-kicker">{{ process?.denomination || 'PROCESO DE ADMISIÓN' }}</div>
            <div class="dynamic-admission-title">{{ admission?.title || 'ADMISIÓN' }}</div>
            <div class="dynamic-admission-subtitle">{{ admission?.subtitle || admission?.audience }}</div>
            <div class="admision-title">ADMISIÓN 2026-II</div>
            <div class="admision-subtitle">Segunda Especialidad en Obstetricia</div>
            <div class="admision-registration">
              <RouterLink to="/admision">VER ADMISIÓN</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="parent-container programas-section">
    <div class="container">
      <div class="row">
        <div class="col section-title">
          <div class="section-kicker">FORMACIÓN ESPECIALIZADA</div>
          <span>PROGRAMAS DE ESTUDIO</span>
        </div>
      </div>
      <div class="row align-items-stretch section-body">
        <div class="col-md-4">
          <div class="card h-100 program-card aro-card">
            <img
              src="../assets/img/programas/aro.webp"
              class="card-img-top"
              alt="Imagen de presentación Obstetricia de Alto Riesgo"
            />
            <div class="card-body">
              <p class="card-text text-center">
                SEGUNDA ESPECIALIDAD EN OBSTETRICIA DE ALTO RIESGO CON MENCIÓN EN CUIDADOS
                INTENSIVOS MATERNOS
              </p>
              <div>
                <RouterLink to="/obstetricia-de-alto-riesgo" class="btn btn-aro"
                  >VER PROGRAMA</RouterLink
                >
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mt-3 mt-md-0">
          <div class="card h-100 program-card eco-card">
            <img
              src="../assets/img/programas/eco.webp"
              class="card-img-top"
              alt="Imagen de presentación de Ecografía Obstétrica"
            />
            <div class="card-body">
              <p class="card-text text-center">
                SEGUNDA ESPECIALIDAD EN ECOGRAFÍA OBSTÉTRICA CON MENCIÓN EN MONITOREO FETAL
                ELECTRÓNICO
              </p>
              <div>
                <RouterLink to="/ecografia-obstetrica" class="btn btn-eco">VER PROGRAMA</RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mt-3 mt-md-0">
          <div class="card h-100 program-card cacu-card">
            <img
              src="../assets/img/programas/cacu.webp"
              class="card-img-top"
              alt="Imagen de presentación de Salud Reproductiva"
            />
            <div class="card-body">
              <p class="card-text text-center">
                SEGUNDA ESPECIALIDAD EN SALUD REPRODUCTIVA CON MENCIÓN EN PREVENCIÓN DE CÁNCER DE
                CUELLO UTERINO Y MAMA
              </p>
              <div>
                <RouterLink to="/salud-reproductiva" class="btn btn-cacu">VER PROGRAMA</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admision-section {
  background: linear-gradient(135deg, #f8f6f3, #f1e7e9);
  padding: 48px 20px;
}

.admission-panel {
  color: #811632;
  max-width: 720px;
  padding: 26px 30px 30px;
  position: relative;
  text-align: center !important;
}

.admission-panel::before {
  background: #d9b766;
  content: '';
  height: 3px;
  left: 50%;
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  width: 66px;
}

.section-kicker {
  color: #8b6b31;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.17em;
  margin-bottom: 10px;
}

.admision-title, .admision-subtitle { display: none; }
.dynamic-admission-title { color: #4f0e30; font-family: BarlowCondensedBold, BarlowBold, sans-serif; font-size: clamp(2.4rem, 6vw, 4.7rem); line-height: 1; }
.dynamic-admission-subtitle { color: #811632; font-family: OpenSans, sans-serif; font-size: clamp(1.05rem, 2.5vw, 1.45rem); margin-top: 15px; }

.admision-registration {
  margin: 25px 0 0 !important;
}

.admision-registration a {
  background: linear-gradient(135deg, #811632, #5b1023);
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(129, 22, 50, 0.24);
  color: #fff;
  font-size: 0.9em;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 12px 23px;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.admision-registration a:hover {
  box-shadow: 0 12px 22px rgba(129, 22, 50, 0.34);
  color: #fff;
  transform: translateY(-2px);
}

/* SECTION STYLES - GENERAL*/
.section-title {
  padding-bottom: 30px;
  text-align: center;
}

.section-title span {
  color: #811632;
  display: block;
  font-family: BarlowBold, Barlow, sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.35rem);
  font-weight: bold;
  letter-spacing: 0.04em;
}

/* PROGRAMAS SECTION STYLES */
.programas-section {
  background: #fff;
  padding-bottom: 70px;
  padding-top: 65px;
}

.aro-card,
.eco-card,
.cacu-card {
  border: none !important;
  border-radius: 22px !important;
  box-shadow: 0 10px 28px rgba(39, 24, 33, 0.12);
  font-family: BarlowBold;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.program-card:hover {
  box-shadow: 0 18px 38px rgba(39, 24, 33, 0.2);
  transform: translateY(-7px);
}

.card-img-top {
  border-radius: 0 !important;
  height: 205px;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.program-card:hover .card-img-top {
  transform: scale(1.04);
}

.aro-card .card-body {
  background-color: #f4f8ff;
  padding: 24px 22px 26px;
}

.eco-card .card-body {
  background-color: #f4fde3;
  padding: 24px 22px 26px;
}

.cacu-card .card-body {
  background-color: #fae6e5;
  padding: 24px 22px 26px;
}

.program-card .card-text {
  font-size: 1.02rem;
  line-height: 1.3;
  min-height: 92px;
  text-shadow:
    -1px -1px 0 #fff,
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    1px 1px 0 #fff;
}

.aro-card .card-text {
  color: #03437d;
}

.eco-card .card-text {
  color: #8dd804;
}

.cacu-card .card-text {
  color: #fa549e;
}

.card .card-body div {
  display: flex;
  justify-content: center;
}

.btn-aro,
.btn-eco,
.btn-cacu {
  color: white !important;
  font-family: BarlowBold !important;
  font-size: 0.7em !important;
  border-radius: 999px !important;
  letter-spacing: 0.08em;
  padding: 10px 20px !important;
  transition:
    filter 0.2s ease,
    transform 0.2s ease;
}

.btn-aro:hover,
.btn-eco:hover,
.btn-cacu:hover {
  filter: brightness(0.9);
  transform: translateY(-2px);
}

.btn-aro {
  background-color: #03437d !important;
}

@media only screen and (max-width: 575px) {
  .admission-section {
    padding: 36px 15px;
  }
  .admission-panel {
    padding: 30px 20px 32px;
  }
  .programas-section {
    padding: 48px 0 55px;
  }
}

.btn-eco {
  background-color: #8dd804 !important;
}

.btn-cacu {
  background-color: #fa549e !important;
}

@media only screen and (min-width: 492px) {
  .admision-section {
    padding-bottom: 30px;
    padding-top: 30px;
  }

  .admision-title {
    font-size: 3.5em;
  }

  .admision-subtitle {
    font-size: 1.8em;
  }

  .admision-registration {
    margin-bottom: 30px !important;
    margin-top: 35px !important;
  }

  .admision-registration a {
    font-size: 1.2em;
  }

  .admision-title {
    color: #4f0e30;
    font-family: BarlowCondensedBold;
    font-size: 3em;
    line-height: 1;
  }

  /* SECTION STYLES - GENERAL*/
  .section-title {
    padding-bottom: 30px;
  }

  .section-title span {
    font-size: 1.5em;
  }
}

/* @media only screen and (min-width: 992px) {
    .card {
        font-size: 1.3em;
    }
} */

@media only screen and (min-width: 1200px) {
  .header-section {
    background-image: linear-gradient(to bottom, #81163390, #81163389) !important;
    position: absolute !important;
    width: 100% !important;
    z-index: 2 !important;
  }

  /* ADMISION SECTION STYLES */
  .admision-section {
    padding-bottom: 30px;
    padding-top: 30px;
  }

  .admision-title {
    font-size: 5em;
  }

  .admision-subtitle {
    font-size: 1.8em;
  }

  /* SECTION STYLES - GENERAL*/
  .section-title {
    padding-bottom: 30px;
  }

  .section-title span {
    font-size: 2.4em;
  }
}
</style>
