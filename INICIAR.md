# Ejecución local en Windows

Este repositorio contiene tres frontends y una API Node.js. PHP no se usa en
ninguno de ellos.

## Requisitos

- Node.js 20 LTS para `backsefcs`, `intrause` y `siteuse`.
- PostgreSQL 14 o posterior, iniciado en el puerto `5432`.
- Node.js 16.20.2 solamente para instalar e iniciar `frontsefcs`: su
  dependencia `node-sass@6` no es compatible con Node 24.

PowerShell puede bloquear `npm.ps1`; use `npm.cmd` en los comandos siguientes.
No cambie la política de ejecución del sistema para este proyecto.

## Instalar dependencias

Abra una terminal en cada carpeta y ejecute una sola vez:

```powershell
cd backsefcs; npm.cmd ci
cd ..\frontsefcs; npm.cmd ci
cd ..\intrause; npm.cmd ci
cd ..\siteuse; npm.cmd ci
```

Para `frontsefcs`, active Node 16 antes de `npm.cmd ci` y antes de arrancarlo.
Una vez esté ejecutándose puede volver a Node 20 para los otros servicios.

## Base de datos y API

El backend usa PostgreSQL, no MySQL. La configuración local se encuentra en
`backsefcs/server/config/config.json`: para desarrollo espera la base `use`,
usuario `postgres`, contraseña `1506`, host `localhost` y puerto `5432`.
Cambie esos valores por sus credenciales locales antes de migrar.

Si la base aún no existe, desde `backsefcs` ejecute:

```powershell
npm.cmd run dev:seq:db:create
npm.cmd run dev:seq:security:m
npm.cmd run dev:seq:general:m
npm.cmd run dev:seq:programs:m
npm.cmd run dev:seq:person:m
npm.cmd run dev:seq:accounting:m
npm.cmd run dev:seq:registration:m
```

Después arranque la API:

```powershell
cd backsefcs
npm.cmd run dev
```

Queda disponible en `http://localhost:8899/api`. Los archivos subidos y logs
se crean localmente en `backsefcs/public` y `backsefcs/server/logs`.

## Frontends

En tres terminales separadas, con la API iniciada:

```powershell
cd frontsefcs; npm.cmd start       # http://localhost:3000/admin/
cd intrause; npm.cmd run dev       # http://localhost:5173/intranet/
cd siteuse; npm.cmd run dev        # http://localhost:5174/
```

La intranet ya incluye el archivo local `.env` que apunta a
`http://localhost:8899/api`. Si cambia el puerto de la API, actualice ese
valor y reinicie Vite.
