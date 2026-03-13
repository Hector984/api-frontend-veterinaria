<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ToggleSwitch from 'primevue/toggleswitch';
import { ref, watch } from 'vue';
import { useServicioExtraStore } from '../stores/useServicioExtraStore.js';

const props = defineProps({
    visible: Boolean,
    servicioParaEditar: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['update:visible', 'cerrar']);

const servicioExtraStore = useServicioExtraStore();

const formularioBase = {
    id: null,
    Nombre: '',
    Activo: true
};

const datosFormulario = ref({ ...formularioBase });
const errores = ref({});
const cargando = ref(false);

/**
 * Valida que los campos obligatorios no estén vacíos.
 */
const validarFormulario = () => {
    errores.value = {};
    if (!datosFormulario.value.Nombre || !datosFormulario.value.Nombre.trim()) {
        errores.value.Nombre = 'El nombre del servicio es obligatorio';
    }
    return Object.keys(errores.value).length === 0;
};

/**
 * Guarda los cambios, ya sea para un nuevo registro o una edición.
 */
const guardar = async () => {
    if (!validarFormulario()) return;

    cargando.value = true;
    try {
        let resultado;
        if (datosFormulario.value.id) {
            resultado = await servicioExtraStore.actualizarServicioExtra(datosFormulario.value.id, datosFormulario.value);
        } else {
            resultado = await servicioExtraStore.registrarServicioExtra(datosFormulario.value);
        }

        if (resultado) {
            cerrarModal();
        }
    } catch (error) {
        console.error('Error en la operación de guardado:', error);
    } finally {
        cargando.value = false;
    }
};

/**
 * Cierra el modal y limpia el estado.
 */
const cerrarModal = () => {
    emit('update:visible', false);
    emit('cerrar');
};

/**
 * Vigila los cambios en la prop servicioParaEditar para cargar los datos en el formulario.
 */
watch(
    () => props.servicioParaEditar,
    (nuevoServicio) => {
        if (nuevoServicio) {
            datosFormulario.value = {
                id: nuevoServicio.id,
                Nombre: nuevoServicio.nombre,
                Activo: nuevoServicio.activo
            };
        } else {
            datosFormulario.value = { ...formularioBase };
        }
        errores.value = {};
    },
    { immediate: true }
);
</script>

<template>
    <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" header="Detalles del Servicio Extra"
        :modal="true" class="p-fluid w-full max-w-md" :closable="!cargando">
        <div class="flex flex-col gap-6 pt-2">
            <!-- Campo: Nombre del Servicio -->
            <div class="flex flex-col gap-2">
                <label for="nombreServicio" class="font-semibold text-sm">Nombre del Servicio *</label>
                <InputText id="nombreServicio" v-model="datosFormulario.Nombre"
                    placeholder="Ej: Baño y Corte, Vacunación, etc." autofocus
                    :class="{ 'p-invalid': errores.Nombre }" @keyup.enter="guardar" />
                <small class="text-red-400" v-if="errores.Nombre">{{ errores.Nombre }}</small>
            </div>

            <!-- Campo: Estado (Activo/Inactivo) -->
            <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <ToggleSwitch id="estadoServicio" v-model="datosFormulario.Activo" />
                <label for="estadoServicio" class="font-medium cursor-pointer select-none">
                    Servicio {{ datosFormulario.Activo ? 'Activo' : 'Inactivo' }}
                </label>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" text @click="cerrarModal"
                    :disabled="cargando" />
                <Button label="Guardar" icon="pi pi-check" @click="guardar" :loading="cargando" severity="primary" />
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
