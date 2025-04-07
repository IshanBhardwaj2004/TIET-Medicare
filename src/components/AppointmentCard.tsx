import React, { useState, useEffect } from 'react';
import BlurEffect from './BlurEffect';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { 
  saveAppointment, 
  isSlotBooked, 
  AppointmentDetails 
} from '@/utils/appointmentStorage';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AppointmentCard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("Dr. Aisha Sharma");
  const [selectedType, setSelectedType] = useState<string>("General Checkup");
  const [patientName, setPatientName] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(['9:00 AM', '10:30 AM', '11:45 AM', '2:00 PM', '3:15 PM', '4:30 PM']);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (selectedDate) {
      const allTimeSlots = ['9:00 AM', '10:30 AM', '11:45 AM', '2:00 PM', '3:15 PM', '4:30 PM'];
      const available = allTimeSlots.filter(time => !isSlotBooked(selectedDate, time));
      setAvailableTimeSlots(available);
      
      if (available.length > 0 && !available.includes(selectedTime)) {
        setSelectedTime(available[0]);
      }
    }
  }, [selectedDate, selectedTime]);
  
  const handleNext = () => {
    if (activeStep === 1) {
      if (!selectedDate || !selectedTime) {
        toast.error("Please select both date and time for your appointment");
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!selectedDoctor || !selectedType) {
        toast.error("Please select doctor and appointment type");
        return;
      }
      setActiveStep(3);
    } else if (activeStep === 3) {
      if (!patientName) {
        toast.error("Please enter your name");
        return;
      }
      
      if (!isAuthenticated) {
        toast.error("Please sign in to complete your booking");
        navigate('/auth');
        return;
      }
      
      const appointment: AppointmentDetails = {
        date: selectedDate!,
        time: selectedTime,
        doctor: selectedDoctor,
        type: selectedType,
        notes,
        patientName,
        patientEmail
      };
      
      saveAppointment(appointment);
      
      toast.success("Appointment booked successfully!", {
        description: `Your appointment with ${selectedDoctor} is scheduled for ${format(selectedDate || new Date(), 'EEEE, MMM d, yyyy')} at ${selectedTime}`,
      });
      
      setActiveStep(1);
      setSelectedDate(new Date());
      setSelectedTime("10:30 AM");
      setSelectedDoctor("Dr. Aisha Sharma");
      setSelectedType("General Checkup");
      setPatientName("");
      setPatientEmail("");
      setNotes("");
    }
  };
  
  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <section id="appointments" className="section-container bg-medical-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <BlurEffect>
              <span className="inline-block px-4 py-1.5 rounded-full bg-medical-blue-100 text-medical-blue-700 font-medium text-sm mb-4">
                Quick & Easy
              </span>
            </BlurEffect>
            
            <BlurEffect delay={100}>
              <h2 className="section-title">Schedule Your Appointment</h2>
            </BlurEffect>
            
            <BlurEffect delay={200}>
              <p className="section-subtitle">
                Our streamlined booking process makes it effortless to schedule appointments with campus medical professionals. Get the care you need, when you need it.
              </p>
            </BlurEffect>
            
            <BlurEffect delay={300}>
              <div className="space-y-6 mt-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-medical-blue-100 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-medical-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold mb-1">Select Your Date & Time</h3>
                    <p className="text-gray-600">Choose from available slots that fit your schedule.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-medical-blue-100 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-medical-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold mb-1">Choose Your Doctor</h3>
                    <p className="text-gray-600">Select from our qualified medical professionals based on your needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-medical-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-medical-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold mb-1">Confirm Your Details</h3>
                    <p className="text-gray-600">Verify your information and appointment specifics.</p>
                  </div>
                </div>
              </div>
            </BlurEffect>
          </div>
          
          <BlurEffect delay={400}>
            <motion.div 
              className="glass-effect rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Book Appointment</h3>
                  <div className="flex">
                    {[1, 2, 3].map((step) => (
                      <motion.div 
                        key={step} 
                        className={`w-3 h-3 rounded-full mx-1 cursor-pointer ${
                          step === activeStep 
                            ? 'bg-medical-blue-500' 
                            : step < activeStep 
                              ? 'bg-medical-blue-300' 
                              : 'bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => {
                          if (step < activeStep) setActiveStep(step);
                        }}
                      ></motion.div>
                    ))}
                  </div>
                </div>
                
                {activeStep === 1 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Select Date</label>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500 flex justify-between items-center">
                              {selectedDate ? format(selectedDate, 'EEEE, MMM d, yyyy') : 'Select date'}
                              <CalendarIcon className="h-5 w-5 text-gray-400" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              className="border rounded-md pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Available Time Slots</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimeSlots.length > 0 ? (
                          availableTimeSlots.map((time, i) => (
                            <motion.button 
                              key={i}
                              className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${
                                time === selectedTime 
                                  ? 'bg-medical-blue-100 text-medical-blue-600 border-2 border-medical-blue-500' 
                                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-medical-blue-50'
                              }`}
                              onClick={() => setSelectedTime(time)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {time}
                            </motion.button>
                          ))
                        ) : (
                          <p className="col-span-3 text-center py-3 bg-gray-50 text-gray-500 rounded-lg">
                            No slots available for selected date
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeStep === 2 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <motion.button 
                          className={`p-4 ${selectedType === "General Checkup" ? 'bg-medical-blue-100 border-2 border-medical-blue-500' : 'bg-white border border-gray-200 hover:bg-medical-blue-50'} rounded-lg text-left transition-all`}
                          onClick={() => setSelectedType("General Checkup")}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                              <Stethoscope className="h-5 w-5 text-medical-blue-600" />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-medical-blue-800">General Checkup</p>
                            </div>
                          </div>
                        </motion.button>
                        
                        <motion.button 
                          className={`p-4 ${selectedType === "Specialist Consult" ? 'bg-medical-blue-100 border-2 border-medical-blue-500' : 'bg-white border border-gray-200 hover:bg-medical-blue-50'} rounded-lg text-left transition-all`}
                          onClick={() => setSelectedType("Specialist Consult")}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-800">Specialist Consult</p>
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                      <div className="space-y-2">
                        {['Dr. Aisha Sharma', 'Dr. Rajiv Mehta'].map((doctor, i) => (
                          <motion.button 
                            key={i}
                            className={`w-full p-3 flex items-center rounded-lg transition-all ${
                              doctor === selectedDoctor 
                                ? 'bg-medical-blue-100 border-2 border-medical-blue-500' 
                                : 'bg-white border border-gray-200 hover:bg-medical-blue-50'
                            }`}
                            onClick={() => setSelectedDoctor(doctor)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-3 text-left">
                              <p className={`font-medium ${doctor === selectedDoctor ? 'text-medical-blue-800' : 'text-gray-800'}`}>{doctor}</p>
                              <p className="text-sm text-gray-500">General Physician</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeStep === 3 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name*</label>
                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                        <input
                          type="email"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-medical-blue-50 rounded-lg border border-medical-blue-100">
                      <h4 className="font-medium text-medical-blue-800 mb-3">Appointment Summary</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <div className="flex items-center text-gray-700">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            <span className="text-sm">Date:</span>
                          </div>
                          <span className="text-sm font-medium">
                            {selectedDate ? format(selectedDate, 'EEEE, MMM d, yyyy') : 'Not selected'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center text-gray-700">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">Time:</span>
                          </div>
                          <span className="text-sm font-medium">{selectedTime}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center text-gray-700">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            <span className="text-sm">Doctor:</span>
                          </div>
                          <span className="text-sm font-medium">{selectedDoctor}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center text-gray-700">
                            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            </svg>
                            <span className="text-sm">Service:</span>
                          </div>
                          <span className="text-sm font-medium">{selectedType}</span>
                        </div>
                      </div>
                      
                      {!isAuthenticated && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-700 flex items-center">
                            <Lock className="h-4 w-4 mr-2" />
                            You'll need to sign in to complete your booking
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500 resize-none"
                        rows={3}
                        placeholder="Add any specific concerns or symptoms you'd like to discuss..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex justify-between mt-8">
                  {activeStep > 1 ? (
                    <motion.button 
                      onClick={handlePrev}
                      className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back
                    </motion.button>
                  ) : (
                    <div></div>
                  )}
                  
                  <motion.button 
                    onClick={handleNext}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue-500 ${
                      activeStep === 3 
                        ? 'bg-medical-green-500 text-white hover:bg-medical-green-600' 
                        : 'bg-medical-blue-500 text-white hover:bg-medical-blue-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeStep === 3 ? (isAuthenticated ? 'Confirm Booking' : 'Sign In & Book') : 'Continue'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </BlurEffect>
        </div>
      </div>
    </section>
  );
};

export default AppointmentCard;
