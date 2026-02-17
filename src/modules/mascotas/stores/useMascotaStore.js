import { useVeterinariaStore } from '@/modules/veterinaria/stores/useVeterinariaStore.js';
import { useLoadingStore } from '@/stores/useLoadingStore.js';
import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import * as mascotaService from '../services/mascotaService.js';
import { useClienteStore } from '@/modules/clientes/stores/useClienteStore.js';

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

    const setDatosMascota = (datos) => {
        const veterinariaStore = useVeterinariaStore();
        const veterinariaId = veterinariaStore.idVeterinaria;

        datosMascota.value.id = datos.id;
        datosMascota.value.Nombre = datos.nombre;
        datosMascota.value.Especie = datos.especie;
        datosMascota.value.Sexo = datos.sexo;
        datosMascota.value.Edad = datos.edad;
        datosMascota.value.Peso = datos.peso;
        datosMascota.value.FechaNacimiento = new Date(datos.fechaNacimiento);
        datosMascota.value.ClienteId = datos.clienteId;
        datosMascota.value.VeterinariaId = veterinariaId;
    };

    const fetchDatosMascota = async (id) => {
        const loadingStore = useLoadingStore();
        const clienteStore = useClienteStore();

        loadingStore.setLoading(true);
        try {
            const respuesta = await mascotaService.fetchDatosMascota(id);
            setDatosMascota(respuesta.data);
            clienteStore.setDatosClienteDesdeMascota(respuesta.data);

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

    return { fetchDatosMascota, datosMascota, registrarMascota, seleccionarCliente, limpiarDatosMascota, setDatosMascota };
});
