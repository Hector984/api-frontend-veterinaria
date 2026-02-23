import api from '@/api/axios';

export const consultasService = {
    registrarConsulta: async (consulta) => {
        const { data } = await api.post('consultas', consulta);
        return data;
    }
};

export default consultasService;
