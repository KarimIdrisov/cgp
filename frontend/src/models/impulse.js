export default function impulse(start, samples, fd,  argument, notObject=false) {
    const dataTmp = []
    localStorage.setItem('impulse', argument)
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push((i === +argument ? 1 : 0).toString())
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': i === +argument ? 1 : 0,
                'x': (new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime()
            })
        }
        return dataTmp
    }
}
