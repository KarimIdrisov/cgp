export default function getTimes(start, fd, samples) {
    const times = []
    for (let i = 0; i < samples; i++) {
        times.push((new Date(start.getTime() + (i * (1 / fd)) * 1000)).getTime())
    }
    return times
}