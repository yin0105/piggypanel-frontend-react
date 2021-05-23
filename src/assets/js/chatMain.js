export const removeQuotes = s => {
    if (s.length > 1) {
        return s.substr(1, s.length - 2);
    } else {
        return s
    }
}