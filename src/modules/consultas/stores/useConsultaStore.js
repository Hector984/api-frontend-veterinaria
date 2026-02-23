import { useLoadingStore } from '@/stores/useLoadingStore';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { consultasService } from '../services/consultasService';

export const useConsultaStore = defineStore('consulta', () => {
    const error = ref(null);
    const consulta = ref({
        mascotaId: null,
        motivo: '',
        sintomas: '',
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
        costo: 0,
        fechaProximaCita: null
    });

    const setDatosConsulta = () => {
        return {
            mascotaId: consulta.value.mascotaId,
            motivo: consulta.value.motivo,
            sintomas: consulta.value.sintomas || null,
            diagnostico: consulta.value.diagnostico || null,
            tratamiento: consulta.value.tratamiento || null,
            observaciones: consulta.value.observaciones || null,
            costo: consulta.value.costo || 0,
            fechaProximaCita: consulta.value.fechaProximaCita || null
        };
    };

    const registrarNuevaConsulta = async () => {
        const loadingStore = useLoadingStore();

        error.value = null;
        loadingStore.setLoading(true);

        try {
            const payload = setDatosConsulta();
            const response = await consultasService.registrarConsulta(payload);
            return response;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error al registrar la consulta';
            throw err;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const resetConsulta = () => {
        consulta.value = {
            mascotaId: null,
            motivo: '',
            sintomas: '',
            diagnostico: '',
            tratamiento: '',
            observaciones: '',
            costo: 0,
            fechaProximaCita: null
        };
    };

    return {
        consulta,
        error,
        registrarNuevaConsulta,
        resetConsulta
    };
});
