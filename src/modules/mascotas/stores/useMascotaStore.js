import { useLoadingStore } from '@/stores/useLoadingStore.js';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as mascotaService from '../services/mascotaService.js';

export const useMascotaStore = defineStore('mascota', () => {
    const datosMascota = ref({
        id: null,
        nombre: '',
        especie: '',
        sexo: '',
        edad: 0,
        peso: 0,
        fechaNacimiento: null,
        observaciones: '',
        clienteId: null,
        veterinariaId: null
    });

    const editarDatosMascota = ref(false);

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

    return { fetchDatosMascota, datosMascota };
});
