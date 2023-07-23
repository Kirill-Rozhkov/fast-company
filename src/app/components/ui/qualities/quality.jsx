import React from "react";
import PropTypes from "prop-types";
import { useQuality } from "../../../hooks/useQuality";
const Quality = ({ _id }) => {
    const { isLoading, getQuality } = useQuality(_id);
    const quality = getQuality(_id);
    console.log(quality);
    if (!isLoading) {
        return (
            <span className={"badge m-1 bg-" + quality.color}>
                {quality.name}
            </span>
        );
    } else {
        return "Loading...";
    }
};
Quality.propTypes = {
    _id: PropTypes.string.isRequired
};

export default Quality;
