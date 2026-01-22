import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useVeterinaryStore = defineStore('veterinary', () => {
    const idVeterinaria = ref(null);
    const obtenerIdVeterinaria = computed(() => idVeterinaria.value);

    function setIdVeterinaria(id) {
        idVeterinaria.value = id;
    }

    return { idVeterinaria, obtenerIdVeterinaria, setIdVeterinaria };
});
