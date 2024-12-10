import React from "react";
import * as ReactRouterDOM from "react-router-dom";
import SurveyApp from "../SurveyApp";

const AdminSimpleContentPage: React.FC = () => {
    const navigate = ReactRouterDOM.useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.clear();

        navigate("/login");
    };

    return (
        <div className="flex flex-col justify-items-center">
            <div className={`flex flex-col lg:flex-row justify-evenly
                 w-full place-items-center place-content-center
                 pl-[10%] pr-[10%] text-center bg-slate-200  pt-4`}>
                <h1 className="text-4xl font-bold mb-6">Welcome to Admin Content Page</h1>
                <div className={`flex flex-row gap-4`}>
                    <ReactRouterDOM.NavLink
                        to={`/`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go Back
                    </ReactRouterDOM.NavLink>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <SurveyApp showSurveyForm={false} showRecords={true} showStats={true} />
        </div>
    );
};

export default AdminSimpleContentPage;
