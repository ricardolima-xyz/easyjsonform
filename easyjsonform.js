class EasyJsonFormField { 
    constructor(json = null) {
        if (json === null) json = {};
        this.type = json.type || null;
        this.label = json.label || '';
        this.customattribute = json.customattribute || '';
        this.mandatory = json.mandatory || false;
        this.spec = json.spec || null;
        this.value = json.value || null;
    }

    builderEditor(updateCallback) {
        // Creating editor
        let editor = document.createElement('div');
        Object.assign(editor.style,{
            alignItems: 'center', display: 'grid', gridGap: '0.55rem',
            gridTemplateColumns: 'min-content auto', padding:'1rem', whiteSpace: 'nowrap',
        });
        // Label field
        let lblLabel = document.createElement('label');
        lblLabel.htmlFor = EasyJsonForm.newElementId();
        lblLabel.textContent = EasyJsonForm.dictionary['item.spec.label'];
        let iptDescription = document.createElement('input');
        iptDescription.id = EasyJsonForm.getElementId();
        iptDescription.type = 'text';
        iptDescription.value = this.label;
        iptDescription.onchange = () => {this.label = iptDescription.value; updateCallback();};
        editor.appendChild(lblLabel);
        editor.appendChild(iptDescription);
        // Custom attribute field
        let lblCustomAttribute = document.createElement('label');
        lblCustomAttribute.htmlFor = EasyJsonForm.newElementId();
        lblCustomAttribute.textContent = EasyJsonForm.dictionary['item.spec.customattribute'];
        let iptCustomAttribute = document.createElement('input');
        iptCustomAttribute.id = EasyJsonForm.getElementId();
        iptCustomAttribute.type = 'text';
        iptCustomAttribute.value = this.customattribute;
        iptCustomAttribute.onchange = () => {this.customattribute = iptCustomAttribute.value; updateCallback();};
        editor.appendChild(lblCustomAttribute);
        editor.appendChild(iptCustomAttribute);
        // Mandatory field
        let lblMandatory = document.createElement('label');
        lblMandatory.htmlFor = EasyJsonForm.newElementId();
        lblMandatory.textContent = EasyJsonForm.dictionary['item.spec.mandatory'];
        let iptMandatory = document.createElement('input');
        iptMandatory.id = EasyJsonForm.getElementId();
        iptMandatory.type = 'checkbox';
        iptMandatory.checked = this.mandatory;
        iptMandatory.onchange = () => {this.mandatory = iptMandatory.checked; updateCallback();};
        editor.appendChild(lblMandatory);
        editor.appendChild(iptMandatory);
        return editor;
    }

    helpText() {
        return !this.mandatory ? '' :
            EasyJsonForm.dictionary['common.helptext']
                .replace('{{help-text}}', EasyJsonForm.dictionary['common.helptext.mandatory']);
    }

    validationErrorMessage(ejf) {
        let validationInfo = this.validate().map(x => {
            return EasyJsonForm.dictionary[x].replace('{{field-label}}', this.label);
        }).join(EasyJsonForm.dictionary['common.helptext.separator']);
        let lblValidation = ejf.ejfElement('div', 'ValidationErrorMessage');
        lblValidation.textContent = validationInfo;
        return lblValidation;
    }
}

class EasyJsonFormFieldFile extends EasyJsonFormField {
    constructor(json = null) {
        super(json);
        if (this.spec === null) this.spec = 
        {
            file_types: [], // array containing mimetypes
            max_size: 0,    // nonnegative float values
        };
        this.type = 'file';
    }

    builderEditor(updateCallback) {
        let editor = super.builderEditor(updateCallback);
        // Max file size field
        let lblMaxSize = document.createElement('label');
        lblMaxSize.htmlFor = EasyJsonForm.newElementId();
        lblMaxSize.textContent = EasyJsonForm.dictionary['item.file.spec.maxsize'];
        let iptMaxSize = document.createElement('input');
        iptMaxSize.id = EasyJsonForm.getElementId();
        iptMaxSize.type = 'number';
        iptMaxSize.min = 0;
        iptMaxSize.step = 0.1;
        iptMaxSize.value = this.spec.max_size;
        iptMaxSize.onchange = () => {this.spec.max_size = iptMaxSize.value; updateCallback();};
        editor.appendChild(lblMaxSize);
        editor.appendChild(iptMaxSize);
        // File types field
        let lblFileTypes = document.createElement('label');
        lblFileTypes.textContent = EasyJsonForm.dictionary['item.file.spec.filetypes'];
        let divFileTypes = document.createElement('div');
        for (const [fileType, properties] of Object.entries(EasyJsonForm.supportedFileTypes)) {
            let cbxFileType = document.createElement('input');
            cbxFileType.id = EasyJsonForm.newElementId();
            cbxFileType.type = 'checkbox';
            cbxFileType.checked = this.spec.file_types.indexOf(fileType) > -1;
            cbxFileType.onchange = () => {
                if (cbxFileType.checked) this.spec.file_types.push(fileType);
                else this.spec.file_types.splice(this.spec.file_types.indexOf(fileType),1);
                updateCallback();
            };
            let lblFileType = document.createElement('label');
            lblFileType.htmlFor = EasyJsonForm.getElementId();
            lblFileType.textContent = properties.extensions[0];
            let divFileType = document.createElement('div');
            divFileType.appendChild(cbxFileType);
            divFileType.appendChild(lblFileType);
            divFileTypes.appendChild(divFileType);
        }
        editor.appendChild(lblFileTypes);
        editor.appendChild(divFileTypes);
        return editor;
    }

