import api from '@/api/axios.js';

export const fetchDatosMascota = async (id) => {
    const respuesta = await api.get(`mascotas/${id}`);
    return respuesta.data;
};
