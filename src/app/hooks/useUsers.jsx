import React, { useContext, useEffect, useState } from "react"
import PropTypes, { oneOfType } from "prop-types"
import userService from "../services/user.service"
import { toast } from "react-toastify"
import { useHistory } from "react-router-dom"
import { useAuth } from "./useAuth"

const UserContext = React.createContext()

export const useUser = () => {
    return useContext(UserContext)
}

const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [isLoading, setloading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        getUsers()
    }, [])
    useEffect(() => {
        if (error !== null) {
            toast(error)
            setError(null)
        }
    }, [error])
    async function getUsers() {
        try {
            const { content } = await userService.get()
            setUsers(content)
            setloading(false)
        } catch (error) {
            errorCatcher(error)
        }
    }

    function errorCatcher(error) {
        const { message } = error.response.data
        setError(message)
    }

    function getUserById(userId) {
        return users.find((user) => user._id === userId)
    }

    return (
        <UserContext.Provider value={{ users, getUserById }}>
            {!isLoading ? children : "Loading"}
        </UserContext.Provider>
    )
}

UserProvider.propTypes = {
    children: oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
}

export default UserProvider
