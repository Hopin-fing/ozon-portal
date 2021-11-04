import React from "react";

import {Loader} from "./Loader";
import TableRow from "./TableRow";
import { useSelector} from "react-redux";

const TabContent = ({ urlData }) => {

    const products = useSelector(({products}) => products.listModel);
    const isLoading = useSelector(({products}) => products.loading);


    return (
        <div className={"padding-top-50"}>
        {Object.keys(products).length !== 0
                ?<>
                    <div className="row">
                        <div className="col s12">
                            {isLoading
                                ? <Loader/>
                                :
                                <table className="striped centered">
                                    <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>Артикул</th>
                                        <th>Артикул OZON</th>
                                        <th>Название товара</th>
                                        <th>Штрихкод</th>
                                        <th>Цена</th>
                                        <th>Кол-во на складе </th>
                                        <th>Закупочная цена </th>
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
                                                  buyingPrice={item.buyingPrice}
                                                  url ={urlData}/>
                                    )}
                                    </tbody>
                                </table>
                            }
                        </div>

                    </div>

                </>
                : <>
                    <h5>Модель не найдена</h5>
                </>}
        </div>
    )};

export default TabContent