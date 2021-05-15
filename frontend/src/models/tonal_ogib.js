export default function tonal_ogib(samples, fd, amplitude, ogib, nesuch, startPhase, glubina, notObject=false) {
    const dataTmp = []
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(amplitude * (1 + +glubina * Math.cos(2 * Math.PI * +ogib * i)) * Math.cos(2 * Math.PI * +nesuch * i + +startPhase))
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': amplitude * (1 + +glubina * Math.cos(2 * Math.PI * +ogib * i)) * Math.cos(2 * Math.PI * +nesuch * i + +startPhase),
                'x': i
            })
        }
        return dataTmp
    }
}