import React, {useContext, useEffect, useState} from "react"
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";

export const AuthPage = () => {
    const auth = useContext(AuthContext)

    const { error, request, clearError} = useHttp()
    const [form, setForm] = useState( {
        login: '', password: ''
    })


    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value} )
    }

    const loginHandler = async () => {
        try {
            const data = await request('http://84.38.180.73:5000/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {}
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
                                value={form.login}
                                onChange={changeHandler}
                            />
                            <label className="black-text" htmlFor="login">Login</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="validate"
                                value={form.password}
                                onChange={changeHandler}
                            />
                            <label className="black-text" htmlFor="password">Password</label>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn green lighten-1"
                            onClick={loginHandler}
                        >Войти</button>
                    </div>
                </div>

            </div>
        </div>
    )
}