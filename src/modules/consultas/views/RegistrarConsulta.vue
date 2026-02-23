<script setup>
import { useMascotaStore } from '@/modules/mascotas/stores/useMascotaStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConsultaStore } from '../stores/useConsultaStore';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const mascotaStore = useMascotaStore();
const consultaStore = useConsultaStore();
const loadingStore = useLoadingStore();

const formErrors = ref({
    motivo: false,
    costo: false
});

const limits = {
    motivo: 255,
    sintomas: 1000,
    diagnostico: 1000,
    tratamiento: 2000,
    observaciones: 1000
};

const validateForm = () => {
    formErrors.value.motivo = !consultaStore.consulta.motivo || consultaStore.consulta.motivo.length > limits.motivo;
    formErrors.value.costo = consultaStore.consulta.costo < 0;

    return !formErrors.value.motivo && !formErrors.value.costo;
};

const fetchDatosMascota = async () => {
    const mascotaId = route.params.id;
    if (mascotaId) {
        await mascotaStore.fetchDatosMascota(mascotaId);
        consultaStore.consulta.mascotaId = parseInt(mascotaId);
    }
};

const guardarConsulta = async () => {
    if (!validateForm()) {
        toast.add({
            severity: 'warn',
            summary: 'Validación',
            detail: 'Por favor, revise los campos obligatorios y sus límites.',
            life: 3000
        });
        return;
    }

    try {
        await consultaStore.registrarNuevaConsulta();
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Consulta registrada correctamente',
            life: 3000
        });
        consultaStore.resetConsulta();
        router.push({ name: 'mi-veterinaria' });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: consultaStore.error || 'No se pudo registrar la consulta',
            life: 3000
        });
    }
};

onMounted(async () => {
    consultaStore.resetConsulta();
    await fetchDatosMascota();
});
</script>

<template>
    <Toast />
    <div class="grid">
        <!-- Header de la Mascota -->
        <div class="col-12">
            <Card v-if="mascotaStore.datosMascota.id">
                <template #title>
                    <div class="flex items-center gap-4">
                        <div>
                            <h2 class="font-bold text-3xl mb-0">Registrar Consulta: {{ mascotaStore.datosMascota.Nombre
                                }}</h2>
                        </div>
                    </div>
                </template>
                <template #content>
                    <div class="flex justify-around">
                        <div class="text-center">
                            <p class="font-semibold text-lg">Especie</p>
                            <p>{{ mascotaStore.datosMascota.Especie }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg">Sexo</p>
                            <p>{{ mascotaStore.datosMascota.Sexo }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg">Edad</p>
                            <p>{{ mascotaStore.datosMascota.Edad }} años</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg">Peso</p>
                            <p>{{ mascotaStore.datosMascota.Peso }} Kg</p>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Formulario de Consulta -->
        <div class="col-12 mt-5">
            <Card>
                <template #title>
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-file-edit" style="font-size: 1.5rem"></i>
                        <span class="font-bold">Detalles de la Consulta</span>
                    </div>
                </template>
                <template #content>
                    <Fluid>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Motivo (Requerido) -->
                            <div class="field col-12">
                                <label for="motivo" class="font-semibold"
                                    :class="{ 'text-red-500': formErrors.motivo }">Motivo de la Consulta *</label>
                                <InputText id="motivo" v-model="consultaStore.consulta.motivo"
                                    placeholder="Ej. Control de rutina, Malestar estomacal..."
                                    :maxlength="limits.motivo" :class="{ 'p-invalid': formErrors.motivo }" />
                                <div class="flex justify-between mt-1">
                                    <small class="text-red-500" v-if="formErrors.motivo">El motivo es obligatorio y no
                                        debe exceder los 255 caracteres.</small>
                                    <small class="text-gray-500 ml-auto">{{ consultaStore.consulta.motivo.length }}/{{
                                        limits.motivo }} caracteres</small>
                                </div>
                            </div>

                            <!-- Síntomas -->
                            <div class="field col-12 md:col-6">
                                <label for="sintomas" class="font-semibold">Síntomas</label>
                                <Textarea id="sintomas" v-model="consultaStore.consulta.sintomas" rows="3" autoResize
                                    :maxlength="limits.sintomas" />
                                <div class="text-right">
                                    <small class="text-gray-500">{{ consultaStore.consulta.sintomas?.length || 0 }}/{{
                                        limits.sintomas }} caracteres</small>
                                </div>
                            </div>

                            <!-- Diagnóstico -->
                            <div class="field col-12 md:col-6">
                                <label for="diagnostico" class="font-semibold">Diagnóstico</label>
                                <Textarea id="diagnostico" v-model="consultaStore.consulta.diagnostico" rows="3"
                                    autoResize :maxlength="limits.diagnostico" />
                                <div class="text-right">
                                    <small class="text-gray-500">{{ consultaStore.consulta.diagnostico?.length || 0
                                        }}/{{ limits.diagnostico }} caracteres</small>
                                </div>
                            </div>

                            <!-- Tratamiento -->
                            <div class="field col-12">
                                <label for="tratamiento" class="font-semibold">Tratamiento</label>
                                <Textarea id="tratamiento" v-model="consultaStore.consulta.tratamiento" rows="3"
                                    autoResize :maxlength="limits.tratamiento" />
                                <div class="text-right">
                                    <small class="text-gray-500">{{ consultaStore.consulta.tratamiento?.length || 0
                                        }}/{{ limits.tratamiento }} caracteres</small>
                                </div>
                            </div>

                            <!-- Observaciones -->
                            <div class="field col-12">
                                <label for="observaciones" class="font-semibold">Observaciones</label>
                                <Textarea id="observaciones" v-model="consultaStore.consulta.observaciones" rows="2"
                                    autoResize :maxlength="limits.observaciones" />
                                <div class="text-right">
                                    <small class="text-gray-500">{{ consultaStore.consulta.observaciones?.length || 0
                                        }}/{{ limits.observaciones }} caracteres</small>
                                </div>
                            </div>

                            <!-- Costo -->
                            <div class="field col-12 md:col-6">
                                <label for="costo" class="font-semibold"
                                    :class="{ 'text-red-500': formErrors.costo }">Costo</label>
                                <InputNumber id="costo" v-model="consultaStore.consulta.costo" mode="currency"
                                    currency="MXN" locale="es-MX" :min="0" fluid
                                    :class="{ 'p-invalid': formErrors.costo }" />
                                <small class="text-red-500" v-if="formErrors.costo">El costo debe ser un valor
                                    positivo.</small>
                            </div>

                            <!-- Próxima Cita -->
                            <div class="field col-12 md:col-6">
                                <label for="proximaCita" class="font-semibold">Fecha Próxima Cita</label>
                                <DatePicker id="proximaCita" v-model="consultaStore.consulta.fechaProximaCita" showIcon
                                    fluid iconDisplay="input" dateFormat="dd/mm/yy" :minDate="new Date()" />
                            </div>
                        </div>
                    </Fluid>
                </template>
                <template #footer>
                    <div class="flex justify-end gap-2">
                        <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="router.back()" />
                        <Button label="Registrar Consulta" icon="pi pi-check"
                            :disabled="!consultaStore.consulta.motivo || formErrors.costo" @click="guardarConsulta" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}
</style>
