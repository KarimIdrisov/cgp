export default function sin(samples, fd,  amplitude, circle, startPhase, notObject=false) {
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
                'x': i
            })
        }
        return dataTmp
    }
}