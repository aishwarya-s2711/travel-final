import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function DestinationsManagement() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await api.get('/admin/destinations');
      setDestinations(res.data || []);
    } catch (err) {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await api.delete(`/admin/destinations/${id}`);
      toast.success('Destination deleted');
      fetchDestinations();
    } catch (err) {
      toast.error('Failed to delete destination');
    }
  };

  if (loading) return <div>Loading destinations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Destinations</h1>
        <button className="btn btn-primary bg-blue-600 flex items-center gap-2">
          <FiPlus size={16} /> Add Destination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map(dest => (
          <div key={dest._id} className="modern-card bg-white overflow-hidden">
            <div className="h-36 bg-slate-100">
              <img src={dest.image || 'https://via.placeholder.com/400x300'} alt={dest.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-900">{dest.name}</h3>
              <p className="text-xs text-slate-400">{dest.country}</p>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <button className="btn bg-blue-50 text-blue-600 text-xs py-1 flex-1">Edit</button>
              <button onClick={() => handleDelete(dest._id)} className="btn bg-rose-50 text-rose-600 px-3 py-1"><FiTrash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
