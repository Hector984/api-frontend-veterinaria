import api from '@/api/axios';

export const historialService = {
    obtenerHistorialCompleto: async (consulta) => {
        const { data } = await api.post('consultas', consulta);
        return data;
    },
    obtenerConsultasPorMascota: async (mascotaId) => {
        const response = await api.get(`consultas/mascota/${mascotaId}`);
        return response.data;
    },
    obtenerServiciosExtra: async (consultaId) => {
        // El segundo parámetro es el body (null), el tercero es la config
        const response = await api.post(`receta/generar/${consultaId}`, null, {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default historialService;
