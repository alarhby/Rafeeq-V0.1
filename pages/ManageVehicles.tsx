
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Vehicle, VehicleStatus } from '../types';
import { Car, Plus, Clock, CheckCircle, XCircle, ArrowRight, Edit2 } from 'lucide-react';

interface ManageVehiclesProps {
  user: User;
}

const ManageVehicles: React.FC<ManageVehiclesProps> = ({ user }) => {
  const navigate = useNavigate();
  // Mock vehicles
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'v1',
      driverId: user.id,
      make: 'تويوتا',
      model: 'كامري',
      year: '2023',
      plateNumber: 'أ ب ج 1234',
      status: VehicleStatus.APPROVED,
      photos: { front: '', back: '', side: '' },
      documents: { license: '', registration: '', idCard: '' }
    },
    {
      id: 'v2',
      driverId: user.id,
      make: 'هيونداي',
      model: 'إلنترا',
      year: '2021',
      plateNumber: 'س ع ص 9999',
      status: VehicleStatus.PENDING,
      photos: { front: '', back: '', side: '' },
      documents: { license: '', registration: '', idCard: '' }
    }
  ]);

  const handleEdit = (vehicle: Vehicle) => {
    navigate('/add-vehicle', { state: { vehicle } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition bg-white shadow-sm">
            <ArrowRight size={24} className="text-gray-800" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">سياراتي</h2>
        </div>
        <Link to="/add-vehicle" className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-blue-700 transition">
          <Plus size={20} />
          إضافة سيارة
        </Link>
      </div>

      <div className="grid gap-4">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Car size={32} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-800">{v.make} {v.model}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(v)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="تعديل"
                  >
                    <Edit2 size={18} />
                  </button>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 ${v.status === VehicleStatus.APPROVED ? 'bg-green-50 text-green-600' :
                      v.status === VehicleStatus.REJECTED ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {v.status === VehicleStatus.APPROVED && <CheckCircle size={12} />}
                    {v.status === VehicleStatus.PENDING && <Clock size={12} />}
                    {v.status === VehicleStatus.REJECTED && <XCircle size={12} />}
                    {v.status === VehicleStatus.APPROVED ? 'معتمدة' : v.status === VehicleStatus.REJECTED ? 'مرفوضة' : 'قيد المراجعة'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{v.plateNumber} • {v.year}</p>
            </div>
          </div>
        ))}

        {vehicles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <Car size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">لم تقم بإضافة أي سيارة بعد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVehicles;
