# EduTech Labs - Evaluación Parcial 3

Ciclo de Vida del Software I

Para esta evaluación reutilicé el repositorio con el que trabajé anteriormente, incorporando una aplicación web para calcular la asistencia de los estudiantes mediante Node.js y Express. El objetivo principal fue automatizar los procesos de integración, compilación, pruebas, revisión de seguridad y publicación de la aplicación mediante GitHub Actions.

## Configuración del repositorio

Trabajé con dos ramas, `main` y `develop`. Utilicé develop para realizar las modificaciones y comprobar su funcionamiento antes de integrarlas a main mediante un Pull Request.

Configuré la protección de main para impedir la integración de cambios cuando el pipeline no cumple las comprobaciones obligatorias. Las credenciales de Docker Hub, SonarCloud y Snyk quedaron almacenadas en GitHub Actions Secrets, evitando incorporar sus valores directamente en el código.

## Pipeline CI/CD

El workflow se encuentra en `.github/workflows/pruebas.yml` y se ejecuta automáticamente al realizar un push hacia develop o al crear y actualizar un Pull Request dirigido a main. También se ejecuta después de integrar los cambios a main, instancia en la que se publica la imagen.

El orden de ejecución que establecí fue el siguiente:

1. Descarga del código fuente e instalación de dependencias.
2. Ejecución de pruebas unitarias y comprobación de cobertura.
3. Compilación de la aplicación mediante esbuild.
4. Análisis de calidad con SonarCloud en los Pull Requests y en main.
5. Análisis de dependencias con Snyk.
6. Construcción de la imagen Docker.
7. Comprobación del funcionamiento del contenedor mediante peticiones HTTP.
8. Análisis de vulnerabilidades con Docker Scout.
9. Publicación automática de la imagen en Docker Hub desde main.

La publicación depende del resultado de las etapas anteriores. Si alguna validación obligatoria falla, el proceso no continúa hacia Docker Hub.

## Pruebas y cobertura

Utilicé Jest para comprobar la lógica de la aplicación y Supertest para realizar pruebas sobre las rutas HTTP. Establecí una cobertura mínima del 80% para sentencias, ramificaciones, funciones y líneas.

Los resultados obtenidos en la ejecución final fueron:

- 24 pruebas aprobadas de 24.
- Sentencias: 91.11%.
- Ramificaciones: 94.59%.
- Funciones: 87.50%.
- Líneas: 90.24%.

Todos los porcentajes obtenidos superaron el mínimo establecido.

## SonarCloud

Integré SonarCloud para revisar la calidad del código y detectar problemas de seguridad, duplicación y mantenibilidad. Configuré el pipeline para esperar el resultado del Quality Gate antes de continuar.

El análisis del Pull Request obtuvo un 85.7% de cobertura sobre el código nuevo, un 0% de duplicación, ningún problema nuevo y ningún Security Hotspot nuevo. El Quality Gate fue aprobado.

## Snyk

Utilicé Snyk para analizar las dependencias de la aplicación, incluyendo las utilizadas durante el desarrollo.

Se analizaron 412 dependencias, identificando dos hallazgos de severidad media asociados a glob y minimatch. No se detectaron vulnerabilidades críticas, por lo que el pipeline pudo continuar.

## GitHub Advanced Security

Habilité y comprobé los siguientes controles dentro del repositorio:

- Dependabot para identificar dependencias vulnerables y gestionar actualizaciones.
- CodeQL para analizar riesgos de seguridad presentes en el código.
- Secret Scanning para detectar credenciales expuestas.
- Push Protection para prevenir la incorporación de secretos al repositorio.

Estos controles complementan los análisis realizados mediante SonarCloud, Snyk y Docker Scout.

## Docker y Docker Scout

Creé un Dockerfile multietapa utilizando Node.js 22 como imagen base. La primera etapa se encarga de compilar la aplicación, mientras que la segunda incorpora el archivo compilado y las dependencias necesarias para su ejecución.

Docker Scout analizó la imagen antes de su publicación, obteniendo los siguientes resultados:

- Vulnerabilidades críticas: 0.
- Vulnerabilidades altas: 17.
- Vulnerabilidades medias: 24.
- Vulnerabilidades bajas: 41.

