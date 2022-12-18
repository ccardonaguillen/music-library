## TO DO
- Retocar anchura de columnas "owned" y "favorite"
- Adaptar diseño para moviles

## POSSIBLE FUTURE ADDITIONS
- Añadir datos basicos disco desde Discogs (u otra pagina?) pasando el link
- Filtros multiples? (opcion en columnas o como "etiquetas")
- Menú filtrado (multiple) en barra lateral (Filtrar por.... "+ Añadir filtro...")

## OPTIMIZATIONS
- Cuando añades un album con formulario añadir elemento en la primera fila (mejorar visibilidad y solo actualizar esa fila: para esto es necesario modificar funcion _renderAlbum para
poder especificar posicion

- Cuando editas un album, actualizar solo album. Dos opciones:
	1. Utilizar la modificacion anterior para borrar y poner una fila en su lugar actualizando solo esta fila
	2. Crear/modificar funcion para actualizar contenido de la fila --> preferible esta opcion para usarla con iconos clicables

- Cambiar modo de editar con formulario utilizando funcion "editAlbumDetails" en vez de "addAlbum"

- Añadir clases a las diferentes columnas para facilitar la seleccion en CSS

- Generalizar sugerencias y añadir a otros campos (Páis, sello, etc.)