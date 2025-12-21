
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Trip } from '../types';
import { Calendar, MapPin, Clock, ChevronLeft, ArrowRight } from 'lucide-react';

interface MyTripsProps {
  user: User;
}

const MyTrips: React.FC<MyTripsProps> = ({ user }) => {
  const navigate = useNavigate();
  // Mock trips
  const trips = [
    {
      id: 't1',
      fromCity: 'جدة',
      toCity: 'صنعاء',
      date: '2024-05-20',
      status: 'ACTIVE',
      price: 150,
      seatsBooked: 2,
      seatsAvailable: 4
    },
    {
      id: 't2',
      fromCity: 'الرياض',
      toCity: 'عدن',
      date: '2024-05-15',
      status: 'COMPLETED',
      price: 200,
      seatsBooked: 4,
      seatsAvailable: 4
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition bg-white shadow-sm">
          <ArrowRight size={24} className="text-gray-800" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">رحلاتي</h2>
      </div>
      
      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                <span className="text-sm font-bold text-gray-600">{trip.date}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                trip.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {trip.status === 'ACTIVE' ? 'نشطة' : 'مكتملة'}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <div className="w-0.5 h-6 bg-gray-100"></div>
                <div className="w-2 h-2 rounded-full border-2 border-blue-600"></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-bold text-gray-800">{trip.fromCity}</div>
                <div className="font-bold text-gray-800">{trip.toCity}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock size={12} /> 08:00 ص</span>
                <span>{trip.seatsBooked} مسافرين</span>
              </div>
              <div className="font-bold text-blue-600">
                {trip.price} ر.س
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTrips;
