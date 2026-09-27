<script setup>
import { onMounted, ref } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import rectorImage from '../assets/img/autoridades/rector.webp'
import decanaImage from '../assets/img/autoridades/decana.webp'
import coordinadorImage from '../assets/img/autoridades/coordinador.webp'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8899/api').replace(/\/$/, '')
const fallbackContent = {
  presentation: 'La Unidad de Segunda Especialidad de la Facultad de Ciencias de la Salud de la Universidad Nacional de San Martín - Tarapoto, prosiguiendo con su labor orientada a la formación de profesionales altamente especializados en su carrera así como en el campo de la investigación mediante el estudio multidisciplinario, busca incesantemente seguir contribuyendo en dar solución a múltiples problemas dentro del ámbito local, regional, nacional e internacional.',
  mission: 'Formar especialistas en Obstetricia con un enfoque integral, basados en la excelencia académica, la innovación y la ética profesional, contribuyendo al fortalecimiento de la salud sexual y reproductiva.',
  vision: 'Ser una unidad académica de excelencia, reconocida por su contribución al desarrollo de especialistas en obstetricia que impacten positivamente en la salud de la comunidad.'
}
const legacyImages = { rector: rectorImage, decana: decanaImage, coordinador: coordinadorImage }
const content = ref(fallbackContent)
const authorities = ref([])
const getAuthorityImage = authority => authority.image_url ? `${apiBaseUrl.replace(/\/api$/, '')}${authority.image_url}` : legacyImages[authority.legacy_image] || rectorImage

