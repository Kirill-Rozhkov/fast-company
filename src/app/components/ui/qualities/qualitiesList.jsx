import React, { useEffect } from "react"
import PropTypes from "prop-types"
import Quality from "./quality"
import { useDispatch, useSelector } from "react-redux"
import {
    getQualitiesByIds,
    getQualitiesLoadingStatus,
    loadQualitiesList
} from "../../../store/qualities"

const QualitiesList = ({ qualities }) => {
    const isLoading = useSelector(getQualitiesLoadingStatus())
    const qualitiesList = useSelector(getQualitiesByIds(qualities))

    if (isLoading) return "Loading..."

    return (
        <>
            {qualitiesList.map((qual) => (
                <Quality key={qual._id} {...qual} />
            ))}
        </>
    )
}

QualitiesList.propTypes = {
    qualities: PropTypes.array
}

export default QualitiesList
