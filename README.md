# Music Library

Library to register all records (CD, Vynil or other formats) that the user owns or want to buy.

## TO DO

-   Adaptar diseño para moviles
-   Escoger varios generos para un mismo disco

## POSSIBLE FUTURE ADDITIONS

-   Filtros multiples? (opcion en columnas o como "etiquetas")
-   Menú filtrado (multiple) en barra lateral (Filtrar por.... "+ Añadir filtro...")

## OPTIMIZATIONS

-   Cuando añades un album con formulario añadir elemento en la primera fila (mejorar visibilidad y solo actualizar esa fila: para esto es necesario modificar funcion \_renderAlbum para
    poder especificar posicion

-   Cuando editas un album, actualizar solo album. Dos opciones:

    1.  Utilizar la modificacion anterior para borrar y poner una fila en su lugar actualizando solo esta fila
    2.  Crear/modificar funcion para actualizar contenido de la fila --> preferible esta opcion para usarla con iconos clicables

-   Añadir clases a las diferentes columnas para facilitar la seleccion en CSS

# KNOWN BUGS

-   Duplicated albums can be added
-   Second fieldset of new album modal is cleared when "NO" is selected as an option in the "Do you own a copy?" input
-   When applying filter with no coincidences message of collection with no albums in it appears. Change to correct message
