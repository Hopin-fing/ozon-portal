const {Router} = require('express')
const User = require('../models/User')
const config = require("config")
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator");
const router = Router()


router.post(
    '/register',
    [
        check('login', 'Введите корректный логин').notEmpty(),
        check('password', 'Введите пароль').exists()
    ],
    async (req,res) => {
        try{
            const errors = validationResult(req)

            if(errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные'
                })
            }
            const {login, password} = req.body
            const candidate = await User.findOne({login})

            if(candidate) {
                return res.status(400).json({message: "Такой пользователь существует"})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ login, password: hashedPassword})

            await user.save()

            res.status(201).json({message: 'User created'})

        }catch (e) {

        }
    })

router.post(
    '/login',
    [
        check('login', 'Введите корректный логин').notEmpty(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректые данные'
                })
            }

            const {login, password} = req.body
            const user = await  User.findOne({login})


            if(!user) {
                return res.status(400).json({message: "Пользователь не найден"})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                return res.status(400).json({ message: "Неверные данные"})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
            {expiresIn: '1h'}
            )

            res.json({token, userId: user.id})

        } catch (e) {
            res.status(500).json({
                message: 'Что-то пошло не так, повторите попытку'
            })
        }
    })


module.exports = router