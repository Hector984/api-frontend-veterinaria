<script setup>
import { ref } from 'vue';

const form = ref({
    nombreDueno: '',
    direccion: '',
    paciente: '',
    edad: '',
    especie: '',
    peso: '',
    prescripcion: ''
});

const logoUrl = ref(null);
const fileInput = ref(null);

const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        logoUrl.value = URL.createObjectURL(file);
    }
};
</script>

<template>
    <div
        class="min-h-screen bg-[#d4d4d4] print:bg-white flex justify-center items-start py-8 print:py-0 px-4 font-['Source_Sans_3']">
        <div
            class="bg-white w-[148mm] h-[210mm] pt-8 px-9 pb-0 shadow-[0_4px_32px_rgba(0,0,0,0.18)] print:shadow-none flex flex-col relative overflow-hidden">
            <div class="flex items-center gap-5 pb-6 border-b-2 border-[#1a9a9a] mb-5">
                <div class="flex-shrink-0 cursor-pointer group relative" @click="fileInput.click()">
                    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleLogoUpload" />

                    <div v-if="logoUrl" class="w-[72px] h-[72px] rounded-full overflow-hidden border border-[#1a9a9a]">
                        <img :src="logoUrl" class="w-full h-full object-cover" alt="Logo" />
                    </div>

                    <svg v-else viewBox="0 0 80 80" class="w-[72px] h-[72px]">
                        <circle cx="40" cy="40" r="38" fill="#e8f7f7" stroke="#1a9a9a" stroke-width="1.5" />
                        <text x="40" y="48" text-anchor="middle" font-size="28" fill="#1a9a9a" font-family="serif"
                            font-weight="bold">V</text>
                        <path d="M18 22 Q30 14 40 20 Q50 14 62 22" stroke="#1a9a9a" stroke-width="2" fill="none" />
                        <path d="M18 28 Q30 20 40 26 Q50 20 62 28" stroke="#1a9a9a" stroke-width="1.5" fill="none"
                            opacity="0.6" />
                    </svg>
                    <span
                        class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1a9a9a] text-white text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 print:hidden transition-opacity">CAMBIAR</span>
                </div>

                <div class="flex-1 text-right">
                    <h1 class="font-['Lora'] text-[1.3rem] font-semibold text-[#1a9a9a] leading-[1.2]">Dr. Marcela
                        Montalván Arias</h1>
                    <p class="text-[0.82rem] text-[#555] mt-0.5 font-light tracking-wide">Médico Veterinario</p>
                    <p class="text-[0.78rem] text-[#888] mt-0.5">No. Cédula.: 13.123.456-7</p>
                </div>
            </div>

            <div class="border-[1.5px] border-[#1a9a9a] rounded-lg py-3.5 px-[18px] flex flex-col gap-2.5 mb-5">
                <div class="flex items-baseline gap-2 w-full">
                    <label class="text-[0.82rem] text-[#333] font-semibold whitespace-nowrap">Nombre Dueño:</label>
                    <input v-model="form.nombreDueno" type="text"
                        class="flex-1 border-none border-b border-[#aaa] outline-none text-[0.82rem] text-[#222] p-0.5 bg-transparent" />
                </div>
                <div class="flex items-baseline gap-2 w-full">
                    <label class="text-[0.82rem] text-[#333] font-semibold whitespace-nowrap">Dirección:</label>
                    <input v-model="form.direccion" type="text"
                        class="flex-1 border-none border-b border-[#aaa] outline-none text-[0.82rem] text-[#222] p-0.5 bg-transparent" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-baseline gap-2">
                        <label class="text-[0.82rem] text-[#333] font-semibold whitespace-nowrap">Paciente:</label>
                        <input v-model="form.paciente" type="text"
                            class="flex-1 border-none border-b border-[#aaa] outline-none text-[0.82rem] text-[#222] p-0.5 bg-transparent" />
                    </div>
                    <div class="flex items-baseline gap-2">
                        <label class="text-[0.82rem] text-[#333] font-semibold whitespace-nowrap">Edad:</label>
                        <input v-model="form.edad" type="text"
                            class="flex-1 border-none border-b border-[#aaa] outline-none text-[0.82rem] text-[#222] p-0.5 bg-transparent" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-baseline gap-2">
                        <label class="text-[0.82rem] text-[#333] font-semibold whitespace-nowrap">Especie:</label>
                        <input v-model="form.especie" type="text"
                            class="flex-1 border-none border-b border-[#aaa] outline-none text-[0.82rem] text-[#222] p-0.5 bg-transparent" />
                    </div>
                    <div class="flex items-baseline gap-2">
                        <label class="text-[0.82rem] text-[#333] font-semibold whitespace-nowrap">Peso:</label>
                        <input v-model="form.peso" type="text"
                            class="flex-1 border-none border-b border-[#aaa] outline-none text-[0.82rem] text-[#222] p-0.5 bg-transparent" />
                    </div>
                </div>
            </div>

            <div class="relative flex-1 min-h-0 mb-6">
                <span class="font-['Lora'] text-[1.1rem] font-semibold text-[#1a9a9a] block mb-2">Rp.</span>

                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] opacity-[0.2] pointer-events-none z-0">
                    <svg viewBox="0 0 200 200">
                        <ellipse cx="100" cy="140" rx="55" ry="48" fill="#e8e8e8" />
                        <ellipse cx="58" cy="95" rx="20" ry="25" fill="#e8e8e8" />
                        <ellipse cx="142" cy="95" rx="20" ry="25" fill="#e8e8e8" />
                        <ellipse cx="78" cy="72" rx="15" ry="19" fill="#e8e8e8" />
                        <ellipse cx="122" cy="72" rx="15" ry="19" fill="#e8e8e8" />
                    </svg>
                </div>

                <textarea v-model="form.prescripcion"
                    class="relative z-10 w-full h-full border-none outline-none resize-none text-[0.88rem] text-[#222] bg-transparent leading-[1.7] focus:ring-0"> </textarea>
            </div>

            <div class="flex justify-between py-6 px-4 gap-10">
                <div class="flex-1 flex flex-col items-center gap-1.5">
                    <div class="w-full border-b border-[#444]"></div>
                    <span class="text-[0.72rem] text-[#555] tracking-widest uppercase">FECHA</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1.5">
                    <div class="w-full border-b border-[#444]"></div>
                    <span class="text-[0.72rem] text-[#555] tracking-widest uppercase">FIRMA</span>
                </div>
            </div>

            <div
                class="bg-[#f4fafa] border-t border-[#cde8e8] py-3.5 px-5 flex justify-between items-center gap-4 -mx-9">
                <div class="flex flex-col gap-0.5">
                    <p class="text-[0.74rem] text-[#444]">Aguayo 139 / Playa Ancha / Valparaíso</p>
                    <p class="text-[0.74rem] text-[#1a9a9a] font-semibold">+569 9439 6296</p>
                </div>
                <div class="flex-shrink-0">
                    <div class="flex items-center gap-1.5 bg-[#1a9a9a] rounded-lg py-1.5 px-3">
                        <span class="text-[1.1rem]">🐾</span>
                        <span class="text-[0.8rem] font-semibold text-white tracking-wider">Mi App</span>
                    </div>
                </div>
            </div>
            <div class="text-center text-[0.7rem] text-[#555]">Las recetas generadas por Yolcatl respetan lo establecido en la norma NOM-064-ZOO-2000</div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Source+Sans+3:wght@300;400;600&display=swap');

/* Reglas específicas para impresión */
@media print {
    @page {
        size: A5;
        margin: 0;
    }

    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    /* Asegura que no se impriman elementos de la UI del navegador */
    .min-h-screen {
        padding: 0 !important;
        background: white !important;
    }
}

/* Estilo para que el textarea no muestre scroll en el diseño fijo */
textarea::-webkit-scrollbar {
    display: none;
}

textarea {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
