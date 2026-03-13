import api from '@/api/axios.js';

/**
 * Servicio para manejar el registro de servicios específicos realizados a una mascota.
 * Apunta a la ruta /servicios-mascota.
 */
export const servicioMascotaService = {
    /**
     * Registra un nuevo servicio realizado a una mascota.
     * @param {Object} datosServicio - Datos del servicio (MascotaId, VeterinariaId, ServicioExtraId, Nota, CostoCentavos).
     */
    registrarServicioMascota: async (datosServicio) => {
        const { data } = await api.post('servicios-mascota', datosServicio);
        return data;
    }
};

export default servicioMascotaService;
