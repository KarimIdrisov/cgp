import dsp from 'dsp.js'

export default function getFFTPower(zero, array, time, samples, fd, l=0) {
    let next = 0
    let power = 1
    while (array.length > power) {
        power = power * 2
    }
    next = power * 2
    const tmp = array.slice()
    for (let i = array.length; i < next; i = i + 1) {
        tmp[i] = 0
    }
    const dft = new dsp.FFT(next, 1);
    dft.forward(tmp);
    const spectrum = dft.spectrum;
    const dataXY = []

    if (l !== 0) {
        const a = []
        for (let i = 0; i < dft.spectrum.length / 2; i = i + 1) {
            a.push(i === 0 ? zero : Math.pow(fd, 2) * Math.pow(dft.spectrum[i], 2))
        }

        if (zero === 'nothing') {
            dataXY.push({
                'x': 0,
                'y': Math.pow(fd, 2) * Math.pow(dft.spectrum[0], 2)
            })
        }
        if (zero === 'zero') {
            dataXY.push({
                'x': 0,
                'y': 0
            })
        }
        if (zero === 'neighbor') {
            dataXY.push({
                'x': 0,
                'y': Math.pow(fd, 2) * Math.pow(dft.spectrum[1], 2)
            })
        }

        for (let i = 1; i < dft.spectrum.length / 2; i = i + 1) {
            dataXY.push({
                'x': i / (samples * fd * 2),
                'y': i === 0 ? zero : (1 / (2 * l + 1)) * sum(l, a, i)
            })
        }

        return dataXY
    }
    if (zero === 'nothing') {
        dataXY.push({
            'x': 0,
            'y': Math.pow(fd, 2) * Math.pow(dft.spectrum[0], 2)
        })
    }
    if (zero === 'zero') {
        dataXY.push({
            'x': 0,
            'y': 0
        })
    }
    if (zero === 'neighbor') {
        dataXY.push({
            'x': 0,
            'y': Math.pow(fd, 2) * Math.pow(dft.spectrum[1], 2)
        })
    }

    for (let i = 1; i < dft.spectrum.length; i = i + 1) {
        dataXY.push({
            'x': i / (samples * fd * 2),
            'y': i === 0 ? zero : Math.pow(fd, 2) * Math.pow(dft.spectrum[i], 2)
        })
    }

    return dataXY
}

function sum(l, a, i) {
    let sum = 0
    for (let j = -l; j < l; j = j + 1) {
        if (Math.abs(i) - j > 0) {
            sum = sum + a[i + j]
        }
    }
    return sum
}