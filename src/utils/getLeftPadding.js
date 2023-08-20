module.exports = (string, width) => {
    const lines = string.split('\n'); // Разбиваем на массив строк
    const maxLength = lines.reduce((max, line) => Math.max(max, line.length), 0); // Находим максимальную длину строки в массиве

    let leftPadding = Math.floor((width - maxLength) / 2); // Вычисляем отступ слева

    let out = "";

    return Math.abs(leftPadding)
}