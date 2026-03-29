# Guía de Despliegue: Sargas Engineering Hub

Sigue estos pasos para subir todos tus proyectos a GitHub y activar la visualización web (GitHub Pages).

## 1. Configuración Inicial (Git)

Abre una terminal (PowerShell o CMD) en la carpeta raíz `c:\Users\Sargas-PC\Desktop\Proyectos\Materias\` y ejecuta:

```powershell
# Inicializar el repositorio local
git init

# Agregar el repositorio remoto
git remote add origin https://github.com/sargas1717-bit/Departamento-Materias.git

# Crear una rama principal si no existe
git branch -M main
```

## 2. Subir el Código

```powershell
# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Sargas Engineering Hub Portal & Suite"

# Subir a GitHub
git push -u origin main
```

## 3. Activar GitHub Pages

Una vez que el código esté en GitHub:

1. Ve a tu repositorio en el navegador: [Departamento-Materias](https://github.com/sargas1717-bit/Departamento-Materias)
2. Haz clic en la pestaña **Settings** (Configuración).
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En la sección **Build and deployment**:
   - **Source**: Deploy from a branch.
   - **Branch**: Selecciona `main` y la carpeta `/(root)`.
5. Haz clic en **Save**.

**¡Listo!** En unos minutos, tu portal estará disponible en la URL que aparecerá en la parte superior de esa misma página (ej: `https://sargas1717-bit.github.io/Departamento-Materias/`).

---
> [!TIP]
> **Actualizaciones Futuras**: Cada vez que hagas un cambio en tus archivos locales, solo necesitas ejecutar:
> ```powershell
> git add .
> git commit -m "Descripción del cambio"
> git push
> ```
> GitHub Pages se actualizará automáticamente.
