import impulse from "./impulse";
import jump from "./jump";
import exponent from "./exponent";
import sin from "./sin";
import meandr from "./meandr";
import pila from "./pila";
import exp_ogub from "./exp_ogub";
import balance_ogib from "./balance_ogib";
import tonal_ogib from "./tonal_ogib";
import linear_module from "./linear_module";
import whiteLaw from "./whiteLaw";
import regression from "./regression";
import whiteEqual from "./whiteEqual";

export default function linearSuperposition(samples, fd, first, names, argsNames, args, notObject=false) {
    const dataTmp = []

    if (notObject) {
        const models = JSON.parse(localStorage.getItem('models'))
        const modelNames = names.split(';')
        const modelArgNames = argsNames.split(';')
        const modelArgs = args.split(';')

        const channelsValues = []
        models.forEach( model => {
            if (modelNames.includes(model.name)) {
                if (model.type === 'impulse') {
                    channelsValues.push({data: impulse(samples, fd, model.args, true), name: model.name})
                }
                if (model.type === 'jump') {
                    channelsValues.push({data: jump(samples, fd, model.args, true), name: model.name})
                }
                if (model.type === 'exponent') {
                    channelsValues.push({data: exponent(samples, fd, model.args, true), name: model.name})
                }
                if (model.type === 'sin') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: sin(samples, fd, args[0], args[1], args[2], true), name: model.name})
                }
                if (model.type === 'meandr') {
                    channelsValues.push({data: meandr(samples, fd, models.args, true), name: model.name})
                }
                if (model.type === 'pila') {
                    channelsValues.push({data: pila(samples, fd, model.args, true), name: model.name})
                }
                if (model.type === 'exp_ogub') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: exp_ogub(samples, fd, args[0], args[1], args[2], args[3], true), name: model.name})
                }
                if (model.type === 'balance_ogib') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: balance_ogib(samples, fd, args[0], args[1], args[2], args[3], true), name: model.name})
                }
                if (model.type === 'tonal_ogib') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: tonal_ogib(samples, fd, args[0], args[1], args[2], args[3], args[4], true), name: model.name})
                }
                if (model.type === 'linear_module') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: linear_module(samples, fd, args[0], args[1], args[2], args[3], true), name: model.name})
                }
                if (model.type === 'whiteEqual') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: whiteEqual(samples, fd, args[0], args[1], true), name: model.name})
                }
                if (model.type === 'whiteLaw') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: whiteLaw(samples, fd, args[0], args[1], true), name: model.name})
                }
                if (model.type === 'regression') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: regression(samples, fd, args[0], args[1], args[2], args[3], args[4], true), name: model.name})
                }
            }
        })

        const res = new Array(samples).fill(0)

        for (let i = 0; i < modelNames.length; i++) {
            let modelData = []
            channelsValues.forEach( (channel) => {
                if (channel.name === modelNames[i]) {
                    modelData = channel.data
                }
            })
            for (let j = 0; j < samples; j++) {
                res[j] += +modelData[j] * +modelArgs[modelArgNames.indexOf(modelNames[i])]
            }
        }

        for (let i = 0; i < samples; i++) {
            dataTmp.push(+first + +res[i])
        }
        return dataTmp
    } else {
        const models = JSON.parse(localStorage.getItem('models'))
        const modelNames = names.split(';')
        const modelArgNames = argsNames.split(';')
        const modelArgs = args.split(';')

        const channelsValues = []
        models.forEach( model => {
            if (modelNames.includes(model.name)) {
                if (model.type === 'impulse') {
                    channelsValues.push({data: impulse(samples, fd, model.args, true), name: model.name})
                }
                if (model.type === 'jump') {
                    channelsValues.push({data: jump(samples, fd, model.args, true), name: model.name})
                }
                if (model.type === 'exponent') {
                    channelsValues.push({data: exponent(samples, fd, model.args, true), name: model.name})
                }
                if (model.type === 'sin') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: sin(samples, fd, args[0], args[1], args[2], true), name: model.name})
                }
                if (model.type === 'meandr') {
                    channelsValues.push({data: meandr(samples, fd, models.args, true), name: model.name})
                }
                if (model.type === 'pila') {
                    channelsValues.push({data: pila(samples, fd, model.args, true), name: model.name})
                }
                if (model.type === 'exp_ogub') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: exp_ogub(samples, fd, args[0], args[1], args[2], args[3], true), name: model.name})
                }
                if (model.type === 'balance_ogib') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: balance_ogib(samples, fd, args[0], args[1], args[2], args[3], true), name: model.name})
                }
                if (model.type === 'tonal_ogib') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: tonal_ogib(samples, fd, args[0], args[1], args[2], args[3], args[4], true), name: model.name})
                }
                if (model.type === 'linear_module') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: linear_module(samples, fd, args[0], args[1], args[2], args[3], true), name: model.name})
                }
                if (model.type === 'whiteEqual') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: whiteEqual(samples, fd, args[0], args[1], true), name: model.name})
                }
                if (model.type === 'whiteLaw') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: whiteLaw(samples, fd, args[0], args[1], true), name: model.name})
                }
                if (model.type === 'regression') {
                    const args = model.args?.split(':')
                    channelsValues.push({data: regression(samples, fd, args[0], args[1], args[2], args[3], args[4], true), name: model.name})
                }
            }
        })

        const res = new Array(samples).fill(0)

        for (let i = 0; i < modelNames.length; i++) {
            let modelData = []
            channelsValues.forEach( (channel) => {
                if (channel.name === modelNames[i]) {
                    modelData = channel.data
                }
            })
            for (let j = 0; j < samples; j++) {
                res[j] += +modelData[j] * +modelArgs[modelArgNames.indexOf(modelNames[i])]
            }
        }

        for (let i = 0; i < samples; i++) {
            dataTmp.push({
                'y': +first + +res[i],
                'x': i
            })
        }
        return dataTmp
    }
}