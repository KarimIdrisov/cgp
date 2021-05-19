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

export default function getNewSignalData(type, arg, samples, fd, time) {
    let data = []
    let dataXY = []
    if (type === 'impulse') {
        data = impulse(samples, fd, arg, true)
        dataXY = impulse(samples, fd, arg)
        return [data, dataXY]
    }
    if (type === 'jump') {
        data = jump(samples, fd, arg, true)
        dataXY = jump(samples, fd, arg)
        return [data, dataXY]
    }
    if (type === 'exponent') {
        data = exponent(samples, fd, arg, true)
        dataXY = exponent(samples, fd, arg)
        return [data, dataXY]
    }
    if (type === 'sin') {
        const args = arg.split(':')
        data = sin(samples, fd, args[0], args[1], args[2], true)
        dataXY = sin(samples, fd, args[0], args[1], args[2])
        return [data, dataXY]
    }
    if (type === 'meandr') {
        const args = arg.split(':')
        data = meandr(samples, fd, args,true)
        dataXY = meandr(samples, fd, args)
        return [data, dataXY]
    }
    if (type === 'pila') {
        const args = arg.split(':')
        data = pila(samples, fd, args, true)
        dataXY = pila(samples, fd, args)
        return [data, dataXY]
    }
    if (type === 'exp_ogub') {
        const args = arg.split(':')
        data = exp_ogub(samples, fd, args[0], args[1], args[2], args[3], true)
        dataXY = exp_ogub(samples, fd, args[0], args[1], args[2], args[3])
        return [data, dataXY]
    }
    if (type === 'balance_ogib') {
        const args = arg.split(':')
        data = balance_ogib(samples, fd, args[0], args[1], args[2], args[3], true)
        dataXY = balance_ogib(samples, fd, args[0], args[1], args[2], args[3])
        return [data, dataXY]
    }
    if (type === 'tonal_ogib') {
        const args = arg.split(':')
        data = tonal_ogib(samples, fd, args[0], args[1], args[2], args[3], args[4], true)
        dataXY = sin(samples, fd, args[0], args[1], args[2], args[3], args[4])
        return [data, dataXY]
    }
    if (type === 'linear_module') {
        const args = arg.split(':')
        data = linear_module(samples, fd, args[0], args[1], args[2], args[3], true)
        dataXY = linear_module(samples, fd, args[0], args[1], args[2], args[3])
        return [data, dataXY]
    }
    if (type === 'whiteEqual') {
        const args = arg.split(':')
        data = whiteEqual(samples, fd, args[0], args[1], true)
        dataXY = whiteEqual(samples, fd, args[0], args[1])
        return [data, dataXY]
    }
    if (type === 'whiteLaw') {
        const args = arg.split(':')
        data = whiteLaw(samples, fd, args[0], args[1], true)
        dataXY = whiteLaw(samples, fd, args[0], args[1])
        return [data, dataXY]
    }
    if (type === 'regression') {
        const args = arg.split(':')
        data = regression(samples, fd, args[0], args[1], args[2], args[3], args[4], true)
        dataXY = regression(samples, fd, args[0], args[1], args[2], args[3], args[4])
        return [data, dataXY]
    }
    return [[], []]
}