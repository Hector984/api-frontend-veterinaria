import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';

export const useNotificacionesStore = defineStore('notificaciones', () => {
    const toast = useToast();

    /**
     * Muestra una notificación de tipo 'success'.
     * @param {string} titulo - El título de la notificación.
     * @param {string} detalle - El mensaje detallado de la notificación.
     * @param {number} [duracion=3000] - La duración en milisegundos.
     */
    const mostrarExito = (titulo, detalle, duracion = 3000) => {
        toast.add({ severity: 'success', summary: titulo, detail: detalle, life: duracion });
    };

    /**
     * Muestra una notificación de tipo 'error'.
     * @param {string} titulo - El título de la notificación.
     * @param {string} detalle - El mensaje detallado de la notificación.
     * @param {number} [duracion=3000] - La duración en milisegundos.
     */
    const mostrarError = (titulo, detalle, duracion = 3000) => {
        toast.add({ severity: 'error', summary: titulo, detail: detalle, life: duracion });
    };

    /**
     * Muestra una notificación de tipo 'info'.
     * @param {string} titulo - El título de la notificación.
     * @param {string} detalle - El mensaje detallado de la notificación.
     * @param {number} [duracion=3000] - La duración en milisegundos.
     */
    const mostrarInfo = (titulo, detalle, duracion = 3000) => {
        toast.add({ severity: 'info', summary: titulo, detail: detalle, life: duracion });
    };

    /**
     * Muestra una notificación de tipo 'warn' (advertencia).
     * @param {string} titulo - El título de la notificación.
     * @param {string} detalle - El mensaje detallado de la notificación.
     * @param {number} [duracion=3000] - La duración en milisegundos.
     */
    const mostrarAdvertencia = (titulo, detalle, duracion = 3000) => {
        toast.add({ severity: 'warn', summary: titulo, detail: detalle, life: duracion });
    };

    return {
        mostrarExito,
        mostrarError,
        mostrarInfo,
        mostrarAdvertencia
    };
});
