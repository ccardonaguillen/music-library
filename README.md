# Music Library

Library to register all records (CD, Vynil or other formats) that the user owns or want to buy.

## TO DO

-   Multiselect album genre

## KNOWN BUGS

-   Duplicated albums can be added
-   Second fieldset of new album modal is cleared when "NO" is selected as an option in the "Do you own a copy?" input
-   When applying filter with no coincidences message of collection with no albums in it appears. Change to correct message
-   Clicking outside options modal to close it triggers other click events

## IMPROVEMENTS AND OPTIMIZATIONS

-   Group all modals as a HOC with similar behaviour (e.g. close when clicking outside modal)
-   Create placeholder image when no album jacket is provided or found
-   Remove "record info" entries from "extra-info" panel and/or those that are not provided (or leave as NA)
-   Translate record formats (vynil, etc) and country (?) fields
-   Split table by title/artist/release_year (a,b,c,... or by number of entries 1--50, 50--100,...) to improve rendering when sorting

## POSSIBLE FUTURE ADDITIONS

-   Multiple filters (in column headers or as "tag" system)
