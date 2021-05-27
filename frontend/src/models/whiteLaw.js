import frand from "../utils/frand";

export default function whiteLaw(start, samples, fd, average, dispersion, notObject=false) {
    const dataTmp = []

    if (notObject) {
        for (let i = 0; i < samples; i++) {
            let frand12 = 0
            for (let i = 0; i < 12; i++) {
                frand12 += frand()
            }
            dataTmp.push(+average + Math.sqrt(+dispersion) * (+frand12 - 6))
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            let frand12 = 0
            for (let i = 0; i < 12; i++) {
                frand12 += frand()
            }
            dataTmp.push({
                'y': +average + Math.sqrt(+dispersion) * (+frand12 - 6),
                'x': (new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime()
            })
        }
        return dataTmp
    }
}
