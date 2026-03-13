<script setup>
import { useMascotaStore } from '@/modules/mascotas/stores/useMascotaStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConsultaStore } from '../stores/useConsultaStore';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const mascotaStore = useMascotaStore();
const consultaStore = useConsultaStore();

const formErrors = ref({
    motivo: false,
    sintomas: false,
    diagnostico: false,
    tratamiento: false,
    observaciones: false,
    costo: false,
    fechaProximaCita: false
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
    formErrors.value.sintomas = !consultaStore.consulta.sintomas || consultaStore.consulta.sintomas.length > limits.sintomas;
    formErrors.value.diagnostico = !consultaStore.consulta.diagnostico || consultaStore.consulta.diagnostico.length > limits.diagnostico;
    formErrors.value.tratamiento = !consultaStore.consulta.tratamiento || consultaStore.consulta.tratamiento.length > limits.tratamiento;
    formErrors.value.observaciones = !consultaStore.consulta.observaciones && consultaStore.consulta.observaciones.length > limits.observaciones;
    formErrors.value.costo = !consultaStore.consulta.costo < 0;

    return !formErrors.value.motivo && !formErrors.value.costo && !formErrors.value.sintomas && !formErrors.value.diagnostico && !formErrors.value.tratamiento && !formErrors.value.observaciones;
};

const campoTocado = (campo) => {
    formErrors.value[campo] = true;
    validarCamposFormulario(campo);
};

const validarCampoTiempoReal = (campo) => {
    if (formErrors.value[campo]) {
        validarCamposFormulario(campo);
    }
};

const validarCamposFormulario = (campo) => {
    switch (campo) {
        case 'motivo':
            formErrors.value.motivo = !consultaStore.consulta.motivo || consultaStore.consulta.motivo.length > limits.motivo;
            break;
        case 'sintomas':
            formErrors.value.sintomas = !consultaStore.consulta.sintomas || consultaStore.consulta.sintomas.length > limits.sintomas;
            break;
        case 'diagnostico':
            formErrors.value.diagnostico = !consultaStore.consulta.diagnostico || consultaStore.consulta.diagnostico.length > limits.diagnostico;
            break;
        case 'tratamiento':
            formErrors.value.tratamiento = !consultaStore.consulta.tratamiento || consultaStore.consulta.tratamiento.length > limits.tratamiento;
            break;
        case 'observaciones':
            formErrors.value.observaciones = consultaStore.consulta.observaciones && consultaStore.consulta.observaciones.length > limits.observaciones;
            break;
        case 'costo':
            formErrors.value.costo = consultaStore.consulta.costo < 0;
            break;
        case 'fechaProximaCita':
            // eslint-disable-next-line no-case-declarations
            const seleccionada = new Date(consultaStore.consulta.fechaProximaCita);

            // 2. Obtenemos el "Hoy" local y le quitamos horas, minutos y segundos
            // eslint-disable-next-line no-case-declarations
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            formErrors.value.fechaProximaCita = seleccionada <= hoy;
            break;
    }
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
        const response = await consultaStore.registrarNuevaConsulta();

        // Mensaje 1: Registro exitoso
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Consulta registrada correctamente',
            life: 5000
        });

        // Mensaje 2: Generando receta (sin eliminar el anterior)
        toast.add({
            severity: 'info',
            summary: 'Receta Médica',
            detail: 'Generando receta para imprimir...',
            life: 5000
        });

        if (response && response.id) {
            try {
                const blob = await consultaStore.generarReceta(response.id);

                // Validar que realmente sea un Blob
                if (!(blob instanceof Blob)) {
                    throw new Error('La respuesta del servidor no es un archivo válido.');
                }

                const url = window.URL.createObjectURL(blob);

                // Abrir en nueva ventana/pestaña
                const nuevaVentana = window.open(url, '_blank');
                // Intentar sugerir tamaño A5 al visor (opcional, limitado por el navegador)
                if (nuevaVentana) {
                    nuevaVentana.focus();
                }

                // Limpiar URL después de un tiempo para liberar memoria
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                }, 10000);
            } catch (err) {
                toast.add({
                    severity: 'error',
                    summary: 'Error Receta',
                    detail: consultaStore.error || 'No se pudo generar el archivo de la receta.',
                    life: 4000
                });
            }
        }

        consultaStore.resetConsulta();
        router.push({ name: 'mi-veterinaria' });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: consultaStore.error || 'No se pudo registrar la consulta',
            life: 5000
        });
    }
};

