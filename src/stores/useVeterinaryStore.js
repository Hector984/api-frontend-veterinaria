import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useVeterinaryStore = defineStore('veterinary', () => {
    const idVeterinaria = ref(null);
    const mascotas = ref([]);
    const obtenerIdVeterinaria = computed(() => idVeterinaria.value);
    const obtenerMascotas = computed(() => mascotas.value);

    function setIdVeterinaria(id) {
        idVeterinaria.value = id;
    }

    function actualizarMascotas(nuevaMascota) {
        if (Array.isArray(nuevaMascota)) {
            mascotas.value = nuevaMascota;
        } else {
            mascotas.value.push(nuevaMascota);
        }
    }

    return { idVeterinaria, obtenerIdVeterinaria, setIdVeterinaria, obtenerMascotas, actualizarMascotas };
});
