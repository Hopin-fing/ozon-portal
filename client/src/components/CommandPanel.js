import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { getAttrPrice, openTables, resetData,
    setLoading, getProductTree} from "../redux/actions/products";
import {useHttp} from "../hooks/http.hook";
import {domain} from "../methods/clientData";


const CommandPanel = () => {

    const dispatch = useDispatch();
    const isOpen = useSelector(({products}) => products.isOpen);
    const isLoading = useSelector(({products}) => products.loading);
    const productTree = useSelector(({products}) => products.productTree);
    const {request} = useHttp()

    useEffect(async () => {
        if(productTree.length !== 0) await getAttrPriceFunc()
    }, [productTree])


    const getAttrPriceFunc = async () => {
        const cabinets = Object.keys(productTree)
        let bodyReq = {}

        cabinets.forEach(cabinet => {
            const clrCabinet = cabinet.replaceAll(/_/g, " ")
            const clrNamesModel= {}
            Object.keys(productTree[cabinet]).forEach(nameModel => {
                const clrNameModel = nameModel.replaceAll(/_/g, " ")
                clrNamesModel[clrNameModel] = productTree[cabinet][nameModel].exampleId
            })
            bodyReq[clrCabinet] = clrNamesModel
        })

        dispatch(getAttrPrice(bodyReq))
    }

    const onOpenTables = async () => {
        dispatch(openTables())
        try {
            dispatch(setLoading())
            const dataProdTree = await request(`${domain}/api/product/get_productTree`)
            // const dataProdTree = await request(`${domain}/api/product/write_genStorage`)
            await dispatch(getProductTree(dataProdTree.docs))
        } catch (e) {
            console.log("Ошибка :", e.message)
        }

    }

    const handlerResetData = async () => {
        dispatch(resetData())
        await onOpenTables()
    }



    return (
        <div className="col s8 offset-s2">
            <div className="card blue-grey darken-2">
                <div className="card-content white-text">
                    <span className="card-title">Мониторинг цен по кабинетам на OZON</span>

                </div>
            </div>

            <div className="card">
                <div className="card-action center brown lighten-5">
                    {isOpen ? <button
                            className="indigo waves-effect waves-light btn  darken-1"
                            onClick={handlerResetData}
                            disabled={isLoading}
                        >Перезагрузить</button> :
                        <button
                            className="indigo waves-effect waves-light btn  darken-1"
                            onClick={onOpenTables}
                            disabled={isLoading}
                        >Загрузить таблицу</button>
                    }

                </div>
            </div>

        </div>

    );
};

export default CommandPanel;