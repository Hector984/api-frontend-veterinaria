import api from '@/api/axios.js';

/**
 * Servicio para manejar los servicios extras de la veterinaria (baños, estética, vacunas, etc.).
 * Apunta a la ruta /servicios-extra.
 */
export const servicioExtraService = {
    /**
     * Obtiene todos los servicios extras asociados a la veterinaria.
     */
    obtenerServiciosExtras: async () => {
        const { data } = await api.get('servicios-extra');
        return data;
    },

    /**
     * Registra un nuevo servicio extra.
     * @param {Object} datosServicio - Datos del nuevo servicio (Nombre, Activo, VeterinariaId).
     */
    crearServicioExtra: async (datosServicio) => {
        const { data } = await api.post('servicios-extra', datosServicio);
        return data;
    },

    /**
     * Actualiza un servicio extra existente.
     * @param {number} id - ID del servicio.
     * @param {Object} datosServicio - Datos actualizados.
     */
    actualizarServicioExtra: async (id, datosServicio) => {
        const { data } = await api.put(`servicios-extra/${id}`, datosServicio);
        return data;
    },

    /**
     * Elimina un servicio extra por su ID.
     * @param {number} id - ID del servicio.
     */
    eliminarServicioExtra: async (id) => {
        const { data } = await api.delete(`servicios-extra/${id}`);
        return data;
    }
};

export default servicioExtraService;
