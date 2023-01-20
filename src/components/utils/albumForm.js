function parseAlbumForm(form) {
    let formData = new FormData(form.current);
    let formContent = Object.fromEntries(formData.entries());

    formContent['owned'] = formContent['owned'] === 'true' ? true : false;
    formContent['favorite'] = formContent['favorite'] === 'true' ? true : false;
    formContent['format'] = formData.getAll('format');

    return formContent;
}

function populateAlbumForm(info) {
    for (let prop in info) {
        switch (prop) {
            case 'owned':
            case 'favorite':
            case 'album_format':
                clickRadioButtons(prop, info[prop]);
                break;
            case 'record_format':
                clickCheckBoxes(prop, info[prop]);
                break;
            default:
                populateInput(prop, info[prop]);
        }
    }

    return info.owned;
}

function populateInput(name, value) {
    const input = document.querySelector(`input[name="${name}"]`);
    if (input && value !== '') {
        input.value = value;
    }
}

function clickRadioButtons(name, value) {
    const radioButtons = document.querySelectorAll(`input[type=radio][name=${name}]`);
    for (let button of radioButtons) {
        if (String(value) === button.value) button.click();
    }
}

function clickCheckBoxes(name, value) {
    const checkBoxes = document.querySelectorAll(`input[type=checkbox][name=${name}]`);
    for (let box of checkBoxes) {
        if (value.some((format) => format === box.value)) box.click();
    }
}

export { parseAlbumForm, populateAlbumForm };
