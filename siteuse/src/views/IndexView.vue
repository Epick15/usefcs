<script setup>
import { useSeoMeta } from '@unhead/vue'

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

  <section class="parent-container admision-section">
    <div class="container">
      <div class="row">
        <div class="col d-flex align-items-center justify-content-center">
          <div class="text-center">
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
  background-color: #eef6f5;
  padding-bottom: 20px;
  padding-top: 20px;
}

.admision-title {
  color: #4f0e30;
  font-family: BarlowCondensedBold;
  font-size: 3em;
  line-height: 1;
}

.admision-subtitle {
  color: #811632;
  font-family: OpenSans;
  font-size: 1.5em;
  line-height: 1;
  margin-top: 15px;
}

.admision-registration {
  margin-bottom: 20px !important;
  margin-top: 25px !important;
}

.admision-registration a {
  background-color: #811632;
  color: #fff;
  font-size: 0.9em;
  font-weight: 700;
  padding: 10px 15px;
  text-decoration: none;
}

/* SECTION STYLES - GENERAL*/
.section-title {
  padding-bottom: 20px;
}

.section-title span {
  color: #811632;
  font-size: 1.2em;
  font-weight: bold;
}

/* PROGRAMAS SECTION STYLES */
.programas-section {
  padding-bottom: 20px;
  padding-top: 20px;
}

.aro-card,
.eco-card,
.cacu-card {
  border: none !important;
  font-family: BarlowBold;
}

.card-img-top {
  border-radius: 0 !important;
}

.aro-card .card-body {
  background-color: #f4f8ff;
  padding-top: 20px;
}

.eco-card .card-body {
  background-color: #f4fde3;
  padding-top: 20px;
}

.cacu-card .card-body {
  background-color: #fae6e5;
  padding-top: 20px;
}

.program-card .card-text {
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
}

.btn-aro {
  background-color: #03437d !important;
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
