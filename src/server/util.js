
function encodingBASE64(data){
    //let buff = new Buffer(data);
    let buff = new Buffer.from(data);
    let base64data = buff.toString('base64');
    return base64data;
}

function decodingBASE64(data){
    //let buff = new Buffer(data, 'base64');
    let buff = new Buffer.from(data);
    let text = buff.toString('ascii');
    return text;
}

exports.encodingBASE64 = encodingBASE64;
exports.decodingBASE64 = decodingBASE64;
