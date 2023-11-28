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
		'Спидранерский телепорт',
		'Штраф за превышение',
		
		

    ],
    effects: [
        'Фантомные штаны',
		'Шоколад Вадима',
		'Свиток реролла',
		'Внезапное озарение',
		'Бутылочка молочка',
		'Четырехлистный клевер',
		'Ремонтный набор',
		'Интрига',
		'Тот самый куст',
		'Два по цене одного',
		'Плюсовый блокнот',
		'Спойлер',
		'Мидас',
		'Красочная манга',
		'Озолочение какиша',
		'Кулер удачи',
		'Третий глаз',
		'Читерский кубик',
		'ТРИ!',
		'Активация Windows',
		'Аегис',
		'Парные кольца времени',
		'Спидранерский телепорт'

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
		'Возвращение Киромы',
        'Кубик хуюбика',
        'Взрывчатка',
		'Интрига',
        'Маска Канеки Кека',
        'Тухлая шаверма',
		'Штраф за превышение',
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
				47,
				48,
				49
			];
			result = '../hpg-inventory/images/0' + ('0' + (mapping3[index])).slice(-2) + '.png';
			break;
			
        case "effects":
			const mapping2 = [
				2,
				3,
				4,
				10,
				13,
				16,
				17,
				18,
				21,
				20,
				24,
				30,
				31,
				36,
				38,
				39,
				40,
				41,
				42,
				43,
				44,
				47,
				48
			];
			result = '../hpg-inventory/images/0' + ('0' + (mapping2[index])).slice(-2) + '.png';
			break;


        case "debuffs":
            const mapping = [
                5,
				9,
                12,
                14,
				18,
                28,
                46,
				49
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
		['videos/All Star but they don\'t stop coming pitch corrected.mp4', 20],
		['videos/Сыновья России. Кто пчелок уважает.mp4', 26],
		['videos/Пузантос - Бумаги [Morrowind].mp4', 129],
		['videos/Every_Mirage_Match_Ever.mp4', 18],
		//['videos/Чем занимался Пин в сороковые.mp4', 4],
		['videos/Top Gear in Skyrim goes wrong.mp4', 18],
		['videos/Бразильский мальчик поёт.mp4', 8],
		['videos/Rovio.mp4',5],
		'videos/Old Gods2.mp4',
		'videos/the rain.mp4',
		//['videos/Diamond.mp4',49],
	    ['videos/Убийца Стас Барецкий.mp4',10],
		['videos/Папич-марш  прощание славянки .9мая.mp4', 7],
		'videos/ultdank.mp4',
		//'videos/Дугин о борьбе с депрессией.mp4',
		'videos/This is my Kingdom Come.mp4',
		'videos/W.mp4',
		'videos/Me and Michael.mp4',
		'videos/Shadow Wizard Money Gang but Baldurs Gate 3.mp4',
		'videos/Arab Patrick Bateman Arabian Psycho.mp4',
		'videos/ec3580.mp4',
		'videos/[Re-upload] [1080p] HONK HONK.mp4',
		'videos/6 отвлекающих кадров.mp4',
		'videos/Music make you lose control triangle.mp4',
		//'videos/02.mp4',
		//'videos/04.mp4',
		'videos/06.mp4',
		'videos/We Are Number One but its woahed by Crash Bandicoot.mp4',
		'videos/18.mp4',
        'videos/19.mp4',
		'videos/Half_lifes.mp4',
		'videos/billy.mp4',
		'videos/gavno.mp4',
		'videos/gonshik.mp4',
		'videos/hey.mp4',
		'videos/karta.mp4',
		'videos/kasino.mp4',
		'videos/petecat.mp4',
		'videos/rikroll.mp4',
		'videos/wide-putin-ascii.mp4',
		'videos/Кит.mp4',
        
        

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
