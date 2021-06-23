import frand from "../utils/frand";
import print from "../utils/print"

export default function regression(start, samples, fd, dispersion, p, r, pNums, rNums, notObject = false) {

    let xValues = []
    let yValues = []

    const dataTmp = []
    pNums = pNums.split(' ')
    rNums = rNums.split(' ')

    for (let i = 0; i < samples; i = i + 1) {
        xValues.push(nValues(dispersion));
        yValues.push(xValues[i] + sum(rNums, xValues) - sum(pNums, yValues))
    }
    print(xValues, yValues)

    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(yValues[i])
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': yValues[i],
                'x': (new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime()
            })
        }
        return dataTmp
    }

    function nValues(dispersion) {
        let x = 0;
        for (let i = 0; i < 12; i = i  + 1) {
            x += frand()
        }
        return (x - 6) * Math.sqrt(dispersion);
    }

    function sum(factor, values) {
        let answer = 0
        for ( let i = 0; i < factor.length && values.length - i - 1 >= 0; i = i + 1) {
            answer += factor[i] * values[values.length - i - 1];
        }
        return answer;
    }
}
