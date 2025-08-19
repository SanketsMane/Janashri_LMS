import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrateExistingStudents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    // Find all students that might need migration
    const students = await User.find({ role: 'student' });
    
    console.log(`Found ${students.length} students to check for migration`);
    
    for (const student of students) {
      let needsUpdate = false;
      const updates = {};
      
      // Add default notification settings if missing
      if (!student.notificationSettings) {
        updates.notificationSettings = {
          emailNotifications: true,
          smsNotifications: false,
          academicUpdates: true,
          examReminders: true,
          feeReminders: true,
          generalAnnouncements: true
        };
        needsUpdate = true;
      }
      
      // Add default privacy settings if missing
      if (!student.privacySettings) {
        updates.privacySettings = {
          profileVisibility: 'private',
          contactVisibility: 'limited',
          academicInfoVisibility: 'private'
        };
        needsUpdate = true;
      }
      
      // Initialize empty emergency contact if missing
      if (!student.emergencyContact) {
        updates.emergencyContact = {
          name: '',
          relationship: '',
          phone: ''
        };
        needsUpdate = true;
      }
      
      // Set empty address if missing
      if (!student.address) {
        updates.address = '';
        needsUpdate = true;
      }
      
      // Initialize photo object if missing
      if (!student.photo) {
        updates.photo = {
          url: '',
          public_id: ''
        };
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await User.findByIdAndUpdate(student._id, updates, { 
          runValidators: false  // Skip validation during migration
        });
        console.log(`Migrated student: ${student.name} (${student.email})`);
      }
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateExistingStudents();
