import React, {useEffect} from 'react';
import {getListModel, setLoading} from "../redux/actions/products";
import {useDispatch} from "react-redux";
import LinkHome from "../components/Link/LinkHome";
import TabContent from "../components/TabList";

const List = ({match}) =>  {

    const dispatch = useDispatch();
    const urlData = match.params.name

    useEffect(() => {
        dispatch(setLoading())
        dispatch(getListModel(urlData))
    },[])

    return (
        <>
            <LinkHome/>
            <TabContent
                urlData={urlData}
            />
        </>
    )
}

export default List;