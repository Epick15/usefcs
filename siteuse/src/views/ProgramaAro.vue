<script setup>
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
    title: 'Obstetricia de Alto Riesgo | Segunda Especialidad - FCS',
    description:
        'El programa de Segunda Especialidad en Obstetricia de Alto Riesgo te prepara para reconocer los cambios fisiológicos del embarazo y diagnosticar la patología materna y fetal.',
    ogTitle: 'Obstetricia de Alto Riesgo | Segunda Especialidad - FCS',
    ogDescription:
        'El programa de Segunda Especialidad en Obstetricia de Alto Riesgo te espera, matricúlate ya.'
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

    <section class="parent-container aro-plan">
        <div class="container">
            <div class="row py-2" style="background-color: rgb(220, 220, 220)">
                <div class="col-md-8 offset-md-2 aro-plan-title">
                    SEGUNDA ESPECIALIDAD EN OBSTETRICIA DE ALTO RIESGO CON MENCIÓN EN CUIDADOS
                    INTENSIVOS MATERNOS
                </div>
            </div>

            <div class="row gx-md-5">
                <div class="col-md-6 mt-3 mt-md-4">
                    <div class="aro-plan-article">OBJETIVOS</div>
                    <div class="mt-3">
                        <ul class="program-list">
                            <li>
                                Reconocer los cambios fisiológicos del embarazo y diagnosticar la
                                patología materna y fetal, para elaborar un plan de control y
                                tratamiento en concordancia con la gravedad de la patología.
                            </li>
                            <li>
                                Interpretar adecuadamente la literatura científica haciendo hincapié
                                especialmente en la metodología utilizada por la medicina basada en
                                evidencias.
                            </li>
                            <li>
                                Conocer e interpretar los resultados de las diferentes técnicas
                                moleculares de apoyo al diagnóstico citogenética.
                            </li>
                            <li>
                                Desarrollar las competencias y habilidades para la gestión y
                                administración de la investigación y de las Unidades de UCI
                                obstétrico.
                            </li>
                        </ul>
                    </div>
                    <div class="mt-3 aro-plan-article">COMPETENCIAS</div>
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
                    <div class="aro-plan-article">PLAN DE ESTUDIOS</div>
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
                                <td rowspan="5">I</td>
                                <td>Salud Sexual y Reproductiva</td>
                                <td>4</td>
                                <td rowspan="5">6 MESES</td>
                            </tr>
                            <tr>
                                <td>Psicoprofilaxis del ARO</td>
                                <td>5</td>
                            </tr>
                            <tr>
                                <td>Manejo y Vigilancia Materno - Fetal I</td>
                                <td>5</td>
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
                                <td rowspan="5">II</td>
                                <td>Obstetricia de Alto Riesgo I</td>
                                <td>5</td>
                                <td rowspan="5">6 MESES</td>
                            </tr>
                            <tr>
                                <td>Patología Gineco - Obstétrica I</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Manejo y Vigilancia Materno - Fetal II</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Medicina Integrativa en Obstetricia</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Investigación II</td>
                                <td>5</td>
                            </tr>

                            <tr>
                                <td rowspan="5">III</td>
                                <td>Obstetricia de Alto Riesgo II</td>
                                <td>4</td>
                                <td rowspan="5">6 MESES</td>
                            </tr>
                            <tr>
                                <td>Patología Gineco - Obstétrica II</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Obstetricia y Neonatología</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Obstetricia en UCi Materno y Neonatal</td>
                                <td>5</td>
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
.aro-plan {
    padding-bottom: 20px;
    padding-top: 20px;
}

.aro-plan {
    background-color: #f4f8ff;
}

.aro-plan-title {
    font-family: BarlowBold;
    font-size: 1.5em;
    text-align: center;
    text-shadow:
        -1px -1px 0 #eeeeee,
        1px -1px 0 #eeeeee,
        -1px 1px 0 #eeeeee,
        1px 1px 0 #eeeeee;
}

.aro-plan-title {
    color: #03437d;
}

.aro-plan-article {
    color: #03437d;
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

.aro-plan table {
    border: 2px solid black;
    border-collapse: collapse;
    margin-bottom: 0;
}

.aro-plan th {
    border: 2px solid black;
    color: white;
    font-family: BarlowBold;
    font-size: 0.7em;
    text-align: center;
}

.aro-plan th {
    background-color: #03437d;
}

.aro-plan td {
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
