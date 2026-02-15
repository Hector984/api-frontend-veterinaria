import { useVeterinariaStore } from '@/modules/veterinaria/stores/useVeterinariaStore.js';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import * as clientesService from '../services/clientesService.js';

export const useClienteStore = defineStore('clientes', () => {
    const clientes = reactive([]);

    const datosCliente = ref({
        Nombre: '',
        ApellidoPaterno: '',
        ApellidoMaterno: '',
        Email: '',
        Telefono: '',
        VeterinariaId: null
    });

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

    const registrarCliente = async () => {
        const loadingStore = useLoadingStore();
        try {
            const veterinariaStore = useVeterinariaStore();
            datosCliente.value.VeterinariaId = veterinariaStore.idVeterinaria;

            loadingStore.setLoading(true);

            const respuesta = await clientesService.registrarCliente(datosCliente.value);

            return respuesta;
        } catch (error) {
            if (error.response) {
                console.error('Error en el servidor:', error);
            } else {
                console.error('Error en la petición:', error);
            }
        } finally {
            loadingStore.setLoading(false);
        }
    };

    return { fetchClientesPorVeterinariaId, registrarCliente, datosCliente, clientes };
});
