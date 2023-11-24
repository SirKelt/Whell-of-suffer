/*
 * Copyright (c) 2020. shtrih
 */

const dataSets = {
    inventory: [
        'Аптечка с подвохом',
		'Фантомные штаны',
        'Шоколад Вадима',
		'Свиток реролла',
		'Эстонские часы',
		'Бомж с "Товарищества"',
		'Выбор зумера',
		'Скрытый пул первые 50%',
		'Возвращение Киромы',
		'Внезапное озарение',
		'Тимочка',
		'Кубик хуюбика',
		'Бутылочка молочка',
		'Взрывчатка',
		'Внезапная обида',
		'Четырехлистный клевер',
		'Ремонтный набор',
		'Интрига',
		'Камера Сережи',
		'Два по цене одного',
		'Тот самый куст',
		'Лидер лобби',
		'Долгожданный SI game',
		'Плюсовый блокнот',
		'Орел или решка',
		'Выбор бумера',
		'Проклятие водоноса',
		'Маска Канеки Кека',
		'Переобувочка в воздухе',
		'Спойлер',
		'Мидас',
		'Ребилд по-дварфовски',
		'Скрытый пул вторые 50%',
		'Калькулятор Вадима',
		'Вейп Никиты',
		'Красочная манга',
		'Минное поле',
		'Озолочение какиша',
		'Кулер удачи',
		'Третий глаз',
		'Читерский кубик',
		'ТРИ!',
		'Активация Windows',
		'Аегис',
		'Тихий тиминг',
		'Тухлая шаверма',
		'Парные кольца времени',
		
		

    ],
    effects: [
        'Фантомные штаны',
		'Шоколад Вадима',
		'Свиток реролла',
		'Бутылочка молочка',
		'Четырехлистный клевер',
		'Ремонтный набор',
		'Тот самый куст',
		'Плюсовый блокнот',
		'Спойлер',
		'Мидас',
		'Третий глаз',
		'Читерский кубик',
		'Аегис',
		'Парные кольца времени',

    ],
    coin: [
        'Орёл',
        'Решка',
        'Орёл',
        'Решка',
        'Орёл',
        'Решка',
        'Орёл',
        'Решка',
        'Орёл',
        'Решка',
        'Ребро!',
    ],
    players: [
        'Rextrel',
        'Sir_Kelt',
        'Ora',
        'LeEblan',
        'LiStOw',
        'ZBZ',
		'Slavutich',
		'Lentilles',
		'SuperAdolf',
    ],
    debuffs: [
        'Эстонские часы',
        'Кубик хуюбика',
        'Взрывчатка',
        'Маска Канеки Кека',
        'Тухлая шаверма',
    ]
};
let currentDataSet = 'inventory',
    editedDataSets = {};

const editDialog = document.getElementById('dialog-edit'),
    editButton = document.getElementById('btn-edit'),
    editConfirmButton = editDialog.getElementsByClassName('apply')[0],
    editOptions = editDialog.getElementsByClassName('options')[0],
    editPresets = editDialog.getElementsByClassName('presets')[0],
    optionClick = function (option, checked) {
        editedDataSets[currentDataSet][option] = checked;
    },
    generateOptions = function (dataObject) {
        let options = '';
        for (let i in dataObject) {
            options += `<label><input type="checkbox" onchange="optionClick('${i}', this.checked)" ${dataObject[i] ? 'checked' : ''} />${i}</label><br />`;
        }

        return options;
    },
    resetEditedDataSet = function () {
        editedDataSets[currentDataSet] = Object.fromEntries(dataSets[currentDataSet].map(v => v).sort().map(v => [v, true]));
    },
    editedDataToArray = function () {
        let result = [];

        for (let [key, value] of Object.entries(editedDataSets[currentDataSet])) {
            if (value) {
                result.push(key)
            }
        }

        return result;
    }
;

editButton.addEventListener('click', function () {
    if (currentDataSet === 'custom') {
        p5Instance.mouseDragEnable(false);
        customDialog.style.display = 'block';

        return;
    }

    editDialog.style.display = 'block';
    p5Instance.mouseDragEnable(false);

    editPresets.innerHTML = '';
    editPresets.append(...presets.getNodes(currentDataSet));
    editOptions.innerHTML = generateOptions(editedDataSets[currentDataSet]);
});
editConfirmButton.addEventListener('click', function () {
    editDialog.style.display = 'none';
    p5Instance.mouseDragEnable();

    p5Instance.setData(editedDataToArray());
});

class Preset {
    constructor(title, disabledEntries, isDefault) {
        this._title = title;
        this._disabledEntries = disabledEntries;
        this._isDefault = Boolean(isDefault);
    }

    get isDefault() {
        return this._isDefault;
    }

    get domNode() {
        const el = document.createElement('a');

        el.setAttribute('href', '#');
        el.appendChild(document.createTextNode(this._title));
        el.addEventListener('click', this.handleClick.bind(this));

        return el;
    }

    handleClick() {
        resetEditedDataSet();

        for(const i in this._disabledEntries) {
            if (editedDataSets[currentDataSet][this._disabledEntries[i]]) {
                editedDataSets[currentDataSet][this._disabledEntries[i]] = false;
            }
        }

        editOptions.innerHTML = generateOptions(editedDataSets[currentDataSet]);

        return false;
    }
}

class PresetAll extends Preset {
    constructor(isDefault) {
        super('Выбрать всё', [], isDefault);
    }
}

