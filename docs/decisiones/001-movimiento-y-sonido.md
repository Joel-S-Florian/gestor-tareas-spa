# ADR 001 (SPA) — Movimiento, avisos y sonido de la interfaz

**Estado:** aceptada (2026-11-12)

## Contexto
La interfaz funcionaba, pero los cambios eran bruscos: las ventanas aparecían de golpe, mover una tarjeta no daba señal de haber funcionado, los errores eran textos sueltos y la carga era un "Cargando…". Se quería que se sintiera cuidada sin añadir librerías.

## Decisiones
- **CSS puro y una sola hoja (`styles/motion.css`).** Variables de duración y curvas (`--dur-*`, `--ease-*`), animaciones que terminan solas y sin librería de animación. Las entradas usan `fill-mode: backwards` para no congelar el `transform` y que el efecto de elevar la tarjeta al pasar el ratón siga funcionando.
- **Reducir movimiento.** Un bloque `prefers-reduced-motion` anula todas las animaciones y transiciones; el contador numérico del dashboard también lo consulta y muestra el valor final directamente.
- **Avisos flotantes (`ToastContext`).** Confirman lo que acaba de pasar (guardar, eliminar, completar) y explican los errores recuperables (por ejemplo, una tarjeta que se devuelve a su sitio porque la API rechazó el movimiento). Región `aria-live`, máximo 4 a la vez, los errores duran más y usan `role="alert"`.
- **Esqueletos de carga** con la forma del contenido, en lugar de texto, para evitar saltos de diseño.
- **Ventanas con salida animada y Escape**, con `role="dialog"` y `aria-modal`.
- **Sonidos con Web Audio, sin archivos.** Notas sintetizadas (mover, completar tarea, completar paso, aviso, error) con volumen bajo. **Apagados por defecto**; el interruptor del encabezado (`aria-pressed`) los activa y la elección se guarda en `localStorage` (con respaldo si no hay almacenamiento). Cualquier fallo del audio se ignora: nunca puede romper la app.
- **Detalles:** campana que suena y insignia con rebote al llegar un aviso nuevo (solo cuando sube el contador respecto a la consulta anterior, no al cargar la página), resalte al soltar una tarjeta, columna que se ilumina al arrastrar encima, estados vacíos con ilustración SVG y tarjetas de proyecto con barra de color superior.

## Consecuencias
- Cero dependencias nuevas; el peso del paquete apenas cambia.
- Los navegadores bloquean el audio hasta que hay un gesto del usuario: por eso activar el sonido ya reproduce una nota de confirmación.
- La salida animada de las ventanas retrasa 140 ms el cierre real; los tests lo cubren con temporizadores simulados.
- No hay prueba visual automatizada: las animaciones se comprobaron a mano (modo claro, oscuro y 375 px de ancho).

## Alternativas descartadas
- **Framer Motion / librería de animación:** potente, pero añade peso y dependencia para efectos que CSS resuelve.
- **Archivos de audio:** requieren assets y licencias; las notas sintetizadas bastan para pistas breves.
- **Sonido activado por defecto:** molesta en oficinas y sorprende al usuario.
