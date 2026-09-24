<script setup>
import { ref } from 'vue'
import 'jspdf-autotable'

const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))
const student = localStorage.getItem('student')

// DOCUMENTOS----------------------------------------------
let documentsList = ref([])
let getDocuments = async () => {
    let response = await fetch(url + `/intranet/student-documents`, {
        headers: {
            'X-Accesss-Token': token,
            'X-Student-Id': student
        }
    })
    let data = await response.json()
    documentsList.value = data
}
getDocuments()

// Configuración de la tabla documentos
const documentSearchField = ['Concept.denomination']
const documentSearchValue = ref('')
const documentsHeader = ref([
    { text: 'DOCUMENTO', value: 'Concept.denomination' },
    { text: 'DESCARGA', value: 'operation' }
])

let downloadItem = async (item) => {
    let link = document.createElement('a')
    link.href = url + '/student-document/' + item.file
    link.target = '_blank'
    link.click()
}
</script>

<template>
    <div class="row">
        <div class="col d-flex align-items-center page-bar">
            <span class="page-title">Documentos</span>
        </div>
    </div>
    <div class="row">
        <div class="col mt-3 mb-3">
            <div class="card shadow-sm top-random">
                <div class="card-header text-random">
                    <span class="h6">DOCUMENTOS DE TRÁMITE</span>
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
                                v-model="documentSearchValue"
                            />
                        </div>
                    </div>
                    <EasyDataTable
                        :headers="documentsHeader"
                        :items="documentsList"
                        :search-field="documentSearchField"
                        :search-value="documentSearchValue"
                        :rows-per-page="10"
                        show-index
                        alternating
                        buttons-pagination
                    >
                        <template #item-operation="item">
                            <div class="operation-wrapper">
                                <span
                                    class="fa-solid fa-download icon-option"
                                    @click="downloadItem(item)"
                                ></span>
                            </div>
                        </template>
                    </EasyDataTable>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.operation-wrapper span:hover {
    cursor: pointer;
}

.icon-option {
    font-size: 1.4em;
}
</style>