class PresetWithoutSpecialRolls extends Preset {
    constructor(isDefault) {
        super(
            'Без спецроллов',
            [
                'Чуйка на говно',
                'Выбор Бумера',
                'Выбор Зумера',
                'Чат здесь закон',
                'Я здесь закон',
                'Never Lucky',
            ],
            isDefault
        );
    }
}

class Presets {
    constructor() {
        this._presets = {
            // inventory: [
            //     new PresetAll(),
            // ],
            effects: [
                new PresetAll(),
                new PresetWithoutSpecialRolls(true),
            ],
            debuffs: [
                new PresetAll(),
                new PresetWithoutSpecialRolls(true),
            ],
            streamers: [
                new PresetAll(),
            ],
        };
    }

    hasPreset(dataSetKey) {
        return !!this._presets[dataSetKey];
    }

    getNodes(dataSetKey) {
        let result = [];

        for(const i in this._presets[dataSetKey]) {
            if (i % 2) {
                result.push(document.createTextNode(', '));
            }
            result.push(this._presets[dataSetKey][i].domNode);
        }

        return result;
    }

    applyDefaults(dataSetKey) {
        for(const i in this._presets[dataSetKey]) {
            if (this._presets[dataSetKey][i].isDefault) {
                this._presets[dataSetKey][i].handleClick();
            }
        }
    }
}

const presets = new Presets;

function getImageURI(index) {
    let result = '../hpg-inventory/images/000.png',
        offset = 0
    ;
    switch (currentDataSet) {
        case "inventory":
			const mapping3 = [
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11,
				12,
				13,
				14,
				15,
				16,
				17,
				18,
				19,
				20,
				21,
				22,
				23,
				24,
				25,
				26,
				27,
				28,
				29,
				30,
				31,
				32,
				33,
				34,
				35,
				36,
				37,
				38,
				39,
				40,
				41,
				42,
				43,
				44,
				45,
				46,
				47
			];
			result = '../hpg-inventory/images/0' + ('0' + (mapping3[index])).slice(-2) + '.png';
			break;
			
        case "effects":
			const mapping2 = [
				2,
				3,
				4,
				13,
				16,
				17,
				21,
				24,
				30,
				31,
				40,
				41,
				44,
				47
			];
			result = '../hpg-inventory/images/0' + ('0' + (mapping2[index])).slice(-2) + '.png';
			break;


        case "debuffs":
            const mapping = [
                5,
                12,
                14,
                28,
                46
            ];
            result = '../hpg-inventory/images/0' + ('0' + (mapping[index])).slice(-2) + '.png';
            break;

        case "coin":
            result = '../images/coin-obverse-20.png';
            if (index === 1) {
                result = '../images/coin-reverse-20.png';
            }
            if (index === 10) {
                result = '../images/coin-gurt.png';
            }
            break;

        case "players":
            result = '../images/streamers/'+ dataSets[currentDataSet][index] +'.png';
            break;
    }

    return result;
}


const p5Instance = new p5(wheelSketch);

p5Instance.onAfterSetup = function () {
    p5Instance.setVideos([
		//['videos/All Star but they don\'t stop coming pitch corrected.mp4', 20],
		//['videos/Сыновья России. Кто пчелок уважает.mp4', 26],
		//['videos/Пузантос - Бумаги [Morrowind].mp4', 129],
		['Every Mirage Match Ever.mp4', 17],
		//'videos/[Re-upload] [1080p] HONK HONK.mp4',
		//'videos/6 отвлекающих кадров.mp4',
		//'videos/Music make you lose control triangle.mp4',
		//'videos/02.mp4',
		// 'videos/04.mp4',
		//'videos/06.mp4',
        
        

    ]);
};

const image = document.querySelector('#item-image img');
p5Instance.onSelectItem = function(data, selectedKey) {
    if (dataSets[currentDataSet]) {
        image.src = getImageURI(dataSets[currentDataSet].indexOf(data[selectedKey]));
    }
    else {
        image.src = '../hpg-inventory/images/000.png';
    }
};

const customDialog = document.getElementById('custom-list'),
    customTextarea = customDialog.getElementsByTagName('textarea')[0],
    customButton = customDialog.getElementsByTagName('button')[0]
;

customButton.addEventListener('click', function () {
    customDialog.style.display = 'none';

    p5Instance.setData(customTextarea.value.split('\n'));
    p5Instance.mouseDragEnable();
});

let radios = document.querySelectorAll('[name="list"]');
for(let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('click', function () {
        currentDataSet = this.value;

        if (this.value === 'custom') {
            p5Instance.mouseDragEnable(false);
            customDialog.style.display = 'block';

            return;
        }

        customDialog.style.display = 'none';
        p5Instance.mouseDragEnable();

        if (presets.hasPreset(currentDataSet)) {
            if (!editedDataSets[currentDataSet]) {
                resetEditedDataSet();
                presets.applyDefaults(currentDataSet);
            }

            p5Instance.setData(editedDataToArray());
            editButton.removeAttribute('disabled');
        }
        else {
            p5Instance.setData(dataSets[currentDataSet]);
            editButton.setAttribute('disabled', 'disabled');
        }
    });

    // Выбираем начальный вариант при загрузке страницы
    if (radios[i].hasAttribute('checked')) {
        radios[i].dispatchEvent(new Event('click'));
    }
}
