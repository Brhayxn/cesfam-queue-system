import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function useVerify(requiredRole) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const userRole = sessionStorage.getItem("userRol");

        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Token no valido'
            })
            navigate("/login");
            return;
        }

        if (userRole !== requiredRole) {
            Swal.fire({
                icon: 'error',
                title: 'Rol no valido'
            })
            navigate("/login");
        }
    }, [navigate, requiredRole]);
}