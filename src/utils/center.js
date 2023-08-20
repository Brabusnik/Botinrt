module.exports = (string, width) => {
    const lines = string.split('\n'); // Разбиваем на массив строк
    const maxLength = lines.reduce((max, line) => Math.max(max, line.length), 0); // Находим максимальную длину строки в массиве

    let leftPadding = Math.floor((width - maxLength) / 2); // Вычисляем отступ слева

    let out = "";

    leftPadding = Math.abs(leftPadding)

    lines.forEach(line => {
        let rightPadding = width - line.length - leftPadding; // Вычисляем отступ справа
        rightPadding = Math.abs(rightPadding)
        out += ' '.repeat(leftPadding) + line + ' '.repeat(rightPadding) + "\n"
    });

    out = out.substring(0, out.length - 1);
    return out;
}