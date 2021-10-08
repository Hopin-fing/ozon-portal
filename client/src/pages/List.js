import React from 'react';
import {getListModel} from "../redux/actions/products";
import {useDispatch, useSelector} from "react-redux";
import LinkHome from "../components/Link/LinkHome";
import TableRow from "../components/TableRow";

const List = ({match}) => {
    const urlName = match.params.name
    const dispatch = useDispatch();

    dispatch(getListModel(urlName))



    const products = useSelector(({products}) => products.listModel);
    return (
        <>
            <LinkHome/>
            <div className={"padding-top-50"}>
                {products.length !== 0
                ?<>
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
                                           balance={item.balance}
                                           minPrice={item.minPrice}
                                           url ={urlName}/>
                                )}
                                </tbody>
                            </table>
                        </div>

                    </div>

                </>
                : <>
                    <LinkHome/>
                    <h5>Модель не найдена</h5>
                </>}
            </div>
        </>
    )
}

export default List;