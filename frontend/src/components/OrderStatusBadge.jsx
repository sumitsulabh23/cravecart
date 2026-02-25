import React from 'react';
import { Package, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const OrderStatusBadge = ({ status }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending':
                return { icon: <Clock size={16} className="shrink-0" />, color: 'bg-amber-50 text-amber-600 border-amber-100' };
            case 'Preparing':
                return { icon: <div className="animate-pulse shrink-0"><Package size={16} /></div>, color: 'bg-blue-50 text-blue-600 border-blue-100' };
            case 'Out for Delivery':
                return { icon: <Truck size={16} className="shrink-0" />, color: 'bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20' };
            case 'Delivered':
                return { icon: <CheckCircle size={16} className="shrink-0" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
            case 'Cancelled':
                return { icon: <XCircle size={16} className="shrink-0" />, color: 'bg-red-50 text-red-600 border-red-100' };
            default:
                return { icon: <Clock size={16} className="shrink-0" />, color: 'bg-gray-50 text-gray-600 border-gray-100' };
        }
    };

    const style = getStatusStyles(status);

    return (
        <div className={`flex items-center whitespace-nowrap gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${style.color}`}>
            {style.icon}
            <span>{status}</span>
        </div>
    );
};

export default OrderStatusBadge;
