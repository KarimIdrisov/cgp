import impulse from "../models/impulse";
import whiteEqual from "../models/whiteEqual";
import getTimes from "./getTimes";
import whiteLaw from "../models/whiteLaw";
import regression from "../models/regression";
import jump from "../models/jump";
import exponent from "../models/exponent";
import sin from "../models/sin";
import meandr from "../models/meandr";
import pila from "../models/pila";
import exp_ogub from "../models/exp_ogub";
import balance_ogib from "../models/balance_ogib";
import tonal_ogib from "../models/tonal_ogib";
import linear_module from "../models/linear_module";
import linearSuperposition from "../models/linearSuperposition";
import multiplicativeSuperposition from "../models/multiplicativeSuperposition";

export default function getNewSignalData(channels=[], type, arg, samples, fd, time) {
    let data = []
    let dataXY = []
    console.log(type)
    if (type === 'impulse') {
        data = impulse(time, samples, fd, arg, true)
        dataXY = impulse(time, samples, fd, arg)
        console.log(data)
        return [data, dataXY]
    }
    if (type === 'jump') {
        data = jump(time, samples, fd, arg, true)
        dataXY = jump(time, samples, fd, arg)
        return [data, dataXY]
    }
    if (type === 'exponent') {
        data = exponent(time, samples, fd, arg, true)
        dataXY = exponent(time, samples, fd, arg)
        return [data, dataXY]
    }
    if (type === 'sin') {
        const args = arg.split(':')
        data = sin(time, samples, fd, args[0], args[1], args[2], true)
        dataXY = sin(time, samples, fd, args[0], args[1], args[2])
        return [data, dataXY]
    }
    if (type === 'meandr') {
        const args = arg.split(':')
        data = meandr(time, samples, fd, args,true)
        dataXY = meandr(time, samples, fd, args)
        return [data, dataXY]
    }
    if (type === 'pila') {
        const args = arg.split(':')
        data = pila(time, samples, fd, args, true)
        dataXY = pila(time, samples, fd, args)
        return [data, dataXY]
    }
    if (type === 'exp_ogub') {
        const args = arg.split(':')
        data = exp_ogub(time, samples, fd, args[0], args[1], args[2], args[3], true)
        dataXY = exp_ogub(time, samples, fd, args[0], args[1], args[2], args[3])
        return [data, dataXY]
    }
    if (type === 'balance_ogib') {
        const args = arg.split(':')
        data = balance_ogib(time, samples, fd, args[0], args[1], args[2], args[3], true)
        dataXY = balance_ogib(time, samples, fd, args[0], args[1], args[2], args[3])
        return [data, dataXY]
    }
    if (type === 'tonal_ogib') {
        const args = arg.split(':')
        data = tonal_ogib(time, samples, fd, args[0], args[1], args[2], args[3], args[4], true)
        dataXY = tonal_ogib(time, samples, fd, args[0], args[1], args[2], args[3], args[4])
        return [data, dataXY]
    }
    if (type === 'linear_module') {
        const args = arg.split(':')
        data = linear_module(time, samples, fd, args[0], args[1], args[2], args[3], true)
        dataXY = linear_module(time, samples, fd, args[0], args[1], args[2], args[3])
        return [data, dataXY]
    }
    if (type === 'whiteEqual') {
        const args = arg.split(':')
        data = whiteEqual(time, samples, fd, args[0], args[1], true)
        dataXY = whiteEqual(time, samples, fd, args[0], args[1])
        return [data, dataXY]
    }
    if (type === 'whiteLaw') {
        const args = arg.split(':')
        data = whiteLaw(time, samples, fd, args[0], args[1], true)
        dataXY = whiteLaw(time, samples, fd, args[0], args[1])
        return [data, dataXY]
    }
    if (type === 'regression') {
        const args = arg.split(':')
        data = regression(time, samples, fd, args[0], args[1], args[2], args[3], args[4], true)
        dataXY = regression(time, samples, fd, args[0], args[1], args[2], args[3], args[4])
        return [data, dataXY]
    }
    if (type === 'linear') {
        const args = arg.split(':')
        data = linearSuperposition(time, channels,samples, fd, args[1], args[2], true)
        dataXY = linearSuperposition(time, channels, samples, fd, args[1], args[2])
        return [data, dataXY]
    }
    if (type === 'multiplicative') {
        const args = arg.split(':')
        data = multiplicativeSuperposition(time, channels, samples, fd, args[1], args[2],  true)
        dataXY = multiplicativeSuperposition(time, channels, samples, fd, args[1], args[2])
        return [data, dataXY]
    }
    return [[], []]
}