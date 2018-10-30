'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = [];

function phoneIsValid(phone) {

    return phone && phone.length === 10 && !phone.match(/[^0-9]/gi) && !isNaN(Number(phone));
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (typeof name !== 'string' || !name || !phoneIsValid(phone)) {
        return false;
    }

    let checkPhoned = phoneBook.some(function (record) {

        return record.phone === phone;
    });

    if (!checkPhoned) {
        phoneBook.push({ name, phone, email });

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (typeof name !== 'string' || !(name.length > 0)) {
        return false;
    }
    let indexPhoned = -1;
    let findPhoned = phoneBook.some(function (record, index) {
        indexPhoned = index;

        return record.phone === phone;
    });
    if (findPhoned && name) {
        phoneBook[indexPhoned].name = name;
        phoneBook[indexPhoned].phone = phone;
        phoneBook[indexPhoned].email = email;

        return true;
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === '*') {
        let result = phoneBook.length;
        phoneBook = [];

        return result;
    }
    if (query === '') {
        return 0;
    }
    let result = phoneBook.filter(function (record) {
        if (record.name.indexOf(query) !== -1 || record.phone.indexOf(query) !== -1) {
            return true;
        }
        if (record.email) {
            return record.email.indexOf(query) !== -1;
        }

        return false;
    });
    result.forEach(element => {
        phoneBook.splice(phoneBook.indexOf(element), 1);
    });

    return result.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let result = [];
    if (query === '') {
        return result;
    }
    if (query === '*') {
        for (let i = 0; i < phoneBook.length; i++) {
            result.push(outString(phoneBook[i].name, phoneBook[i].phone, phoneBook[i].email));

        }
    }
    function checkRecord(record) {
        if (record.name.indexOf(query) > -1 || record.phone.indexOf(query) > -1) {
            return true;
        }
        if (record.email) {
            return record.email.indexOf(query) > -1;
        }

        return false;

    }
    let res = phoneBook.filter(checkRecord);
    for (let j = 0; j < res.length; j++) {
        result.push(outString(res[j].name, res[j].phone, res[j].email));
    }

    return result.sort();
}

function outString(name, phone, email) {
    let result = name;
    if (phone !== undefined) {
        result = `${result}, ${makeFormatPhone(phone)}`;
    }
    if (email !== undefined) {
        result = `${result}, ${email}`;
    }

    return result;
}

function makeFormatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
     phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

function addRecordInBook(record) {
    const cont = record.split(';');
    const name = cont[0];
    const phone = cont[1];
    const email = cont[2];
    if (add(phone, name, email) ||
        update(phone, name, email)) {
        return true;
    }

    return false;
}


/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {

    const book = csv.split('\n');
    const addRecord = book.reduce((accum, elem) => {
        return accum + addRecordInBook(elem);
    }, 0);

    return addRecord;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
