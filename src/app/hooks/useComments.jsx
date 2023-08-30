import React, { useContext, useEffect, useState } from "react"
import PropTypes, { oneOfType } from "prop-types"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useAuth } from "./useAuth"
import { nanoid } from "nanoid"
import commentService from "../services/comment.service"

const CommentsContext = React.createContext()

export const useComments = () => {
    return useContext(CommentsContext)
}

export const CommentsProvider = ({ children }) => {
    const { userId } = useParams()
    const { currentUser } = useAuth()
    const [comments, setComments] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        if (error !== null) {
            toast(error)
            setError(null)
        }
    }, [error])

    useEffect(() => {
        getComments()
    }, [userId])

    function errorCatcher(error) {
        const { message } = error.response.data
        setError(message)
    }

    async function createComment(data) {
        const comment = {
            ...data,
            _id: nanoid(),
            pageId: userId,
            created_at: Date.now(),
            userId: currentUser._id
        }
        try {
            const { content } = await commentService.createComment(comment)
            setComments((prev) => [...prev, content])
        } catch (error) {
            errorCatcher(error)
        } finally {
            setLoading(false)
        }
    }

    async function getComments() {
        try {
            const { content } = await commentService.getComments(userId)
            setComments(content)
        } catch (error) {
            errorCatcher(error)
        }
    }

    async function removeComment(id) {
        try {
            const { content } = await commentService.removeComment(id)
            if (content === null) {
                setComments((prev) => prev.filter((c) => c._id !== id))
            }
        } catch (error) {
            errorCatcher(error)
        }
    }

    return (
        <CommentsContext.Provider
            value={{ comments, createComment, isLoading, removeComment }}
        >
            {children}
        </CommentsContext.Provider>
    )
}

CommentsProvider.propTypes = {
    children: oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
}
