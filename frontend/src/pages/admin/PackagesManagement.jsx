import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiGrid, FiList, FiEye, FiCheck, FiX, FiImage, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Domestic', 'International', 'Family', 'Adventure', 'Luxury', 'Pilgrimage', 'Wildlife', 'Beach', 'Hill Station', 'Cultural'];

export default function PackagesManagement() {
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, featured: 0, bestseller: 0 });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  
  // Filtering & Pagination
  const [filters, setFilters] = useState({ search: '', status: 'all', category: 'All' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentPkg, setCurrentPkg] = useState(null);
  const [formTab, setFormTab] = useState('basic'); // basic, pricing, content, itinerary, images, settings

  // Form State
  const [formData, setFormData] = useState(getInitialFormData());
  const [files, setFiles] = useState({ coverImage: null, galleryImages: [] });
  const [previews, setPreviews] = useState({ coverImage: '', galleryImages: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPackages();
    fetchStats();
  }, [page, filters.status, filters.category]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPackages();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        status: filters.status,
      });
      if (filters.search) params.append('search', filters.search);
      if (filters.category !== 'All') params.append('category', filters.category);
      
      const res = await api.get(`/packages?${params.toString()}`);
      setPackages(res.data.packages || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/packages/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Stats fetch failed', err);
    }
  };

  function getInitialFormData() {
    return {
      title: '', destination: '', country: '', category: 'Domestic', type: 'Domestic',
      price: '', originalPrice: '', durationDays: 1, durationNights: 0, duration: '', availableSeats: 20,
      shortDescription: '', detailedDescription: '',
      highlights: [''], inclusions: [''], exclusions: [''],
      itinerary: [{ day: 1, title: '', description: '', meals: '', accommodation: '' }],
      hotelInfo: [{ name: '', rating: 3, location: '', amenities: [''] }],
      transportInfo: { type: '', details: '' },
      mealPlan: '', cancellationPolicy: '', termsAndConditions: '',
      isFeatured: false, isBestSeller: false, status: 'Active'
    };
  }

  const handleOpenForm = (pkg = null) => {
    if (pkg) {
      // Ensure we have arrays even if null in db
      const editData = {
        ...pkg,
        highlights: pkg.highlights?.length ? pkg.highlights : [''],
        inclusions: pkg.inclusions?.length ? pkg.inclusions : [''],
        exclusions: pkg.exclusions?.length ? pkg.exclusions : [''],
        itinerary: pkg.itinerary?.length ? pkg.itinerary : [{ day: 1, title: '', description: '', meals: '', accommodation: '' }],
        hotelInfo: pkg.hotelInfo?.length ? pkg.hotelInfo : [{ name: '', rating: 3, location: '', amenities: [''] }],
        transportInfo: pkg.transportInfo || { type: '', details: '' }
      };
      setFormData(editData);
      setPreviews({
        coverImage: pkg.coverImage || pkg.image || '',
        galleryImages: pkg.galleryImages || pkg.images || []
      });
    } else {
      setFormData(getInitialFormData());
      setPreviews({ coverImage: '', galleryImages: [] });
    }
    setFiles({ coverImage: null, galleryImages: [] });
    setFormTab('basic');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(getInitialFormData());
    setFiles({ coverImage: null, galleryImages: [] });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package permanently?')) return;
    try {
      await api.delete(`/packages/${id}`);
      toast.success('Package deleted');
      fetchPackages();
      fetchStats();
    } catch (err) {
      toast.error('Failed to delete package');
    }
  };

  const toggleFeatured = async (id) => {
    try {
      await api.patch(`/packages/${id}/featured`);
      fetchPackages();
      fetchStats();
    } catch (err) {
      toast.error('Failed to update featured status');
    }
  };

  const toggleBestSeller = async (id) => {
    try {
      await api.patch(`/packages/${id}/bestseller`);
      fetchPackages();
      fetchStats();
    } catch (err) {
      toast.error('Failed to update bestseller status');
    }
  };

  // ── Form Handlers ──────────────────────────────────────────────────────────

  const handleFileChange = (e, field) => {
    if (field === 'coverImage') {
      const file = e.target.files[0];
      if (file) {
        setFiles(prev => ({ ...prev, coverImage: file }));
        setPreviews(prev => ({ ...prev, coverImage: URL.createObjectURL(file) }));
      }
    } else if (field === 'galleryImages') {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...newFiles] }));
      
      const newPreviews = newFiles.map(f => URL.createObjectURL(f));
      setPreviews(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...newPreviews] }));
    }
  };

  const removeGalleryImage = (index, isExisting) => {
    if (isExisting) {
      const newExisting = [...previews.galleryImages];
      newExisting.splice(index, 1);
      setPreviews(prev => ({ ...prev, galleryImages: newExisting }));
      // Also update formData so it gets saved
      setFormData(prev => ({ ...prev, galleryImages: newExisting }));
    } else {
      // It's a new file, calculate offset based on existing images
      const existingCount = formData._id && formData.galleryImages ? formData.galleryImages.length : 0;
      const fileIndex = index - existingCount;
      
      const newFiles = [...files.galleryImages];
      newFiles.splice(fileIndex, 1);
      setFiles(prev => ({ ...prev, galleryImages: newFiles }));
      
      const newPreviews = [...previews.galleryImages];
      newPreviews.splice(index, 1);
      setPreviews(prev => ({ ...prev, galleryImages: newPreviews }));
    }
  };

  // Array handlers (Highlights, Inclusions, etc)
  const handleArrayChange = (field, index, value) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };
  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };
  const removeArrayItem = (field, index) => {
    const newArr = [...formData[field]];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  // Itinerary handlers
  const handleItineraryChange = (index, subfield, value) => {
    const newItin = [...formData.itinerary];
    newItin[index] = { ...newItin[index], [subfield]: value };
    setFormData({ ...formData, itinerary: newItin });
  };
  const addItineraryDay = () => {
    const nextDay = formData.itinerary.length > 0 ? formData.itinerary[formData.itinerary.length - 1].day + 1 : 1;
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: nextDay, title: '', description: '', meals: '', accommodation: '' }]
    });
  };
  const removeItineraryDay = (index) => {
    const newItin = [...formData.itinerary];
    newItin.splice(index, 1);
    // Re-number days
    newItin.forEach((item, i) => item.day = i + 1);
    setFormData({ ...formData, itinerary: newItin });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      
      // Auto-generate duration string if empty
      let finalData = { ...formData };
      if (!finalData.duration) {
        finalData.duration = `${finalData.durationDays}D/${finalData.durationNights}N`;
      }

      // Append basic fields
      Object.keys(finalData).forEach(key => {
        if (['highlights', 'inclusions', 'exclusions', 'itinerary', 'hotelInfo', 'transportInfo', 'galleryImages'].includes(key)) {
          data.append(key, JSON.stringify(finalData[key]));
        } else if (key !== 'coverImage' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
          data.append(key, finalData[key]);
        }
      });

      // Append files
      if (files.coverImage) {
        data.append('coverImage', files.coverImage);
      }
      if (files.galleryImages.length > 0) {
        files.galleryImages.forEach(file => {
          data.append('galleryImages', file);
        });
        data.append('appendGallery', formData._id ? 'true' : 'false'); // If editing, append. If new, just these.
      }

      if (formData._id) {
        await api.put(`/packages/${formData._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success('Package updated successfully');
      } else {
        await api.post('/packages', data, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success('Package created successfully');
      }
      
      handleCloseForm();
      fetchPackages();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save package');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Package Management</h1>
          <p className="text-slate-500 text-sm">Manage all your tour packages</p>
        </div>
        <button onClick={() => handleOpenForm()} className="btn btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <FiPlus size={16} /> Add New Package
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'blue' },
          { label: 'Active', value: stats.active, color: 'emerald' },
          { label: 'Inactive', value: stats.inactive, color: 'slate' },
          { label: 'Featured', value: stats.featured, color: 'amber' },
          { label: 'Best Sellers', value: stats.bestseller, color: 'rose' }
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
            <span className="text-sm font-medium text-slate-500 mb-1">{s.label}</span>
            <span className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="" 
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <select 
            value={filters.status} 
            onChange={e => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select 
            value={filters.category} 
            onChange={e => setFilters({...filters, category: e.target.value})}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setView('grid')} className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
            <FiGrid size={16} />
          </button>
          <button onClick={() => setView('list')} className={`p-1.5 rounded-md ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
            <FiList size={16} />
          </button>
        </div>
      </div>

      {/* Package List */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : packages.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center shadow-sm">
          <FiMapPin className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No packages found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-slate-100">
                <img src={pkg.coverImage || pkg.image || 'https://via.placeholder.com/400x300'} alt={pkg.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-white ${pkg.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}`}>
                    {pkg.status}
                  </span>
                  {pkg.isFeatured && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500 text-white">Featured</span>}
                  {pkg.isBestSeller && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-rose-500 text-white">Best Seller</span>}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded">
                  ${pkg.price.toLocaleString()}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-blue-600 mb-1">{pkg.category}</div>
                <h3 className="font-bold text-slate-900 mb-1 line-clamp-1" title={pkg.title}>{pkg.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><FiMapPin /> {pkg.destination}</span>
                  <span className="flex items-center gap-1"><FiCalendar /> {pkg.durationDays}D/{pkg.durationNights}N</span>
                </div>
                
                <div className="mt-auto pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <button onClick={() => { setCurrentPkg(pkg); setIsViewOpen(true); }} className="flex justify-center items-center gap-1 py-1.5 rounded bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors">
                    <FiEye size={14} /> View
                  </button>
                  <button onClick={() => handleOpenForm(pkg)} className="flex justify-center items-center gap-1 py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium transition-colors">
                    <FiEdit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(pkg._id)} className="flex justify-center items-center gap-1 py-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-medium transition-colors">
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fafaf8] text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-slate-400">Package Details</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-slate-400">Price</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-slate-400">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-slate-400">Highlights</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {packages.map(pkg => (
                  <tr key={pkg._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
                          <img src={pkg.coverImage || pkg.image || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-base">{pkg.title}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{pkg.destination} <span className="mx-1 text-slate-300">•</span> {pkg.durationDays} Days</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">${pkg.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border ${pkg.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        {pkg.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleFeatured(pkg._id)} className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md border transition-colors ${pkg.isFeatured ? 'bg-[#7C3AED]/10 border-[#7C3AED]/30 text-[#7C3AED]' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>Featured</button>
                        <button onClick={() => toggleBestSeller(pkg._id)} className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md border transition-colors ${pkg.isBestSeller ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>Best Seller</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setCurrentPkg(pkg); setIsViewOpen(true); }} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="View"><FiEye size={16} /></button>
                        <button onClick={() => handleOpenForm(pkg)} className="p-2 text-blue-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><FiEdit size={16} /></button>
                        <button onClick={() => handleDelete(pkg._id)} className="p-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button 
              key={i} 
              onClick={() => setPage(i+1)}
              className={`w-8 h-8 rounded text-sm flex items-center justify-center ${page === i+1 ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              {i+1}
            </button>
          ))}
        </div>
      )}

      {/* ADD/EDIT PACKAGE MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseForm}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">{formData._id ? 'Edit Package' : 'Create New Package'}</h2>
              <button onClick={handleCloseForm} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"><FiX size={20} /></button>
            </div>

            {/* Modal Body - 2 Columns */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 flex flex-col gap-1 overflow-y-auto">
                {[
                  { id: 'basic', label: 'Basic Info' },
                  { id: 'pricing', label: 'Pricing & Status' },
                  { id: 'content', label: 'Descriptions' },
                  { id: 'lists', label: 'Highlights & Info' },
                  { id: 'itinerary', label: 'Itinerary' },
                  { id: 'images', label: 'Images' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    type="button"
                    onClick={() => setFormTab(tab.id)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${formTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <form id="package-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* BASIC INFO TAB */}
                  <div className={formTab === 'basic' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Package Title *</label>
                        <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Destination *</label>
                        <input type="text" required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                        <input type="text" required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration Days *</label>
                        <div className="flex items-center gap-2">
                          <input type="number" min="1" required value={formData.durationDays} onChange={e => setFormData({...formData, durationDays: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                          <span className="text-sm text-slate-500">Days</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration Nights *</label>
                        <div className="flex items-center gap-2">
                          <input type="number" min="0" required value={formData.durationNights} onChange={e => setFormData({...formData, durationNights: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                          <span className="text-sm text-slate-500">Nights</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Custom Duration String (Optional)</label>
                        <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="" />
                      </div>
                    </div>
                  </div>

                  {/* PRICING & STATUS TAB */}
                  <div className={formTab === 'pricing' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold mb-4">Pricing, Capacity & Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Selling Price ($) *</label>
                        <input type="number" min="0" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Original Price / MRP ($)</label>
                        <input type="number" min="0" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Available Seats *</label>
                        <input type="number" min="0" required value={formData.availableSeats} onChange={e => setFormData({...formData, availableSeats: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                          <option value="Active">Active (Visible to users)</option>
                          <option value="Inactive">Inactive (Hidden)</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2 mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="font-semibold text-sm mb-3">Promotional Toggles</p>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm font-medium">Show as Featured</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.isBestSeller} onChange={e => setFormData({...formData, isBestSeller: e.target.checked})} className="w-4 h-4 text-rose-600 rounded" />
                            <span className="text-sm font-medium">Mark as Best Seller</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTIONS TAB */}
                  <div className={formTab === 'content' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold mb-4">Descriptions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Short Description (For Cards) *</label>
                        <textarea required value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="w-full px-3 py-2 border rounded-lg h-20 resize-none" placeholder=""></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description (For Package Page)</label>
                        <textarea value={formData.detailedDescription} onChange={e => setFormData({...formData, detailedDescription: e.target.value})} className="w-full px-3 py-2 border rounded-lg h-48" placeholder=""></textarea>
                      </div>
                    </div>
                  </div>

                  {/* LISTS & INFO TAB */}
                  <div className={formTab === 'lists' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold mb-4">Highlights, Inclusions & Info</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Transport & Meals */}
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-slate-50">
                          <h4 className="font-semibold text-sm mb-3">Transport Info</h4>
                          <input type="text" value={formData.transportInfo?.type || ''} onChange={e => setFormData({...formData, transportInfo: {...formData.transportInfo, type: e.target.value}})} className="w-full px-3 py-2 border rounded-lg mb-2 text-sm" placeholder="" />
                          <input type="text" value={formData.transportInfo?.details || ''} onChange={e => setFormData({...formData, transportInfo: {...formData.transportInfo, details: e.target.value}})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Meal Plan</label>
                          <input type="text" value={formData.mealPlan} onChange={e => setFormData({...formData, mealPlan: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="" />
                        </div>
                      </div>

                      {/* Hotel (simplified to 1 for form) */}
                      <div className="p-4 border rounded-lg bg-slate-50">
                        <h4 className="font-semibold text-sm mb-3">Primary Accommodation</h4>
                        <div className="space-y-3">
                          <input type="text" value={formData.hotelInfo?.[0]?.name || ''} onChange={e => handleArrayChange('hotelInfo', 0, {...formData.hotelInfo[0], name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="" />
                          <div className="flex gap-2">
                            <input type="number" min="1" max="5" value={formData.hotelInfo?.[0]?.rating || 3} onChange={e => handleArrayChange('hotelInfo', 0, {...formData.hotelInfo[0], rating: Number(e.target.value)})} className="w-20 px-3 py-2 border rounded-lg text-sm" placeholder="" />
                            <input type="text" value={formData.hotelInfo?.[0]?.location || ''} onChange={e => handleArrayChange('hotelInfo', 0, {...formData.hotelInfo[0], location: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrays: Highlights, Inclusions, Exclusions */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {['highlights', 'inclusions', 'exclusions'].map(field => (
                        <div key={field} className="border p-3 rounded-lg">
                          <h4 className="font-semibold text-sm capitalize mb-2 flex justify-between items-center">
                            {field}
                            <button type="button" onClick={() => addArrayItem(field)} className="text-blue-600 hover:text-blue-800"><FiPlus size={16} /></button>
                          </h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {formData[field].map((item, idx) => (
                              <div key={idx} className="flex gap-1">
                                <input type="text" value={item} onChange={e => handleArrayChange(field, idx, e.target.value)} className="flex-1 px-2 py-1 text-sm border rounded" placeholder={`Item ${idx+1}`} />
                                <button type="button" onClick={() => removeArrayItem(field, idx)} className="text-slate-400 hover:text-rose-500 p-1"><FiX size={14} /></button>
                              </div>
                            ))}
                            {formData[field].length === 0 && <p className="text-xs text-slate-400 italic">No items added</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ITINERARY TAB */}
                  <div className={formTab === 'itinerary' ? 'block' : 'hidden'}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">Day-by-Day Itinerary</h3>
                      <button type="button" onClick={addItineraryDay} className="btn bg-blue-50 text-blue-600 text-sm py-1.5 px-3 flex items-center gap-1 rounded-lg">
                        <FiPlus /> Add Day
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.itinerary.map((day, idx) => (
                        <div key={idx} className="p-4 border rounded-xl bg-slate-50 relative group">
                          <button type="button" onClick={() => removeItineraryDay(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><FiTrash2 /></button>
                          
                          <div className="flex gap-3 mb-3">
                            <div className="w-10 h-10 shrink-0 bg-blue-100 text-blue-700 font-bold rounded-lg flex items-center justify-center">D{day.day}</div>
                            <div className="flex-1">
                              <input type="text" value={day.title} onChange={e => handleItineraryChange(idx, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg font-semibold" placeholder={`Day ${day.day} Title (e.g. Arrival & City Tour)`} />
                            </div>
                          </div>
                          
                          <textarea value={day.description || day.desc || ''} onChange={e => handleItineraryChange(idx, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm mb-3 h-20 resize-none" placeholder=""></textarea>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={day.meals || ''} onChange={e => handleItineraryChange(idx, 'meals', e.target.value)} className="w-full px-3 py-1.5 border rounded-lg text-sm" placeholder="" />
                            <input type="text" value={day.accommodation || ''} onChange={e => handleItineraryChange(idx, 'accommodation', e.target.value)} className="w-full px-3 py-1.5 border rounded-lg text-sm" placeholder="" />
                          </div>
                        </div>
                      ))}
                      {formData.itinerary.length === 0 && (
                        <div className="text-center py-8 text-slate-500 border border-dashed rounded-xl">No itinerary days added. Click "Add Day" to start.</div>
                      )}
                    </div>
                  </div>

                  {/* IMAGES TAB */}
                  <div className={formTab === 'images' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold mb-4">Images</h3>
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm mb-6 border border-amber-200">
                      <strong>Note:</strong> Images are stored as base64 in the database. Please compress images before uploading to save space. Max 5MB per image.
                    </div>
                    
                    {/* Cover Image */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image (Main thumbnail) *</label>
                      <div className="flex items-center gap-6">
                        <div className="w-48 h-32 rounded-lg border-2 border-dashed border-slate-300 overflow-hidden flex flex-col items-center justify-center bg-slate-50 relative group">
                          {previews.coverImage ? (
                            <>
                              <img src={previews.coverImage} alt="Cover" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs font-semibold">Change</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <FiImage className="text-slate-400 text-2xl mb-1" />
                              <span className="text-xs text-slate-500">Upload Cover</span>
                            </>
                          )}
                          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'coverImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                        <div className="text-xs text-slate-500">
                          <p>Recommended: 800x600px, WebP or JPEG.</p>
                          <p>Will be used as the main thumbnail in listings.</p>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Images */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Gallery Images</label>
                      
                      <div className="flex flex-wrap gap-4 mb-4">
                        {previews.galleryImages.map((src, idx) => {
                          const existingCount = formData._id && formData.galleryImages ? formData.galleryImages.length : 0;
                          const isExisting = idx < existingCount;
                          
                          return (
                            <div key={idx} className="w-24 h-24 rounded-lg border overflow-hidden relative group">
                              <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeGalleryImage(idx, isExisting)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiX size={12} />
                              </button>
                            </div>
                          );
                        })}
                        
                        {/* Add more button */}
                        <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 relative hover:bg-slate-100 transition-colors">
                          <FiPlus className="text-slate-400 text-xl" />
                          <span className="text-[10px] text-slate-500 mt-1">Add Image</span>
                          <input type="file" accept="image/*" multiple onChange={e => handleFileChange(e, 'galleryImages')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>

                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={handleCloseForm} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
              <button type="submit" form="package-form" disabled={submitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FiCheck />}
                {formData._id ? 'Save Changes' : 'Create Package'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
