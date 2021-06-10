import dsp from 'dsp.js'

export default function getFFTPower(zero, array, time, samples, fd, min, max) {
    const next = Math.pow(2, Math.ceil(Math.log(array.length)/Math.log(2)))
    const tmp = array.slice()
    for (let i = array.length; i < next; i = i + 1) {
        tmp[i] = 0
    }
    const dft = new dsp.FFT(next, 1);
    dft.forward(tmp);
    const spectrum = dft.spectrum;
    const dataXY = []

    for (let i = 0; i < dft.spectrum.length / 2; i = i + 1) {
        dataXY.push({
            'x': i / (samples * fd),
            'y': i === 0 ? zero : Math.pow(fd, 2) * Math.pow(dft.spectrum[i], 2)
        })
    }

    return dataXY
}