    formFieldCreate(ejf, position, withValidation = false) {
        let validationError = (withValidation && this.validate().length > 0);
        let lblFormField = ejf.ejfElement('label', 'FieldFileLabel', validationError ? 'ValidationErrorLabel' : null);
        lblFormField.innerHTML = `${this.label}${this.helpText()}`;
        lblFormField.htmlFor = `${ejf.id}[${position}]`;
        let formField = ejf.ejfElement('div', 'FieldFile');
        formField.appendChild(lblFormField);
        formField.appendChild(this.formFieldControl(ejf, position, formField, validationError));
        if (validationError) formField.appendChild(this.validationErrorMessage(ejf));
        return formField;
    }

    formFieldControl(ejf, position, formField, validationError) {
        if (this.value === null) {
            let iptFile = ejf.ejfElement('input', 'FieldFileInput', validationError ? 'ValidationErrorInput' : null);
            iptFile.type = 'file';
            iptFile.id = `${ejf.id}[${position}]`;
            iptFile.name = `${ejf.id}[${position}]`;
            iptFile.disabled = ejf.options.disabled || false;
            if (!ejf.options.fileHandler) iptFile.disabled = true; // Disabled if no handler
            else iptFile.onchange = () => {
                // TODO VALIDATION BEFORE UPLOAD: SIZE AND FILETYPE
                ejf.options.fileHandler.upload(iptFile.files[0])
                .then((result) => {
                    if (result.success) {
                        this.value = result.value;
                        formField.replaceChild(
                            this.formFieldControl(ejf, position, formField),
                            formField.children[1]
                        );
                    }
                });
            };
            return iptFile;
        } else {
            let iptFile = ejf.ejfElement('input');
            iptFile.type = 'hidden';
            iptFile.id = `${ejf.id}[${position}]`;
            iptFile.name = `${ejf.id}[${position}]`;
            iptFile.value = this.value;
            let lnkFile = ejf.ejfElement('a', 'FieldFileLink');
            lnkFile.textContent = (ejf.options.fileHandler) ?
                ejf.options.fileHandler.displayName(this.value) : this.value;
            lnkFile.href = (ejf.options.fileHandler) ?
                ejf.options.fileHandler.url(this.value) : '#';
            let btnClear = ejf.ejfElement('button', 'FieldFileClear');
            btnClear.type = 'button';
            if (!ejf.options.fileHandler) btnClear.disabled = true; // Disabled if no handler
            btnClear.onclick = () => {
                this.value = null;
                formField.replaceChild(
                    this.formFieldControl(ejf, position, formField), formField.children[1]);
            };
            btnClear.innerHTML = EasyJsonForm.iconDelete;
            let spnFile = ejf.ejfElement('span', 'FieldFileValue');
            spnFile.appendChild(iptFile);
            spnFile.appendChild(lnkFile);
            spnFile.appendChild(btnClear);
            return spnFile;
        }
    }

    helpText() {
        let restrictions = [];
        if (this.mandatory) restrictions.push(EasyJsonForm.dictionary['common.helptext.mandatory']);
        if (this.spec.max_size > 0)
            restrictions.push(EasyJsonForm.dictionary['item.file.helptext.maxsize'].replace('{{size}}', this.spec.max_size));
        if (this.spec.file_types.length > 0)
            restrictions.push(EasyJsonForm.dictionary['item.file.helptext.filetypes'].replace('{{file-types}}', 
                this.spec.file_types
                    .map((x) => EasyJsonForm.supportedFileTypes[x].extensions[0])
                    .join(EasyJsonForm.dictionary['common.helptext.separator'])
                )
            );
        else
            restrictions.push(EasyJsonForm.dictionary['item.file.helptext.filetypes'].replace('{{file-types}}', EasyJsonForm.dictionary['item.file.helptext.filetypes.all']));
    
        return (restrictions.length == 0) ? 
            '' :
            EasyJsonForm.dictionary['common.helptext'].replace('{{help-text}}',
            restrictions.join(EasyJsonForm.dictionary['common.helptext.separator']));
    }

    formattedValue() {
        return value || '';
    }

    validate() {
        if (this.mandatory && this.value == null) 
            return ['validation.error.mandatory'];
        else
            return [];
    }
}

