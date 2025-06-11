function getCursor(cursorPosition) {
    let cursor = '', i = 1;
    while (i < cursorPosition) {
        cursor = cursor + '-';
        i = i + 1;
    }
    cursor = cursor + '^';
    return cursor;
}

function getSpaces(num) {
    let result = '';
    for (let i = 0; i < num; i++) {
        result = result + ' ';
    }
    return result;
}


function printList(errors, warningOrError) {

    for (let i in errors) {
        let error = errors[i];
        let location = error['location'];

        console.log(`'${location['templatePath']}':${location['line']}:${location['column']}: ${error['type'] || ''} ${warningOrError}: ${error['message']}`);
        console.log(location['lineTxt']);
        console.log(getCursor(location['column']));
        if ('references' in error) {
            console.log(getSpaces(4) + 'References:');
            for (let key in error['references']) {
                let reference = error['references'][key];
                let location = reference['location'];
                let message = reference['message'] || '';
                console.log(getSpaces(8) + `(${key}): '${location['templatePath']}':${location['line']}:${location['column']}${message}`);

                if ('lineTxt' in location) {
                    console.log(getSpaces(8) + location['lineTxt']);
                    console.log(getSpaces(8) + getCursor(location['column']));
                }

            }
        }
    }
}

function printResult(result) {
    const { errors, warnings } = result;
    if (errors.length > 0) {
        console.log("\nErrors:");
        printList(errors, 'error');
    }

    if (warnings.length > 0) {
        console.log("\nWarnings:")
        printList(warnings, 'warning')
    }
}

exports.printResult = printResult;