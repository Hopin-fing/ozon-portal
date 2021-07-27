import React, {useState} from "react"
import {useHttp} from "../hooks/http.hook";

export const AuthPage = () => {
    const {loading, error, request} = useHttp()
    const [form, setForm] = useState( {
        login: '', password: ''
    })

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value} )
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', "POST", {...form})
            console.log("Data", data)
        }catch (e) {

        }
    }
    return(
        <div className="row">
            <div className="col s8 offset-s1">
                <h3>Мониторинг цен Ozon</h3>
                <div className="card #bdbdbd grey lighten-1 ">
                    <div className="card-content">
                        <span className="card-title">Авторизация</span>
                        <div className="input-field">
                            <input
                                id="login"
                                type="text"
                                name="login"
                                className="validate"
                                onChange={changeHandler}
                            />
                            <label className="black-text" htmlFor="login">Login</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="password"
                                type="text"
                                name="password"
                                className="validate"
                                onChange={changeHandler}
                            />
                            <label className="black-text" htmlFor="password">Password</label>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn green lighten-1">Войти</button>
                        <button
                            className="btn yellow lighten-1"
                            onClick={registerHandler}
                        >Регистрация</button>
                    </div>
                </div>

            </div>
        </div>
    )
}