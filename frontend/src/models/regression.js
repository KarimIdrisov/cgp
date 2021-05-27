import frand from "../utils/frand";

export default function regression(start, samples, fd, dispersion, p, r, pNums, rNums, notObject = false) {
    const dataTmp = []
    pNums = pNums.split(' ')
    rNums = rNums.split(' ')

    if (notObject) {
        for (let i = 0; i < samples; i++) {
            dataTmp.push(getARMA(samples, dispersion, p, r, pNums, rNums)[0])
        }
        return dataTmp
    } else {
        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': getARMA(samples, dispersion, p, r, pNums, rNums)[0],
                'x': (new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime()
            })
        }
        return dataTmp
    }
}

function getARMA(samples, dispersion, p, r, pNums, rNums) {
    let res = []

    for (let i = 0; i < samples; i++) {
        res.push(y(i, dispersion, p, r, pNums, rNums, res))
    }

    function y(n, dispersion, p, r, pNums, rNums, res) {
        const arma = []

        if (n === 0) {
            for (let i = 0; i < samples; i++) {
                arma.push(getRandom12(dispersion))
            }
        }

        let tmp_res = arma[n]

        for (let i = 0; i < p && n - i > 0; i++) {
            tmp_res += arma[n - i - 1] * pNums[i]
        }

        for (let i = 0; i < r && n - i > 0; i++) {
            tmp_res -= res[n - i - 1] * rNums[i]
        }

        return tmp_res
    }

    return res
}

function getRandom12(d) {
    let frand12 = 0
    for (let i = 0; i < 12; i++) {
        frand12 += frand()
    }
    return (frand12 - 6) * Math.sqrt(d)
}
