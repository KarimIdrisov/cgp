export default function linear_module(samples, fd, amplitude, start, end, startPhase, notObject=false) {
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
                'x': i
            })
        }
        return dataTmp
    }
}