class EasyJsonFormFieldMultipleChoice extends EasyJsonFormField {
    constructor(json = null) {
        super(json);
        if (this.spec === null) this.spec = 
        {
            items:[1, 2, 3],   // array containing values
        };
        if (this.value === null) this.value = Array(this.spec.items.length).fill('0');
        this.type = 'multiplechoice';
    }

    builderEditor(updateCallback) {
        let editor = super.builderEditor(updateCallback);
        // Items field
        let lblItems = document.createElement('label');
        lblItems.htmlFor = EasyJsonForm.newElementId();
        lblItems.innerHTML = `${EasyJsonForm.dictionary['item.spec.items']}
        <br/><small>${EasyJsonForm.dictionary['item.spec.items.help']}</small>`;
        let txaItems = document.createElement('textarea');
        txaItems.id = EasyJsonForm.getElementId();
        txaItems.value = this.spec.items.join('\n');
        txaItems.onchange = () => {this.spec.items = txaItems.value.split('\n'); this.value = Array(this.spec.items.length).fill('0'); updateCallback();};
        editor.appendChild(lblItems);
        editor.appendChild(txaItems);
        return editor;
    }

    formFieldCreate(ejf, position, withValidation = false) {
        let validationError = (withValidation && this.validate().length > 0);
        let lblFormField = ejf.ejfElement('label', 'FieldMultiplechoiceLabel', validationError ? 'ValidationErrorLabel' : null);
        lblFormField.innerHTML = `${this.label}${this.helpText()}`;
        let formGroup = ejf.ejfElement('span', 'FieldMultiplechoiceGroup');
        this.spec.items.forEach((element, index) => {
            let iptHidden = ejf.ejfElement('input');
            iptHidden.type = 'hidden';
            iptHidden.value = '0';
            iptHidden.name = `${ejf.id}[${position}][${index}]`;
            let iptCheck = ejf.ejfElement('input', 'FieldMultiplechoiceItemInput', validationError ? 'ValidationErrorInput' : null);
            iptCheck.type = 'checkbox';
            iptCheck.disabled = ejf.options.disabled || false;
            iptCheck.id = `${ejf.id}[${position}][${index}]`;
            iptCheck.name = `${ejf.id}[${position}][${index}]`;
            iptCheck.value = '1';
            iptCheck.checked = parseInt(this.value[index]);
            iptCheck.onchange = () => {this.value[index] = iptCheck.checked ? "1" : "0"};
            let lblCheck = ejf.ejfElement('label', 'FieldMultiplechoiceItemLabel');
            lblCheck.htmlFor = `${ejf.id}[${position}][${index}]`;
            lblCheck.textContent = element;
            let item = ejf.ejfElement('span', 'FieldMultiplechoiceItem');
            item.appendChild(iptHidden);
            item.appendChild(iptCheck);
            item.appendChild(lblCheck);
            if (validationError) item.appendChild(this.validationErrorMessage(ejf));
            formGroup.appendChild(item);
        });
        let formField = ejf.ejfElement('div', 'FieldMultiplechoice');
        formField.appendChild(lblFormField);
        formField.appendChild(formGroup);
        return formField;
    }

    formattedValue() {
        return this.value.map((x) => {
            return parseInt(x) ? EasyJsonForm.dictionary['common.value.yes'] : EasyJsonForm.dictionary['common.value.no']; 
        });
    }

    validate() {
        if (this.mandatory) {
            let valid = false;
            for (const val of this.value) if (parseInt(val)) valid = true;
            return valid ? [] : ['validation.error.please.select.one.option'];
        }
        else
            return [];
    }
}

class EasyJsonFormFieldNumber extends EasyJsonFormField {
    constructor(json = null) {
        super(json);
        this.type = 'number';
    }

    formFieldCreate(ejf, position, withValidation = false) {
        let validationError = (withValidation && this.validate().length > 0);
        let lblFormField = ejf.ejfElement('label', 'FieldNumberLabel', validationError ? 'ValidationErrorLabel' : null);
        lblFormField.htmlFor = `${ejf.id}[${position}]`;
        lblFormField.innerHTML = `${this.label}${this.helpText()}`;
        let iptFormField = ejf.ejfElement('input', 'FieldNumberInput', validationError ? 'ValidationErrorInput' : null);
        iptFormField.disabled = ejf.options.disabled || false;
        iptFormField.id = `${ejf.id}[${position}]`;
        iptFormField.name = `${ejf.id}[${position}]`;
        iptFormField.type = 'number';
        iptFormField.value = this.value;
        iptFormField.onchange = () => {this.value = iptFormField.value};
        let formField = ejf.ejfElement('div', 'FieldNumber');
        formField.appendChild(lblFormField);
        formField.appendChild(iptFormField);
        if (validationError) formField.appendChild(this.validationErrorMessage(ejf));
        return formField;
    }

    formattedValue() {
        return this.value;
    }

    validate() {
        return (this.mandatory && this.value === null) ? ['validation.error.mandatory'] : [];
    }
}

class EasyJsonFormFieldSingleChoice extends EasyJsonFormField {
    constructor(json = null) {
        super(json);
        if (this.spec === null) this.spec = 
        {
            items:[1, 2, 3],   // array containing values
        };
        this.type = 'singlechoice';
    }

