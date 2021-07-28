import React, {useState} from 'react';
import {getListModel} from "../redux/actions/products";
import {useDispatch, useSelector} from "react-redux";
import LinkHome from "../components/LinkHome";
import TableRow from "../components/TableRow";

const List = ({match}) => {
    console.log("match", match)
    const urlName = match.params.name
    const dispatch = useDispatch();
    dispatch(getListModel(urlName))

    const products = useSelector(({products}) => products.listModel);
    return (
        <> {products.length !== 0
            ?<>
                <LinkHome/>
                <div className="row">
                    <div className="col s12">
                        <table className="striped centered">
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Артикул OZON</th>
                                <th>Артикул</th>
                                <th>Название товара</th>
                                <th>Штрихкод</th>
                                <th>Цена</th>
                                <th>Минимальная цена</th>
                                <th>Кол-во на складе </th>

                                <th> </th>

                            </tr>
                            </thead>

                            <tbody>
                            {products.map((item,index) =>
                             <TableRow key={`product_${index}`}
                                       index={index}
                                       offerId={item.offer_id}
                                       id={item.id}
                                       name={item.name}
                                       barcode={item.barcode}
                                       price={item.price}
                                       purchasePrice={item.purchasePrice}
                                       balance={item.balance}
                                       minPrice={item.minPrice}
                                       url ={urlName}/>
                            )}
                            </tbody>
                        </table>
                        {/*<Pagination totalRecords={products.result.items.length} />*/}
                    </div>

                </div>

            </>
            : <>
                <LinkHome/>
                <h5>Модель не найдена</h5>
            </>}
        </>
    )
}

export default List;