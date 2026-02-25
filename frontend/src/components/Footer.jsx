import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#14b8a6] text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-extrabold flex items-center gap-2">
                            <div className="bg-white p-1.5 rounded-lg text-[#14b8a6]">
                                <ShoppingBag size={22} fill="currentColor" />
                            </div>
                            <span>CraveCart</span>
                        </Link>
                        <p className="text-teal-50 text-sm leading-relaxed max-w-xs">
                            Bringing your favorite meals straight from local kitchens to your doorstep. Minimal, fast, and satisfying.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-teal-200 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-teal-200 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-teal-200 transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Company</h4>
                        <ul className="space-y-4 text-teal-50 text-sm">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Partner With Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Support</h4>
                        <ul className="space-y-4 text-teal-50 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-teal-50 text-sm">
                            <li className="flex items-center gap-3">
                                <Mail size={16} />
                                <span>support@cravecart.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} />
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin size={16} />
                                <span>123 Foodie Street, Flavor Town</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-teal-500/30 pt-8 text-center text-teal-100 text-xs">
                    <p>&copy; {new Date().getFullYear()} CraveCart. Built with love for foodies.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
