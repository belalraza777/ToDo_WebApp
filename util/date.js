module.exports = function formatDate(dateInput) {
    const date = new Date(dateInput);

    const options = {
        weekday: 'long',     // Saturday
        day: '2-digit',      // 14
        month: 'long',       // June
        year: 'numeric'      // 2025
    };

    return date.toLocaleDateString('en-IN', options);
}