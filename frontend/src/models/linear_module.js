export default function linear_module(time, samples, fd, amplitude, start, end, startPhase, notObject=false) {
    const dataTmp = []
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(amplitude * Math.cos(2 * Math.PI * ((+start + ((+end - +start) * i) / (samples * (1 / fd))) * i) + +startPhase))
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': amplitude * Math.cos(2 * Math.PI * ((+start + ((+end - +start) * i) / (samples * (1 / fd))) * i) + +startPhase),
                'x': (new Date(time.getTime() + (i * (1 / fd)) * 1000)).getTime()
            })
        }
        return dataTmp
    }
}