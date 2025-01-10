import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { db } from './firebase';

const MontirDashboard = () => {
  const [montirs, setMontirs] = useState([]);
  const [filteredMontirs, setFilteredMontirs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newMontir, setNewMontir] = useState({
    Nama: '',
    'Plat No': '',
    'No telpon': '',
    'Merk Motor': '',
  });

  const fetchMontirs = () => {
    const montirsRef = ref(db, 'Montir');
    onValue(montirsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const montirData = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setMontirs(montirData);
        setFilteredMontirs(montirData);
      } else {
        setMontirs([]);
        setFilteredMontirs([]);
      }
    });
  };

  const filterMontirs = () => {
    if (searchQuery) {
      const filtered = montirs.filter(
        (montir) =>
          montir.Nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          montir['Plat No']?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          montir['Merk Motor']?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMontirs(filtered);
    } else {
      setFilteredMontirs(montirs);
    }
  };

  const handleAddMontir = () => {
    const montirsRef = ref(db, 'Montir');
    push(montirsRef, newMontir)
      .then(() => {
        setShowModal(false);
        setNewMontir({ Nama: '', 'Plat No': '', 'No telpon': '', 'Merk Motor': '' });
        console.log('Montir added successfully!');
      })
      .catch((error) => {
        console.error('Error adding montir:', error);
      });
  };

  useEffect(() => {
    fetchMontirs();
  }, []);

  useEffect(() => {
    filterMontirs();
  }, [searchQuery, montirs]);

  return (
    <div className="bg-white p-4 rounded shadow mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Montir Dashboard</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Add Montir
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search Montir by Name, Plat No, or Merk Motor"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-200 pl-3 pr-4 py-2 rounded w-1/4 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Nama</th>
              <th className="py-2 px-4 border">Plat No</th>
              <th className="py-2 px-4 border">No Telpon</th>
              <th className="py-2 px-4 border">Merk Motor</th>
            </tr>
          </thead>
          <tbody>
            {filteredMontirs.length > 0 ? (
              filteredMontirs.map((montir, index) => (
                <tr key={montir.id}>
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{montir.Nama || 'N/A'}</td>
                  <td className="py-2 px-4 border">{montir['Plat No'] || 'N/A'}</td>
                  <td className="py-2 px-4 border">{montir['No telpon'] || 'N/A'}</td>
                  <td className="py-2 px-4 border">{montir['Merk Motor'] || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-2 px-4 border text-center">
                  No montirs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Add New Montir</h3>
            {['Nama', 'Plat No', 'No telpon', 'Merk Motor'].map((field) => (
              <div className="mb-3" key={field}>
                <label className="block text-sm font-semibold">{field}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newMontir[field]}
                  onChange={(e) => setNewMontir({ ...newMontir, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMontir}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MontirDashboard;
