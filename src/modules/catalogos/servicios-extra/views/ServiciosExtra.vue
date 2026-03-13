<script setup>
import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Tag from 'primevue/tag';
import { useConfirm } from 'primevue/useconfirm';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormularioServicioExtra from '../components/FormularioServicioExtra.vue';
import { useServicioExtraStore } from '../stores/useServicioExtraStore.js';

const route = useRoute();
const router = useRouter();
const servicioExtraStore = useServicioExtraStore();
const confirm = useConfirm();

const mostrarModal = ref(false);
const servicioSeleccionado = ref(null);

/**
 * Abre el modal para registrar un nuevo servicio.
 */
const abrirNuevo = () => {
    servicioSeleccionado.value = null;
    mostrarModal.value = true;
    router.push({ name: 'servicios-extra' });
};

/**
 * Abre el modal para editar un servicio existente.
 * @param {Object} servicio - Datos del servicio a editar.
 */
const abrirEditar = (servicio) => {
    servicioSeleccionado.value = { ...servicio };
    mostrarModal.value = true;
    router.push({ name: 'servicios-extra', params: { id: servicio.id } });
};

/**
 * Limpia el estado al cerrar el modal y restablece la URL.
 */
const alCerrarModal = () => {
    servicioSeleccionado.value = null;
    router.push({ name: 'servicios-extra' });
};

/**
 * Muestra el diálogo de confirmación para eliminar un servicio.
 * @param {Object} servicio - Datos del servicio a eliminar.
 */
const confirmarEliminar = (servicio) => {
    confirm.require({
        message: `¿Estás seguro de que deseas eliminar el servicio "${servicio.nombre}"?`,
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Eliminar',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            servicioExtraStore.eliminarServicioExtra(servicio.id);
        }
    });
};

/**
 * Formatea la fecha de registro para mostrarla en la tabla.
 */
const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
};

onMounted(async () => {
    await servicioExtraStore.cargarServiciosExtras();

    // Si la ruta contiene un ID, intentamos abrir el modal de edición
    if (route.params.id) {
        const servicio = servicioExtraStore.listaServiciosExtras.find((s) => s.id == route.params.id);
        if (servicio) {
            abrirEditar(servicio);
        }
    }
});

/**
 * Observador para la lista de servicios. Útil si el ID de la ruta llega antes
 * de que la carga inicial de datos termine.
 */
watch(
    () => servicioExtraStore.listaServiciosExtras,
    (nuevaLista) => {
        if (route.params.id && !servicioSeleccionado.value) {
            const servicio = nuevaLista.find((s) => s.id == route.params.id);
            if (servicio) {
                abrirEditar(servicio);
            }
        }
    }
);
</script>

<template>
    <div class="card p-4">
        <ConfirmDialog />

        <!-- Cabecera de la Vista -->
        <div class="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div class="flex flex-col gap-1">
                <h1 class="text-2xl font-bold text-slate-800">Servicios Extras</h1>
                <p class="text-slate-500">Configura servicios adicionales como baños, estética y vacunas.</p>
            </div>
            <Button label="Registrar Servicio" icon="pi pi-plus" severity="success" raised @click="abrirNuevo" />
        </div>

        <!-- Tabla de Datos -->
        <DataTable :value="servicioExtraStore.listaServiciosExtras" stripedRows paginator :rows="10"
            responsiveLayout="scroll" class="p-datatable-sm shadow-sm border rounded-xl overflow-hidden"
            emptyMessage="Aún no hay servicios registrados para esta veterinaria.">
            <Column field="nombre" header="Nombre" sortable class="font-semibold text-slate-700"></Column>

            <Column header="Estado" class="w-32 text-center">
                <template #body="slotProps">
                    <Tag :severity="slotProps.data.activo ? 'success' : 'danger'"
                        :value="slotProps.data.activo ? 'ACTIVO' : 'INACTIVO'" rounded />
                </template>
            </Column>

            <Column header="Acciones" class="w-32 text-center">
                <template #body="slotProps">
                    <div class="flex justify-center gap-1">
                        <Button icon="pi pi-pencil" severity="primary" text rounded @click="abrirEditar(slotProps.data)"
                            v-tooltip.top="'Editar servicio'" />
                        <Button icon="pi pi-trash" severity="danger" text rounded
                            @click="confirmarEliminar(slotProps.data)" v-tooltip.top="'Eliminar servicio'" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Modal de Formulario -->
        <FormularioServicioExtra v-model:visible="mostrarModal" :servicioParaEditar="servicioSeleccionado"
            @cerrar="alCerrarModal" />
    </div>
</template>

<style scoped>
:deep(.p-datatable-thead > tr > th) {
    background: #f8fafc;
    color: #475569;
}
</style>
