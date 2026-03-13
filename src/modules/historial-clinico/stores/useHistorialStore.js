import { useLoadingStore } from '@/stores/useLoadingStore';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { historialService } from '../services/historialService';

export const useHistorialStore = defineStore('historialStore', () => {
    const consultasMascota = ref(null);
    const error = ref(null);

    var obtenerConsultasPorMascota = async (id) => {
        // const mascotaStore = useMascotaStore();
        const loadingStore = useLoadingStore();

        loadingStore.setLoading(true);

        try {
            consultasMascota.value = await historialService.obtenerConsultasPorMascota(id);
        } catch (err) {
            error.value = 'Error al generar la receta médica';
            throw err;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    return {
        obtenerConsultasPorMascota
    };
});
