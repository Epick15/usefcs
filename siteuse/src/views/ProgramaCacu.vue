<script setup>
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
    title: 'Salud Reproductiva | Segunda Especialidad - FCS',
    description:
        'El programa de Segunda Especialidad en Salud Reproductiva te prepara para orientar el desarrollo de la salud integral a la mujer, pareja y familia durante el periodo reproductivo, básicamente en salud reproductiva con énfasis en cáncer de cuello uterino y mamas.',
    ogTitle: 'Salud Reproductiva | Segunda Especialidad - FCS',
    ogDescription:
        'El programa de Segunda Especialidad en Salud Reproductiva te espera, matricúlate ya.'
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

    <section class="parent-container cacu-plan">
        <div class="container">
            <div class="row py-2" style="background-color: rgb(220, 220, 220)">
                <div class="col-md-8 offset-md-2 cacu-plan-title">
                    SEGUNDA ESPECIALIDAD EN SALUD REPRODUCTIVA CON MENCIÓN EN PREVENCIÓN DE CÁNCER
                    DE CUELLO UTERINO Y MAMA
                </div>
            </div>
            <div class="row gx-md-5">
                <div class="col-md-6 mt-3 mt-md-4">
                    <div class="cacu-plan-article">OBJETIVOS</div>
                    <div class="mt-3">
                        <ul class="program-list">
                            <li>
                                Formar profesionales del área de la salud sexual y reproductiva con
                                capacidades creativas e innovadoras orientados al desarrollo de la
                                salud integral a la mujer, pareja y familia durante el periodo
                                reproductivo, básicamente en salud reproductiva con énfasis en
                                cáncer de cuello uterino y mamas, desarrollando intervenciones de
                                comunicación y educación en salud para el cambio hacia
                                comportamiento saludable, seguro y protegido.
                            </li>
                            <li>
                                Fortalecer las capacidades en los participantes en la planificación,
                                organización, ejecución y evaluación de actividades en salud
                                reproductiva con énfasis en Cáncer de cuello uterino y mamas,
                                incorporando estrategias que faciliten la participación de todos los
                                actores sociales y políticos
                            </li>
                        </ul>
                    </div>
                    <div class="mt-3 cacu-plan-article">COMPETENCIAS</div>
                    <div class="mt-3">
                        <ul class="program-list">
                            <li>
                                Desarrollo la acciones de promoción de la salud sexual y
                                reproductiva en distintos escenarios, especialmente con las
                                poblaciones vulnerables evaluando y controlando los procesos,
                                resultados e impacto de las intervenciones realizadas en el campo de
                                la salud.
                            </li>
                            <li>
                                Diseña y propone modelos de intervención innovadores y pertinentes
                                para la promoción y prevención del cáncer Ginecológico.
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6 mt-3 mt-md-4">
                    <div class="cacu-plan-article">PLAN DE ESTUDIOS</div>
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
                                <td rowspan="4">I</td>
                                <td>Epidemiología del Cáncer Ginecológico y del Cáncer de Mamas</td>
                                <td>4</td>
                                <td rowspan="4">6 MESES</td>
                            </tr>
                            <tr>
                                <td>Anatomía y Fisiopatología del Aparato Genital Femenino</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Anatomía y Fisiopatología de la Mama</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Tesis I (Elaboración y Aprobación del proyecto)</td>
                                <td>5</td>
                            </tr>

                            <tr>
                                <td rowspan="4">II</td>
                                <td>Genética del Cáncer</td>
                                <td>4</td>
                                <td rowspan="4">6 MESES</td>
                            </tr>
                            <tr>
                                <td>
                                    Prevención del Cáncer Ginecológico, Clínica y Procedimiento de
                                    Diagnóstico
                                </td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Tesis II (Ejecución del proyecto)</td>
                                <td>5</td>
                            </tr>

                            <tr>
                                <td>Rotación I: Práctica Especializada I</td>
                                <td>5</td>
                            </tr>

                            <tr>
                                <td rowspan="5">III</td>
                                <td>Prevención del Cáncer de Mama y Mamografía</td>
                                <td>4</td>
                                <td rowspan="5">6 MESES</td>
                            </tr>
                            <tr>
                                <td>Tratamiento del Cáncer Ginecológico y de Mamas</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Tesis III (Sustentación del informe final de la Tesis)</td>
                                <td>5</td>
                            </tr>
                            <tr>
                                <td>Rotación II: Práctica Especializada II</td>
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
.cacu-plan {
    padding-bottom: 20px;
    padding-top: 20px;
}

.cacu-plan {
    background-color: #fae6e5;
}

.cacu-plan-title {
    font-family: BarlowBold;
    font-size: 1.5em;
    text-align: center;
    text-shadow:
        -1px -1px 0 #eeeeee,
        1px -1px 0 #eeeeee,
        -1px 1px 0 #eeeeee,
        1px 1px 0 #eeeeee;
}

.cacu-plan-title {
    color: #fa549e;
}

.cacu-plan-article {
    color: #fa549e;
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

.cacu-plan table {
    border: 2px solid black;
    border-collapse: collapse;
    margin-bottom: 0;
}

.cacu-plan th {
    border: 2px solid black;
    color: white;
    font-family: BarlowBold;
    font-size: 0.7em;
    text-align: center;
}

.cacu-plan th {
    background-color: #fa549e;
}

.cacu-plan td {
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
