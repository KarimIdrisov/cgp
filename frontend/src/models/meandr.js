export default function meandr(samples, fd,  period, notObject=false) {
    const dataTmp = []
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(i % +period > +period / 2 ? -1 : 1)
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': i % +period > +period / 2 ? -1 : 1,
                'x': i
            })
        }
        return dataTmp
    }
}