import React from "react";
import EditUserPage from "../components/page/editUserPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UserProvider from "../hooks/useUsers";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
const Users = () => {
    const params = useParams();
    const { userId, edit } = params;
    return (
        <UserProvider>
            {userId ? (
                edit ? (
                    <EditUserPage />
                ) : (
                    <UserPage userId={userId} />
                )
            ) : (
                <UsersListPage />
            )}
        </UserProvider>
    );
};

export default Users;
