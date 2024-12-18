/**
 * removes books published on `dayToOmit
 * @param {Array<Object>} jsonData 
 * @param {string|number} dayToOmit - the day we want to get rid of (either in string form or 0-6 as sunday to saturday)
 * @returns {Array<Object>}
 */
function removeDays(jsonData, dayToOmit) {
    const dayToOmitIdx = getDayIndex(dayToOmit);
    return jsonData.filter(item => {
        try {
            return !isDayExcluded(item.publish_date, dayToOmitIdx) // true if day published == day we are omitting
        } catch (err) {
            console.error(`item (id ${item.id}) has invalid date field: ${item.publish_date}: `, err.message)
            return false;
        }
    });
}

/**
 * gets the day in the form of a number if a string. if already a number, it validates that it lies within the correct range.
 * @param {string|number} day
 * @returns {number}
 * @throws {Error} - if day in the incorrect type or range
 */
function getDayIndex(day) {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    if (typeof day === "string") {
        const index = daysOfWeek.indexOf(day.toLowerCase());
        if (index === -1) {
            throw new Error(`Invalid day name: "${day}"; It should be one of ${daysOfWeek.join(', ')} (case insensitive)`);
        }
        return index;
    } else if (typeof day === "number") {
        if (day < 0 || day > 6) {
            throw new Error(`Invalid day index: ${day}. It should be between 0 and 6.`);
        }
        return day;
    } else {
        throw new Error(`Day should be a string or number, received type: ${typeof day}`);
    }
}

/**
 * checks if the publish_date is in 'yyyy-mm-dd' format.
 * @param {string} dateString 
 * @returns {boolean}
 */
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    return regex.test(dateString);
}

/**
 * converts the date as a string in the JSON data to a Date object
 * @param {string} dateString 
 * @returns {Date}
 * @throws {Error} - if date is incorrectly formatted in data
 */
function parseDate(dateString) {
    if (!isValidDate(dateString)) {
        throw new Error(`Invalid numerical component(s) in: "${dateString}"`);
    }
    
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(5, 7), 10) - 1; // first month is 0 in js
    const day = parseInt(dateString.slice(8, 10), 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(`Invalid numerical component(s) in: "${dateString}"`);
    }

    return new Date(year, month, day);
}

/**
 * checks if the day is the one we don't want!
 * @param {string} dateString - the date in the publish_date field of the item
 * @param {number} dayToOmitIdx - the day of the week as a number from 0-6
 * @returns {boolean}
 */
function isDayExcluded(dateString, dayToOmitIdx) {
    const date = parseDate(dateString);
    return date.getDay() === dayToOmitIdx;
}

module.exports = removeDays;