    builderEditor(updateCallback) {
        let editor = super.builderEditor(updateCallback);
        // Items field
        let lblItems = document.createElement('label');
        lblItems.htmlFor = EasyJsonForm.newElementId();
        lblItems.innerHTML = `${EasyJsonForm.dictionary['item.spec.items']}
        <br/><small>${EasyJsonForm.dictionary['item.spec.items.help']}</small>`;
        let txaItems = document.createElement('textarea');
        txaItems.id = EasyJsonForm.getElementId();
        txaItems.value = this.spec.items.join('\n');
        txaItems.onchange = () => {this.spec.items = txaItems.value.split('\n'); updateCallback();};
        editor.appendChild(lblItems);
        editor.appendChild(txaItems);
        return editor;
    }

    formFieldCreate(ejf, position, withValidation = false) {
        let validationError = (withValidation && this.validate().length > 0);
        let lblFormField = ejf.ejfElement('label', 'FieldSinglechoiceLabel', validationError ? 'ValidationErrorLabel' : null);
        lblFormField.htmlFor = `${ejf.id}[${position}]`;
        lblFormField.innerHTML = `${this.label}${this.helpText()}`;
        let iptFormField = ejf.ejfElement('select', 'FieldSinglechoiceSelect', validationError ? 'ValidationErrorInput' : null);
        iptFormField.disabled = ejf.options.disabled || false;
        iptFormField.id = `${ejf.id}[${position}]`;
        iptFormField.name = `${ejf.id}[${position}]`;
        let nullOption = ejf.ejfElement('option');
        nullOption.value = 'null';
        nullOption.textContent = EasyJsonForm.dictionary['item.singlechoice.value.null'];
        iptFormField.appendChild(nullOption);
        this.spec.items.forEach((element, index) => {
            let option = ejf.ejfElement('option');
            option.value = index;
            option.textContent = element;
            iptFormField.appendChild(option);
        });
        iptFormField.value = this.value;
        iptFormField.onchange = () => {this.value = iptFormField.value == 'null' ? null : iptFormField.value};
        let formField = ejf.ejfElement('div', 'FieldSinglechoice');
        formField.appendChild(lblFormField);
        formField.appendChild(iptFormField);
        if (validationError) formField.appendChild(this.validationErrorMessage(ejf));
        return formField;
    }

    formattedValue() {
        return this.spec.items[this.value];
    }

    validate() {
        return (this.mandatory && this.value === null) ? ['validation.error.mandatory'] : [];
    }
}

class EasyJsonFormFieldText extends EasyJsonFormField {
    constructor(json = null) {
        super(json);
        if (this.value === null) this.value = '';
        if (this.spec === null) this.spec = {
            multiline: false,
            length: {
                measure: 'no', // Can also be 'bycharacter' or 'byword'
                min: 0, // nonnegative integer values
                max: 0, // nonnegative integer values
            },
        };
        this.type = 'text';
    }

    builderEditor(updateCallback) {
        let editor = super.builderEditor(updateCallback);
        // Multiline field
        let lblMultiline = document.createElement('label');
        lblMultiline.htmlFor = EasyJsonForm.newElementId();
        lblMultiline.textContent = EasyJsonForm.dictionary['item.text.spec.multiline'];
        let iptMultiline = document.createElement('input');
        iptMultiline.id = EasyJsonForm.getElementId();
        iptMultiline.type = 'checkbox';
        iptMultiline.checked = this.spec.multiline;
        iptMultiline.onchange = () => {this.spec.multiline = iptMultiline.checked; updateCallback();};
        editor.appendChild(lblMultiline);
        editor.appendChild(iptMultiline);
        // Length measure field
        let lblLengthMeasure = document.createElement('label');
        lblLengthMeasure.htmlFor = EasyJsonForm.newElementId();
        lblLengthMeasure.textContent = EasyJsonForm.dictionary['item.text.spec.length.measure'];
        let optLengthMeasureByCharacter = document.createElement('option');
        optLengthMeasureByCharacter.value = 'bycharacter';
        optLengthMeasureByCharacter.textContent = EasyJsonForm.dictionary['item.text.spec.length.measure.bycharacter'];
        let optLengthMeasureByWord = document.createElement('option');
        optLengthMeasureByWord.value = 'byword';
        optLengthMeasureByWord.textContent = EasyJsonForm.dictionary['item.text.spec.length.measure.byword'];
        let optLengthMeasureNo = document.createElement('option');
        optLengthMeasureNo.value = 'no';
        optLengthMeasureNo.textContent = EasyJsonForm.dictionary['item.text.spec.length.measure.no'];
        let selLengthMeasure = document.createElement('select');
        selLengthMeasure.id = EasyJsonForm.getElementId();
        selLengthMeasure.appendChild(optLengthMeasureByCharacter);
        selLengthMeasure.appendChild(optLengthMeasureByWord);
        selLengthMeasure.appendChild(optLengthMeasureNo);
        selLengthMeasure.value = this.spec.length.measure;
        selLengthMeasure.onchange = () => {this.spec.length.measure = selLengthMeasure.value; updateCallback();};
        editor.appendChild(lblLengthMeasure);
        editor.appendChild(selLengthMeasure);
        // Length min field
        let lblLengthMin = document.createElement('label');
        lblLengthMin.htmlFor = EasyJsonForm.newElementId();
        lblLengthMin.textContent = EasyJsonForm.dictionary['item.text.spec.length.min'];
        let iptLengthMin = document.createElement('input');
        iptLengthMin.type = 'number';
        iptLengthMin.min = 0;
        iptLengthMin.step = 1;
        iptLengthMin.id = EasyJsonForm.getElementId();
        iptLengthMin.value = this.spec.length.min;
        iptLengthMin.onchange = () => {this.spec.length.min = iptLengthMin.value; updateCallback();};
        editor.appendChild(lblLengthMin);
        editor.appendChild(iptLengthMin);
        // Length max field
        let lblLengthMax = document.createElement('label');
        lblLengthMax.htmlFor = EasyJsonForm.newElementId();
        lblLengthMax.textContent = EasyJsonForm.dictionary['item.text.spec.length.max'];
        let iptLengthMax = document.createElement('input');
        iptLengthMax.type = 'number';
        iptLengthMax.min = 0;
        iptLengthMax.step = 1;
        iptLengthMax.id = EasyJsonForm.getElementId();
        iptLengthMax.value = this.spec.length.max;
        iptLengthMax.onchange = () => {this.spec.length.max = iptLengthMax.value; updateCallback();};
        editor.appendChild(lblLengthMax);
        editor.appendChild(iptLengthMax);
        return editor;
    }

