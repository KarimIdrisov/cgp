export default function exp_ogub(start, samples, fd, amplitude, ogib, nesuch, startPhase, notObject=false) {
    const dataTmp = []
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(amplitude * Math.exp(-i / +ogib) * Math.cos(2 * Math.PI * +nesuch * i + +startPhase))
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': amplitude * Math.exp(-i / +ogib) * Math.cos(2 * Math.PI * +nesuch * i + +startPhase),
                'x': (new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime()
            })
        }
        return dataTmp
    }
}