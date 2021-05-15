export default function exponent(samples, fd, argument, notObject=false) {
    const dataTmp = []
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push( Math.pow(+argument, i))
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y':  Math.pow(+argument, i),
                'x': i
            })
        }
        return dataTmp
    }
}