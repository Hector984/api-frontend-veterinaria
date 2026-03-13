<script setup>
import Button from 'primevue/button';
import Card from 'primevue/card';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import Timeline from 'primevue/timeline';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormularioRegistrarServicio from '../../mascotas/components/FormularioRegistrarServicio.vue';
import { useMascotaStore } from '../../mascotas/stores/useMascotaStore';
import { useHistorialStore } from '../stores/useHistorialStore';

const route = useRoute();
const router = useRouter();
const mascotaStore = useMascotaStore();
const historialStore = useHistorialStore();
const mascota = computed(() => mascotaStore.datosMascota);

const mostrarModalServicio = ref(false);

const alRegistrarServicio = () => {
    // Aquí se podría recargar el historial si fuera dinámico
    console.log('Servicio registrado con éxito, actualizando historial...');
};

// Mock data for history entries
const historial = ref([
    {
        id: 1,
        fecha: '15/01/2024',
        tipo: 'consulta',
        motivo: 'Vacunación Anual',
        hallazgos: 'Paciente en buen estado general. Frecuencia cardiaca normal.',
        diagnostico: 'Saludable',
        tratamiento: 'Vacuna polivalente y antirrábica.',
        doctor: 'Dr. García',
        icon: 'pi pi-calendar',
        color: '#3B82F6'
    },
    {
        id: 2,
        fecha: '20/03/2024',
        tipo: 'laboratorio',
        motivo: 'Perfil Bioquímico',
        hallazgos: 'Niveles de glucosa ligeramente elevados.',
        diagnostico: 'Prediabetes felina',
        tratamiento: 'Cambio a dieta baja en carbohidratos.',
        doctor: 'Dra. López',
        valores: 'Glucosa: 145 mg/dL (Normal: 70-110)',
        icon: 'pi pi-chart-bar',
        color: '#10B981'
    },
    {
        id: 3,
        fecha: '05/06/2024',
        tipo: 'receta',
        motivo: 'Control de parásitos',
        hallazgos: 'Presencia de pulgas detectada en exploración.',
        diagnostico: 'Infestación leve por ectoparásitos',
        tratamiento: 'Pipeta antipulgas de amplio espectro.',
        doctor: 'Dr. García',
        icon: 'pi pi-ticket',
        color: '#F59E0B'
    },
    {
        id: 4,
        fecha: '10/08/2024',
        tipo: 'estudio',
        motivo: 'Radiografía de tórax',
        hallazgos: 'Sin anomalías en pulmones o corazón.',
        diagnostico: 'Normal',
        tratamiento: 'N/A',
        doctor: 'Dr. Martínez',
        icon: 'pi pi-image',
        color: '#8B5CF6'
    }
]);

const filters = ref({
    text: '',
    type: null
});

const filterOptions = ref([
    { label: 'Todos', value: null },
    { label: 'Consultas', value: 'consulta' },
    { label: 'Lab', value: 'laboratorio' },
    { label: 'Recetas', value: 'receta' },
    { label: 'Estudios', value: 'estudio' }
]);

const filteredHistorial = computed(() => {
    return historial.value.filter((item) => {
        const matchesText =
            !filters.value.text ||
            item.motivo.toLowerCase().includes(filters.value.text.toLowerCase()) ||
            item.diagnostico.toLowerCase().includes(filters.value.text.toLowerCase()) ||
            item.doctor.toLowerCase().includes(filters.value.text.toLowerCase());
        const matchesType = !filters.value.type || item.tipo === filters.value.type;
        return matchesText && matchesType;
    });
});

const exportPDF = () => {
    alert('Generando resumen médico para exportar...');
};

const internalNotes = ref('Mascota agresiva al manipular orejas. Requiere bozal preventivo.');
const showNotes = ref(false);

onMounted(async () => {
    if (route.params.id) {
        await mascotaStore.fetchDatosMascota(route.params.id);
        await historialStore.obtenerConsultasPorMascota(route.params.id);
    }
});
</script>

