module.exports = (int) => {
    int = int.toString();
    return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
}