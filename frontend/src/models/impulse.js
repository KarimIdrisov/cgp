export default function impulse(samples, fd,  argument, notObject=false) {
    const dataTmp = []
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(i === +argument ? 1 : 0)
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': i === +argument ? 1 : 0,
                'x': i
            })
        }
        return dataTmp
    }
}
