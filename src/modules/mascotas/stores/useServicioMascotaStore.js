import { useVeterinariaStore } from '@/modules/veterinaria/stores/useVeterinariaStore.js';
import { useLoadingStore } from '@/stores/useLoadingStore.js';
import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { servicioMascotaService } from '../services/servicioMascotaService.js';

export const useServicioMascotaStore = defineStore('serviciosMascota', () => {
    const veterinariaStore = useVeterinariaStore();
    const loadingStore = useLoadingStore();
    const toast = useToast();

    /**
     * Registra un nuevo servicio realizado a la mascota.
     * Realiza la conversión de costo a centavos antes de enviar.
     * @param {Object} datosRegistro - Datos: MascotaId, ServicioExtraId, Nota, Costo.
     */
    const registrarServicioMascota = async (datosRegistro) => {
        loadingStore.setLoading(true);
        try {
            // Conversión de costo a centavos para integridad financiera según el estándar del proyecto
            const costoEnCentavos = Math.round(datosRegistro.Costo * 100);

            const payload = {
                MascotaId: datosRegistro.MascotaId,
                VeterinariaId: veterinariaStore.idVeterinaria,
                ServicioExtraId: datosRegistro.ServicioExtraId,
                Nota: datosRegistro.Nota,
                Costo: costoEnCentavos
            };

            await servicioMascotaService.registrarServicioMascota(payload);
            
            toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Servicio registrado correctamente en el historial',
                life: 3000
            });
            return true;
        } catch (error) {
            console.error('Error al registrar el servicio de la mascota:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo registrar el servicio de la mascota',
                life: 3000
            });
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    return {
        registrarServicioMascota
    };
});
