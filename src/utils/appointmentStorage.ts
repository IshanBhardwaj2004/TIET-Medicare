
// Utility functions for storing appointment details

export interface AppointmentDetails {
  id?: string;
  date: Date;
  time: string;
  doctor: string;
  type: string;
  notes?: string;
  patientName?: string;
  patientEmail?: string;
  userId?: string; // Add userId to associate appointments with users
}

// Helper to get current user ID
const getCurrentUserId = (): string | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    const userData = JSON.parse(user);
    return userData._id || null;
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}

// Get all appointments for the current user
export const getAppointments = (): AppointmentDetails[] => {
  const userId = getCurrentUserId();
  const allAppointments = localStorage.getItem('appointments');
  
  if (!allAppointments) return [];
  
  try {
    const appointments = JSON.parse(allAppointments, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    });
    
    // If user is logged in, filter appointments by userId
    if (userId) {
      return appointments.filter((apt: AppointmentDetails) => apt.userId === userId);
    }
    
    // If no user is logged in, return appointments without userId (anonymous)
    return appointments.filter((apt: AppointmentDetails) => !apt.userId);
  } catch (e) {
    console.error('Error parsing appointments:', e);
    return [];
  }
};

// Save a new appointment
export const saveAppointment = (appointment: AppointmentDetails): void => {
  const userId = getCurrentUserId();
  const appointments = localStorage.getItem('appointments') 
    ? JSON.parse(localStorage.getItem('appointments') || '[]')
    : [];
  
  // Generate a unique ID for the appointment
  const newAppointment = {
    ...appointment,
    id: `apt_${Date.now()}`,
    userId: userId || undefined,
  };
  
  appointments.push(newAppointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
};

// Get upcoming appointments for the current user
export const getUpcomingAppointments = (): AppointmentDetails[] => {
  const appointments = getAppointments();
  const now = new Date();
  
  return appointments
    .filter(appointment => new Date(appointment.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Check if a slot is already booked
export const isSlotBooked = (date: Date, time: string): boolean => {
  const userId = getCurrentUserId();
  const allAppointments = localStorage.getItem('appointments')
    ? JSON.parse(localStorage.getItem('appointments') || '[]', (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      })
    : [];
  
  // Check all appointments, not just the current user's
  return allAppointments.some(
    (appointment: AppointmentDetails) => 
      appointment.date.toDateString() === date.toDateString() && 
      appointment.time === time
  );
};

// Delete an appointment
export const deleteAppointment = (id: string): boolean => {
  const userId = getCurrentUserId();
  const allAppointments = localStorage.getItem('appointments')
    ? JSON.parse(localStorage.getItem('appointments') || '[]')
    : [];
  
  // Find the appointment
  const appointmentIndex = allAppointments.findIndex(
    (apt: AppointmentDetails) => apt.id === id
  );
  
  if (appointmentIndex === -1) return false;
  
  // Check if the user owns this appointment or if it's anonymous
  const appointment = allAppointments[appointmentIndex];
  if (appointment.userId && appointment.userId !== userId) {
    return false; // Not authorized to delete
  }
  
  // Delete the appointment
  allAppointments.splice(appointmentIndex, 1);
  localStorage.setItem('appointments', JSON.stringify(allAppointments));
  return true;
};

// Update an existing appointment
export const updateAppointment = (appointment: AppointmentDetails): boolean => {
  const userId = getCurrentUserId();
  const allAppointments = localStorage.getItem('appointments')
    ? JSON.parse(localStorage.getItem('appointments') || '[]', (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      })
    : [];
  
  // Find the appointment
  const appointmentIndex = allAppointments.findIndex(
    (apt: AppointmentDetails) => apt.id === appointment.id
  );
  
  if (appointmentIndex === -1) return false;
  
  // Check if the user owns this appointment
  const existingAppointment = allAppointments[appointmentIndex];
  if (existingAppointment.userId && existingAppointment.userId !== userId) {
    return false; // Not authorized to update
  }
  
  // Update the appointment
  allAppointments[appointmentIndex] = {
    ...appointment,
    userId: existingAppointment.userId // Preserve the original userId
  };
  
  localStorage.setItem('appointments', JSON.stringify(allAppointments));
  return true;
};