    formFieldCreate(ejf, position, withValidation = false) {
        let validationError = (withValidation && this.validate().length > 0);
        let lblFormField = ejf.ejfElement('label', 'FieldTextLabel', validationError ? 'ValidationErrorLabel' : null);
        lblFormField.htmlFor = `${ejf.id}[${position}]`;
        lblFormField.innerHTML = `${this.label}${this.helpText()}`;
        let spnCounter = ejf.ejfElement('span', 'FieldTextInfo');
        let iptFormField = this.spec.multiline ? 
            ejf.ejfElement('textarea', 'fieldTextInput', validationError ? 'ValidationErrorInput' : null):
            ejf.ejfElement('input', 'fieldTextInput', validationError ? 'ValidationErrorInput' : null);
        iptFormField.disabled = ejf.options.disabled || false;
        iptFormField.id = `${ejf.id}[${position}]`;
        iptFormField.name = `${ejf.id}[${position}]`;
        iptFormField.value = this.value;
        iptFormField.onkeyup = () => {
            this.value = iptFormField.value;
            switch (this.spec.length.measure) {
                case 'bycharacter':
                    let characters = iptFormField.value;
                    spnCounter.textContent = EasyJsonForm.dictionary['item.text.character.count'].replace('{{chars}}', characters.length);
                    if (characters.length < this.spec.length.min || characters.length > this.spec.length.max)
                        spnCounter.setAttribute('role', 'alert');
                    else
                        spnCounter.removeAttribute('role');
                    break;
                case 'byword':
                    let words = iptFormField.value.match(/\S+/g) || [];
                    spnCounter.textContent = EasyJsonForm.dictionary['item.text.word.count'].replace('{{words}}', words.length);
                    if (words.length < this.spec.length.min || words.length > this.spec.length.max)
                        spnCounter.setAttribute('role', 'alert');
                    else
                        spnCounter.removeAttribute('role');
                    break;
                default:
                    break;
            }
        };
        iptFormField.onkeyup();
        let formField = ejf.ejfElement('div', 'FieldText');
        formField.appendChild(lblFormField);
        formField.appendChild(spnCounter);
        formField.appendChild(iptFormField);
        if (validationError) formField.appendChild(this.validationErrorMessage(ejf));
        return formField;
    }

    formattedValue() {
        return this.value;
    }

    helpText() {
        let restrictions = [];
        if (this.mandatory) restrictions.push(EasyJsonForm.dictionary['common.helptext.mandatory']);
        if (this.spec.length.measure == 'byword')
            restrictions.push(EasyJsonForm.dictionary['common.helptext.length.by.word'].replace('{{min}}', this.spec.length.min).replace('{{max}}', this.spec.length.max));
        if (this.spec.length.measure == 'bycharacter')
            restrictions.push(EasyJsonForm.dictionary['common.helptext.length.by.character'].replace('{{min}}', this.spec.length.min).replace('{{max}}', this.spec.length.max));
        return (restrictions.length == 0) ? 
            '' :
            EasyJsonForm.dictionary['common.helptext'].replace('{{help-text}}',
            restrictions.join(EasyJsonForm.dictionary['common.helptext.separator']));
    }

