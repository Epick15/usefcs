<script setup>
import { ref } from 'vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { usePerson } from '../composables/person'
import { useProgram } from '../composables/program'

import logoUnsm from '../assets/logo-unsm.png'
import logoFcs from '../assets/logo-fcs.png'

const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))
const student = localStorage.getItem('student')

// COMPOSABLES
const { personName, personDocument } = usePerson(url, token)
const { programName } = useProgram(url, token, student)

// RECORD ACADEMICO --------------------------------------
let unityFullName = ref('')
let sedeName = ref('')
let registrationList = ref([])
let totalCourses = ref(0)
let totalCredits = ref(0)
let generalAverage = ref(0)
let aprovedCourses = ref(0)
let aprovedCredits = ref(0)
// let percentAprovedCredits = ref(0)
let getAcademicRecord = async () => {
    let response = await fetch(url + `/intranet/student-academic-record`, {
        headers: {
            'X-Accesss-Token': token,
            'X-Student-Id': student
        }
    })
    let data = await response.json()

    // Datos generales de texto
    unityFullName.value = data.principalOrganicUnit.description.toUpperCase()
    sedeName.value = data.studentData.Program.Organic_unit_register.Campu.denomination.toUpperCase()
    registrationList.value = data.registration

    // Calcular total de cursos inscritos
    totalCourses.value = data.registration
        .map((reg) => reg.Registration_course.length)
        .reduce((total, course) => total + course, 0)

    // Calcular total de créditos inscritos
    totalCredits.value = data.registration
        .map((reg) =>
            reg.Registration_course.reduce(
                (totalRegCredits, regCourse) => totalRegCredits + regCourse.credits,
                0
            )
        )
        .reduce((total, regQtyCredits) => total + regQtyCredits, 0)

    // Calcular promedio general de los cursos inscritos
    generalAverage.value = (
        data.registration
            .map((reg) => {
                let sumNotes = reg.Registration_course.reduce(
                    (sumNotes, regCourse) => sumNotes + regCourse.note,
                    0
                )
                let regNote = sumNotes / reg.Registration_course.length
                return regNote
            })
            .reduce((sumRegNotes, regNote) => sumRegNotes + regNote, 0) / data.registration.length
    ).toFixed(2)

    // Calcular total de cursos aprobados
    aprovedCourses.value = data.registration
        .map(
            (reg) =>
                reg.Registration_course.filter((regCourse) => regCourse.type == 'Aprobado').length
        )
        .reduce((total, course) => total + course)

    // Calcular total de créditos aprobados
    aprovedCredits.value = data.registration
        .map((reg) =>
            reg.Registration_course.filter((regCourse) => regCourse.type == 'Aprobado').reduce(
                (totalRegCredits, regCourse) => totalRegCredits + regCourse.credits,
                0
            )
        )
        .reduce((total, regQtyCredits) => total + regQtyCredits, 0)

    // Calcular porcentaje de créditos aprobados
    // percentAprovedCredits.value = (aprovedCredits.value / totalCredits.value) * 100
}
getAcademicRecord()

// Descarga del reporte de notas
let universityName = 'Universidad Nacional de San Martín'
let facultyName = 'Facultad de Ciencias de la Salud'
let unityName = 'Unidad de Segunda Especialidad'

const imgUnsm = logoUnsm
const imgFcs = logoFcs

const numberToLetter = (num) => {
    let number
    switch (num) {
        case 0:
            number = 'CERO'
            break
        case 1:
            number = 'UNO'
            break
        case 2:
            number = 'DOS'
            break
        case 3:
            number = 'TRES'
            break
        case 4:
            number = 'CUATRO'
            break
        case 5:
            number = 'CINCO'
            break
        case 6:
            number = 'SEIS'
            break
        case 7:
            number = 'SIETE'
            break
        case 8:
            number = 'OCHO'
            break
        case 9:
            number = 'NUEVE'
            break
        case 10:
            number = 'DIEZ'
            break
        case 11:
            number = 'ONCE'
            break
        case 12:
            number = 'DOCE'
            break
        case 13:
            number = 'TRECE'
            break
        case 14:
            number = 'CATORCE'
            break
        case 15:
            number = 'QUINCE'
            break
        case 16:
            number = 'DIECISÉIS'
            break
        case 17:
            number = 'DIECISIETE'
            break
        case 18:
            number = 'DIECIOCHO'
            break
        case 19:
            number = 'DIECINUEVE'
            break
        case 20:
            number = 'VEINTE'
            break
    }
    return number
}

