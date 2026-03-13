import { useVeterinariaStore } from '@/modules/veterinaria/stores/useVeterinariaStore.js';
import { useLoadingStore } from '@/stores/useLoadingStore.js';
import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { servicioExtraService } from '../services/servicioExtraService.js';

export const useServicioExtraStore = defineStore('serviciosExtras', () => {
    const listaServiciosExtras = ref([]);
    const veterinariaStore = useVeterinariaStore();
    const loadingStore = useLoadingStore();
    const toast = useToast();

    /**
     * Carga todos los servicios extras asociados a la veterinaria actual.
     */
    const cargarServiciosExtras = async () => {
        loadingStore.setLoading(true);
        try {
            const data = await servicioExtraService.obtenerServiciosExtras();
            listaServiciosExtras.value = data || [];
        } catch (error) {
            console.error('Error al cargar los servicios extras:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los servicios extras',
                life: 3000
            });
        } finally {
            loadingStore.setLoading(false);
        }
    };

    /**
     * Registra un nuevo servicio extra.
     * @param {Object} nuevoServicio - Datos del nuevo servicio extra.
     */
    const registrarServicioExtra = async (nuevoServicio) => {
        loadingStore.setLoading(true);
        try {
            const payload = {
                ...nuevoServicio,
                VeterinariaId: veterinariaStore.idVeterinaria
            };
            await servicioExtraService.crearServicioExtra(payload);
            toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Servicio extra registrado correctamente',
                life: 3000
            });
            await cargarServiciosExtras();
            return true;
        } catch (error) {
            console.error('Error al registrar el servicio extra:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo registrar el servicio extra',
                life: 3000
            });
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    /**
     * Actualiza un servicio extra existente.
     * @param {number} id - El ID del servicio.
     * @param {Object} datosActualizados - Nuevos datos para el servicio.
     */
    const actualizarServicioExtra = async (id, datosActualizados) => {
        loadingStore.setLoading(true);
        try {
            await servicioExtraService.actualizarServicioExtra(id, datosActualizados);
            toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Servicio extra actualizado correctamente',
                life: 3000
            });
            await cargarServiciosExtras();
            return true;
        } catch (error) {
            console.error('Error al actualizar el servicio extra:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el servicio extra',
                life: 3000
            });
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    /**
     * Elimina (o da de baja) un servicio extra por su ID.
     * @param {number} id - El ID del servicio.
     */
    const eliminarServicioExtra = async (id) => {
        loadingStore.setLoading(true);
        try {
            await servicioExtraService.eliminarServicioExtra(id);
            toast.add({
                severity: 'success',
                summary: 'Eliminado',
                detail: 'El servicio extra ha sido eliminado correctamente',
                life: 3000
            });
            await cargarServiciosExtras();
            return true;
        } catch (error) {
            console.error('Error al eliminar el servicio extra:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el servicio extra',
                life: 3000
            });
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    return {
        listaServiciosExtras,
        cargarServiciosExtras,
        registrarServicioExtra,
        actualizarServicioExtra,
        eliminarServicioExtra
    };
});