<template>
    <div class="grid p-4">
        <!-- 1. Header de la Mascota (Información Crítica) -->
        <div class="col-12">
            <Card v-if="mascota.id">
                <template #title>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <Button icon="pi pi-arrow-left" severity="secondary" text rounded @click="router.back()" />
                            <h2 class="font-bold text-3xl mb-0">Historial Clínico: {{ mascota.Nombre }}</h2>
                        </div>
                    </div>
                </template>
                <template #content>
                    <div class="flex justify-around items-center">
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Especie / Raza</p>
                            <p class="text-xl font-bold">{{ mascota.Especie }} / {{ mascota.Raza || 'Mestizo' }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Sexo</p>
                            <p class="text-xl font-bold">{{ mascota.Sexo }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Edad</p>
                            <p class="text-xl font-bold">{{ mascota.Edad }} años</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Peso Actual</p>
                            <p class="text-xl font-bold">{{ mascota.Peso }} Kg</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Esterilizado</p>
                            <Tag :severity="mascota.Esterilizado ? 'success' : 'info'"
                                :value="mascota.Esterilizado ? 'SÍ' : 'NO'" />
                        </div>
                    </div>
                </template>
            </Card>

            <Card v-else>
                <template #content>
                    <div class="p-4 text-center">
                        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
                        <p>Cargando información de la mascota...</p>
                    </div>
                </template>
            </Card>
        </div>

        <!-- 2. Resumen de Salud (Dashboard) -->
        <div class="col-12 mt-5">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card class="h-full border">
                    <template #title>
                        <div class="flex items-center gap-2 text-orange-500">
                            <i class="pi pi-exclamation-triangle"></i>
                            <span class="text-lg">Condiciones Crónicas</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="flex flex-wrap gap-2">
                            <Tag severity="warn" value="Diabetes Tipo I" />
                            <Tag severity="info" value="Soplo cardiaco grado I" />
                        </div>
                    </template>
                </Card>

                <Card class="h-full border">
                    <template #title>
                        <div class="flex items-center gap-2 text-green-500">
                            <i class="pi pi-shield"></i>
                            <span class="text-lg">Vacunación Pendiente</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="space-y-2">
                            <div class="flex justify-between items-center text-sm">
                                <span>Antirrábica</span>
                                <Tag severity="success" value="Al día" />
                            </div>
                            <div class="flex justify-between items-center text-sm">
                                <span>Polivalente</span>
                                <Tag severity="danger" value="Vencida" />
                            </div>
                        </div>
                    </template>
                </Card>

                <Card class="h-full border">
                    <template #title>
                        <div class="flex items-center gap-2 text-blue-500">
                            <i class="pi pi-history"></i>
                            <span class="text-lg">Última Visita</span>
                        </div>
                    </template>
                    <template #content>
                        <p class="font-bold text-lg mb-1">10 de Agosto, 2024</p>
                        <p class="text-sm text-muted-color mb-0">Motivo: Radiografía de tórax</p>
                        <p class="text-xs text-muted-color">Profesional: Dr. Martínez</p>
                    </template>
                </Card>
            </div>
        </div>

        <!-- 3. Línea de Tiempo y Filtros -->
        <div class="col-12 mt-5">
            <Card>
                <template #title>
                    <div class="flex flex-wrap justify-between items-center gap-4">
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-list" style="font-size: 1.5rem"></i>
                            <span class="font-bold white-space-nowrap">Historial de Eventos</span>
                        </div>
                        <div class="flex gap-2">
                            <Button label="Registrar Servicio" icon="pi pi-plus" severity="success"
                                @click="mostrarModalServicio = true" />
                            <Button :label="showNotes ? 'Ocultar Notas' : 'Ver Notas'"
                                :icon="showNotes ? 'pi pi-eye-slash' : 'pi pi-eye'" severity="secondary"
                                @click="showNotes = !showNotes" />
                            <Button label="Exportar a PDF" icon="pi pi-file-pdf" severity="help" @click="exportPDF" />
                        </div>
                    </div>
                </template>
                <template #content>
                    <!-- Modal para registrar servicio -->
                    <FormularioRegistrarServicio v-model:visible="mostrarModalServicio" :mascotaId="route.params.id"
                        @servicioRegistrado="alRegistrarServicio" />

                    <!-- Filtros -->
                    <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mb-6 border">
                        <div class="flex flex-wrap gap-4 items-center">
                            <IconField iconPosition="left" class="flex-grow md:flex-none">
                                <InputIcon class="pi pi-search" />
                                <InputText v-model="filters.text" placeholder="Buscar por diagnóstico o doctor..."
                                    class="w-full md:w-80" />
                            </IconField>
                            <SelectButton v-model="filters.type" :options="filterOptions" optionLabel="label"
                                optionValue="value" />
                        </div>
                    </div>

                    <!-- Notas Críticas -->
                    <div v-if="showNotes"
                        class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded shadow-sm">
                        <div class="flex items-center gap-2 mb-2 text-yellow-700 dark:text-yellow-200 font-bold">
                            <i class="pi pi-info-circle"></i>
                            <span>OBSERVACIONES MÉDICAS CRÍTICAS</span>
                        </div>
                        <p class="text-slate-700 dark:text-slate-300 italic mb-0">"{{ internalNotes }}"</p>
                    </div>

                    <!-- Timeline -->
                    <div class="mt-4 px-2">
                        <Timeline :value="filteredHistorial" class="custom-timeline">
                            <template #marker="slotProps">
                                <span
                                    class="flex w-10 h-10 items-center justify-center text-white rounded-full z-10 shadow-md"
                                    :style="{ backgroundColor: slotProps.item.color }">
                                    <i :class="slotProps.item.icon"></i>
                                </span>
                            </template>
                            <template #content="slotProps">
                                <Card class="mb-6 shadow-sm border hover:shadow-md transition-shadow">
                                    <template #title>
                                        <div class="flex flex-wrap justify-between items-center gap-2">
                                            <span class="text-xl font-bold">{{ slotProps.item.motivo }}</span>
                                            <Tag :value="slotProps.item.fecha" severity="secondary" />
                                        </div>
                                    </template>
                                    <template #subtitle>
                                        <div class="flex items-center gap-2 mt-1 text-primary">
                                            <i class="pi pi-user text-xs"></i>
                                            <span class="font-semibold">{{ slotProps.item.doctor }}</span>
                                        </div>
                                    </template>
                                    <template #content>
                                        <div class="space-y-4">
                                            <div v-if="slotProps.item.hallazgos">
                                                <p class="font-bold text-xs uppercase text-muted-color mb-1">Exploración
                                                    Física</p>
                                                <p class="text-slate-700 dark:text-slate-300">{{
                                                    slotProps.item.hallazgos }}</p>
                                            </div>

                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div
                                                    class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-4 border-blue-400">
                                                    <p
                                                        class="font-bold text-xs uppercase text-blue-600 dark:text-blue-400 mb-1">
                                                        Diagnóstico</p>
                                                    <p class="font-medium mb-0">{{ slotProps.item.diagnostico }}</p>
                                                </div>
                                                <div
                                                    class="bg-green-50 dark:bg-green-900/20 p-3 rounded border-l-4 border-green-400">
                                                    <p
                                                        class="font-bold text-xs uppercase text-green-600 dark:text-green-400 mb-1">
                                                        Tratamiento</p>
                                                    <p class="font-medium mb-0">{{ slotProps.item.tratamiento }}</p>
                                                </div>
                                            </div>

                                            <div v-if="slotProps.item.valores" class="mt-2 pt-3 border-t">
                                                <div
                                                    class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                                                    <i class="pi pi-chart-line"></i>
                                                    <span class="font-bold text-xs uppercase">Resultados de
                                                        Laboratorio</span>
                                                </div>
                                                <div class="p-3 bg-slate-900 text-slate-100 rounded font-mono text-sm">
                                                    {{ slotProps.item.valores }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template #footer>
                                        <div class="flex justify-end gap-2">
                                            <Button v-if="['receta', 'consulta'].includes(slotProps.item.tipo)"
                                                label="Imprimir Receta" icon="pi pi-print" text size="small" />
                                            <Button v-if="['laboratorio', 'estudio'].includes(slotProps.item.tipo)"
                                                label="Ver Resultados" icon="pi pi-external-link" text size="small" />
                                        </div>
                                    </template>
                                </Card>
                            </template>
                        </Timeline>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Botón de retorno -->
        <div class="col-12 mt-5 flex justify-end">
            <Button label="Volver al Inicio" icon="pi pi-arrow-left" severity="secondary"
                @click="router.push({ name: 'mi-veterinaria' })" />
        </div>
    </div>
</template>

<style scoped>
.grid {
    max-width: 1400px;
    margin: 0 auto;
}

:deep(.p-timeline-event-opposite) {
    display: none;
}

:deep(.p-card-content) {
    padding-top: 0;
}

.custom-timeline {
    margin-top: 1rem;
}
</style>
