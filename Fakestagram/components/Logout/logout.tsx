import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <button onClick={handleLogout}><img src="https://static.vecteezy.com/system/resources/previews/020/839/751/non_2x/logout-icon-for-web-ui-design-vector.jpg" className="icon"></img></button>
    );
}

export default Logout;

