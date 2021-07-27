import {Link} from "react-router-dom";

const TabContent = ({ title, cabinetInfo }) => {


    const minPrice = arrModels => {
        let arrPrices = []
        arrModels.forEach(model => {
            arrPrices.push(model["price"])
        })

        return Math.min.apply(null, arrPrices)
    }

    const averagePrice = arrPrice => {
        const count = arrPrice.length
        const sum = sumPriceModels(arrPrice)
        return Math.floor(sum/count)

    }

    const sumPriceModels = arrModels => {
        let sum = 0
        arrModels.forEach(model => {
            sum += model.price
        })
        return sum
    }

    const maxPurchasePrice = arrModels => {
        let arrPrices = []
        arrModels.forEach(model => {
            arrPrices.push(model["purchasePrice"])
        })
        return Math.max.apply(null, arrPrices)
    }

   return (

    <div className="tab-content">
        <h4>{title.replace("_", " ")}</h4>
        <table className="striped centered">
            <thead>
            <tr>
                {/*<th>Артикул</th>*/}
                <th>Название товара</th>
                <th>Средняя цена за модель</th>
                <th>Максимальная закупочная цена </th>
                <th>Минимальная цена</th>

                {/*<th>Цена</th>*/}
                {/*<th>Кол-во на складе</th>*/}
                {/*<th>Комиссия</th>*/}
                {/*<th>Мин. цена</th>*/}
                {/*<th>Прибыль</th>*/}
                <th> </th>

            </tr>
            </thead>

            <tbody>
            {Object.keys(cabinetInfo).map((item,index) =>
                <tr key={`model_${index}`}>
                    {/*<td>{item.offer_id}</td>*/}
                    <td>{item.replace(/_/g, " ")}</td>
                    <td>{`${averagePrice(cabinetInfo[item])} р.`}</td>
                    <td>{`${maxPurchasePrice(cabinetInfo[item])} р.`}</td>
                    <td>{`${minPrice(cabinetInfo[item])} р.`}</td>
                    {/*<td>{item.barcode}</td>*/}
                    {/*<td>{item.price.replace(/(00$)/ , "" )}</td>*/}
                    {/*<td>{item.stocks.coming}</td>*/}
                    {/*<td>{commission(item.price)}</td>*/}
                    {/*<td>?????</td>*/}
                    {/*<td>?????</td>*/}
                    <td>
                        <Link to={`/list/` + item}>
                            <i className="material-icons">chevron_right</i>
                        </Link>
                    </td>
                </tr>
            )
            }
            </tbody>
        </table>
    </div>
)};

export default TabContent