    validate() {
        let result = [];
        if (this.mandatory && this.value == '') 
            result.push(['validation.error.mandatory']);
        if (this.spec.length.measure == 'bycharacter') {
            let numberOfCharacters = this.value.length;
            if (numberOfCharacters < this.spec.length.min)
                result.push(['validation.error.less.than.minimum.chars.accepted']);
            else if (numberOfCharacters > this.spec.length.max)
                result.push(['validation.error.more.than.maximum.chars.accepted']);
        }
        else if (this.spec.length.measure == 'byword') {
            let words = this.value.match(/\S+/g) || [];
            if (words.length < this.spec.length.min)
                result.push(['validation.error.less.than.minimum.words.accepted']);
            else if (words.length > this.spec.length.max)
                result.push(['validation.error.more.than.maximum.words.accepted']);
        }
        return result;
    }
}

class EasyJsonFormFieldTextgroup extends EasyJsonFormField {
    constructor(json = null) {
        super(json);
        if (this.spec === null) this.spec = 
        {
            items:[1, 2, 3],   // array containing values
        };
        if (this.value === null) this.value = Array(this.spec.items.length).fill('');
        this.type = 'textgroup';
    }

    builderEditor(updateCallback) {
        let editor = super.builderEditor(updateCallback);
        // Items field
        let lblItems = document.createElement('label');
        lblItems.htmlFor = EasyJsonForm.newElementId();;
        lblItems.innerHTML = `${EasyJsonForm.dictionary['item.spec.items']}
        <br/><small>${EasyJsonForm.dictionary['item.spec.items.help']}</small>`;
        let txaItems = document.createElement('textarea');
        txaItems.id = EasyJsonForm.getElementId();
        txaItems.value = this.spec.items.join('\n');
        txaItems.onchange = () => {this.spec.items = txaItems.value.split('\n'); this.value = Array(this.spec.items.length).fill(''); updateCallback();};
        editor.appendChild(lblItems);
        editor.appendChild(txaItems);
        return editor;
    }

    formFieldCreate(ejf, position, withValidation = false) {
        let validationError = (withValidation && this.validate().length > 0);
        let lblFormField = ejf.ejfElement('label', 'FieldTextgroupLabel', validationError ? 'ValidationErrorLabel' : null);
        lblFormField.innerHTML = `${this.label}${this.helpText()}`;
        let formGroup = ejf.ejfElement('span', 'FieldTextgroupGroup');
        this.spec.items.forEach((element, index) => {
            let lblCheck = ejf.ejfElement('label', 'FieldTextgroupItemLabel');
            lblCheck.htmlFor = `${ejf.id}[${position}][${index}]`;
            lblCheck.textContent = element;
            let iptCheck = ejf.ejfElement('input', 'FieldTextgroupItemInput', validationError ? 'ValidationErrorInput' : null);
            iptCheck.type = 'text';
            iptCheck.disabled = ejf.options.disabled || false;
            iptCheck.id = `${ejf.id}[${position}][${index}]`;
            iptCheck.name = `${ejf.id}[${position}][${index}]`;
            iptCheck.value = this.value[index];
            iptCheck.onchange = () => {this.value[index] = iptCheck.value};
            let item = ejf.ejfElement('span', 'FieldTextgroupItem');
            item.appendChild(lblCheck);
            item.appendChild(iptCheck);
            if (validationError) item.appendChild(this.validationErrorMessage(ejf));
            formGroup.appendChild(item);
        });
        let formField = ejf.ejfElement('div', 'FieldTextgroup');
        formField.appendChild(lblFormField);
        formField.appendChild(formGroup);
        return formField;
    }

    formattedValue() {
        return this.value;
    }

    validate() {
        if (this.mandatory) {
            let valid = true;
            for (const val of this.value) if (val == '') valid = false;
            return valid ? [] : ['validation.error.please.fill.all.fields'];
        }
        else
            return [];
    }
}

class EasyJsonForm {
    constructor(id, structure = null, style = null, options = null) {
        if (id) this.id = id;
        else throw new Error('Id is mandatory');
        this.structureImport(structure || []);
        this.style = style || {};
        this.options = options || {};
    }

    ejfElement(htmlTagName, styleName = null, validationStyleName = null) {
        let element = document.createElement(htmlTagName);
        if (styleName && this.style[styleName]) {
            if (this.style[styleName].classList)
                this.style[styleName].classList.forEach(x =>element.classList.add(x));
            if (this.style[styleName].style)
                for (const [key, value] of Object.entries(this.style[styleName].style))
                    element.style[`${key}`] = value;
        }
        if (styleName) element.classList.add(`ejf${styleName}`);
        if (validationStyleName && this.style[validationStyleName]) {
            if (this.style[validationStyleName].classList)
                this.style[validationStyleName].classList.forEach(x =>element.classList.add(x));
            if (this.style[validationStyleName].style)
                for (const [key, value] of Object.entries(this.style[validationStyleName].style))
                    element.style[`${key}`] = value;
        }
        if (validationStyleName) element.classList.add(`ejf${validationStyleName}`);
        return element;
    }

