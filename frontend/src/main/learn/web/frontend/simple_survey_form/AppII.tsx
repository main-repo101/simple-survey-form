import * as React from 'react';
import * as ReactRouterDom from "react-router-dom"
import Login from './component/Login';
import AdminSimpleContentPage from './component/AdminSimpleContentPage';
import UserSimpleContentPage from './component/UserSimpleContentPage';
import ProtectedRoute from './component/ProtectedRoute';
import { AuthProvider } from './component/context/AuthContext';
import SurveyApp from './SurveyApp';
import "@resource/css/global-twcss.css";

const AppII: React.FC = () => {
    return (
        <AuthProvider>
            <ReactRouterDom.BrowserRouter>
                <ReactRouterDom.Routes>
                    <ReactRouterDom.Route index path="/" element={<SurveyApp />} />
                    <ReactRouterDom.Route path="/login" element={<Login />} />
                    <ReactRouterDom.Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <AdminSimpleContentPage />
                            </ProtectedRoute>
                        }
                    />
                    <ReactRouterDom.Route
                        path="/user/dashboard"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <UserSimpleContentPage />
                            </ProtectedRoute>
                        }
                    />
                    <ReactRouterDom.Route path="*" element={<h1>Page not found...</h1>} />
                </ReactRouterDom.Routes>
            </ReactRouterDom.BrowserRouter>
        </AuthProvider>
    );
};

export default AppII;