const formularioValido = computed(() => {
    const camposRequeridosLlenos = consultaStore.consulta.motivo && consultaStore.consulta.sintomas && consultaStore.consulta.diagnostico && consultaStore.consulta.tratamiento && consultaStore.consulta.costo;
    const formularioSinErrores =
        !formErrors.value.motivo && !formErrors.value.costo && !formErrors.value.sintomas && !formErrors.value.diagnostico && !formErrors.value.tratamiento && !formErrors.value.observaciones && !formErrors.value.fechaProximaCita;

    return camposRequeridosLlenos && formularioSinErrores;
});

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
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <Button icon="pi pi-arrow-left" severity="secondary" text rounded @click="router.back()" />
                            <h2 class="font-bold text-3xl mb-0">Nueva Consulta: {{ mascotaStore.datosMascota.Nombre }}
                            </h2>
                        </div>
                    </div>
                </template>
                <template #content>
                    <div class="flex justify-around items-center">
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Especie / Raza</p>
                            <p class="text-xl font-bold">{{ mascotaStore.datosMascota.Especie }} / {{ 'Mestizo' }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Sexo</p>
                            <p class="text-xl font-bold">{{ mascotaStore.datosMascota.Sexo }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Edad</p>
                            <p class="text-xl font-bold">{{ mascotaStore.datosMascota.Edad }} años</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Peso Actual</p>
                            <p class="text-xl font-bold">{{ mascotaStore.datosMascota.Peso }} Kg</p>
                        </div>
                        <!-- <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Esterilizado</p>
                            <Tag :severity="mascota.Esterilizado ? 'success' : 'info'"
                                :value="mascota.Esterilizado ? 'SÍ' : 'NO'" />
                        </div> -->
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
                                    @blur="campoTocado('motivo')" @input="validarCampoTiempoReal('motivo')"
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
                                <label for="sintomas" class="font-semibold"
                                    :class="{ 'text-red-500': formErrors.sintomas }">Síntomas *</label>
                                <Textarea id="sintomas" v-model="consultaStore.consulta.sintomas" rows="3" autoResize
                                    :maxlength="limits.sintomas" @blur="campoTocado('sintomas')"
                                    @input="validarCampoTiempoReal('sintomas')"
                                    :class="{ 'p-invalid': formErrors.sintomas }" />
                                <div class="text-right">
                                    <small class="text-red-500" v-if="formErrors.sintomas">Los sintomas son obligatorios
                                        y no deben exceder los {{ limits.sintomas }} caracteres.</small>
                                    <small class="text-gray-500">{{ consultaStore.consulta.sintomas?.length || 0 }}/{{
                                        limits.sintomas }} caracteres</small>
                                </div>
                            </div>

                            <!-- Diagnóstico -->
                            <div class="field col-12 md:col-6">
                                <label for="diagnostico" class="font-semibold"
                                    :class="{ 'text-red-500': formErrors.diagnostico }">Diagnóstico *</label>
                                <Textarea id="diagnostico" v-model="consultaStore.consulta.diagnostico" rows="3"
                                    autoResize :maxlength="limits.diagnostico"
                                    :class="{ 'p-invalid': formErrors.diagnostico }" @blur="campoTocado('diagnostico')"
                                    @input="validarCampoTiempoReal('diagnostico')" />
                                <div class="text-right">
                                    <small class="text-red-500" v-if="formErrors.diagnostico">El diagnostico es
                                        obligatorio y no debe exceder los {{ limits.diagnostico }} caracteres.</small>
                                    <small class="text-gray-500">{{ consultaStore.consulta.diagnostico?.length || 0
                                        }}/{{ limits.diagnostico }} caracteres</small>
                                </div>
                            </div>

                            <!-- Tratamiento -->
                            <div class="field col-12">
                                <label for="tratamiento" class="font-semibold"
                                    :class="{ 'text-red-500': formErrors.tratamiento }">Tratamiento *</label>
                                <Textarea id="tratamiento" v-model="consultaStore.consulta.tratamiento" rows="3"
                                    autoResize :maxlength="limits.tratamiento"
                                    :class="{ 'p-invalid': formErrors.tratamiento }" @blur="campoTocado('tratamiento')"
                                    @input="validarCampoTiempoReal('tratamiento')" />
                                <div class="text-right">
                                    <small class="text-red-500" v-if="formErrors.tratamiento">El tratamiento es
                                        obligatorio y no debe exceder los {{ limits.tratamiento }} caracteres.</small>
                                    <small class="text-gray-500">{{ consultaStore.consulta.tratamiento?.length || 0
                                        }}/{{ limits.tratamiento }} caracteres</small>
                                </div>
                            </div>

                            <!-- Observaciones -->
                            <div class="field col-12">
                                <label for="observaciones" class="font-semibold"
                                    :class="{ 'text-red-500': formErrors.observaciones }">Observaciones</label>
                                <Textarea id="observaciones" v-model="consultaStore.consulta.observaciones" rows="2"
                                    autoResize :maxlength="limits.observaciones"
                                    :class="{ 'p-invalid': formErrors.observaciones }"
                                    @blur="campoTocado('observaciones')"
                                    @input="validarCampoTiempoReal('observaciones')" />
                                <div class="text-right">
                                    <small class="text-red-500" v-if="formErrors.observaciones">Las observaciones no
                                        deben exceder los {{ limits.observaciones }} caracteres.</small>
                                    <small class="text-gray-500">{{ consultaStore.consulta.observaciones?.length || 0
                                        }}/{{ limits.observaciones }} caracteres</small>
                                </div>
                            </div>

                            <!-- Costo -->
                            <div class="field col-12 md:col-6">
                                <label for="costo" class="font-semibold"
                                    :class="{ 'text-red-500': formErrors.costo }">Costo *</label>
                                <InputNumber id="costo" v-model="consultaStore.consulta.costo" mode="currency"
                                    currency="MXN" locale="es-MX" :min="0" fluid
                                    :class="{ 'p-invalid': formErrors.costo }" @blur="campoTocado('costo')"
                                    @input="validarCampoTiempoReal('costo')" />
                                <small class="text-red-500" v-if="formErrors.costo">El costo debe ser un valor
                                    positivo.</small>
                            </div>

                            <!-- Próxima Cita -->
                            <div class="field col-12 md:col-6">
                                <label for="proximaCita" class="font-semibold"
                                    :class="{ 'text-red-500': formErrors.fechaProximaCita }">Fecha Próxima Cita</label>
                                <DatePicker id="proximaCita" v-model="consultaStore.consulta.fechaProximaCita" showIcon
                                    fluid iconDisplay="input" dateFormat="dd/mm/yy" :minDate="new Date()"
                                    :class="{ 'p-invalid': formErrors.fechaProximaCita }"
                                    @blur="campoTocado('fechaProximaCita')"
                                    @change="validarCampoTiempoReal('fechaProximaCita')" />
                                <small class="text-red-500" v-if="formErrors.fechaProximaCita">La fecha de próxima cita
                                    debe ser mayor a la fecha actual.</small>
                            </div>
                        </div>
                    </Fluid>
                </template>
                <template #footer>
                    <div class="flex justify-end gap-2">
                        <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="router.back()" />
                        <Button label="Registrar Consulta" icon="pi pi-check" :disabled="!formularioValido"
                            @click="guardarConsulta" />
                    </div>
                </template>
            </Card>
        </div>

        <!-- Botón de retorno -->
        <div class="col-12 mt-5 flex justify-end">
            <Button label="Volver al Inicio" icon="pi pi-arrow-left" severity="secondary"
                @click="router.push({ name: 'mi-veterinaria' })" />
        </div>
    </div>
</template>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}
</style>