    /**
     * Creates the EasyJsonForm Builder element to be added in the page.
     */
    builderGet() {
        if (!this.builder) {
            // Creating builder element
            this.builder = this.ejfElement('div', 'Builder');

            // Creating toolbar
            this.builderToolbar = this.ejfElement('div', 'BuilderToolbar');

            // Inserting add buttons to the toolbar 
            for (const [type, classs] of Object.entries(EasyJsonForm.registeredClasses)) {
                let button = this.ejfElement('button', 'BuilderToolbarButton');
                button.disabled = this.options.disabled || false;
                button.type = 'button';
                button.innerHTML = EasyJsonForm.iconAdd + EasyJsonForm.dictionary[`item.${type}`];
                button.onclick = () => {
                    this.structure.push(new classs(
                        {label: EasyJsonForm.dictionary[`common.label.new`].replace('{{field-type}}', EasyJsonForm.dictionary[`item.${type}`])}
                    ));
                    this.builderUpdate();
                    if (this.options.onStructureChange) this.options.onStructureChange();
                };
                this.builderToolbar.appendChild(button);
            }

            // Creating table
            let builderTable = this.ejfElement('table', 'BuilderTable');
            builderTable.appendChild(document.createElement('tbody'));
            this.builder.appendChild(builderTable);
            this.builderUpdate();
        }
        return this.builder;
    }

    builderMoveItem(position, offset) {
        if (position+offset >= this.structure.length || position+offset < 0) return;
        let currentItem = this.structure[position];
        let movedItem = this.structure[position+offset];
        this.structure[position+offset] = currentItem;
        this.structure[position] = movedItem;
        this.builderUpdate();
        if (this.options.onStructureChange) this.options.onStructureChange();
    }

    builderUpdate() {
        let tbody = this.builder.children[0].children[0];
        while (tbody.rows.length > 0) tbody.deleteRow(-1);
        this.structure.forEach((element, i) => {
            let tr = tbody.insertRow(-1);

            let mainTd = tr.insertCell(-1);
            mainTd.appendChild(element.formFieldCreate(this, i));
            mainTd.style.width = '90%';

            let toolbarTd = tr.insertCell(-1);
            let toolbar = this.ejfElement('div', 'BuilderFieldTooldbar');
            toolbarTd.appendChild(toolbar);

            let btnEdit = this.ejfElement('button', 'BuilderFieldTooldbarButton');
            btnEdit.disabled = this.options.disabled || false;
            btnEdit.type = 'button';
            btnEdit.innerHTML = EasyJsonForm.iconEdit;
            toolbar.appendChild(btnEdit);

            let btnEditFinish = this.ejfElement('button', 'BuilderFieldTooldbarButton');
            btnEditFinish.disabled = this.options.disabled || false;
            btnEditFinish.type = 'button';
            btnEditFinish.style.display = 'none';
            btnEditFinish.innerHTML = EasyJsonForm.iconOK;
            toolbar.appendChild(btnEditFinish);

            let btnMoveUp = this.ejfElement('button', 'BuilderFieldTooldbarButton');
            btnMoveUp.disabled = this.options.disabled || false;
            btnMoveUp.type = 'button';
            btnMoveUp.innerHTML = EasyJsonForm.iconUp;
            toolbar.appendChild(btnMoveUp);

            let btnMoveDown = this.ejfElement('button', 'BuilderFieldTooldbarButton');
            btnMoveDown.disabled = this.options.disabled || false;
            btnMoveDown.type = 'button';
            btnMoveDown.innerHTML = EasyJsonForm.iconDown;
            toolbar.appendChild(btnMoveDown);
            
            let btnDelete = this.ejfElement('button', 'BuilderFieldTooldbarDeleteButton');
            btnDelete.disabled = this.options.disabled || false;
            btnDelete.type = 'button';
            btnDelete.innerHTML = EasyJsonForm.iconDelete;
            toolbar.appendChild(btnDelete);

            btnEdit.onclick = () => {
                let editor = this.structure[i].builderEditor(() => {
                    mainTd.replaceChild(this.structure[i].formFieldCreate(this, i), mainTd.children[0]);
                    if (this.options.onStructureChange) this.options.onStructureChange();
                });
                mainTd.appendChild(editor);
                btnEdit.style.display = 'none';
                btnEditFinish.style.display = 'inline-block';
            };
            btnEditFinish.onclick = () => {
                mainTd.removeChild(mainTd.lastChild);
                btnEdit.style.display = 'inline-block';
                btnEditFinish.style.display = 'none';
            };
            btnMoveUp.onclick = () => this.builderMoveItem(i, -1);
            btnMoveDown.onclick = () => this.builderMoveItem(i, +1);
            btnDelete.onclick = () => {
                if(confirm(EasyJsonForm.dictionary['builder.message.delete'].replace('{{position}}', i+1)))
                {
                    this.structure.splice(i, 1);
                    this.builderUpdate();
                    if (this.options.onStructureChange) this.options.onStructureChange();
                }
            };
        });
        let lastRow = tbody.insertRow(-1).insertCell(-1);
        lastRow.colSpan = 2;
        lastRow.appendChild(this.builderToolbar);
    }

