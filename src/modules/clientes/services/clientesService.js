import api from '@/api/axios.js';

export const fetchClientesPorVeterinariaId = async (id) => {
    const respuesta = await api.get(`clientes/veterinaria/${id}`);
    return respuesta;
};
