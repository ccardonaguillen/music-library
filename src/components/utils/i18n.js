import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: false,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    fields: {
                        title: 'Title',
                        artist: 'Artist',
                        released: {
                            short: 'Released',
                            long: 'Release Year',
                        },
                        owned: 'Owned',
                        favorite: 'Favorite',
                        genre: 'Genre',
                        genreOptions: {},
                        wikipedia: 'Wikipedia Page',
                        discogs: 'Discogs Link',
                        jacket: 'Album Jacket',
                        recordFormat: {
                            vynil: 'Vynil',
                            cd: 'CD',
                            casette: 'Casette',
                            other: 'Other',
                        },
                        catalog_num: {
                            short: 'Catalog #',
                            long: 'Catalog Number',
                        },
                        label: 'Label',
                        country: 'Country',
                        edition: {
                            short: 'Edition',
                            long: 'Edition Year',
                        },
                        matrix: 'Matrix',
                        condition: 'Condition',
                        ndisk: 'Disks',
                        notes: 'Notes',
                        format: 'Formato',
                    },
                    common: {
                        exampleAbbr: 'e.g. ',
                        yes: 'Yes',
                    },
                    alerts: {
                        added: {
                            success: 'Album added to library: {{title}}',
                            duplicated: 'Album already exists in the library',
                            error: 'Error adding album to library',
                        },
                        removed: 'Album removed',
                        edited: 'Album edited',
                    },
                    header: {
                        title: 'Music Library',
                        user: {
                            signIn: 'Sign In with Google',
                            signOut: 'Sign Out',
                        },
                    },
                    controls: {
                        entries: {
                            zero: 'No albums in the library. Add one by clicking the button',
                            other: 'Showing {{displayed}} out of {{total}} albums',
                        },
                        filter: {
                            by: 'Filter by',
                            placeholder: {
                                owned: '"true", "no", "not owned"',
                                format: '"Vynil", "cd+casette", "vynil/CD"',
                            },
                            apply: 'Apply filter',
                        },
                        newAlbum: 'New album',
                    },
                    albumModal: {
                        title: {
                            new: 'New Album',
                            edit: 'Edit Album',
                        },
                        hero: 'Input the album info manually or load it from Discogs',
                        fieldsets: {
                            general: 'General Info',
                            record: 'Record Info',
                        },
                        labels: {
                            owned: 'Do you own a copy?',
                            favorite: 'Mark as favorite?',
                            wikipedia: 'Wikipedia Page',
                            discogs: 'Discogs Link',
                            record: 'Record Format(s)',
                            album: 'Album Format',
                        },
                        buttons: {
                            load: 'Load Info',
                            submit: 'Submit',
                            reset: 'Reset',
                            cancel: 'Cancel',
                            close: 'Close Modal',
                        },
                    },
                    optionsModal: {
                        edit: 'Edit Album',
                        delete: 'Delete Album',
                    },
                    table: {
                        notLogged: {
                            part1: 'You are not currently logged in. Use the button at the top of the page or ',
                            action: 'click here to log in',
                            part2: 'and start adding albums.',
                        },
                        noAlbums: {
                            part1: 'There are currently no albums in your music library. ',
                            action: 'Upload a collection',
                            part2: ' from your computer or use the "New Album" button.',
                        },
                    },
                    credits: 'Design and code',
                },
            },
            es: {
                translation: {
                    fields: {
                        title: 'Título',
                        artist: 'Artista',
                        released: {
                            short: 'Publicado',
                            long: 'Año Publicación',
                        },
                        owned: 'Adquirido',
                        favorite: 'Favorito',
                        genre: 'Género',
                        genreOptions: {},
                        wikipedia: 'Página Wikipedia',
                        discogs: 'Enlace Discogs',
                        jacket: 'Carátula',
                        recordFormat: {
                            vynil: 'Vinilo',
                            cd: 'CD',
                            casette: 'Casete',
                            other: 'Otro',
                        },
                        catalog_num: {
                            short: 'No. Catálogo',
                            long: 'Número Catálogo',
                        },
                        label: 'Sello',
                        country: 'País',
                        edition: {
                            short: 'Editado',
                            long: 'Año Edición',
                        },
                        matrix: 'Matriz',
                        condition: 'Estado',
                        ndisk: 'Discos',
                        notes: 'Observaciones',
                        format: 'Formato',
                    },
                    common: {
                        exampleAbbr: 'p. ej. ',
                        yes: 'Sí',
                    },
                    alerts: {
                        added: {
                            success: 'Álbum añadido a la colección: {{title}}',
                            duplicated: 'Este álbum ya está en la colección',
                            error: 'Error al añadir álbum',
                        },
                        removed: 'Álbum borrado',
                        edited: 'Álbum editado',
                    },
                    header: {
                        title: 'Colección Música',
                        user: {
                            signIn: 'Iniciar Sesión con Google',
                            signOut: 'Cerrar Sesión',
                        },
                    },
                    controls: {
                        entries: {
                            zero: 'No hay ningún album en la colección. Añade uno usando el botón',
                            other: 'Mostrando {{displayed}} de {{total}} álbumes',
                        },
                        filter: {
                            by: 'Filtrar por',
                            placeholder: {
                                owned: '"sí", "no", "falso"',
                                format: '"Vinilo", "cd+casette", "vinilo/CD"',
                            },
                            apply: 'Aplicar filtro',
                        },
                        newAlbum: 'Añadir Álbum',
                    },
                    albumModal: {
                        title: {
                            new: 'Nuevo Álbum',
                            edit: 'Editar Álbum',
                        },
                        hero: 'Introduce los datos del álbum o cárgalos desde Discogs',
                        fieldsets: {
                            general: 'Información General',
                            record: 'Datos del Disco',
                        },
                        labels: {
                            owned: '¿Tienes una copia?',
                            favorite: '¿Añadir a favoritos?',
                            wikipedia: 'Artículo Wikipedia',
                            discogs: 'Enlace Discogs',
                            record: 'Formato(s) Grabación',
                            album: 'Tipo Álbum',
                        },
                        buttons: {
                            load: 'Cargar Datos',
                            submit: 'Aceptar',
                            reset: 'Reestabl.',
                            cancel: 'Cancelar',
                            close: 'Cerrar',
                        },
                    },
                    optionsModal: {
                        edit: 'Editar Datos',
                        delete: 'Borrar Álbum',
                    },
                    table: {
                        notLogged: {
                            part1: 'No estás registrado. Pulsa el botón en la parte superior o ',
                            action: 'haz click aquí para iniciar sesión',
                            part2: ' y empezar añadir álbumes a tu colección de música.',
                        },
                        noAlbums: {
                            part1: 'No hay ningún álbum en tu colección. ',
                            action: 'Carga una colección',
                            part2: ' desde tu ordenador o pulsa el botón "Nuevo álbum".',
                        },
                    },

                    credits: 'Diseño y código',
                },
            },
        },
    });

export default i18n;
