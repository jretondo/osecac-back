const TABLA = 'extractos_bco_cba'
const TABLA_BACKUP = "`extractos_bco_cba-backup`"
const moment = require('moment')
const TABLA2 = 'tipos_movimientos'
const functions = require("./functions")
const customQuerys = require("./customQuery")
const path = require('path')
const getPages = require('../../../utils/getPages')
const formatMoney = require('../../../utils/NumberFormat')

const { error, table } = require("console")
const RawDateToDate = require("../../../utils/newDataRaw")
const dataNumberPrice = require("../../../utils/priceNumber")

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const processDef = async (fileName, idUser) => {
        const dataSheet = functions.getDataSheet(path.join("Archivos", "Extractos-Excel", fileName))
        const queryValues = await Promise.all(
            dataSheet.map(async (fila) => {

            })
        )
        return await store.customQuery(customQuerys.insertNewMov(TABLA, queryValues))
    }

    const process = async (fileName, idUser) => {
        const dataSheet = functions.getDataSheet(path.join("Archivos", "Extractos-Excel", fileName))
        const queryValues = await Promise.all(
            dataSheet.map(async (fila) => {
                const nroCbte = fila.__EMPTY_4
                const verificInt = parseInt(nroCbte)
                const esNulo = isNaN(verificInt)
                let fechaFalsa = false;
                let fechaAnt = "";
                if (!esNulo) {
                    const fecha = functions.transformToDate(fila.__EMPTY);
                    if (!fechaFalsa || fechaAnt !== fecha) {
                        const cantRegByDate = await getByDate(fecha);
                        if (cantRegByDate[0].cant === 0) {
                            fechaFalsa = false;
                            const concepto = fila.__EMPTY_1
                            let smallConcepto = concepto.slice(0, 13)
                            smallConcepto = "%" + smallConcepto + "%"
                            let descripcion = fila.__EMPTY_2
                            if (descripcion === undefined) {
                                descripcion = ""
                            }
                            const monto = functions.transformToMoney(fila.__EMPTY_3)
                            let credito
                            if (monto < 0) {
                                credito = 1
                            } else {
                                credito = 0
                            }
                            return customQuerys.singleValueNewMov(TABLA2, fecha, concepto, nroCbte, monto, smallConcepto, credito, idUser, descripcion)
                        } else {
                            fechaFalsa = true
                            return ""
                        }
                    } else {
                        return ""
                    }
                    fechaAnt = fecha
                } else {
                    return ""
                }
            })
        )
        return await store.customQuery(customQuerys.insertNewMov(TABLA, queryValues))
    }

    const process1 = async (fileName, idUser) => {
        const dataSheet = functions.getDataSheet(path.join("Archivos", "Extractos-Excel", fileName))
        const queryValues = await Promise.all(
            dataSheet.map(async (fila) => {
                console.log('fila :>> ', fila);
                const nroCbte = fila.__EMPTY_2
                const verificInt = parseInt(nroCbte)
                const esNulo = isNaN(verificInt)
                let fechaFalsa = false;
                let fechaAnt = "";
                if (!esNulo) {
                    let fecha = functions.transformToDate2(fila.__EMPTY);
                    if (fecha === "Invalid date") {
                        fecha = functions.transformToDate(fila.__EMPTY);
                    }
                    if (!fechaFalsa || fechaAnt !== fecha) {
                        const cantRegByDate = await getByDate(fecha);
                        if (cantRegByDate[0].cant === 0) {
                            fechaFalsa = false;
                            const concepto = fila.__EMPTY_3.trim()
                            let smallConcepto = concepto.slice(0, 10)
                            smallConcepto = "%" + smallConcepto + "%"
                            let descripcion = ""
                            if (descripcion === undefined) {
                                descripcion = ""
                            }
                            const monto = fila.__EMPTY_1
                            let credito
                            if (monto < 0) {
                                credito = 1
                            } else {
                                credito = 0
                            }
                            return customQuerys.singleValueNewMov2(TABLA2, fecha, concepto, nroCbte, monto, smallConcepto, credito, idUser, descripcion)
                        } else {
                            fechaFalsa = true
                            //return ""
                        }
                    }
                }
            })
        )

        return await store.customQuery(customQuerys.insertNewMov2(TABLA, queryValues))
    }

    const process3 = async (fileName, idUser) => {
        const dataSheet = functions.getDataSheet(path.join("Archivos", "Extractos-Excel", fileName))

        let fechaFalsa = false;
        let fechaAnt = "";
        const queryValues = await Promise.all(
            dataSheet.map(async (fila) => {

                const nroCbte = fila.Nro_Comprobante
                const verificInt = parseInt(nroCbte)
                const esNulo = isNaN(verificInt)

                if (!esNulo) {
                    let fecha = functions.transformToDate2(fila.Fecha);
                    console.log('feha :>> ', fecha);
                    if (fecha === "Invalid date") {
                        fecha = functions.transformToDate(fila.Fecha);
                    }
                    if (!fechaFalsa) {
                        if (fechaAnt !== fecha) {
                            fechaAnt = fecha
                            const cantRegByDate = await getByDate(fecha);
                            if (cantRegByDate[0].cant === 0) {
                                fechaFalsa = false;
                                const concepto = fila.Concepto.trim()
                                let smallConcepto = concepto.slice(0, 13)
                                smallConcepto = "%" + smallConcepto + "%"
                                let descripcion = fila.Descripcion
                                if (descripcion === undefined) {
                                    descripcion = ""
                                } else {
                                    descripcion = descripcion.trim()
                                }

                                const monto = fila.Monto
                                let credito
                                if (monto < 0) {
                                    credito = 1
                                } else {
                                    credito = 0
                                }

                                return customQuerys.singleValueNewMov(TABLA2, fecha, concepto, nroCbte, monto, smallConcepto, credito, idUser, descripcion)
                            } else {
                                fechaFalsa = true
                                return ""
                            }
                        } else {
                            fechaFalsa = false;
                            const concepto = fila.Concepto.trim()
                            let smallConcepto = concepto.slice(0, 13)
                            smallConcepto = "%" + smallConcepto + "%"
                            let descripcion = fila.Descripcion
                            if (descripcion === undefined) {
                                descripcion = ""
                            } else {
                                descripcion = descripcion.trim()
                            }

                            const monto = fila.Monto
                            let credito
                            if (monto < 0) {
                                credito = 1
                            } else {
                                credito = 0
                            }

                            return customQuerys.singleValueNewMov(TABLA2, fecha, concepto, nroCbte, monto, smallConcepto, credito, idUser, descripcion)
                        }
                    } else {
                        //return ""
                    }
                } else {
                    //return ""
                }
            })
        )

        return await store.customQuery(customQuerys.insertNewMov(TABLA, queryValues))


        /* 
            console.log('dataSheet :>> ', dataSheet);
            const data = dataSheet[2][4]
            const data2 = data + 1
            console.log('data :>> ', data);       
        */

        return ""
    }

    const fecha = async (fechaNUEVA, fechaOrig) => {
        return store.customQuery(`UPDATE ${TABLA} SET fecha = '${fechaNUEVA}' WHERE fecha = '${fechaOrig}'`)
    }

    const process4 = async (fileName, idUser) => {
        const dataSheet = functions.getDataSheet(path.join("Archivos", "Extractos-Excel", fileName))

        let fechaFalsa = false;
        let fechaAnt = "";
        const queryValues = await Promise.all(
            dataSheet.map(async (fila, key) => {
                let comprobante = fila[1]
                try {
                    comprobante = parseInt(comprobante)
                } catch (error) {

                }
                const verificInt = parseInt(comprobante)
                const esNulo = isNaN(verificInt)

                if (!esNulo) {
                    let fecha = RawDateToDate(fila[0])
                    if (fecha === "Invalid date") {
                        fecha = functions.transformToDate(fila[0]);
                    }
                    const concepto = fila[2].trim()
                    const descripcion = fila[3].trim()
                    const monto = dataNumberPrice(fila[4])
                    const cantRegByDate = await getByDate(fecha)
                    if (cantRegByDate[0].cant === 0) {
                        if (fechaAnt !== fecha) {
                            fechaAnt = fecha
                            if (cantRegByDate[0].cant === 0) {
                                fechaFalsa = false;
                                let smallConcepto = concepto.slice(0, 30)
                                smallConcepto = "%" + smallConcepto + "%"

                                let credito = 0
                                if (monto < 0) {
                                    credito = 1
                                }

                                return customQuerys.singleValueNewMov(TABLA2, fecha, concepto, comprobante, monto, smallConcepto, credito, idUser, descripcion)
                            } else {
                                fechaFalsa = true
                            }
                        } else if (!fechaFalsa) {
                            let smallConcepto = concepto.slice(0, 13)
                            smallConcepto = "%" + smallConcepto + "%"

                            let credito = 0
                            if (monto < 0) {
                                credito = 1
                            }

                            return customQuerys.singleValueNewMov(TABLA2, fecha, concepto, comprobante, monto, smallConcepto, credito, idUser, descripcion)
                        }
                    }

                }
            })
        )
        return await store.customQuery(customQuerys.insertNewMov(TABLA, queryValues))
    }

    const replaceImp = async (fileName, idUser) => {
        const dataSheet = functions.getDataSheet(path.join("Archivos", "Extractos-Excel", fileName))
        const conscepts = await store.customQuery(`SELECT desc_extracto AS descripcion FROM tipos_movimientos WHERE orden >= 7`)
        const concepts2 = conscepts.map(item => item.descripcion)
        const filtered = dataSheet.filter(function (item) {
            if (item.__EMPTY_1) {
                return concepts2.indexOf(item.__EMPTY_1) !== -1;
            }
        });

        const queryValues = await Promise.all(
            dataSheet.map(async (fila) => {
                const nroCbte = fila.__EMPTY_4
                const verificInt = parseInt(nroCbte)
                const esNulo = isNaN(verificInt)
                let fechaAnt = "";
                if (!esNulo) {
                    const fecha = functions.transformToDate(fila.__EMPTY);
                    if (fechaAnt !== fecha) {
                        await store.customQuery(`DELETE FROM extractos_bco_cba WHERE id_tipo >= 7 and fecha = '${fecha}'`)
                    }

                    const concepto = fila.__EMPTY_1
                    let smallConcepto = concepto.slice(0, 13)
                    smallConcepto = "%" + smallConcepto + "%"
                    let descripcion = fila.__EMPTY_2
                    if (descripcion === undefined) {
                        descripcion = ""
                    }
                    const monto = functions.transformToMoney(fila.__EMPTY_3)
                    let credito
                    if (monto < 0) {
                        credito = 1
                    } else {
                        credito = 0
                    }

                    fechaAnt = fecha
                    return customQuerys.singleValueNewMov(TABLA2, fecha, concepto, nroCbte, monto, smallConcepto, credito, idUser, descripcion)
                } else {
                    return ""
                }
            })
        )
        return await store.customQuery(customQuerys.insertNewMov(TABLA, queryValues))
    }

    const getByDate = async (date) => {
        return await new Promise((resolve, reject) => {
            resolve(store.customQuery(customQuerys.getByDate(TABLA, date)))
        })
    }

    const remove = (query) => {
        return store.remove(TABLA, query)
    }

    const list = async (page, desde, hasta) => {
        const listaFechas = await store.customQuery(customQuerys.cantExtractos(desde, hasta))
        const cantTotal = parseInt(listaFechas.length)
        const listado = await store.customQuery(customQuerys.listExtractos(desde, hasta, page))
        const pages = await getPages(cantTotal, 10, page)
        return {
            listado,
            pages
        }
    }

    const download = async (desde, hasta, privateData, next) => {
        const desdeStr = moment(desde, "YYYY-MM-DD").format("DD/MM/YYYY")
        const hastaStr = moment(hasta, "YYYY-MM-DD").format("DD/MM/YYYY")
        let datosIniciales = await store.customQuery(customQuerys.saldoInicial(desde))
        const saldoinicial = datosIniciales[0].saldoIni
        const saldoIniStr = formatMoney(saldoinicial)
        const fechaIni = moment(datosIniciales[0].fechaAnt, "YYYY-MM-DD").format("DD/MM/YYYY")
        let gastos = await store.customQuery(customQuerys.totalGastos(desde, hasta))
        gastos = formatMoney(- gastos[0].gastos)
        let sircreb = await store.customQuery(customQuerys.totalSicreb(desde, hasta))
        sircreb = formatMoney(- sircreb[0].sircreb)
        let impuestos = await store.customQuery(customQuerys.totalImpuestos(desde, hasta))
        impuestos = formatMoney(- impuestos[0].impuestos)
        const listaMovRaw = await store.customQuery(customQuerys.movimientosBco(desde, hasta))
        const listaMov = await functions.listaMovExtracto(listaMovRaw, saldoinicial)

        const datosRender = {
            desde: desdeStr,
            hasta: hastaStr,
            gastos,
            sircreb,
            impuestos,
            saldoInicial: saldoIniStr,
            fechaIni,
            listaItems: listaMov,
            sucursal: privateData.sucursalBcoCba,
            nroCta: privateData.ctaBcoCba
        }
        return await functions.renderReport(datosRender, desde, hasta, next)
    }

    const get = async (fecha) => {
        const fechaFormat = moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD")
        return await store.customQuery(customQuerys.detalleDia(TABLA, fechaFormat))
    }

    const getOne = async (id) => {
        return await store.get(TABLA, id)
    }

    const getMovimientos = async (page, fecha, filtro) => {
        const fechaFormat = moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD")
        const listado = await store.customQuery(customQuerys.movimientosBco(fechaFormat, fechaFormat, true, filtro, page))
        const cantMov = await store.customQuery(customQuerys.cantMov(fechaFormat, filtro))
        const pages = await getPages(cantMov[0].cant, 10, page)
        return {
            listado,
            pages
        }
    }

    const getMovimientos2 = async (page, desde, hasta, filtro) => {
        const desdeStr = moment(desde, "YYYY-MM-DD").format("YYYY-MM-DD")
        const hastaStr = moment(hasta, "YYYY-MM-DD").format("YYYY-MM-DD")
        const listado = await store.customQuery(customQuerys.movimientosBco(desdeStr, hastaStr, true, filtro, page, TABLA))
        const cantMov = await store.customQuery(customQuerys.cantMov2(desdeStr, hastaStr, filtro, TABLA2))
        const pages = await getPages(cantMov[0].cant, 10, page)
        return {
            listado,
            pages
        }
    }

    const getMovimientos3 = async (page, desde, hasta, filtro) => {
        const desdeStr = moment(desde, "YYYY-MM-DD").format("YYYY-MM-DD")
        const hastaStr = moment(hasta, "YYYY-MM-DD").format("YYYY-MM-DD")
        const listado = await store.customQuery(customQuerys.movimientosBco(desdeStr, hastaStr, true, filtro, page, TABLA_BACKUP))
        const cantMov = await store.customQuery(customQuerys.cantMov2(desdeStr, hastaStr, filtro, TABLA_BACKUP))
        const pages = await getPages(cantMov[0].cant, 10, page)
        return {
            listado,
            pages
        }
    }

    const upsert = async (body, user) => {
        const mov = {
            fecha: body.fecha,
            concepto: body.concepto,
            descripcion: body.descripcion,
            nro_cbte: body.nro_cbte,
            monto: body.monto,
            id_tipo: body.id_tipo,
            cr_deb: body.cr_deb,
            conciliado: 0,
            id_libro: 0,
            id_usu: user.id,
            saldo_ini: 0
        }

        if (body.id) {
            mov.id = body.id
            return await store.update(TABLA, mov)
        } else {
            return await store.insert(TABLA, mov)
        }
    }

    const difMov = async (id, body, user, next) => {
        const dataRow = (await getOne(id))[0]
        dataRow.id = id
        dataRow.monto = body.amount
        const newRow = {
            fecha: dataRow.fecha,
            concepto: body.concepto,
            descripcion: "",
            nro_cbte: dataRow.nro_cbte,
            id_tipo: 7,
            cr_deb: body.crDb,
            monto: body.dif
        }

        const resultUpdate = await upsert(dataRow, user)
        const aff1 = parseInt(resultUpdate.affectedRows)

        if (aff1 > 0) {
            const resultNew = await upsert(newRow, user)
            const aff2 = parseInt(resultNew.affectedRows)
            if (aff2 > 0) {
                return ""
            } else {
                dataRow.monto = body.original
                await upsert(dataRow, user)
                    .then(() => {
                        next(error("Error inesperado", 500))
                    })
                    .catch(() => {
                        next(error("Error inesperado", 500))
                    })
            }
        } else {
            next(error("Error inesperado", 500))
        }
    }

    const calcGstosImp = async (desde, hasta) => {
        const desdeStr = moment(desde, "YYYY-MM-DD").format("YYYY-MM-DD")
        const hastaStr = moment(hasta, "YYYY-MM-DD").format("YYYY-MM-DD")
        let gastos = await store.customQuery(customQuerys.totalGastos(desdeStr, hastaStr))
        gastos = formatMoney(- gastos[0].gastos)
        let sircreb = await store.customQuery(customQuerys.totalSicreb(desdeStr, hastaStr))
        sircreb = formatMoney(- sircreb[0].sircreb)
        let impuestos = await store.customQuery(customQuerys.totalImpuestos(desdeStr, hastaStr))
        impuestos = formatMoney(- impuestos[0].impuestos)

        return {
            gastos,
            impuestos,
            sircreb
        }
    }

    const listWithOut = async () => {
        return await store.customQuery(customQuerys.getWithOut(TABLA))
    }

    const update = async (idMov, set) => {
        return await store.update(TABLA, {
            id: idMov,
            ...set
        })
    }

    const listTiposMov = async () => {
        return await store.customQuery(customQuerys.typeMovGroup(TABLA2))
    }

    const aliviarBD = async (hasta) => {
        const hastaStr = moment(hasta, "YYYY-MM-DD").format("YYYY-MM-DD")
        const corrobora = await store.customQuery(` SELECT  COUNT(*) as total FROM ${TABLA} WHERE fecha <= '${hastaStr}' and id_tipo = 3 and conciliado = 0 `)
        console.log('corrobora :>> ', corrobora);
        if (corrobora[0].total > 0) {
            throw Error("Hay transferencias sin dar de baja")
        } else {
            const nuevoSaldo = await store.customQuery(` SELECT ROUND (SUM(monto), 2) as nuevoSaldo FROM ${TABLA} WHERE fecha <= '${hastaStr}' `)
            const saldo = (parseInt(nuevoSaldo[0].nuevoSaldo * 100)) / 100
            const dataBackUp = await store.customQuery(` SELECT * FROM ${TABLA} WHERE fecha <= '${hastaStr}' `);
            (async function (data) {
                const valores = [];
                data.forEach((item) => {
                    item.fecha = moment(item.fecha).format("YYYY-MM-DD")
                    item.create_time = moment(item.fecha).format("YYYY-MM-DD")
                    item.fecha_dep = item.fecha_dep ? moment(item.fecha_dep).format("YYYY-MM-DD") : item.fecha_dep
                    let val2 = "("
                    for (const key in item) {
                        val2 = val2 + `'${item[key]}', `
                    }
                    val2 = val2.slice(0, val2.length - 2)
                    val2 = val2 + ")"
                    valores.push(val2)
                });
                const strInsert = (valores.toString().replace("[", "(").replace("]", ")").replace(/'null'/gi, "null"))
                return await store.customQuery(` INSERT INTO ${TABLA_BACKUP} VALUES ${strInsert} `)
            })(dataBackUp).then(async res => {
                await store.customQuery(` DELETE FROM ${TABLA} WHERE fecha <= '${hastaStr}' `)
                return await store.customQuery(` INSERT INTO ${TABLA} (fecha, concepto, nro_cbte, monto, id_tipo, cr_deb, conciliado, id_libro, id_usu, saldo_ini, descripcion, transf_int) VALUES ('${hastaStr}', 'Saldo Inicial', '0', '${saldo}', '0', '1', '0', '0', '0', '1', 'Saldo inicial', '0'); `)
            }).catch(error => {
                throw Error(error.toString())
            })
        }
    }

    const ajustarSaldo = async (nuevoSaldo) => {
        return await store.customQuery(` UPDATE ${TABLA} SET monto = (monto + ${nuevoSaldo}) WHERE saldo_ini = 1 `)
    }

    const nuevoImpGsto = async (tipo, importe, fecha) => {
        console.log('tipo, importe, fecha :>> ', { tipo, importe, fecha });
        const fechaStr = moment(fecha).format("YYYY-MM-DD")
        if (parseInt(tipo)) {
            return await store.customQuery(` INSERT INTO ${TABLA} (fecha, concepto, nro_cbte, monto, id_tipo, cr_deb, conciliado, id_libro, id_usu, saldo_ini, descripcion, transf_int) VALUES ('${fechaStr}', 'Impuesto sobre operaciones', '0', '${importe}', '8', '1', '0', '0', '6', '0', '', '0'); `)
        } else {
            return await store.customQuery(` INSERT INTO ${TABLA} (fecha, concepto, nro_cbte, monto, id_tipo, cr_deb, conciliado, id_libro, id_usu, saldo_ini, descripcion, transf_int) VALUES ('${fechaStr}', 'Gastos sobre operaciones', '0', '${importe}', '7', '1', '0', '0', '6', '0', '', '0'); `)
        }
    }

    return {
        process,
        replaceImp,
        remove,
        list,
        download,
        get,
        getOne,
        getMovimientos,
        upsert,
        difMov,
        calcGstosImp,
        listWithOut,
        update,
        listTiposMov,
        getMovimientos2,
        process1,
        process3,
        process4,
        processDef,
        aliviarBD,
        ajustarSaldo,
        nuevoImpGsto,
        getMovimientos3,
        fecha
    }
}