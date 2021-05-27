export default function multiplicativeSuperposition(time, models, samples, fd, first, args, notObject = false) {
    const dataTmp = []
    const res = []
    for (let i = 0; i < samples; i++) {
        res.push(1)
    }
    for (let i = 0; i < args.split(";").length; i++) {
        for (let j = 0; j < samples; j++) {
            res[j] *= +models[i][j] * +args.split(';')[i]
        }
    }

    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(+first * +res[i])
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': +first * +res[i],
                'x': (new Date(time.getTime() + (i * (1 / fd)) * 1000)).getTime()
            })
        }
        return dataTmp
    }
}