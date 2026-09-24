<script setup>
import { ref } from 'vue'
import { useSeoMeta } from '@unhead/vue'

import ModalInscription from '@/components/ModalInscription.vue'

const showModal = ref(false)
const counter = ref(0)

useSeoMeta({
  title: 'Admisión | Segunda Especialidad - FCS',
  description:
    '¿Quieres empezar tus estudios de Segunda Especialidad en Obstetricia?, conoce los costos, requisitos y horario de estudios.',
  ogTitle: 'Admisión | Segunda Especialidad - FCS',
  ogDescription:
    '¿Quieres empezar tus estudios de Segunda Especialidad en Obstetricia?, aquí te mostramos los requisitos.'
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

  <section class="parent-container bg-white admision-section">
    <div class="container">
      <div class="row">
        <div class="col mt-4 d-flex align-items-center justify-content-center">
          <div class="text-center">
            <div class="admision-title">ADMISIÓN 2026-II</div>
            <div class="admision-subtitle">Segunda Especialidad en Obstetricia</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col mt-5">
          <div class="article-title">DIRIGIDO A PROFESIONALES TITULADOS EN OBSTETRICIA</div>
        </div>
      </div>
      <!-- <div class="row">
                <div class="col mt-3">
                    <div class="link-inscription">
                        <i class="fa-solid fa-angle-right"></i>
                        <i class="fa-solid fa-angle-right"></i>
                        <i class="fa-solid fa-angle-right"></i>
                        <i><a href="https://drive.google.com/file/d/1-M23puW3Xii_JicgbGgrDX_1A8KF5TuG/view?usp=sharing" target="_blank" class="mx-2">RESULTADOS 2024-I</a></i>
                        <i class="fa-solid fa-angle-left"></i>
                        <i class="fa-solid fa-angle-left"></i>
                        <i class="fa-solid fa-angle-left"></i>
                    </div>
                </div>
            </div> -->
      <div class="row">
        <div class="col">
          <div class="list-group list-programs">
            <RouterLink
              to="/obstetricia-de-alto-riesgo"
              class="list-group-item list-group-item-action"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">
                  Segunda Especialidad en Obstetricia de Alto Riesgo con mención en Cuidados
                  Intensivos Maternos
                </h5>
              </div>
            </RouterLink>
            <RouterLink to="/ecografia-obstetrica" class="list-group-item list-group-item-action">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">
                  Segunda Especialidad en Ecografía Obstétrica con mención en Monitoreo Fetal
                  Electrónico
                </h5>
              </div>
            </RouterLink>
            <RouterLink to="/salud-reproductiva" class="list-group-item list-group-item-action">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">
                  Segunda Especialidad en Salud Reproductiva con mención en Prevención de Cáncer de
                  Cuello Uterino y Mama
                </h5>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col mt-5 requirements">
          <!-- <div class="mb-3">DIRIGIDO A PROFESIONALES TITULADOS EN OBSTETRICIA</div> -->
          <div class="article-title">REQUISITOS DE INSCRIPCIÓN</div>
          <div class="">
            <ul class="requirements-list">
              <li>Copia simple del Título Profesional de Obstetra registrado en SUNEDU.</li>
              <li>Copia simple del DNI.</li>
              <li>
                Solicitud de inscripción, compromiso de pago de estudios, compromiso de entrega de
                documentos (en caso de faltar uno o más requisitos), Declaración jurada.
              </li>
              <li>Recibo de pago por derecho de inscripción y/o admisión.</li>
              <li>Ficha de datos.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row gx-2">
        <div class="article-title mt-5">HORARIO DE CLASES</div>
        <div class="col-md-6">
          <div class="card text-center">
            <div class="card-header">SÁBADOS</div>
            <div class="card-body">
              <h5 class="card-title">3:00 pm - 8:00 pm</h5>
              <p class="card-text">5 horas</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 mt-3 mt-md-0">
          <div class="card text-center">
            <div class="card-header">DOMINGOS</div>
            <div class="card-body">
              <h5 class="card-title">8:00 am - 1:00 pm</h5>
              <p class="card-text">5 horas</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col mt-5 admision-horario">
          <div class="article-title">CRONOGRAMA DE ADMISIÓN</div>
          <table class="table table-sm table-bordered table-cronograma">
            <tbody>
              <tr>
                <td>Inscripción y presentación de documentos</td>
                <td>Hasta el 04 de marzo 2026 (Hora límite 2:45 pm)</td>
              </tr>
              <tr>
                <td>Evaluación de expedientes</td>
                <td>05 y 06 de marzo 2026</td>
              </tr>
              <tr>
                <td>Examen de admisión</td>
                <td>07 de marzo 2026 (9 a 12 am)</td>
              </tr>
              <tr>
                <td>Entrevista personal</td>
                <td>07 de marzo 2026 (2 a 5 pm)</td>
              </tr>
              <tr>
                <td>Publicación de resultados</td>
                <td>08 de marzo 2026 (4 pm)</td>
              </tr>
              <tr>
                <td>Acreditación de ingresantes (virtual)</td>
                <td>Hasta el 20 de marzo 2026</td>
              </tr>
              <tr>
                <td>Inicio de clases, ciclo I</td>
                <td>21 de marzo 2026</td>
              </tr>
              <tr>
                <td>Fin de clases</td>
                <td>30 de agosto 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row">
        <div class="col mt-5">
          <div class="col-12 admision-horario">
            <div class="article-title">COSTOS DE ENSEÑANZA</div>
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>CONCEPTO</th>
                  <th>CANT</th>
                  <th>COSTO</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Inscripción y/o admisión</td>
                  <td>1</td>
                  <td>S/ 350.00<span style="font-weight: 600"> (Promoción: S/ 200.00)</span></td>
                  <td>S/ 350.00</td>
                </tr>
                <tr>
                  <td>Matrícula por ciclo</td>
                  <td>3</td>
                  <td>S/ 300.00</td>
                  <td>S/ 900.00</td>
                </tr>
                <tr>
                  <td>Pensión de enseñanza (cuota)</td>
                  <td>18</td>
                  <td>S/ 350.00</td>
                  <td>S/ 6300.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 mt-5 more-info">¿Más información?</div>
        <div class="col-12">
          <a
            href="https://api.whatsapp.com/send?phone=51989032962&text=Hola%2C%20Unidad%20de%20Segunda%20Especialidad%20-%20FCS%2C%20deseo%20informaci%C3%B3n%20acad%C3%A9mica%20y%20administrativa%20sobre%20el%20proceso%20de%20admisión%202026-II%20para%20las%20Segundas%20Especialidades%20de%20Obstetricia"
            class="btn-inscription-page"
            target="_blank"
          >
            <i class="fa-solid fa-angle-right"></i>
            <i class="fa-solid fa-angle-right"></i>
            <i class="fa-solid fa-angle-right"></i>
            <i><span class="mx-2">CONSULTA</span></i>
            <i class="fa-solid fa-angle-left"></i>
            <i class="fa-solid fa-angle-left"></i>
            <i class="fa-solid fa-angle-left"></i>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- <ModalInscription :show-modal="showModal" :key="counter" /> -->
</template>

<style scoped>
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

.list-programs h5 {
  text-align: justify;
  font-weight: normal;
}

.requirements-list {
  text-align: justify;
  list-style-type: circle;
}

.requirements-list li {
  margin-bottom: 10px;
}

.article-title {
  color: #811632;
  font-size: 1.3em;
  font-weight: bold;
  padding-bottom: 10px;
}

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
  background-color: #811632;
  border: 1px solid #811632;
  color: white;
}

label {
  margin-bottom: 5px;
}

.admision-section {
  background-color: #eef6f5;
  padding-bottom: 20px;
  padding-top: 20px;
}

.btn-inscription-page {
  background-color: #fff01e;
  border: none;
  cursor: pointer;
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
  display: block;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.btn-inscription-page i {
  color: black;
  font-size: 1.4em;
  font-weight: bold;
}

.btn-inscription-page i:nth-child(1),
.btn-inscription-page i:nth-child(7) {
  animation: encender 1s ease-in-out 0s infinite, apagar 1s ease-in-out 1s infinite;
}

.btn-inscription-page i:nth-child(2),
.btn-inscription-page i:nth-child(6) {
  animation: apagar 1s ease-in-out 0s infinite, encender 1s ease-in-out 1s infinite;
  animation-delay: 1s;
}

@keyframes encender {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes apagar {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.admision-horario table {
  border: 2px solid black;
  border-collapse: collapse;
  margin-bottom: 0;
}

.admision-horario thead,
th {
  background-color: #811632 !important;
}

.admision-horario th {
  border: 2px solid black !important;
  color: white;
  font-family: BarlowBold;
  font-size: 0.8em;
  text-align: center;
}

.admision-horario td {
  border: 2px solid black !important;
  font-family: BarlowRegular;
  font-size: 0.8em;
  text-align: center;
  text-wrap: balance;
  vertical-align: middle;
}

.table-cronograma tr td:nth-child(1) {
  font-weight: bold;
}

.downloads-list {
  padding-bottom: 10px;
}

.numbers {
  font-size: 1.2em;
  font-weight: bold;
}

.more-info {
  font-size: 1.4em;
  font-weight: bold;
  display: flex;
  justify-content: center;
  color: #4f0e30;
}

@media only screen and (min-width: 492px) {
  .requirements-list {
    font-size: 1.2em;
    list-style-type: circle;
  }

  .requirements-list li {
    margin-bottom: 10px;
  }

  .more-info {
    font-size: 1.7em;
    font-weight: bold;
    display: flex;
    justify-content: center;
    color: #4f0e30;
  }
}

@media only screen and (min-width: 992px) {
  .admision-horario th {
    border: 2px solid black !important;
    color: white;
    font-family: BarlowBold;
    font-size: 1.1em;
    text-align: center;
  }

  .admision-horario td {
    border: 2px solid black !important;
    font-family: BarlowRegular;
    font-size: 1.1em;
    text-align: center;
    text-wrap: balance;
    vertical-align: middle;
  }

  .card {
    font-size: 1.5em;
  }

  .btn-inscription-page {
    font-size: 1.6em;
  }
}

@media only screen and (min-width: 1200px) {
  .header-section {
    background-image: linear-gradient(to bottom, #811633e9, #811632) !important;
    position: initial !important;
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
}
</style>
