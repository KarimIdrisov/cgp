export default function sort(array) {
    return [...array].sort(function (a, b) {
        return a - b;
    })
}