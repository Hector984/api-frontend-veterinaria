import { useLoadingStore } from '@/stores/useLoadingStore';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import * as clientesService from '../services/clientesService.js';

export const useClienteStore = defineStore('clientes', () => {
    const clientes = reactive([]);
    const fetchClientesPorVeterinariaId = async (id) => {
        const loadingStore = useLoadingStore();
        try {
            loadingStore.setLoading(true);

            const respuesta = await clientesService.fetchClientesPorVeterinariaId(id);
            Object.assign(clientes, respuesta.data);

            return respuesta;
        } catch (error) {
            console.log(error);
            return error.response;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    return { fetchClientesPorVeterinariaId, clientes };
});
