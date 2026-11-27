# Sistema de Préstamo de Material Deportivo – Web

Aplicación web desarrollada con React y Vite para administrar el inventario y gestionar préstamos de material deportivo de la Universidad Tecnológica El Retoño (UTR).

## Tecnologías utilizadas

- React
- Vite
- React Router DOM
- JavaScript
- CSS
- Fetch API
- LocalStorage

## Funcionalidades

### Usuarios
- Registro e inicio de sesión.
- Consulta del inventario deportivo.
- Filtrado de materiales por deporte y disponibilidad.
- Solicitud de préstamos.
- Consulta de préstamos activos e historial.

### Administradores
- Panel de administración.
- Registro y edición de materiales.
- Consulta del inventario.
- Recepción de materiales prestados.
- Registro del estado de devolución y observaciones.
- Administración de usuarios.
- Búsqueda por nombre y matrícula.
- Activación, desactivación y modificación de roles.

## Requisitos previos

- Node.js
- npm
- Acceso a la API del proyecto.

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar en la carpeta:

```bash
cd prestamo-deportivo-web
```

Instalar dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=https://proyecto-idgs9-v1.onrender.com
VITE_API_APP_TOKEN=utr-idgs9-equipo-b2-3bd3b5d9af80f95dc5f77574
```

Consultar `.env.example` como referencia.

No compartir ni subir el archivo `.env` al repositorio.

## Ejecución en desarrollo

```bash
npm run dev
```

## Compilación de producción

```bash
npm run build
```

Los archivos generados se almacenan en la carpeta `dist`.

## Estructura del proyecto

```text
src/
├── components/
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Admin.jsx
│   ├── Inventario.jsx
│   ├── Login.jsx
│   ├── MisPrestamos.jsx
│   └── Registro.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx
```

## API

La aplicación consume los servicios REST del proyecto mediante Fetch API.

Documentación:

https://proyecto-idgs9-v1.onrender.com/api/docs/

La autenticación utiliza JWT y el encabezado `x-api-token`.

## Seguridad

- Rutas protegidas mediante React Router.
- Control de acceso según el rol del usuario.
- Sesión almacenada en LocalStorage.
- Manejo de errores HTTP.
- Variables sensibles mediante `.env`.

## Proyecto académico

Universidad Tecnológica El Retoño (UTR)
Carrera: Tecnologías de la Información
Área: Desarrollo de Software Multiplataforma.