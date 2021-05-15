export default function pila(samples, fd, period, notObject=false) {
    const dataTmp = []
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push((i % +period) / 2)
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': (i % +period) / 2,
                'x': i
            })
        }
        return dataTmp
    }
}