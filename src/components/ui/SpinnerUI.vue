<script setup>
import ProgressSpinner from 'primevue/progressspinner';

defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        default: ''
    }
});
</script>

<template>
    <div v-if="visible" class="spinner-overlay">
        <div class="spinner-content">
            <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" fill="transparent" animationDuration="1s" />
            <p v-if="message" class="mt-3 text-white font-semibold">{{ message }}</p>
        </div>
    </div>
</template>

<style scoped>
.spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.spinner-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
