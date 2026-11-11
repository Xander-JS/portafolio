# Auditoría de velocidad — 2026-11-11

## Resultado
Revisión estática de las rutas, configuración, estado compartido, carga de recursos y motores de animación. Se aplicaron optimizaciones conservadoras de asignación de memoria. No se certifica todavía ausencia de lag en móvil/escritorio: faltan perfiles de navegador y dispositivos reales.

## Cambios
- Scene: reutiliza los dos vectores de salida de las curvas de cámara. Evita dos objetos por fotograma, conservando coordenadas, interpolación y tiempos.
- SkillNexus: reutiliza tres buffers tipados durante la vida del efecto. Reinicia la máscara de pertenencia cada fotograma para conservar el comportamiento al cambiar filtros. Evita tres buffers por fotograma.
- Prueba de equivalencia de las curvas en seis posiciones y tres factores de pantalla.

Estas reducciones son comprobables por código; no representan una mejora de FPS medida.

## Protecciones existentes
- Zustand publica solamente cambios y los consumidores seleccionan campos; la escena lee el progreso dentro del frame sin suscribir React a cada avance.
- Three.js se carga separado mediante next/dynamic; nodos ambientales instanciados.
- Escena con calidad adaptativa y pausa en pestaña oculta; partículas y habilidades cuentan con controles de visibilidad.
- Imágenes con next/image y tamaños responsivos; formatos AVIF/WebP configurados.
- Importaciones de iconos optimizadas y rutas con contenido cacheable.

## Hallazgos pendientes
- Lint existente: ReactionWall actualiza estado dentro de un efecto; AmbientParticles omite contained en las dependencias. No se alteraron los ciclos de esos componentes.
- Filtros/blur y capas transparentes pueden costar GPU. Se conservaron por la restricción de mantener efectos.
- La reconstrucción de nodos mide múltiples cajas al preparar sus fragmentos. Medir sus tareas largas antes de cambiar esa lógica.
- Fuentes descargadas durante build requieren red.

## Verificación
- Tres archivos de pruebas existentes pasan, incluida la nueva comprobación de curvas.
- TypeScript: npx tsc --noEmit pasa.
- git diff --check pasa.
- Lint global: un error y una advertencia previos, indicados arriba.
- Build no completado: primer intento sin acceso a Google Fonts; reintento con permisos solicitados terminó con panic de Turbopack al intentar abrir un puerto (Operation not permitted).
- Sin navegador automatizado disponible en esta sesión; no hubo mediciones Lighthouse, FPS, INP o memoria ni comparación visual.

## Validación de aceptación pendiente
En una compilación de producción, recorrer inicio y todos los módulos, abrir/cerrar proyectos, cambiar filtros, idioma y tema; repetir en Android de gama media y escritorio. Registrar perfiles de CPU/GPU y memoria durante scroll, transiciones y navegación repetida. Comparar antes/después con la misma red y hardware. Objetivos propuestos: INP <= 200 ms, LCP <= 2.5 s, CLS <= 0.1; para 60 Hz, examinar frames que superen 16.7 ms. Esos objetivos aún no se han medido.
