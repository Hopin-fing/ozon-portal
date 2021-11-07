import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import LinkHome from "../components/Link/LinkHome";
import FormStockStop from "../components/FormStockStop";
import {Loader} from "../components/Loader";

const StockPage = () =>  {

    const loading = useSelector(({products}) => products.loading)
    const dispatch = useDispatch();



    return (
        <>
            <LinkHome/>
            {loading
                ? <Loader/>
                :<div className="row padding-top-50">
                    <FormStockStop/>
                </div>
            }

        </>
    )
}

export default StockPage;