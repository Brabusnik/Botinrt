module.exports = (end) => {
    const diff = end - Date.now()
    return diff / (1000 * 60 * 60 * 24);
}