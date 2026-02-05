import api from '@/api/axios.js';

export const fetchDatosVeterinaria = async () => {
    const respuesta = await api.get('veterinarias/mi-veterinaria');
    return respuesta.data;
};
