<script setup>
import { onMounted, ref } from 'vue'
import { useSeoMeta } from '@unhead/vue'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8899/api').replace(/\/$/, '')
const admission = ref({ title: 'ADMISIÓN', subtitle: 'Segunda Especialidad en Obstetricia', audience: '', requirements: [], schedule: [], calendar: [], whatsapp_url: '' })
const plans = ref([])
const currency = value => `S/ ${Number(value || 0).toFixed(2)}`
const total = item => Number(item.amount || 0) * Number(item.cant || 1)

onMounted(async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/web/admission`)
    if (!response.ok) throw new Error('No se pudo obtener la admisión')
    const data = await response.json()
    admission.value = { ...admission.value, ...(data.admission || {}) }
    plans.value = data.plans || []
  } catch (error) { console.warn('No se pudo cargar la configuración de admisión.', error) }
})

useSeoMeta({ title: 'Admisión | Segunda Especialidad - FCS', description: 'Información, requisitos, cronograma y costos de admisión.' })
</script>

<template>
  <main class="admission-page">
    <section class="admission-hero"><div class="container text-center"><p>UNIDAD DE SEGUNDA ESPECIALIDAD · FCS · UNSM</p><h1>{{ admission.title }}</h1><span></span><h2>{{ admission.subtitle }}</h2></div></section>
    <section class="container admission-content">
      <h3>{{ admission.audience }}</h3>
      <div class="row g-4">
        <div class="col-lg-6"><article class="info-card"><h4>REQUISITOS DE INSCRIPCIÓN</h4><ul><li v-for="item in admission.requirements" :key="item">{{ item }}</li></ul></article></div>
        <div class="col-lg-6"><article class="info-card"><h4>HORARIO DE CLASES</h4><div v-for="item in admission.schedule" :key="item.day" class="schedule-row"><strong>{{ item.day }}</strong><span>{{ item.time }}</span><small>{{ item.detail }}</small></div></article></div>
      </div>
      <article v-if="admission.calendar && admission.calendar.length" class="info-card mt-4"><h4>CRONOGRAMA DE ADMISIÓN</h4><div v-for="item in admission.calendar" :key="item.activity" class="calendar-row"><strong>{{ item.activity }}</strong><span>{{ item.date }}</span></div></article>
      <section class="mt-4"><h3 class="costs-title">COSTOS VIGENTES POR PROGRAMA</h3><div class="row g-4 mt-1"><div v-for="plan in plans" :key="plan.id" class="col-lg-6"><article class="info-card h-100"><h4>{{ plan.Program?.denomination || plan.description }}</h4><div class="table-responsive"><table class="table"><thead><tr><th>Concepto</th><th>Cant.</th><th>Costo</th><th>Total</th></tr></thead><tbody><tr v-for="item in plan.Cost_admission_plans" :key="item.id"><td>{{ item.Concept?.denomination }}</td><td>{{ item.cant }}</td><td>{{ currency(item.amount) }}</td><td>{{ currency(total(item)) }}</td></tr><tr v-if="!plan.Cost_admission_plans?.length"><td colspan="4" class="text-center">No hay costos configurados.</td></tr></tbody></table></div></article></div><div v-if="!plans.length" class="col-12"><article class="info-card text-center">Próximamente se publicarán los costos vigentes.</article></div></div></section>
      <a v-if="admission.whatsapp_url" :href="admission.whatsapp_url" target="_blank" rel="noopener" class="consult-button"><i class="fa-brands fa-whatsapp"></i><span><small>¿TIENES CONSULTAS?</small>CONSULTAR INFORMACIÓN</span><i class="fa-solid fa-arrow-right"></i></a>
    </section>
  </main>
</template>

<style scoped>
.admission-page { background: #f8f6f3; min-height: 100vh; }
.admission-hero { background: linear-gradient(135deg,#561022,#811632); color:#fff; padding:80px 0 70px; text-align:center; }
.admission-hero p { color:#e5c681; font-size:.78rem; font-weight:700; letter-spacing:.16em; margin-bottom:14px; }
.admission-hero h1 { font-family:BarlowBold, sans-serif; font-size:clamp(2.4rem,6vw,4.5rem); margin:0; }
.admission-hero span { background:#d9b766; display:block; height:3px; margin:18px auto; width:58px; }
.admission-hero h2 { font-size:clamp(1.05rem,2.5vw,1.45rem); font-weight:400; margin:0; }
.admission-content { padding:65px 12px 80px; }
.admission-content > h3 { color:#811632; font-family:BarlowBold,sans-serif; font-size:1.4rem; margin:0 auto 32px; max-width:800px; text-align:center; }
.costs-title { color:#811632; font-family:BarlowBold,sans-serif; font-size:1.55rem; margin:0; text-align:center; }
.info-card { background:#fff; border-radius:9px; border-top:3px solid #d9b766; box-shadow:0 8px 24px rgba(65,20,32,.08); overflow:hidden; padding:28px; }
.info-card h4 { color:#811632; font-family:BarlowBold,sans-serif; font-size:1.35rem; margin-bottom:20px; }
.info-card ul { line-height:1.8; margin:0; padding-left:20px; }.info-card li { margin-bottom:10px; }
.schedule-row,.calendar-row { border-bottom:1px solid #eee; display:grid; gap:4px; padding:13px 0; }.schedule-row:last-child,.calendar-row:last-child { border:0; }.schedule-row strong,.calendar-row strong { color:#811632; }.schedule-row small,.muted { color:#777; }
.calendar-row { grid-template-columns:1fr 1fr; }.calendar-row span { text-align:right; }
thead { background:#811632; color:white; }.table td,.table th { padding:12px; vertical-align:middle; }.consult-button { align-items:center; background:linear-gradient(135deg,#25d366,#128c7e); border:1px solid rgba(255,255,255,.4); border-radius:10px; box-shadow:0 10px 22px rgba(18,140,126,.28); color:#fff; display:flex; gap:16px; justify-content:center; letter-spacing:.08em; margin:42px auto 0; max-width:440px; padding:13px 24px; text-decoration:none; transition:transform .2s ease,box-shadow .2s ease; }.consult-button:hover { box-shadow:0 14px 27px rgba(18,140,126,.38); color:#fff; transform:translateY(-3px); }.consult-button .fa-whatsapp { font-size:2.25rem; }.consult-button span { display:flex; flex-direction:column; font-size:.92rem; font-weight:800; text-align:left; }.consult-button small { font-size:.62rem; letter-spacing:.14em; margin-bottom:3px; opacity:.85; }.consult-button .fa-arrow-right { font-size:.9rem; }
@media(max-width:575px){.admission-hero{padding:60px 0}.info-card{padding:22px}.calendar-row{grid-template-columns:1fr}.calendar-row span{text-align:left}}
</style>
