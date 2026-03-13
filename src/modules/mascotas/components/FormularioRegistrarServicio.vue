<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import { onMounted, ref } from 'vue';
import { useServicioExtraStore } from '../../catalogos/servicios-extra/stores/useServicioExtraStore.js';
import { useServicioMascotaStore } from '../stores/useServicioMascotaStore.js';

const props = defineProps({
    visible: Boolean,
    mascotaId: {
        type: [Number, String],
        required: true
    }
});

const emit = defineEmits(['update:visible', 'servicioRegistrado']);

const servicioExtraStore = useServicioExtraStore();
const servicioMascotaStore = useServicioMascotaStore();

const formularioBase = {
    ServicioExtraId: null,
    Nota: '',
    Costo: 0
};

const datosFormulario = ref({ ...formularioBase });
const errores = ref({});
const cargando = ref(false);

const limiteNota = 255;

/**
 * Valida que los campos requeridos no estén vacíos.
 */
const validarFormulario = () => {
    errores.value = {};
    if (!datosFormulario.value.ServicioExtraId) {
        errores.value.ServicioExtraId = 'Debes seleccionar un tipo de servicio';
    }
    if (!datosFormulario.value.Nota || !datosFormulario.value.Nota.trim()) {
        errores.value.Nota = 'La nota es obligatoria';
    } else if (datosFormulario.value.Nota.length > limiteNota) {
        errores.value.Nota = `La nota no puede exceder los ${limiteNota} caracteres`;
    }
    if (datosFormulario.value.Costo === null || datosFormulario.value.Costo < 0) {
        errores.value.Costo = 'El costo debe ser mayor o igual a 0';
    }
    return Object.keys(errores.value).length === 0;
};

/**
 * Envía los datos del formulario al store.
 */
const guardarServicio = async () => {
    if (!validarFormulario()) return;

    cargando.value = true;
    try {
        const payload = {
            ...datosFormulario.value,
            MascotaId: parseInt(props.mascotaId)
        };
        
        const exito = await servicioMascotaStore.registrarServicioMascota(payload);
        if (exito) {
            cerrarModal();
            emit('servicioRegistrado');
        }
    } catch (error) {
        console.error('Error al guardar el servicio de la mascota:', error);
    } finally {
        cargando.value = false;
    }
};

/**
 * Cierra el modal y restablece el formulario.
 */
const cerrarModal = () => {
    datosFormulario.value = { ...formularioBase };
    errores.value = {};
    emit('update:visible', false);
};

onMounted(async () => {
    if (servicioExtraStore.listaServiciosExtras.length === 0) {
        await servicioExtraStore.cargarServiciosExtras();
    }
});
</script>

<template>
    <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" header="Registrar Servicio Extra"
        :modal="true" class="p-fluid w-full max-w-md" :closable="!cargando" @hide="cerrarModal">
        <div class="flex flex-col gap-6 pt-2">
            <!-- Selector: Tipo de Servicio (Con búsqueda) -->
            <div class="flex flex-col gap-2">
                <label for="tipoServicio" class="font-semibold text-sm">Tipo de Servicio *</label>
                <Select id="tipoServicio" v-model="datosFormulario.ServicioExtraId" 
                    :options="servicioExtraStore.listaServiciosExtras" 
                    optionLabel="nombre" 
                    optionValue="id"
                    placeholder="Selecciona un servicio (Baño, Estética, etc.)" 
                    filter 
                    :class="{ 'p-invalid': errores.ServicioExtraId }"
                    emptyFilterMessage="No se encontraron servicios" />
                <small class="text-red-400" v-if="errores.ServicioExtraId">{{ errores.ServicioExtraId }}</small>
            </div>

            <!-- Campo: Nota -->
            <div class="flex flex-col gap-2">
                <label for="notaServicio" class="font-semibold text-sm">Nota / Observación *</label>
                <Textarea id="notaServicio" v-model="datosFormulario.Nota" rows="4" autoResize 
                    placeholder="Detalles sobre el servicio realizado..." 
                    :maxlength="limiteNota"
                    :class="{ 'p-invalid': errores.Nota }" />
                <div class="flex justify-between mt-1">
                    <small class="text-red-400" v-if="errores.Nota">{{ errores.Nota }}</small>
                    <small class="text-slate-500 ml-auto">{{ datosFormulario.Nota.length }}/{{ limiteNota }} caracteres</small>
                </div>
            </div>

            <!-- Campo: Costo -->
            <div class="flex flex-col gap-2">
                <label for="costoServicio" class="font-semibold text-sm">Costo del Servicio *</label>
                <InputNumber id="costoServicio" v-model="datosFormulario.Costo" mode="currency" 
                    currency="MXN" locale="es-MX" :min="0"
                    placeholder="$ 0.00" 
                    :class="{ 'p-invalid': errores.Costo }" />
                <small class="text-red-400" v-if="errores.Costo">{{ errores.Costo }}</small>
                <small class="text-slate-400 italic text-xs">Se registrará en centavos internamente.</small>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2 pt-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" text @click="cerrarModal"
                    :disabled="cargando" />
                <Button label="Registrar Servicio" icon="pi pi-check" @click="guardarServicio" :loading="cargando" severity="success" raised />
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
/* Asegura que el dropdown no se vea recortado */
:deep(.p-select) {
    width: 100%;
}
</style>