    formGet() {
        if (!this.form) {
            this.form = this.ejfElement('form', 'Form');
            this.form.id = this.id;
            this.formUpdate();
        }
        return this.form;
    }

    formUpdate(withValidation = false) {
        while (this.form.firstChild) this.form.removeChild(this.form.firstChild);
        this.structure.forEach((element, index) => {
            this.form.appendChild(element.formFieldCreate(this, index, withValidation));
        });
    }

    structureExport() {
        return(JSON.parse(JSON.stringify(this.structure)));
    }

    structureImport(structure) {
        this.structure = [];
        structure.forEach(element => {
            let classs = EasyJsonForm.registeredClasses[element.type];
            if (classs) this.structure.push(new classs(element));
        });
        if (this.builder) this.builderUpdate();
        if (this.form) this.formUpdate();
    }

    // Resources
    static newElementId = () => `ejf-${++EasyJsonForm.elementId}`;
    static getElementId = () => `ejf-${EasyJsonForm.elementId}`;
    static elementId = 0;
    static registeredClasses = {
        'text': EasyJsonFormFieldText,
        'textgroup': EasyJsonFormFieldTextgroup,
        'number': EasyJsonFormFieldNumber,
        'singlechoice': EasyJsonFormFieldSingleChoice,
        'multiplechoice': EasyJsonFormFieldMultipleChoice,
        'file': EasyJsonFormFieldFile,
    };
    static supportedFileTypes = {
        'application/pdf' : {extensions:['pdf']},
        'image/gif' : {extensions:['gif']},
        'image/png' : {extensions:['png']},
        'image/jpeg': {extensions:['jpeg','jpg','jpe']},
        'image/bmp': {extensions:['bmp']},
        'application/msword': {extensions:['doc']},
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {extensions:['docx']},
        'application/vnd.ms-excel': {extensions:['xls']},
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {extensions:['xlsx']},
        'application/vnd.ms-powerpoint': {extensions:['ppt']},
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': {extensions:['pptx']},
    }
    static iconAdd = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg>';
    static iconDelete = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eraser" viewBox="0 0 16 16"><path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/></svg>';
    static iconDown = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>';
    static iconEdit = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>';
    static iconOK = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>';
    static iconUp = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>';
    static dictionary = {
        "builder.message.delete": "Are you sure you want to delete item at position {{position}}?",
        "common.helptext": " <small>({{help-text}})</small>",
        "common.helptext.length.by.character": "min. characters: {{min}}, max. characters: {{max}}",
        "common.helptext.length.by.word": "min. words: {{min}}, max. words: {{max}}",
        "common.helptext.mandatory": "mandatory",
        "common.helptext.separator": ", ",
        "common.label.new": "New {{field-type}}",
        "common.value.no": "No",
        "common.value.yes": "Yes",
        "item.file": "File",
        "item.file.helptext.filetypes": "file types: {{file-types}}",
        "item.file.helptext.filetypes.all": "all",
        "item.file.helptext.maxsize": "maximum size: {{size}} MB",
        "item.file.spec.filetypes": "Allowed filetypes",
        "item.file.spec.maxsize": "Maximum size (MB)",
        "item.file.vaule.uploaded.file": "Uploaded file",
        "item.textgroup": "Text group",
        "item.multiplechoice": "Multiple choice",
        "item.singlechoice": "Single choice",
        "item.singlechoice.value.null": ">> Select",
        "item.spec.customattribute": "Custom attribute",
        "item.spec.label": "Label",
        "item.spec.items": "Items",
        "item.spec.items.help": "One per line",
        "item.spec.mandatory": "Mandatory",
        "item.number": "Number",
        "item.text": "Text",
        "item.text.character.count": "{{chars}} characters",
        "item.text.spec.length.max": "Maximum length",
        "item.text.spec.length.measure": "Restrict length",
        "item.text.spec.length.measure.bycharacter": "By character",
        "item.text.spec.length.measure.byword": "By word",
        "item.text.spec.length.measure.no": "No",
        "item.text.spec.length.min": "Minimum length",
        "item.text.spec.multiline": "Multiple lines (text area)",
        "item.text.word.count": "{{words}} words",
        "validation.error.mandatory": "{{field-label}} is mandatory",
        "validation.error.please.select.one.option": "Please select at least one option",
        "validation.error.less.than.minimum.chars.accepted":"Less characters than the minimum accepted",
        "validation.error.more.than.maximum.chars.accepted":"More characters than the maximum accepted",
        "validation.error.less.than.minimum.words.accepted":"Less words than the minimum accepted",
        "validation.error.more.than.maximum.words.accepted":"More words than the maximum accepted",
        "validation.error.please.fill.all.fields":"Please fill all fields",
    };
}