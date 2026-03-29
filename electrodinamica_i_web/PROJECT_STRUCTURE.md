# Electrodinamica I - Web Platform (Sargas Pro)

Este proyecto es una plataforma interactiva diseñada para la enseñanza de la Electrodinámica I, integrando teoría avanzada, simuladores interactivos y resolutores procedimentales con análisis 3D.

## Estructura del Proyecto

```text
electrodinamica_i_web/
├── assets/                 # Iconos (PWA) e imágenes del proyecto
├── css/                    # Estilos globales y sistemas de diseño
│   └── style.css           # Diseño Premium (Dark Mode/Glassmorphism)
├── js/                     # Lógica de aplicación (en desarrollo)
├── pages/                  # Contenido principal y herramientas
│   ├── datos_curricular.html   # Programa, objetivos y sinopsis
│   ├── Teoria.html             # Notas de clase interactivas (Unid I-IV)
│   ├── Formulas.html           # Prontuario dinámico en KaTeX
│   ├── Instrucciones.html      # Guía de uso de los simuladores
│   ├── Simulador_Campos.html   # Explorador 3D de campos vectoriales
│   ├── Simulador_Electrostat.html # Cargas puntuales (p5.js)
│   ├── Simulador_Magnetostat.html # Biot-Savart (p5.js)
│   └── Ejercicios_Interactivos.html # Resolutor procedimental 3D
├── index.html              # Dashboard Principal
└── manifest.json           # Configuración PWA (Soporte móvil)
```

## Resumen de Actualizaciones (v2.0)

### 1. Sistema de Resolución Procedimental
- Implementación de la **Ley de Coulomb** y **Ley de Gauss** con cálculos paso a paso en tiempo real.
- Uso de **KaTeX** para el renderizado matemático de alta precisión.
- **Corrección v2.1:** Reparación del motor de auto-render para etiquetas dinámicas y ajuste de términos técnicos ("radialmente").

### 2. Análisis Físico en 3D
- Integración de **Plotly.js** para el modelado de superficies gaussianas.
- Visualización de simetrías: **Esférica, Cilíndrica y Planar**.
- Sincronización entre el modelo físico 3D y las curvas de decaimiento del campo en 2D.

### 3. Fenomenología y Didáctica
- Nueva sección de **Tips de Fenomenología** que explica el origen físico de las leyes inversas al cuadrado y efectos de los medios dieléctricos.

## Tecnologías Utilizadas
- **HTML5/CSS3**: Estructura y diseño responsivo.
- **KaTeX**: Motor de renderizado LaTeX.
- **Plotly.js**: Gráficos científicos y escenas 3D.
- **p5.js**: Simulaciones interactivas de cargas y corrientes.

---
© 2026 SARGAS PRO ENGINEERING | ADVANCED AGENTIC COMPUTING
