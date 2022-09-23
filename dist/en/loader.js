const fileLoader = document.getElementById('file-loader');

fileLoader.addEventListener('change', (event) => {
    const fileList = event.target.files;
    var file = fileList[0];
    readFile(file);
    fileLoader.classList.add("hidden");
  });

function readFile(f) {
    const reader = new FileReader();
    var fileContent
    reader.addEventListener('load', (event) => {
        var fileContent = JSON.parse(event.target.result);
        Object.values(fileContent).forEach(val => {
            musicLibrary.addAlbum(Album(val));
        })
    });
    reader.readAsText(f);
}