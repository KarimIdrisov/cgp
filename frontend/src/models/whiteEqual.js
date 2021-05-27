import frand from "../utils/frand";

export default function whiteEqual(start, samples, fd, startInterval, endInterval, notObject=false) {
    const dataTmp = []
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(+startInterval + (+endInterval - +startInterval) * frand())
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': +startInterval + (+endInterval - +startInterval) * frand(),
                'x': (new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime()
            })
        }
        return dataTmp
    }
}
