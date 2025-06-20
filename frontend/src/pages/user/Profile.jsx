// src/pages/user/Profile.jsx
import { useAuth } from "../../hooks/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  FaFacebook,
  FaUserCircle,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();


  if (!user) {
    return (
      <p className="text-center mt-10 text-lg text-red-500">
        No has iniciado sesión.
      </p>
    );
  }

  return (
    <div>
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto mt-20 mb-20 p-10">
          <div className="grid grid-cols-3 grid-rows-6 gap-4 h-140">
            {/* Perfil del Usuario */}
            <div className="row-span-4 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center p-6">
              <FaUserCircle className="size-40 text-gray-300" />
              <h2 className="mt-4 text-2xl font-bold text-center">
                {user?.username || "Usuario"}
              </h2>
              <p className="text-gray-600 pt-4">
                {user?.name || ""}
              </p>
            </div>

            {/* Información personal */}
            <div className="col-span-2 row-span-3 col-start-2 row-start-1 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Información personal
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>Usuario: {user?.username}</li>
                <li>Nombre: {user?.name}</li>
                <li>Email: {user?.email}</li>
                <li>Numero: {user?.phone}</li>
              </ul>
            </div>

            {/* Favoritos / Recetas */}
            <div className="col-span-2 row-span-3 col-start-2 row-start-4 rounded-xl shadow-lg bg-white p-6">
              <h3 className="text-xl font-semibold mb-4 ">Tus favoritos</h3>

              <div className="grid grid-cols-3 grid-rows-1 gap-4">
                <div className="shadow-md rounded-xl bg-gray-400 cursor-pointer h-40"></div>
                <div className="shadow-md rounded-xl bg-gray-400 cursor-pointer"></div>
                <div className="shadow-md rounded-xl bg-gray-400 cursor-pointer"></div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="row-span-2 row-start-5 bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold mb-2">Conecta tus redes</h3>
              <div className="flex space-x-4 text-2xl text-gray-500 gap-2 mt-2 ">
                <a href="">
                  <FaFacebook className="size-10" />
                </a>
                <a href="">
                  <FaTwitter className="size-10" />
                </a>
                <a href="">
                  <FaInstagram className="size-10" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
