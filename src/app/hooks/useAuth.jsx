import React, { useContext, useEffect, useState } from "react"
import PropTypes, { oneOfType } from "prop-types"
import axios from "axios"
import userService from "../services/user.service"
import { toast } from "react-toastify"
import localStorageService, {
    setTokens
} from "../services/localStorage.service"
import { useHistory } from "react-router-dom"

export const httpAuth = axios.create({
    baseURL: "https://identitytoolkit.googleapis.com/v1/",
    params: {
        key: process.env.REACT_APP_FIREBASE_KEY
    }
})
const AuthContext = React.createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

const AuthProvider = ({ children }) => {
    const history = useHistory()
    const [currentUser, setUser] = useState()
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        if (error !== null) {
            toast(error)
            setError(null)
        }
    }, [error])

    function errorCatcher(error) {
        const { message } = error.response.data
        setError(message)
    }

    async function logIn({ email, password }) {
        const url = `accounts:signInWithPassword`
        try {
            const { data } = await httpAuth.post(url, {
                email,
                password,
                returnSecureToken: true
            })
            setTokens(data)
            await getUserData()
        } catch (error) {
            errorCatcher(error)
            const { code, message } = error.response.data.error

            if (code === 400) {
                switch (message) {
                    case "INVALID_PASSWORD":
                        throw new Error("Email или пароль введены неверно")
                    default:
                        throw new Error(
                            "Слишком много попыток входа. Попробуйте позже"
                        )
                }
            }
        }
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function logOut() {
        localStorageService.removeAuthData()
        setUser(null)
        history.push("/")
    }

    async function signUp({ email, password, ...rest }) {
        const url = `accounts:signUp`
        try {
            const { data } = await httpAuth.post(url, {
                email,
                password,
                returnSecureToken: true
            })
            setTokens(data)
            await createUser({
                _id: data.localId,
                email,
                rate: randomInt(1, 5),
                completedMeetings: randomInt(0, 200),
                image: `https://avatars.dicebear.com/api/avataaars/${(
                    Math.random() + 1
                )
                    .toString(36)
                    .substring(7)}.svg`,
                ...rest
            })
        } catch (error) {
            errorCatcher(error)
            const { code, message } = error.response.data.error
            if (code === 400) {
                if (message === "EMAIL_EXISTS") {
                    const errorObject = {
                        email: "Пользователь с таким Email уже существует"
                    }
                    throw errorObject
                }
            }
        }
    }

    async function createUser(data) {
        try {
            const { content } = await userService.create(data)
            setUser(content)
        } catch (error) {
            errorCatcher(error)
        }
    }

    async function getUserData() {
        try {
            const { content } = await userService.getCurrentUser()
            setUser(content)
        } catch (error) {
            errorCatcher(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (localStorageService.getAccessToken()) {
            getUserData()
        } else {
            setLoading(false)
        }
    }, [])

    async function updateUser(data) {
        try {
            const { content } = await userService.updateUser(data)
            console.log(content)
            setUser(content)
            history.push("/users" + currentUser._id)
        } catch (error) {
            errorCatcher(error)
        }
    }

    return (
        <AuthContext.Provider
            value={{ signUp, currentUser, logIn, logOut, updateUser }}
        >
            {!isLoading ? children : "Loading..."}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
}

export default AuthProvider
