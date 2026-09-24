<script setup>
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'Nosotros | Segunda Especialidad - FCS',
  description:
    '¿Quieres conocer los Programas de Segunda Especialidad?, conocer nuestra presentación, nuestra misión y visión, así como nuestras autoridades y demás.',
  ogTitle: 'Nosotros | Segunda Especialidad - FCS',
  ogDescription:
    '¿Quieres conocer los Programas de Segunda Especialidad?, conoce quienes somos y danos tu confianza.'
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

  <section class="parent-container presentacion-section">
    <div class="container">
      <div class="row">
        <div class="col section-title">
          <span>PRESENTACIÓN</span>
        </div>
      </div>
      <div class="row">
        <div class="col" style="text-align: justify">
          La Unidad de Segunda Especialidad de la Facultad de Ciencias de la Salud de la Universidad
          Nacional de San Martín - Tarapoto, prosiguiendo con su labor orientada a la formación de
          profesionales altamente especializados en su carrera asi como en el campo de la
          investigación mediante el estudio multidisciplinario, busca incesantemente seguir
          contribuyendo en dar solución a múltiples problemas dentro del ámbito local, regional,
          nacional e internacional.
        </div>
      </div>
    </div>
  </section>

  <section class="parent-container mision-vision-section">
    <div class="container">
      <div class="row gx-md-5">
        <div class="col-md-6">
          <div class="row">
            <div class="col section-title"><span>MISIÓN</span></div>
          </div>
          <div class="row">
            <div class="col" style="text-align: justify">
              Formar especialistas en Obstetricia con un enfoque integral, basados en la excelencia
              académica, la innovación y la ética profesional, contribuyendo al fortalecimiento de
              la salud sexual y reproductiva.
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col section-title"><span>VISIÓN</span></div>
          </div>
          <div class="row">
            <div class="col" style="text-align: justify">
              Ser una unidad académica de excelencia, reconocida por su contribución al desarrollo de
              especialistas en obstetricia que impacten positivamente en la salud de la comunidad.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="parent-container autoridades-section">
    <div class="container">
      <div class="row">
        <div class="col section-title">
          <span>AUTORIDADES</span>
        </div>
      </div>
      <div class="row align-items-stretch section-body">
        <div class="col-md-4">
          <div class="card h-100 border-0">
            <img
              src="../assets/img/autoridades/rector.webp"
              class="card-img-top autoridad-img"
              alt="Fotografía del Rector"
            />
            <div class="card-body autoridad">
              <div>Dr. Ricardo Raul Layza Castañeda</div>
              <div>RECTOR</div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mt-3 mt-md-0">
          <div class="card h-100 border-0">
            <img
              src="../assets/img/autoridades/decana.webp"
              class="card-img-top autoridad-img"
              alt="Fotografía del Decano"
            />
            <div class="card-body autoridad">
              <div>Obsta. PhD. Gabriela del Pilar Palomino Alvarado</div>
              <div>DECANA</div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mt-3 mt-md-0">
          <div class="card h-100 border-0">
            <img
              src="../assets/img/autoridades/coordinador.webp"
              class="card-img-top autoridad-img"
              alt="Fotografía del Coordinador"
            />
            <div class="card-body autoridad">
              <div>Obsta. Mg. Ynes Torres Flores</div>
              <div>COORDINADORA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-title {
  color: #811632;
  font-size: 1.2em;
  font-weight: 700;
  padding-bottom: 25px;
  padding-top: 25px;
}

.autoridades-section {
  padding-bottom: 25px;
}

.autoridad-img {
  aspect-ratio: 1 / 1;
  object-fit: cover;
  object-position: center top;
  width: 100%;
}

.autoridad {
  background-color: rgb(247, 247, 247);
}

.autoridad div:nth-child(1) {
  color: #434343;
  font-family: BarlowBold;
  text-align: center;
}

.autoridad div:nth-child(2) {
  color: rgb(135, 135, 135);
  display: flex;
  font-weight: bold;
  justify-content: center;
}

@media only screen and (min-width: 492px) {
  .section-title {
    font-size: 1.5em;
  }
}

@media only screen and (min-width: 1200px) {
  .header-section {
    background-image: linear-gradient(to bottom, #811633e9, #811632) !important;
    position: initial !important;
  }

  .section-title {
    font-size: 2.4em;
  }
}
</style>
