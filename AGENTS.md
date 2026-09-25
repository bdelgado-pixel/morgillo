# MORGILLO WEB — PROJECT INSTRUCTIONS

## Objetivo

Desarrollar y terminar el sitio web de Morgillo manteniendo el frontend Next.js
integrado con el backend Django/CMS existente.

No rediseñar por gusto componentes ya terminados.
Avanzar sobre el estado ACTUAL del repositorio.

Antes de modificar cualquier archivo:
1. Inspeccionar el código actual.
2. Inspeccionar los tipos y datos reales disponibles.
3. Reutilizar la arquitectura existente.
4. No inventar campos del CMS.
5. No modificar backend salvo que la tarea lo requiera expresamente.

---

## Arquitectura obligatoria

Mantener:

Django Admin
→ Base de datos / Media
→ Django API
→ lib/content
→ Next.js
→ componentes

El contenido administrable debe seguir viniendo del CMS.

No hardcodear información que actualmente venga de Django.

Preservar funciones como:

- getProducts()
- getProduct()
- getBrands()
- getCategories()
- getServices()
- getCampaigns()
- getArticles()
- getContent()
- getSite()

Inspeccionar siempre `types/content` antes de usar propiedades.

---

# DISEÑO BASE DE MORGILLO

La identidad principal debe sentirse como una empresa de maquinaria para:

- agricultura
- construcción
- movimiento de tierra
- minería
- implementos
- servicio técnico
- repuestos

No diseñar como:
- startup SaaS
- empresa tecnológica genérica
- sitio de lujo negro
- cyber/futurista
- interfaz excesivamente minimalista blanca

Debe sentirse:
- fuerte
- comercial
- técnica
- confiable
- moderna
- relacionada con maquinaria real
- orientada a trabajo y productividad

---

## PROPORCIÓN VISUAL BASE

Usar como referencia, no como fórmula matemática rígida:

- ~55% superficies blancas / claras
- ~25% grises técnicos / acero
- ~15% rojo Morgillo
- ~5% grafito / contraste

El rojo NO debe limitarse a pequeñas líneas.

Puede utilizarse en:
- bandas
- barras
- CTAs
- zonas de transición
- numeraciones
- indicadores
- detalles diagonales
- fondos parciales

Evitar grandes superficies negras en modo claro.

El grafito puede aparecer en pequeñas franjas técnicas o cierres.

---

## COLOR CONTEXTUAL POR MARCA

Morgillo siempre conserva su identidad base.

Cuando una página o producto corresponde a una marca,
usar su color como ACENTO contextual.

Kubota:
- naranja aproximado #f36f21

Kobelco:
- cyan/celeste aproximado #00a6c7

BULL:
- amarillo aproximado #e9ae00 / #f0b400

Estos colores NO sustituyen la identidad Morgillo.

Ejemplo:

Producto Kubota agrícola:
rojo Morgillo + acero + verde agrícola + naranja Kubota.

Excavadora Kobelco:
rojo Morgillo + acero + color construcción + cyan Kobelco.

---

## COLOR CONTEXTUAL POR SECTOR

### Agricultura

Puede incorporar:
- verde natural
- tonos de campo
- líneas de cultivo
- patrones de terreno
- hojas / vegetación estilizada
- vectores agrícolas
- animaciones ligeras relacionadas con campo

No convertir toda la página en verde.

### Construcción / movimiento de tierra / minería

Puede incorporar:
- amarillo tierra
- arena
- acero
- gris maquinaria
- geometrías de obra
- líneas de nivel
- vectores de excavadoras o maquinaria
- patrones técnicos
- animaciones ligeras

No convertir toda la página en amarillo.

### Implementos

Puede incorporar:
- azul acero
- engranajes
- conexiones
- geometría mecánica
- diagramas técnicos sutiles

---

## MARCAS

Las páginas de:

- Kubota
- Kobelco
- BULL

pueden tener más personalidad propia.

Pero deben seguir sintiéndose dentro de Morgillo.

