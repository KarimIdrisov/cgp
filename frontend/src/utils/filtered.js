export default function filtered(array) {
    return array.filter(function (el) {
        return el != null;
    });
}