Si bien no se detectaron vulnerabilidades críticas, las restantes deben ser consideradas para futuras actualizaciones de la imagen y sus componentes.

## Publicación en Docker Hub

Una vez aprobadas las validaciones en main, GitHub Actions publicó automáticamente la imagen en Docker Hub con la etiqueta `latest` y otra correspondiente al SHA del commit. Esto permite identificar la versión del código utilizada para construir la imagen.

Para descargarla y ejecutarla:

```bash
docker pull dmiranda26/edutech-labs:latest
docker run -d --name edutech-final -p 127.0.0.1:8081:3000 dmiranda26/edutech-labs:latest
```

La aplicación queda disponible en `http://localhost:8081/`.

También comprobé el endpoint `/health` y el cálculo de asistencia mediante `/api/asistencia`, obteniendo las respuestas esperadas desde el contenedor.

## Comprobación de los bloqueos

Configuré el pipeline para impedir la publicación cuando la cobertura sea inferior al mínimo establecido, SonarCloud rechace el Quality Gate o Snyk y Docker Scout detecten vulnerabilidades críticas.

Para comprobar el funcionamiento del control de cobertura, creé una rama independiente donde aumenté temporalmente el mínimo de cobertura de líneas al 100%.

Aunque las 24 pruebas fueron aprobadas, Jest rechazó la cobertura obtenida de 90.24%. El pipeline terminó con un código de salida 1, las etapas posteriores no se ejecutaron y GitHub bloqueó el merge hacia main.

Esta prueba no fue integrada a la rama principal, por lo que la configuración original del 80% se mantuvo.

## Problemas detectados

Durante la implementación tuve problemas con la política de ejecución de PowerShell, la disponibilidad del contenedor al realizar las primeras peticiones HTTP, la autenticación de SonarCloud y los permisos de Docker Scout para escribir comentarios en los Pull Requests.

Para solucionarlos, ajusté la política de ejecución de PowerShell, incorporé comprobaciones de disponibilidad antes de realizar las peticiones HTTP, actualicé el token de SonarCloud y deshabilité la publicación automática de comentarios de Docker Scout sin desactivar su análisis de seguridad.

También se produjeron errores HTTP 403 durante la descarga del ejecutable de Docker Scout. Las ejecuciones posteriores permitieron completar el análisis sin modificar los controles establecidos.

## Mejoras

Como mejoras para futuras iteraciones, considero necesario revisar las vulnerabilidades restantes, actualizar las dependencias afectadas, aumentar la cobertura de pruebas y mejorar la gestión de los Pull Requests generados por Dependabot.

También sería conveniente mejorar el mecanismo de descarga de Docker Scout y establecer una política de renovación de credenciales para evitar interrupciones del pipeline.

## Evidencias

- [Repositorio GitHub](https://github.com/DarienM-Kurohige/DollStack)
- [Workflow de GitHub Actions](https://github.com/DarienM-Kurohige/DollStack/blob/main/.github/workflows/pruebas.yml)
- [Dockerfile](https://github.com/DarienM-Kurohige/DollStack/blob/main/Dockerfile)
- [Ejecución del pipeline en develop](https://github.com/DarienM-Kurohige/DollStack/actions/runs/45307187424)
- [Ejecución del Pull Request](https://github.com/DarienM-Kurohige/DollStack/actions/runs/45307192082)
- [Ejecución y publicación desde main](https://github.com/DarienM-Kurohige/DollStack/actions/runs/45395546409)
- [SonarCloud](https://sonarcloud.io/dashboard?id=DarienM-Kurohige_IS-CALIDAD-EVL2)
- [GitHub Advanced Security](https://github.com/DarienM-Kurohige/DollStack/security)
- [Imagen publicada en Docker Hub](https://hub.docker.com/r/dmiranda26/edutech-labs/tags)
- [Prueba de bloqueo por cobertura insuficiente](https://github.com/DarienM-Kurohige/DollStack/actions/runs/45399258851)
- [Pull Request de prueba bloqueado](https://github.com/DarienM-Kurohige/DollStack/pull/8)