let downloadAcademicRecord = (data) => {
    let pagesGenerate = Math.ceil(data.registrationList.length / 3)

    function splitArray(arr, cantSubArray) {
        let result = []
        for (let i = 0; i < arr.length; i += cantSubArray) {
            result.push(arr.slice(i, i + cantSubArray))
        }
        return result
    }

    let arrayParts = splitArray(data.registrationList, 3)

    const pdf = new jsPDF()
    let pageWidth = pdf.internal.pageSize.getWidth()

    let totalAprovedCourse = 0
    let totalAprovedCredit = 0
    let aprovedPromedi = 0
    let totalCourse = 0
    let totalCredit = 0
    let generalPromedi = 0

    let academicSemester = '-'

    const addHeader = () => {
        pdf.addImage(imgUnsm, 'PNG', 10, 10, 24, 24)
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'normal')
        pdf.text(universityName.toUpperCase(), pageWidth / 2, 16, 'center')
        pdf.setFontSize(13)
        pdf.setFont('helvetica', 'normal')
        pdf.text(facultyName.toUpperCase(), pageWidth / 2, 23, 'center')
        pdf.setFontSize(15)
        pdf.setFont('helvetica', 'normal')
        pdf.text(unityName.toUpperCase(), pageWidth / 2, 31, 'center')
        pdf.addImage(imgFcs, 'PNG', 175, 10, 24, 24)

        pdf.setFontSize(19)
        pdf.setFont('helvetica', 'bold')
        pdf.text('REPORTE ACADÉMICO', pageWidth / 2, 42, 'center')
        pdf.setLineWidth(0.3)
        pdf.line(10, 44, 200, 44)

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.text('PROGRAMA', 10, 51)
        pdf.text(':', 34, 51)
        pdf.setFont('helvetica', 'normal')
        let splitProgram = pdf.splitTextToSize(data.programName.toUpperCase(), 162)
        pdf.text(splitProgram, 37, 51)

        pdf.setFont('helvetica', 'bold')
        pdf.text('UNIDAD', 10, 61)
        pdf.text(':', 34, 61)
        pdf.setFont('helvetica', 'normal')
        pdf.text(data.unityFullName.toUpperCase(), 37, 61)

        pdf.setFont('helvetica', 'bold')
        pdf.text('SEDE', 118, 61)
        pdf.text(':', 129, 61)
        pdf.setFont('helvetica', 'normal')
        pdf.text(data.sedeName, 132, 61)

        pdf.setFont('helvetica', 'bold')
        pdf.text('ESTUDIANTE', 10, 66)
        pdf.text(':', 34, 66)
        pdf.setFont('helvetica', 'normal')
        pdf.text(data.personName, 37, 66)

        pdf.setFont('helvetica', 'bold')
        pdf.text('CÓDIGO/DNI', 10, 71)
        pdf.text(':', 34, 71)
        pdf.setFont('helvetica', 'normal')
        pdf.text(data.personDocument, 37, 71)
    }

    const addContent = (part, initialTableY) => {
        part.forEach((reg) => {
            let tempBody = []
            reg.Registration_course.forEach((regCourse) => {
                let typeCourse = regCourse.type_course === 'Obligatorio' ? 'O' : 'E'
                totalCourse = totalCourse + 1
                totalCredit = totalCredit + regCourse.credits
                generalPromedi = generalPromedi + regCourse.note
                totalAprovedCourse =
                    regCourse.note >= 14 ? totalAprovedCourse + 1 : totalAprovedCourse
                aprovedPromedi =
                    regCourse.note >= 14 ? aprovedPromedi + regCourse.note : aprovedPromedi
                totalAprovedCredit =
                    regCourse.note >= 14
                        ? totalAprovedCredit + regCourse.credits
                        : totalAprovedCredit
                let noteText = numberToLetter(parseInt(regCourse.note))
                tempBody.push([
                    regCourse.code,
                    regCourse.denomination,
                    regCourse.ciclo,
                    'NN',
                    '',
                    typeCourse,
                    regCourse.credits,
                    regCourse.note,
                    noteText
                ])
            })

            pdf.setFont('helvetica', 'bold')
            pdf.setTextColor(0, 0, 0)
            pdf.setFontSize(10)
            pdf.text('SEMESTRE', 10, initialTableY - 2)
            academicSemester = reg.Academic_semester.denomination

            pdf.text(
                reg.Academic_semester.Academic_calendar.denomination + ' - ' + academicSemester,
                37,
                initialTableY - 2
            )

            pdf.autoTable({
                margin: [20, 10],
                theme: 'plain',
                didDrawCell: function (cel) {
                    pdf.rect(cel.cell.x, cel.cell.y, cel.cell.width, cel.cell.height)
                },
                startY: initialTableY,
                styles: { fontSize: 7, font: 'helvetica', fontStyle: 'normal', cellPadding: 1.3 },
                headStyles: {
                    font: 'helvetica',
                    fontStyle: 'bold',
                    fillColor: '#000',
                    textColor: '#ffffff'
                },
                head: [
                    [
                        'CÓDIGO',
                        'ASIGNATURA',
                        { content: 'CL', styles: { halign: 'center' } },
                        { content: 'CV', styles: { halign: 'center' } },
                        { content: 'TN', styles: { halign: 'center' } },
                        { content: 'TC', styles: { halign: 'center' } },
                        { content: 'CR', styles: { halign: 'center' } },
                        'NOTA',
                        'LETRA'
                    ]
                ],
                columnStyles: {
                    0: { cellWidth: 23 },
                    // 1: { cellWidth: 111 },
                    2: { cellWidth: 7, halign: 'center' },
                    3: { cellWidth: 7, halign: 'center' },
                    4: { cellWidth: 7, halign: 'center' },
                    5: { cellWidth: 7, halign: 'center' },
                    6: { cellWidth: 7, halign: 'center' },
                    7: { cellWidth: 11, halign: 'center' },
                    8: { cellWidth: 20 }
                },
                body: tempBody
            })
            initialTableY = pdf.lastAutoTable.finalY + 8
        })
    }

    const addFooter = () => {
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)

        pdf.text('TOTAL CURSOS', 10, 258)
        pdf.text(':', 50, 258)
        pdf.text(String(totalCourse), 52, 258)

        pdf.text('TOTAL CRÉDITOS', 10, 263)
        pdf.text(':', 50, 263)
        pdf.text(String(totalCredit), 52, 263)

        pdf.text('PROMEDIO GENERAL', 10, 268)
        pdf.text(':', 50, 268)
        pdf.text(String(Math.round((generalPromedi / totalCourse) * 100) / 100), 52, 268)

        pdf.text('TOTAL DE CURSOS APROBADOS', 120, 258)
        pdf.text(':', 183, 258)
        pdf.text(String(totalAprovedCourse), 185, 258)

        pdf.text('TOTAL DE CRÉDITOS APROBADOS', 120, 263)
        pdf.text(':', 183, 263)
        pdf.text(String(totalAprovedCredit), 185, 263)

        // pdf.text('PROMEDIO CR. APROBADOS', 120, 268)
        // pdf.text(':', 183, 268)
        // pdf.text(
        //     String(
        //         totalAprovedCourse !== 0
        //             ? Math.round((aprovedPromedi / totalAprovedCourse) * 100) / 100
        //             : 0
        //     ),
        //     185,
        //     268
        // )
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        pdf.text('CL: Ciclo', 10, 275)
        pdf.text('CV: Curso Convalidado(C)', 30, 275)
        pdf.text('TN: Tipo de nota', 70, 275)
        pdf.text('TC: Tipo de curso(O=Obligatorio, E=Electivo)', 100, 275)
        pdf.text('CR: Créditos', 163, 275)
    }

    const addWaterMark = () => {
        pdf.setTextColor(222, 222, 222)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(100)
        pdf.text('SOLO', 60, 160, { angle: 45 })
        pdf.text('LECTURA', 60, 200, { angle: 45 })
    }

    for (let index = 0; index < pagesGenerate; index++) {
        if (index > 0) {
            pdf.addPage()
        }
        addHeader()
        addWaterMark()
        addContent(arrayParts[index], 82)
        addFooter()

        pdf.setTextColor(0, 0, 0)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.text('Pag ' + String(index + 1) + ' de ' + String(pagesGenerate), 197, 287, {
            align: 'right'
        })
    }

    pdf.save('RÉCORD-ACADÉMICO-' + data.personDocument + '.pdf')
}
</script>