onMounted(async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/web/about`)
    if (!response.ok) throw new Error('No se pudo obtener el contenido')
    const data = await response.json()
    content.value = { ...fallbackContent, ...(data.content || {}) }
    authorities.value = data.authorities || []
  } catch (error) {
    console.warn('Se conserva el contenido local mientras la API no esté disponible.', error)
  }
})

useSeoMeta({
  title: 'Nosotros | Segunda Especialidad - FCS',
  description: 'Conoce la presentación, misión, visión y autoridades de Segunda Especialidad.',
  ogTitle: 'Nosotros | Segunda Especialidad - FCS',
  ogDescription: 'Conoce quiénes somos y nuestras autoridades.'
})
</script>

<template>
  <main class="about-page">
    <section class="about-hero">
      <div class="container position-relative">
        <div class="brand-row">
          <img src="../assets/img/unsm.webp" alt="Logo de la Universidad Nacional de San Martín" class="brand-logo" />
          <div>
            <p class="brand-university">UNIVERSIDAD NACIONAL DE SAN MARTÍN</p>
            <p class="brand-faculty">FACULTAD DE CIENCIAS DE LA SALUD</p>
          </div>
          <img src="../assets/img/fcs.webp" alt="Logo de la Facultad de Ciencias de la Salud" class="brand-logo" />
        </div>
        <div class="hero-copy">
          <span class="eyebrow">UNIDAD DE SEGUNDA ESPECIALIDAD</span>
          <h1>Nosotros</h1>
          <span class="gold-rule" aria-hidden="true"></span>
          <p>Excelencia académica y compromiso con la salud.</p>
        </div>
      </div>
    </section>

    <section class="content-section presentation-section">
      <div class="container narrow-container">
        <div class="section-heading"><span>PRESENTACIÓN</span><i></i></div>
        <article class="presentation-card"><p>{{ content.presentation }}</p></article>
      </div>
    </section>

    <section class="content-section values-section">
      <div class="container">
        <div class="row g-4 justify-content-center">
          <div class="col-lg-5">
            <article class="value-card h-100">
              <div class="value-icon">M</div>
              <div><h2>Misión</h2><span class="card-rule"></span><p>{{ content.mission }}</p></div>
            </article>
          </div>
          <div class="col-lg-5">
            <article class="value-card h-100">
              <div class="value-icon">V</div>
              <div><h2>Visión</h2><span class="card-rule"></span><p>{{ content.vision }}</p></div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section authorities-section">
      <div class="container">
        <div class="section-heading"><span>AUTORIDADES</span><i></i></div>
        <p class="section-intro">Conoce a quienes orientan el desarrollo de nuestra unidad académica.</p>
        <div class="row g-4 justify-content-center">
          <div v-for="authority in authorities" :key="authority.id" class="col-sm-6 col-lg-4">
            <article class="authority-card h-100">
              <div class="authority-photo-wrap"><img :src="getAuthorityImage(authority)" :alt="`Fotografía de ${authority.position}`" class="authority-photo" /></div>
              <div class="authority-copy"><h2>{{ authority.name }}</h2><p>{{ authority.position }}</p></div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-page { background: #fff; color: #3d3d3d; font-family: OpenSans, 'Open Sans', sans-serif; overflow: hidden; }
.about-hero { background: linear-gradient(135deg, #561022 0%, #811632 58%, #9a2847 100%); color: #fff; padding: 34px 0 74px; position: relative; }
.about-hero::after { border: 1px solid rgba(255,255,255,.13); border-radius: 50%; content: ''; height: 330px; position: absolute; right: -110px; top: -130px; width: 330px; }
.brand-row { align-items: center; display: flex; gap: 18px; justify-content: center; position: relative; text-align: center; z-index: 1; }
.brand-logo { height: 68px; object-fit: contain; width: 68px; }
.brand-university, .brand-faculty { letter-spacing: .08em; margin: 0; text-transform: uppercase; }
.brand-university { font-family: BarlowBold, Barlow, sans-serif; font-size: clamp(.75rem, 1.8vw, 1rem); }
.brand-faculty { font-size: clamp(.62rem, 1.5vw, .82rem); margin-top: 5px; opacity: .82; }
.hero-copy { margin: 62px auto 0; max-width: 720px; position: relative; text-align: center; z-index: 1; }
.eyebrow { color: #e5c681; font-size: .74rem; font-weight: 700; letter-spacing: .21em; }
.hero-copy h1 { font-family: BarlowBold, Barlow, sans-serif; font-size: clamp(2.7rem, 6vw, 4.5rem); letter-spacing: .03em; line-height: 1; margin: 12px 0; text-transform: uppercase; }
.gold-rule, .card-rule { background: #d9b766; display: block; height: 2px; margin: 15px auto 17px; width: 58px; }
.hero-copy p { font-size: clamp(1rem, 2vw, 1.2rem); font-style: italic; margin: 0; opacity: .9; }
.content-section { padding: 75px 0; }
.narrow-container { max-width: 1000px; }
.presentation-section { background: #fff; }
.values-section { background: #f8f6f3; }
.authorities-section { background: #fff; }
.section-heading { color: #811632; font-family: BarlowBold, Barlow, sans-serif; font-size: clamp(1.8rem, 4vw, 2.65rem); letter-spacing: .05em; text-align: center; text-transform: uppercase; }
.section-heading i { background: #d9b766; display: block; height: 3px; margin: 17px auto 0; width: 52px; }
.presentation-card { border-left: 3px solid #d9b766; border-radius: 9px; box-shadow: 0 10px 35px rgba(69, 21, 35, .08); font-size: 1.05rem; line-height: 1.95; margin-top: 40px; padding: 32px 38px; text-align: justify; }
.presentation-card p, .value-card p { margin: 0; }
.value-card { background: #fff; border-radius: 9px; box-shadow: 0 12px 32px rgba(54, 34, 27, .08); display: flex; gap: 22px; padding: 35px 30px; transition: transform .25s ease, box-shadow .25s ease; }
.value-card:hover, .authority-card:hover { box-shadow: 0 18px 38px rgba(67, 18, 34, .15); transform: translateY(-5px); }
.value-icon { align-items: center; background: #811632; border: 2px solid #d9b766; border-radius: 50%; color: #fff; display: flex; flex: 0 0 52px; font-family: BarlowBold, Barlow, sans-serif; font-size: 1.5rem; height: 52px; justify-content: center; }
.value-card h2, .authority-copy h2 { color: #811632; font-family: BarlowBold, Barlow, sans-serif; margin: 0; }
.value-card h2 { font-size: 1.7rem; text-transform: uppercase; }
.value-card .card-rule { margin: 12px 0 17px; width: 38px; }
.value-card p { line-height: 1.8; text-align: justify; }
.section-intro { color: #777; font-size: 1.05rem; margin: 21px auto 38px; max-width: 600px; text-align: center; }
.authority-card { background: #fff; border: 1px solid #eee8e5; border-radius: 9px; box-shadow: 0 8px 24px rgba(50, 26, 20, .07); overflow: hidden; transition: transform .25s ease, box-shadow .25s ease; }
.authority-photo-wrap { background: #eee; height: 300px; overflow: hidden; }
.authority-photo { height: 100%; object-fit: cover; object-position: center top; transition: transform .45s ease; width: 100%; }
.authority-card:hover .authority-photo { transform: scale(1.045); }
.authority-copy { border-top: 3px solid #d9b766; padding: 23px 18px 25px; text-align: center; }
.authority-copy h2 { font-size: 1.14rem; line-height: 1.35; }
.authority-copy p { color: #8b6b31; font-size: .76rem; font-weight: 700; letter-spacing: .12em; margin: 10px 0 0; text-transform: uppercase; }
@media (max-width: 575.98px) { .about-hero { padding-bottom: 55px; } .brand-row { gap: 10px; } .brand-logo { height: 48px; width: 48px; } .hero-copy { margin-top: 46px; } .content-section { padding: 55px 0; } .presentation-card { font-size: 1rem; line-height: 1.8; padding: 25px 22px; } .value-card { padding: 28px 22px; } .authority-photo-wrap { height: 330px; } }
</style>
