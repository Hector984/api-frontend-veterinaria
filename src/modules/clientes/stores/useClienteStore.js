import { useLoadingStore } from '@/stores/useLoadingStore';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import * as clientesService from '../services/clientesService.js';
import { useVeterinariaStore } from '@/modules/veterinaria/stores/useVeterinariaStore.js';

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
            // if (!formularioValido.value) {
            //     mostrarErroresFormulario();
            //     toast.add({ severity: 'error', summary: 'Error', detail: 'El formulario tiene errores.', life: 3000 });
            //     return;
            // }
            const veterinariaStore = useVeterinariaStore();
            datosCliente.value.VeterinariaId = veterinariaStore.idVeterinaria;

            loadingStore.setLoading(true);

            const respuesta = await clientesService.registrarCliente(datosCliente.value);
            console.log(respuesta);
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
