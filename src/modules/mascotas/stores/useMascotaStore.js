import { useVeterinariaStore } from '@/modules/veterinaria/stores/useVeterinariaStore.js';
import { useLoadingStore } from '@/stores/useLoadingStore.js';
import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import * as mascotaService from '../services/mascotaService.js';

export const useMascotaStore = defineStore('mascota', () => {
    const datosMascota = ref({
        id: null,
        Nombre: '',
        Especie: '',
        Sexo: '',
        Edad: 0,
        Peso: 0,
        FechaNacimiento: null,
        Observaciones: '',
        ClienteId: null,
        VeterinariaId: null
    });

    const prepararDatos = () => {
        const veterinariaStore = useVeterinariaStore();
        const clienteId = datosMascota.value.ClienteId.id;
        const datosBase = toRaw(datosMascota.value);

        return {
            ...datosBase,
            VeterinariaId: veterinariaStore.idVeterinaria,
            ClienteId: parseInt(clienteId)
        };
    };

    const seleccionarCliente = (cliente) => {
        console.log(cliente);
        datosMascota.value.ClienteId = cliente;
    };

    const fetchDatosMascota = async (id) => {
        const loadingStore = useLoadingStore();

        loadingStore.setLoading(true);
        try {
            const respuesta = await mascotaService.fetchDatosMascota(id);
            datosMascota.value = respuesta;

            return respuesta;
        } catch (error) {
            return error.response;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const registrarMascota = async () => {
        const loadingStore = useLoadingStore();
        try {
            loadingStore.setLoading(true);

            const res = await mascotaService.registrarMascota(prepararDatos());
            return res;
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

    const limpiarDatosMascota = () => {
        datosMascota.value = {
            id: null,
            Nombre: '',
            Especie: '',
            Sexo: '',
            Edad: 0,
            Peso: 0,
            FechaNacimiento: null,
            Observaciones: '',
            ClienteId: null,
            VeterinariaId: null
        };
    };

    return { fetchDatosMascota, datosMascota, registrarMascota, seleccionarCliente, limpiarDatosMascota };
});
