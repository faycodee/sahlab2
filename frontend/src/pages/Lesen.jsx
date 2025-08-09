// Lesen.jsx (Parent Component)
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/lesen"
    : import.meta.env.VITE_API_URL + "/api/lesen";

const Lesen = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      setData(res.data);
      console.log(data);
    });
  }, []);
  const HandelDetails = (id) => {
    navigate(`/lesen/${id}/teil1`);
  };

  return (
    <div className="p-4 space-y-10 w-full  h-[86vh] bg-gradient-to-r from-green-50 to-blue-100 py-16 md:py-24">
      <div>
        <h1 className="font-mono mb-10"></h1>
        <h1 className="text-4xl  md:text-5xl font-extrabold text-gray-800 mb-10">
          Themat Lesen :<span className="text-green-700">B2</span>
        </h1>
        <div>
          {!data && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
              
            </div>
          )}
          {data && (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-3xl ">
              {/* ... thead ... */}
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => HandelDetails(item._id)}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{item.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {item.thema}
                    </td>
                    <td className="px-6 py-4">{item.themaTr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* <Teil1 data={data.teile.teil1} onScore={(s) => updateScore('Teil 1', s)} /> */}
      {/* <Teil2 data={data.teile.teil2} onScore={(s) => updateScore('Teil 2', s)} />
      <Teil3 data={data.teile.teil3} onScore={(s) => updateScore('Teil 3', s)} />
      <SprachTeil1 data={data.sprachb.teil1} onScore={(s) => updateScore('SprachTeil 1', s)} />
      <SprachTeil2 data={data.sprachb.teil2} onScore={(s) => updateScore('SprachTeil 2', s)} /> */}

      <div className="text-xl font-bold text-center">
        {/* Gesamtergebnis:  */}
        {/* {totalScore} Punkte */}
      </div>
    </div>
  );
};

export default Lesen;
