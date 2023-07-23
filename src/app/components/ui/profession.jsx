import React from "react";
import PropTypes from "prop-types";
import { useProfessions } from "../../hooks/useProfession";

const Profession = ({ id }) => {
    const { isLoading, getProfessions } = useProfessions();
    const prof = getProfessions(id);
    if (!isLoading) {
        return <p>{prof.name}</p>;
    } else {
        return "Loading...";
    }
};

Profession.propTypes = {
    id: PropTypes.string
};

export default Profession;