<template>
    <div class="row">
        <div class="col d-flex align-items-center page-bar">
            <span class="page-title">Reporte de calificaciones</span>
        </div>
    </div>
    <div class="row">
        <div class="col mt-3 mb-3">
            <div class="card shadow-sm top-random">
                <div class="card-header d-flex justify-content-between text-random">
                    <span class="h6">RÉCORD ACADÉMICO</span>
                    <span
                        class="cursor-pt"
                        @click="
                            downloadAcademicRecord({
                                programName: programName,
                                unityFullName: unityName,
                                sedeName: sedeName,
                                personName: personName,
                                personDocument: personDocument,
                                registrationList: registrationList
                                // totalPaymentsPayed: String(totalPaymentsPayed),
                                // totalPaymentsPendant: String(totalPaymentsPendant),
                                // currentDate: currentDate
                            })
                        "
                    >
                        <span class="fa-solid fa-print"></span>
                        DESCARGAR
                    </span>
                </div>
                <div class="card-body">
                    <div class="mb-2 fw-bold text-random">{{ programName }}</div>
                    <div class="row">
                        <div class="col-12 mt-3" v-for="reg in registrationList" :key="reg.id">
                            <span style="font-weight: bold; font-size: 0.8em; margin-right: 35px"
                                >SEMESTRE</span
                            >
                            <span style="font-size: 0.8em">{{
                                reg.Academic_semester.Academic_calendar.denomination +
                                ' - ' +
                                reg.Academic_semester.denomination
                            }}</span>
                            <table class="table table-sm table-bordered">
                                <thead class="table-dark">
                                    <tr>
                                        <th style="width: 85px">CÓDIGO</th>
                                        <th>CURSO</th>
                                        <th style="width: 20px">CL</th>
                                        <th style="width: 20px">CR</th>
                                        <th style="width: 20px">TC</th>
                                        <th style="width: 35px">NOTA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="reco in reg.Registration_course" :key="reco.id">
                                        <td>{{ reco.code }}</td>
                                        <td>{{ reco.denomination }}</td>
                                        <td>{{ reco.ciclo }}</td>
                                        <td>{{ reco.credits }}</td>
                                        <td>
                                            <span v-if="reco.type_course == 'Obligatorio'">O</span>
                                            <span v-else>E</span>
                                        </td>
                                        <td
                                            :class="{
                                                'text-danger': reco.type == 'Desaprobado'
                                            }"
                                        >
                                            <span v-if="Number(reco.note) >= 10">{{
                                                reco.note
                                            }}</span>
                                            <span v-else>{{ `0${reco.note}` }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="mb-2">
                        <div class="row">
                            <div class="col">
                                <div class="mt-3">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td class="td-bold">TOTAL CURSOS</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ totalCourses }}</td>
                                            </tr>
                                            <tr>
                                                <td class="td-bold">TOTAL CRÉDITOS</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ totalCredits }}</td>
                                            </tr>
                                            <tr>
                                                <td class="td-bold">PROMEDIO GENEREAL</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ generalAverage }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="col">
                                <div class="mt-3">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td class="td-bold">CURSOS APROBADOS</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ aprovedCourses }}</td>
                                            </tr>
                                            <tr>
                                                <td class="td-bold">CRÉDITOS APROBADOS</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ aprovedCredits }}</td>
                                            </tr>
                                            <!-- <tr>
                                                <td class="td-bold">
                                                    PORCENTAJE CRÉDITOS APROBADOS
                                                </td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">
                                                    {{ percentAprovedCredits }}%
                                                </td>
                                            </tr> -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3" style="font-size: 0.7em">
                            <div class="col-auto">CL: Ciclo</div>
                            <div class="col-auto">CR: Créditos</div>
                            <div class="col">TC: Tipo Curso (O=Obligatorio; E=Electivo)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media print {
    .print-page {
        width: 21cm;
        min-height: 29.7cm;
        padding: 1cm;
        font-family: Arial, Helvetica, sans-serif;
        position: relative;
    }
}
.watermark {
    color: rgba(0, 0, 0, 0.17);
    font-size: 9em;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: bold;
    position: fixed;
    left: -5%;
    top: 26%;
    transform: rotate(-55deg);
    text-align: center;
}
.image-unsm,
.image-fcs {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    height: 110px;
    width: 110px;
}
.image-unsm {
    background-image: url('../assets/logo-unsm.png');
}
.image-fcs {
    background-image: url('../assets/logo-fcs.png');
}
.unsm-name {
    font-size: 1.4em;
}
.fcs-name {
    font-size: 1.15em;
}
.use-name {
    font-size: 1.3em;
}
.print-title {
    display: flex;
    justify-content: center;
    border-bottom: 2px solid black;
    font-weight: bold;
    font-size: 1.7em;
    color: black;
}

table {
    white-space: normal !important;
}
.td-bold {
    font-weight: bold;
    font-size: 0.8em;
}
.td-normal {
    font-size: 0.8em;
}

th,
td {
    font-size: 0.7em;
}

.legend {
    font-size: 0.7em;
    /* font-weight: bold; */
}
.legend > div {
    padding-left: 0 !important;
    padding-right: 75px !important;
}
</style>
