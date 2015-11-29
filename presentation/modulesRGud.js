function gud(num, callback) {
    for(num; num > 0; num--) {
        callback();
    }
}

module.exports = gud;
