// Simple in-memory storage for testing when MongoDB is not available
class FallbackStorage {
  constructor() {
    this.admissions = [];
    this.users = [];
    this.contacts = [];
  }

  // Admission methods
  saveAdmission(data) {
    const admission = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending'
    };
    this.admissions.push(admission);
    return admission;
  }

  getAllAdmissions() {
    return this.admissions;
  }

  getAdmissionById(id) {
    return this.admissions.find(a => a._id === id);
  }

  updateAdmissionStatus(id, status) {
    const admission = this.admissions.find(a => a._id === id);
    if (admission) {
      admission.status = status;
      admission.updatedAt = new Date();
    }
    return admission;
  }

  // User methods
  saveUser(data) {
    const user = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  findUser(query) {
    const [key, value] = Object.entries(query)[0];
    return this.users.find(u => u[key] === value);
  }

  // Contact methods
  saveContact(data) {
    const contact = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date()
    };
    this.contacts.push(contact);
    return contact;
  }

  getAllContacts() {
    return this.contacts;
  }

  // Stats methods
  getStats() {
    return {
      totalAdmissions: this.admissions.length,
      pendingAdmissions: this.admissions.filter(a => a.status === 'pending').length,
      approvedAdmissions: this.admissions.filter(a => a.status === 'approved').length,
      rejectedAdmissions: this.admissions.filter(a => a.status === 'rejected').length,
      totalContacts: this.contacts.length
    };
  }
}

export default new FallbackStorage();
