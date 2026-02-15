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

    const editarDatosMascota = ref(false);

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
        editarDatosMascota.value = false;

        loadingStore.setLoading(true);
        try {
            const respuesta = await mascotaService.fetchDatosMascota(id);
            datosMascota.value = respuesta;
            editarDatosMascota.value = true;

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
            // if (!formularioValido.value) {
            //     mostrarErroresFormulario();
            //     toast.add({ severity: 'error', summary: 'Error', detail: 'El formulario tiene errores.', life: 3000 });
            //     return;
            // }

            loadingStore.setLoading(true);

            if (editarDatosMascota.value) {
                await mascotaService.actualizarMascota(datosMascota.value.id, prepararDatos());
                // toast.add({ severity: 'success', summary: 'Exito', detail: 'Información actualizada.', life: 3000 });
                // limpiarFormulario();
            } else {
                const res = await mascotaService.registrarMascota(prepararDatos());
                console.log(res.data);
                // actualizarMascotas(res.data);
                // toast.add({ severity: 'success', summary: 'Exito', detail: 'Mascota registrada.', life: 3000 });
                // limpiarFormulario();
            }
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

    return { fetchDatosMascota, datosMascota, editarDatosMascota, registrarMascota, seleccionarCliente };
});
