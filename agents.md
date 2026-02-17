# Arquitectura del Proyecto Yolcatl

Yolcatl es una aplicación para la gestión de veterinarias, construida con una arquitectura modular y orientada a componentes utilizando Vue.js.

A continuación, se detalla la estructura de directorios y la responsabilidad de cada uno.

## Estructura de Directorios Principal

```
/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── layout/
│   ├── modules/
│   ├── router/
│   ├── service/
│   ├── stores/
│   └── views/
├── .editorconfig
├── .eslintrc.cjs
├── .gitignore
├── package.json
└── vite.config.mjs
```

## Descripción de Directorios

### Directorio Raíz (`/`)

Contiene los archivos de configuración del proyecto, como:
- `vite.config.mjs`: Configuración de Vite, el bundler del proyecto.
- `package.json`: Define los scripts y dependencias de npm.
- `.eslintrc.cjs`: Reglas para el linter de JavaScript (ESLint).
- `tailwind.config.js`: Configuración de Tailwind CSS.

### `public/`

Almacena los activos estáticos que no son procesados por Vite y se copian directamente en el directorio de salida de la compilación. Aquí se encuentra el `index.html` principal y otros recursos como imágenes o fuentes.

### `src/`

Es el corazón de la aplicación y contiene todo el código fuente.

#### `src/api/`
Centraliza la configuración del cliente HTTP (Axios) para comunicarse con el backend. Define la URL base y los interceptores para el manejo de peticiones y respuestas.

#### `src/assets/`
Contiene los activos que son procesados por el sistema de compilación, como hojas de estilo globales (`styles.scss`, `tailwind.css`) y otros recursos que se importan desde los componentes.

#### `src/components/`
Alberga componentes de Vue genéricos y reutilizables en diferentes partes de la aplicación. Estos no están ligados a un módulo de negocio específico.
- **`ui/`**: Componentes de UI muy genéricos (Spinners, Cards, etc.).
- **`dashboard/`**: Widgets específicos para el dashboard principal.
- **`landing/`**: Componentes para la página de aterrizaje.

#### `src/layout/`
Define la estructura visual de la aplicación.
- **`AppLayout.vue`**: El layout principal que envuelve las vistas.
- **`AppTopbar.vue`**: La barra de navegación superior.
- **`AppSidebar.vue`**: El menú de navegación lateral.
- **`AppFooter.vue`**: El pie de página.

#### `src/modules/`
Aquí reside la lógica de negocio principal, organizada en módulos cohesivos por dominio. Esta es la base de la arquitectura por componentes. Cada módulo encapsula sus propias vistas, componentes, servicios (API calls) y stores (manejo de estado).

- **`admin/`**: Panel de administración.
- **`citas/`**: Gestión de citas.
- **`clientes/`**: Gestión de clientes.
- **`mascotas/`**: Gestión de mascotas.
- **`notificaciones/`**: Sistema de notificaciones.
- **`veterinaria/`**: Lógica de la veterinaria (información, dashboard específico).

Un módulo típico como `clientes/` tendría:
- **`components/`**: Componentes de Vue específicos para clientes.
- **`services/`**: Lógica para interactuar con la API de clientes.
- **`stores/`**: Estado global relacionado con los clientes (usando Pinia).
- **`views/`**: Vistas o páginas completas del módulo de clientes.

#### `src/router/`
Contiene la configuración de las rutas de la aplicación utilizando Vue Router. Mapea las URLs a las vistas correspondientes.

#### `src/service/`
Servicios globales o genéricos que pueden ser utilizados por cualquier componente o módulo, como un servicio de autenticación o de obtención de datos generales.

#### `src/stores/`
Almacenes de estado globales (usando Pinia) que no pertenecen a un módulo específico, como el estado de carga (`useLoadingStore.js`).

#### `src/views/`
Contiene las vistas principales o páginas de la aplicación que no forman parte de un módulo de negocio específico, como el `Dashboard.vue` general, `Landing.vue` y las páginas de autenticación. Se excluye el directorio `uikit` que contiene componentes de demostración.
