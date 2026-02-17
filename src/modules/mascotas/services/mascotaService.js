import api from '@/api/axios.js';

export const fetchDatosMascota = async (id) => {
    return await api.get(`mascotas/${id}`);
};

export const registrarMascota = async (datos) => {
    return await api.post('mascotas', datos);
};

export const actualizarMascota = async (id, datos) => {
    return await api.put(`mascotas/${id}`, datos);
};
