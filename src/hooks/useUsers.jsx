import React, { useContext } from "react";
import PropTypes, { oneOfType } from "prop-types";

const UserContext = React.createContext();

export const useUser = () => {
    return useContext(UserContext);
};

const UserProvider = ({ children }) => {
    return <UserContext.Provider>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
    children: oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default UserProvider;
