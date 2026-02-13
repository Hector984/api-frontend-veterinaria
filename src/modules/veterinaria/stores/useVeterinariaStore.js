import { useLoadingStore } from '@/stores/useLoadingStore';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import * as veterinariaService from '../services/veterinariaService';

export const useVeterinariaStore = defineStore('veterinaria', () => {
    const idVeterinaria = ref(null);
    const mascotas = ref([]);
    const datosVeterinaria = ref(null);

    // Computed
    const mostarFormularioRegistroVeterinaria = computed(() => !idVeterinaria.value);

    // Setters

    const actualizarMascotas = (nuevaMascota) => {
        if (Array.isArray(nuevaMascota)) {
            mascotas.value = nuevaMascota;
        } else {
            mascotas.value.push(nuevaMascota);
        }
    };

    // API callings
    const fetchDatosVeterinaria = async () => {
        const loadingStore = useLoadingStore();

        loadingStore.setLoading(true);
        try {
            const respuesta = await veterinariaService.fetchDatosVeterinaria();
            console.log(respuesta);
            datosVeterinaria.value = respuesta;
            idVeterinaria.value = respuesta.id;
            actualizarMascotas(datosVeterinaria.value.mascotas);
        } catch (error) {
            console.log(error);
        } finally {
            loadingStore.setLoading(false);
        }
    };

    return {
        idVeterinaria,
        mascotas,
        datosVeterinaria,
        mostarFormularioRegistroVeterinaria,
        fetchDatosVeterinaria
    };
});
