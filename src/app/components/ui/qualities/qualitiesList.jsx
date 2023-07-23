import React from "react";
import PropTypes from "prop-types";
import Quality from "./quality";

const QualitiesList = ({ qualities }) => {
    console.log(qualities);
    return (
        <>
            {qualities.map((qual) => (
                <Quality key={qual._id} _id={qual} />
            ))}
        </>
    );
};

QualitiesList.propTypes = {
    qualities: PropTypes.array
};

export default QualitiesList;
