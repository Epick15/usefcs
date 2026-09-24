<script setup>
import { ref } from 'vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { usePerson } from '../composables/person'
import { useProgram } from '../composables/program'
import { useCurrentDate } from '../composables/current-date'

import logoUnsm from '../assets/logo-unsm.png'
import logoFcs from '../assets/logo-fcs.png'

const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))
const student = localStorage.getItem('student')

// COMPOSABLES
const { personName, personDocument } = usePerson(url, token)
const { programName } = useProgram(url, token, student)
const { currentDate } = useCurrentDate()

// PAGOS----------------------------------------------
let paymentsList = ref([])
let paymentsListPdf = ref([])
let totalPaymentsPayed = ref(0)
let totalPaymentsPendant = ref(0)
let getPayments = async () => {
    let response = await fetch(url + `/intranet/student-payment`, {
        headers: {
            'X-Accesss-Token': token,
            'X-Student-Id': student
        }
    })
    let data = await response.json()
    paymentsList.value = data
    paymentsListPdf.value = data.map((item, k) => [
        k + 1,
        item.concept,
        item.amount,
        item.process,
        item.type
    ])
    totalPaymentsPayed.value = data
        .filter((e) => e.type === 'Pagado')
        .reduce((total, item) => total + Number(item.amount), 0)

    totalPaymentsPendant.value = data
        .filter((e) => e.type === 'Pendiente')
        .reduce((total, item) => total + Number(item.amount), 0)
}
getPayments()

// Configuración de la tabla pagos
const paymentSearchField = ['concept', 'amount', 'process', 'type']
const paymentSearchValue = ref('')
const paymentsHeaders = ref([
    { text: 'CONCEPTO', value: 'concept' },
    { text: 'MONTO', value: 'amount' },
    { text: 'PERIODO', value: 'process' },
    { text: 'ESTADO', value: 'type' }
])

// Descarga del reporte de pagos
let universityName = 'Universidad Nacional de San Martín'
let facultyName = 'Facultad de Ciencias de la Salud'
let unityName = 'Unidad de Segunda Especialidad'

const imgUnsm = logoUnsm
const imgFcs = logoFcs

let downloadPayments = (data) => {
    const pdf = new jsPDF()
    let pageWidth = pdf.internal.pageSize.getWidth()
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
    const pageCount = pdf.internal.getNumberOfPages()

    pdf.setFontSize(19)
    pdf.setFont('helvetica', 'bold')
    pdf.text('REPORTE DE CONCEPTOS DE PAGO', pageWidth / 2, 42, 'center')
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
    pdf.text('ESTUDIANTE', 10, 61)
    pdf.text(':', 34, 61)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.personName.toUpperCase(), 37, 61)

    pdf.setFont('helvetica', 'bold')
    pdf.text('CÓDIGO/DNI', 10, 66)
    pdf.text(':', 34, 66)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.personDocument, 37, 66)

    pdf.setTextColor(222, 222, 222)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(100)
    pdf.text('SOLO', 60, 160, { angle: 45 })
    pdf.text('LECTURA', 60, 200, { angle: 45 })

    // TABLA
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.text('PAGADO', 10, 76)
    pdf.text(':', 28, 76)
    pdf.setFont('helvetica', 'normal')
    pdf.text('S/ ' + data.totalPaymentsPayed, 31, 76)

    pdf.setFont('helvetica', 'bold')
    pdf.text('PENDIENTE', 80, 76)
    pdf.text(':', 102, 76)
    pdf.setFont('helvetica', 'normal')
    pdf.text('S/ ' + data.totalPaymentsPendant, 105, 76)

    pdf.setFont('helvetica', 'bold')
    pdf.text('FECHA', 164, 76)
    pdf.text(':', 178, 76)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.currentDate, 181, 76)

    let initial_autotable = 79
    pdf.autoTable({
        margin: [28, 10],
        theme: 'plain',
        didDrawCell: function (cel) {
            pdf.rect(cel.cell.x, cel.cell.y, cel.cell.width, cel.cell.height)
        },
        styles: {
            fontSize: 7,
            font: 'helvetica',
            fontStyle: 'normal'
        },
        headStyles: {
            font: 'helvetica',
            fontStyle: 'bold',
            fillColor: '#000000',
            textColor: '#ffffff'
        },
        columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 132 },
            2: { cellWidth: 18 },
            3: { cellWidth: 16 },
            4: { cellWidth: 16 }
        },
        startY: initial_autotable,
        columns: ['#', 'CONCEPTO', 'MONTO', 'PERIODO', 'ESTADO'],
        body: data.paymentsListPdf
    })
    initial_autotable = pdf.lastAutoTable.finalY + 5

    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.text('Pag ' + String(i) + ' de ' + String(pageCount), 197, 287, {
            align: 'right'
        })
    }

    pdf.save('REPORTE DE PAGOS - ' + Date() + '.pdf')
}
</script>

<template>
    <div class="row">
        <div class="col d-flex align-items-center page-bar">
            <span class="page-title">Reporte de pagos</span>
        </div>
    </div>
    <div class="row">
        <div class="col mt-3 mb-3">
            <div class="card shadow-sm top-random">
                <div class="card-header d-flex justify-content-between text-random">
                    <span class="h6">CONCEPTOS DE PAGO</span>
                    <span
                        class="cursor-pt"
                        @click="
                            downloadPayments({
                                programName: programName,
                                personName: personName,
                                personDocument: personDocument,
                                paymentsListPdf: paymentsListPdf,
                                totalPaymentsPayed: String(totalPaymentsPayed),
                                totalPaymentsPendant: String(totalPaymentsPendant),
                                currentDate: currentDate
                            })
                        "
                    >
                        <span class="fa-solid fa-print"></span>
                        DESCARGAR
                    </span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-auto">
                            <span class="form-label fw-bold text-secondary">Buscar:</span>
                        </div>
                        <div class="col">
                            <input
                                type="text"
                                class="form-control form-control-sm mb-2"
                                v-model="paymentSearchValue"
                            />
                        </div>
                    </div>
                    <EasyDataTable
                        :headers="paymentsHeaders"
                        :items="paymentsList"
                        :search-field="paymentSearchField"
                        :search-value="paymentSearchValue"
                        :rows-per-page="10"
                        show-index
                        alternating
                        buttons-pagination
                    >
                    </EasyDataTable>
                </div>
            </div>
        </div>
    </div>
</template>
