import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import Contact from "../components/Contact";
import Layout from "./Layout";
import Recetas from "../components/recetas/Recetas";
import RecetaDetail from "../components/recetas/RecetaDetail";
import RecetaForm from "../components/recetas/RecetaForm";
import Profile from "../components/recetas/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../components/Auth/Login";
import RecetasMias from "../components/recetas/RecetasMias"

const Router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: "categories/:id",
                        element: (
                            <Recetas/>
                        ),
                    }
                ]
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/profile/:id",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/recetas",
                children: [
                    {
                        index: true,
                        element: <Recetas />,
                    },
                    {
                        path: ":id",
                        element: (
                            <ProtectedRoute>
                                <RecetaDetail />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "new",
                        element: (
                            <ProtectedRoute>
                                <RecetaForm />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "edit/:id",
                        element: (
                            <ProtectedRoute>
                                <RecetaForm />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "mis-recetas",
                        element: (
                            <ProtectedRoute>
                                <RecetasMias />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "*",
                element: <h1 className="title is-3">Not Found</h1>,
            },
        ],
    },
]);

export default Router;
