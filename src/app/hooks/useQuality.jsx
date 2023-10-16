import React, { useContext, useEffect, useState } from "react"
import PropTypes, { oneOfType } from "prop-types"
import { toast } from "react-toastify"
import qualityService from "../services/quality.service"

const QualityContext = React.createContext()

export const useQuality = () => {
    return useContext(QualityContext)
}

export const QualityProvider = ({ children }) => {
    const [isLoading, setLoading] = useState(true)
    const [qualities, setQualites] = useState([])
    const [error, setError] = useState(null)
    useEffect(() => {
        getQualiteisList()
    }, [])
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

    async function getQualiteisList() {
        try {
            const { content } = await qualityService.get()
            setQualites(content)
            setLoading(false)
        } catch (error) {
            errorCatcher(error)
        }
    }

    function getQuality(id) {
        return qualities.find((q) => q._id === id)
    }

    function transformQualities(qualities) {
        if (qualities) {
            return qualities.map((qual) => {
                const quality = getQuality(qual)
                return {
                    label: quality.name,
                    value: quality._id
                }
            })
        } else {
            return []
        }
    }

    return (
        <QualityContext.Provider
            value={{ isLoading, qualities, getQuality, transformQualities }}
        >
            {children}
        </QualityContext.Provider>
    )
}

QualityProvider.propTypes = {
    children: oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
}
