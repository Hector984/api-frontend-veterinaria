import api from '@/api/axios';

export const consultasService = {
    registrarConsulta: async (consulta) => {
        const { data } = await api.post('consultas', consulta);
        return data;
    },
    generarReceta: async (consultaId) => {
        // El segundo parámetro es el body (null), el tercero es la config
        const response = await api.post(`receta/generar/${consultaId}`, null, {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default consultasService;
