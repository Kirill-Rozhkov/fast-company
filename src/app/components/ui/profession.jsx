import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { useProfessions } from "../../hooks/useProfession"
import { useDispatch, useSelector } from "react-redux"
import {
    getProfessionById,
    getProfessionsLoadingStatus,
    loadProfessionsList
} from "../../store/professions"

const Profession = ({ id }) => {
    const prof = useSelector(getProfessionById(id))
    const isLoading = useSelector(getProfessionsLoadingStatus())

    if (!isLoading) {
        return <p>{prof.name}</p>
    } else {
        return "Loading..."
    }
}

Profession.propTypes = {
    id: PropTypes.string
}

export default Profession
