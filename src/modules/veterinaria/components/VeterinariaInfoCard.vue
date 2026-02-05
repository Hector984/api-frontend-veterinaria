<script setup>
const props = defineProps({
    datosVeterinaria: {
        type: Object,
        default: null
    }
});

defineEmits(['abrir-formulario-mascota']);
</script>
<template>
    <div class="col-span-12 lg:col-span-12 xl:col-span-12 mx-auto">
        <CardInfo :information="props.datosVeterinaria">
            <Button icon="pi pi-plus" rounded severity="secondary" @click="$emit('abrir-formulario-mascota')" />
            <Button icon="pi pi-heart" rounded severity="secondary" />
            <Button icon="pi pi-list" rounded severity="secondary" />
        </CardInfo>
    </div>
</template>
