export default function sin(start, samples, fd,  amplitude, circle, startPhase, notObject=false) {
    const dataTmp = []
    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(+amplitude * Math.sin(i * +circle + +startPhase))
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': +amplitude * Math.sin(i * +circle + +startPhase),
                'x': (new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime()
            })
        }
        return dataTmp
    }
}