No hacer tres webs completamente diferentes.

---

## IMÁGENES

Las fotografías de maquinaria deben ser protagonistas.

Preferir:
- maquinaria real
- campo
- obra
- tierra
- cantera
- agricultura
- construcción
- operación real

Evitar filtros negros fuertes.

En modo claro las fotografías deben verse naturales y luminosas.

Usar los assets existentes en el repositorio antes de pedir nuevos archivos.

---

## RECURSOS VISUALES

Se permite crear con CSS/SVG:

- dibujos vectoriales
- líneas topográficas
- formas mecánicas
- engranajes
- geometría de construcción
- patrones de cultivo
- animaciones de trazado SVG
- diagonales
- numeraciones técnicas
- marcas de medición

Las animaciones deben ser elegantes y ligeras.

Siempre implementar:

@media (prefers-reduced-motion: reduce)

---

# RESPONSIVE

Todo debe diseñarse responsive DESDE EL PRINCIPIO.

Probar mentalmente y mediante navegador cuando sea posible:

- 320px
- 360px
- 375px
- 390px
- 430px
- 768px
- 820px
- 1024px
- 1280px
- 1366px
- 1440px
- 1920px+

Evitar:
- overflow horizontal
- textos cortados
- botones fuera de pantalla
- grids rotos
- imágenes deformadas

Touch y hover deben funcionar correctamente.

---

# LIGHT / DARK

Light mode:
- claro
- rojo
- acero
- gris
- fotografía natural

NO usar enormes bloques negros.

Dark mode:
puede adaptar las superficies a tonos oscuros.

No romper legibilidad ni colores de marca.

---

# UX

La web debe servir principalmente para:

1. encontrar maquinaria
2. entender para qué sirve
3. comparar opciones
4. conocer la marca
5. consultar especificaciones
6. contactar por WhatsApp
7. solicitar atención comercial
8. encontrar servicio técnico/repuestos

No sacrificar usabilidad por decoración.

---

# CATÁLOGO

En `/maquinaria`:

- búsqueda clara
- filtros por categoría
- filtros por marca
- contador de resultados
- filtros activos
- cards fáciles de recorrer
- buena experiencia móvil

Preservar query params existentes como:

?q=
?categoria=
?marca=

No romper URLs compartibles.

---

# PRODUCT DETAIL

En `/maquinaria/[slug]`:

Priorizar:

- galería
- marca
- nombre
- modelo
- categoría
- descripción
- especificaciones
- documentos PDF
- CTA WhatsApp
- contacto
- relacionados

El contexto visual puede reaccionar al sector y a la marca.

---

# CAMPAÑAS

Las campañas siguen administradas desde Django.

Preservar:

- inicio
- fin
- desktop image
- mobile image
- popup
- home placement
- rutas
- frecuencia
- CTA
- lugar

No reemplazar esta lógica por contenido hardcodeado.

---

# REGLA DE AVANCE

NO volver a rehacer componentes que ya fueron aprobados salvo que:

- haya un bug
- impidan continuar
- el usuario pida específicamente modificarlos

Trabajar página por página.

Antes de editar, revisar el estado ACTUAL de los archivos.

No asumir que el repositorio sigue igual que una versión anterior.

---

# CALIDAD

Después de una tarea:

- revisar errores TypeScript
- ejecutar lint si existe
- ejecutar typecheck si existe
- ejecutar build cuando sea razonable
- corregir errores introducidos por los cambios

No dejar imports muertos.

No inventar APIs.

No romper Django/CMS.

No eliminar funcionalidades existentes para facilitar el diseño.

---

# FORMA DE TRABAJO

Cuando recibas una tarea:

1. inspecciona archivos relacionados
2. inspecciona tipos/datos
3. identifica dependencias
4. implementa directamente
5. valida
6. informa qué archivos cambiaste
7. informa las pruebas ejecutadas

No pedir al usuario archivos que ya estén disponibles en el repositorio.

No limitarte a dar snippets:
realiza los cambios directamente en el proyecto.