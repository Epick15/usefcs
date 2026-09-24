<script setup>
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
    title: 'Ecografía Obstétrica | Segunda Especialidad - FCS',
    description:
        'El programa de Segunda Especialidad en Ecografía Obstétrica te prepara para interpretar adecuadamente los resultados de cada uno de los exámenes y procedimientos auxiliares del diagnóstico usados en el diagnóstico de la salud materna y fetal en el nivel de su competencia.',
    ogTitle: 'Ecografía Obstétrica | Segunda Especialidad - FCS',
    ogDescription:
        'El programa de Segunda Especialidad en Ecografía Obstétrica te espera, matricúlate ya.'
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

    <section class="parent-container eco-plan">
        <div class="container">
            <div class="row py-2" style="background-color: rgb(220, 220, 220)">
                <div class="col-md-8 offset-md-2 eco-plan-title">
                    SEGUNDA ESPECIALIDAD EN ECOGRAFÍA OBSTÉTRICA CON MENCIÓN EN MONITOREO FETAL
                    ELECTRÓNICO
                </div>
            </div>
            <div class="row gx-md-5">
                <div class="col-md-6 mt-3 mt-md-4">
                    <div class="eco-plan-article">OBJETIVOS</div>
                    <div class="mt-3">
                        <ul class="program-list">
                            <li>
                                Promover la capacitación actualizada y especializada de alto nivel
                                científico.
                            </li>
                            <li>Impulsar la docencia especializada en Obstetricia.</li>
                            <li>
                                Desarrollar en el profesional de Obstetricia especialista una
                                voluntad compulsiva de perfeccionamiento.
                            </li>
                            <li>
                                Desarrollar las competencias y habilidades para la gestión y
                                administración de la investigación.
                            </li>
                            <li>
                                Formar Obstetras especialistas con un alto nivel de eficiencia en la
                                atención de la Salud Integral.
                            </li>
                        </ul>
                    </div>
                    <div class="mt-3 eco-plan-article">COMPETENCIAS</div>
                    <div class="mt-3">
                        <ul class="program-list">
                            <li>
                                Precisa e interpreta las patologías mas frecuentes que pueden
                                afectar a la madre y al feto.
                            </li>
                            <li>
                                Explica el fundamento e interpreta adecuadamente los resultados de
                                cada uno de los exámenes y procedimientos auxiliares del diagnóstico
                                usados en el diagnóstico de la salud materna y fetal en el nivel de
                                su competencia.
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6 mt-3 mt-md-4">
                    <div class="eco-plan-article">PLAN DE ESTUDIOS</div>
                    <table class="table table-sm mt-3">
                        <thead>
                            <tr>
                                <th>CICLO</th>
                                <th>ASIGNATURA</th>
                                <th>CRÉDITOS</th>
                                <th>DURACIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowspan="6">I</td>
                                <td>Desarrollo Morfológico y Funcional del Feto</td>
                                <td>3</td>
                                <td rowspan="6">6 MESES</td>
                            </tr>
                            <tr>
                                <td>Monitorización Fetal I</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Evaluación de la Condición Fetal</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Ecografía</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td>Ética y Valores en Obstetricia</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td>Investigación I</td>
                                <td>5</td>
                            </tr>

                            <tr>
                                <td rowspan="6">II</td>
                                <td>Monitorización Fetal II</td>
                                <td>4</td>
                                <td rowspan="6">6 MESES</td>
                            </tr>
                            <tr>
                                <td>Semiología Ecográfica Pélvica</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td>Semiología Ecográfica Fetal</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td>Valoración Ecográfica Fetal y Anexos</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Ecografía de Mama</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td>Investigación II</td>
                                <td>5</td>
                            </tr>

                            <tr>
                                <td rowspan="5">III</td>
                                <td>Ecografía en el Embarazo de Alto Riesgo</td>
                                <td>5</td>
                                <td rowspan="5">6 MESES</td>
                            </tr>
                            <tr>
                                <td>Ecografía en Neoplasias Ginecológicas</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Ecografía Dopler y Tridimensional</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Clínica Ecográfica en Gineco - Obstetricia</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Investigación III</td>
                                <td>5</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row">
                <div
                    class="col d-flex justify-content-center justify-content-md-start admision-registration"
                >
                    <RouterLink to="/admision">INSCRÍBETE YA</RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.eco-plan {
    padding-bottom: 20px;
    padding-top: 20px;
}

.eco-plan {
    background-color: #f4fde384;
}

.eco-plan-title {
    font-family: BarlowBold;
    font-size: 1.5em;
    text-align: center;
    text-shadow:
        -1px -1px 0 #eeeeee,
        1px -1px 0 #eeeeee,
        -1px 1px 0 #eeeeee,
        1px 1px 0 #eeeeee;
}

.eco-plan-title {
    /* color: #8dd804; */
    color: #74ae08;
}

.eco-plan-article {
    /* color: #8dd804; */
    color: #85c116;
    font-size: 1.2em;
    font-weight: bold;
}

.program-list {
    text-align: justify;
}

.plan-table-title {
    display: flex;
    font-size: 1.1em;
    font-weight: bold;
    justify-content: center;
}

.eco-plan table {
    border: 2px solid black;
    border-collapse: collapse;
    margin-bottom: 0;
}

.eco-plan th {
    border: 2px solid black;
    color: white;
    font-family: BarlowBold;
    font-size: 0.7em;
    text-align: center;
}

.eco-plan th {
    background-color: #8dd804;
}

.eco-plan td {
    border: 2px solid black;
    font-family: BarlowRegular;
    font-size: 0.7em;
    text-align: center;
    text-wrap: balance;
    vertical-align: middle;
}

.admision-registration {
    margin-bottom: 20px !important;
    margin-top: 25px !important;
}

.admision-registration a {
    background-color: #811632;
    color: #fff;
    /* font-size: 0.9em; */
    font-weight: 700;
    padding: 10px 15px;
    text-decoration: none;
}

@media only screen and (min-width: 1200px) {
    .header-section {
        background-image: linear-gradient(to bottom, #811633e9, #811632) !important;
        position: initial !important;
    }
}
</style>
