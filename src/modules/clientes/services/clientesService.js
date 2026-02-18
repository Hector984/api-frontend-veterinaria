import api from '@/api/axios.js';

export const fetchClientesPorVeterinariaId = async (id) => {
    const respuesta = await api.get(`clientes/veterinaria/${id}`);
    return respuesta;
};

export const registrarCliente = async (datos) => {
    return await api.post('clientes', datos);
};

export const actualizarCliente = async (id, datos) => {
    return await api.put(`clientes/${id}`, datos);
};
