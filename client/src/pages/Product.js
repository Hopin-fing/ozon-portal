import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {endLoading, getCommissions, getHistory, getProduct, setLoading} from "../redux/actions/products";
import LinkHome from "../components/Link/LinkHome";
import LinkList from "../components/Link/LinkList";
import {Loader} from "../components/Loader";

const Product =  React.memo(function Product ({match, location}) {

    const dispatch = useDispatch();
    const urlId = match.params.name
    const urlEmptyImg = 'http://images.vfl.ru/ii/1627130916/99d1b9d6/35267436_s.png'
    const products = useSelector(({products}) => products.item);
    const loading = useSelector(({products}) => products.loading);
    const [history, setHistory] = useState( [])
    const requestCommissions = {
        "offer_id": products.offer_id,
        "product_id": products.id,
        "sku": 0
    }



    useEffect(() => {
        dispatch(setLoading())
        dispatch(getProduct(urlId))
    }, [])



    useEffect(() => {
        if(!products.history) dispatch(getHistory(products))
        if(products.history && products.offer_id) {
            const objHistory = products,
                result = [],
                cabinet = products.cabinet
            dispatch(getCommissions(requestCommissions,cabinet))


            if (objHistory) objHistory.history.forEach( element => {
                result.push(element)
                setHistory(result)
            })
            dispatch(endLoading())

        }

    }, [products.history])


    return (
        <>
        <LinkHome/>
        <LinkList model={location.model}/>
        <div className={"padding-top-100"}>

            {loading
                ? <div className="row">
                    <div className="col s12 text-center">
                        <Loader/>
                    </div>
                </div>
                : <div className="row">
                    <div className="col s6 text-center journal">
                        <div className="journal__wrapper">
                            <h5 className="journal__title">Журнал изменения цен</h5>
                            <ul className="collection">
                                {history.length !== 0
                                    ? history.map((item, index) => {
                                        return <li key={`product-history-${index}`} className="collection-item">{item.data} - {item.price} р. {item.cause ? item.cause : "--"}</li>
                                    })
                                    :  <li className="collection-item">Изменений цены не было</li>
                                }

                            </ul>
                        </div>

                    </div>

                    <div className="col s6 text-center">
                        <img src={products.images ? products.images[0] : urlEmptyImg} alt="test" style={{width: "350px"}}/>
                        <ul>
                            <li>Атрибут: {products.id}</li>
                            <li>Наименование: {products.name}</li>
                            <li>Цена: {`${parseInt(products.price)} р.`}</li>
                            <li>Коммиссия: {products.commissions
                                ?`${parseInt(products.commissions[0].value)} р.`
                                : ""
                            }</li>
                        </ul>
                    </div>
                </div>
            }

        </div>
        </>
    );
});

export default Product;