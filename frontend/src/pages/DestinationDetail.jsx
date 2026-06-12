import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import PackageCard from '../components/PackageCard';
import { FiMapPin, FiArrowLeft, FiClock, FiStar, FiCamera, FiSun, FiHome, FiDollarSign, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

import { getDestinationDetails } from '../utils/destinationMockData';

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const destName = id ? decodeURIComponent(id) : 'Destination';
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destInfo, setDestInfo] = useState(null);

  useEffect(() => {
    const fetchDestData = async () => {
      try {
        const [pkgRes, destRes] = await Promise.all([
          api.get(`/packages?destination=${encodeURIComponent(destName)}&status=Active`),
          api.get('/packages/destinations')
        ]);
        
        setPackages(pkgRes.data.packages || []);
        
        const allDests = destRes.data || [];
        const found = allDests.find(d => d.name.toLowerCase() === destName.toLowerCase());
        setDestInfo(found);
      } catch (err) {
        console.error('Failed to fetch destination data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestData();
  }, [destName]);

  const dynamicDetails = getDestinationDetails(destName);
  
  const mockDetails = {
    name: destName,
    country: 'Global',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'
    ],
    ...dynamicDetails
  };

  const data = {
    ...mockDetails,
    name: destInfo?.name || destName,
    country: destInfo?.country || packages[0]?.country || 'Global',
    image: destInfo?.image || packages[0]?.coverImage || mockDetails.image,
    packagesCount: destInfo?.packages || packages.length || 0
  };

  return (
    <div className="bg-[#fafaf8] min-h-screen">
      <SEO title={`${data.name} - TravelGo`} description={`Explore packages in ${data.name}`} />

      {/* Banner */}
      <section className="relative h-[60vh] min-h-[500px]">
        <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16">
          <div className="max-w-[1200px] mx-auto">
            <Link to="/destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors">
              <FiArrowLeft /> Back to Destinations
            </Link>
            <h1 className="text-5xl lg:text-7xl text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {data.name}
            </h1>
            <div className="flex items-center gap-2 text-[#2563EB] font-bold text-lg">
              <FiMapPin /> {data.country}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="text-3xl text-[#0f172a] mb-6 border-b pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Overview</h2>
              <p className="text-[#475569] leading-relaxed text-lg">{data.description}</p>
            </div>

            {/* Attractions & Activities */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-4 flex items-center gap-2"><FiStar className="text-[#7C3AED]"/> Popular Attractions</h3>
                <ul className="space-y-3">
                  {data.attractions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#475569]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 shrink-0"/> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-4 flex items-center gap-2"><FiCamera className="text-[#7C3AED]"/> Activities</h3>
                <ul className="space-y-3">
                  {data.activities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#475569]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 shrink-0"/> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Available Packages */}
            <div className="mt-12">
              <h2 className="text-3xl text-[#0f172a] mb-6 border-b pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Available Packages in {data.name}
              </h2>
              {loading ? (
                <div className="text-center py-10">Loading packages...</div>
              ) : packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {packages.map((pkg, i) => (
                    <PackageCard key={pkg._id} pkg={pkg} index={i} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-10">No packages currently available for this destination.</p>
              )}
            </div>

            {/* Map Section (Placeholder) */}
            <div>
              <h2 className="text-3xl text-[#0f172a] mb-6 border-b pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Map & Location</h2>
              <div className="w-full h-[400px] bg-slate-200 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden relative">
                <iframe 
                  title="map"
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(data.name)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#f0ede6]">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#0f172a] mb-2">Plan Your Trip</h3>
                <p className="text-sm text-[#64748b]">Explore exclusive packages to {data.name}</p>
              </div>
              <button 
                onClick={() => {
                  if (packages.length > 0) {
                    navigate(`/packages/${packages[0]._id || packages[0].id}`);
                  } else {
                    navigate(`/packages?search=${encodeURIComponent(data.name)}`);
                  }
                }} 
                className="w-full py-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white rounded-xl font-bold tracking-widest uppercase hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Book Now
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0ede6] space-y-6">
              <div>
                <h4 className="font-bold text-[#0f172a] mb-2 flex items-center gap-2"><FiSun className="text-[#7C3AED]"/> Best Time to Visit</h4>
                <p className="text-sm text-[#475569]">{data.bestTime}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#0f172a] mb-2 flex items-center gap-2"><FiDollarSign className="text-[#7C3AED]"/> Estimated Budget</h4>
                <p className="text-sm text-[#475569]">{data.budget}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#0f172a] mb-2 flex items-center gap-2"><FiHome className="text-[#7C3AED]"/> Accommodations</h4>
                <ul className="text-sm text-[#475569] space-y-1">
                  {data.accommodations.map((a,i) => <li key={i}>• {a}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#0f172a] mb-2 flex items-center gap-2"><FiInfo className="text-[#7C3AED]"/> Travel Tips</h4>
                <ul className="text-sm text-[#475569] space-y-1">
                  {data.tips.map((a,i) => <li key={i}>• {a}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#0f172a] mb-2 flex items-center gap-2"><FiMapPin className="text-[#7C3AED]"/> Nearby Attractions</h4>
                <ul className="text-sm text-[#475569] space-y-1">
                  {data.nearby.map((a,i) => <li key={i}>• {a}</li>)}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
