<script setup>
import { computed, onMounted, ref } from 'vue'
const props = defineProps({ slug: { type: String, required: true } })
const api = import.meta.env.VITE_API_URL || 'http://localhost:8899/api'
const data = ref(null)
const loading = ref(true)
onMounted(async () => {
  try {
    const response = await fetch(`${api}/web/specialties/${props.slug}`)
    data.value = response.ok ? await response.json() : null
  } catch (_) {
    data.value = null
  } finally {
    loading.value = false
  }
})
const specialty = computed(() => data.value?.specialty || {})
const program = computed(() => data.value?.program || {})
const plan = computed(() => data.value?.plan || null)
const title = computed(
  () => specialty.value.title || program.value.denomination || 'Segunda Especialidad'
)
</script>
<template>
  <main
    class="specialty"
    :style="{
      '--accent': specialty.color || '#811632',
      '--surface': specialty.background_color || '#f8f6f3'
    }"
  >
    <section class="brand">
      <img src="../assets/img/unsm.webp" alt="UNSM" />
      <div>
        <b>UNIVERSIDAD NACIONAL DE SAN MARTÍN</b><span>FACULTAD DE CIENCIAS DE LA SALUD</span>
      </div>
      <img src="../assets/img/fcs.webp" alt="FCS" />
    </section>
    <section v-if="loading" class="message">Cargando información de la especialidad…</section>
    <section v-else-if="!data" class="message">
      La información de esta especialidad no está disponible.
    </section>
    <template v-else
      ><header>
        <p>SEGUNDA ESPECIALIDAD</p>
        <h1>{{ title }}</h1>
      </header>
      <section class="container details">
        <article v-if="specialty.objectives?.length">
          <h2>Objetivos</h2>
          <ul>
            <li v-for="(item, index) in specialty.objectives" :key="index">{{ item }}</li>
          </ul>
        </article>
        <article v-if="specialty.competencies?.length">
          <h2>Competencias</h2>
          <ul>
            <li v-for="(item, index) in specialty.competencies" :key="index">{{ item }}</li>
          </ul>
        </article>
        <article
          v-if="!specialty.objectives?.length && !specialty.competencies?.length"
          class="editorial-note"
        >
          Los objetivos y competencias serán publicados próximamente.
        </article>
      </section>
      <section class="container curriculum" v-if="plan">
        <div class="section-title">
          <p>PLAN DE ESTUDIOS VIGENTE</p>
          <h2>{{ plan.description }}</h2>
        </div>
        <div class="cycles">
          <article v-for="cycle in plan.Ciclos" :key="cycle.id" class="cycle">
            <h3>Ciclo {{ cycle.ciclo }}</h3>
            <table>
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Créditos</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in cycle.Course" :key="course.id">
                  <td>{{ course.denomination }}</td>
                  <td>{{ course.credits }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </section></template
    >
  </main>
</template>
<style scoped>
.specialty {
  background: var(--surface);
  min-height: 100vh;
  color: #25212a;
  padding-bottom: 4rem;
}
.brand {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 18px;
}
.brand img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}
.brand div {
  text-align: center;
  display: grid;
  gap: 4px;
  color: var(--accent);
  letter-spacing: 0.04em;
}
.brand span {
  font-size: 0.8rem;
  font-weight: 600;
}
header {
  background: linear-gradient(125deg, var(--accent), #34111d);
  color: #fff;
  text-align: center;
  padding: 3.5rem 1.25rem;
}
header p {
  letter-spacing: 0.18em;
  font-weight: 700;
  font-size: 0.78rem;
  margin: 0 0 0.7rem;
}
h1 {
  font-size: clamp(1.55rem, 3vw, 2.45rem);
  max-width: 1050px;
  margin: auto;
  line-height: 1.2;
}
.details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding-top: 42px;
}
.details article,
.cycle {
  background: #fff;
  border-radius: 9px;
  box-shadow: 0 10px 28px #1c0e1817;
  padding: 26px;
  border-top: 4px solid var(--accent);
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}
.details article:hover,
.cycle:hover {
  box-shadow: 0 16px 34px #1c0e1820;
  transform: translateY(-4px);
}
h2 {
  color: var(--accent);
  text-transform: uppercase;
  font-size: 1.15rem;
  letter-spacing: 0.05em;
}
li {
  margin-bottom: 12px;
  line-height: 1.6;
}
.editorial-note {
  grid-column: 1/-1;
  text-align: center;
  color: #6d6870;
}
.curriculum {
  margin-top: 48px;
}
.section-title {
  text-align: center;
  margin-bottom: 24px;
}
.section-title p {
  font-weight: 700;
  color: var(--accent);
  margin: 0;
}
.section-title h2 {
  margin: 0.3rem 0;
  font-size: 1.45rem;
}
.cycles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 22px;
}
.cycle {
  padding: 0;
}
.cycle h3 {
  background: var(--accent);
  color: white;
  padding: 15px 20px;
  margin: 0;
  text-transform: uppercase;
  font-size: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 13px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
th:last-child,
td:last-child {
  text-align: center;
  width: 90px;
}
th {
  font-size: 0.77rem;
  text-transform: uppercase;
  color: #777;
}
.message {
  text-align: center;
  padding: 100px 20px;
  font-size: 1.1rem;
}
@media (max-width: 550px) {
  .brand {
    gap: 10px;
  }
  .brand img {
    width: 45px;
    height: 45px;
  }
  .brand b {
    font-size: 0.68rem;
  }
  .brand span {
    font-size: 0.6rem;
  }
}
</style>
