import mongoose from 'mongoose';
import User from './models/User.js';
import Admission from './models/Admission.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixDuplicateStudentIds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    // Find all students and admissions with student IDs
    const [users, admissions] = await Promise.all([
      User.find({ student_id: { $exists: true, $ne: null } }).sort({ createdAt: 1 }),
      Admission.find({ student_id: { $exists: true, $ne: null } }).sort({ createdAt: 1 })
    ]);
    
    console.log(`Found ${users.length} users with student IDs`);
    console.log(`Found ${admissions.length} admissions with student IDs`);
    
    // Collect all student IDs to check for duplicates
    const allIds = new Map();
    const duplicates = new Set();
    
    // Check users for duplicates
    users.forEach(user => {
      const id = user.student_id;
      if (allIds.has(id)) {
        duplicates.add(id);
        console.log(`Duplicate student ID found: ${id} (User: ${user.name})`);
      } else {
        allIds.set(id, { type: 'user', doc: user });
      }
    });
    
    // Check admissions for duplicates
    admissions.forEach(admission => {
      const id = admission.student_id;
      if (allIds.has(id)) {
        duplicates.add(id);
        console.log(`Duplicate student ID found: ${id} (Admission: ${admission.name})`);
      } else {
        allIds.set(id, { type: 'admission', doc: admission });
      }
    });
    
    if (duplicates.size === 0) {
      console.log('No duplicate student IDs found!');
      process.exit(0);
    }
    
    console.log(`\nFound ${duplicates.size} duplicate student IDs. Fixing...`);
    
    // Find the highest current student ID number
    let highestNumber = 0;
    allIds.forEach((value, id) => {
      const number = parseInt(id.replace('STU', '')) || 0;
      if (number > highestNumber) {
        highestNumber = number;
      }
    });
    
    console.log(`Highest current student ID number: ${highestNumber}`);
    
    let nextNumber = highestNumber + 1;
    
    // Fix duplicates by reassigning new IDs
    for (const duplicateId of duplicates) {
      console.log(`\nFixing duplicate ID: ${duplicateId}`);
      
      // Get all documents with this duplicate ID
      const duplicateUsers = users.filter(u => u.student_id === duplicateId);
      const duplicateAdmissions = admissions.filter(a => a.student_id === duplicateId);
      
      // Keep the first one (oldest), reassign others
      for (let i = 1; i < duplicateUsers.length; i++) {
        const newId = `STU${nextNumber.toString().padStart(4, '0')}`;
        console.log(`  Reassigning user ${duplicateUsers[i].name}: ${duplicateId} -> ${newId}`);
        
        await User.findByIdAndUpdate(duplicateUsers[i]._id, { student_id: newId });
        nextNumber++;
      }
      
      for (let i = 1; i < duplicateAdmissions.length; i++) {
        const newId = `STU${nextNumber.toString().padStart(4, '0')}`;
        console.log(`  Reassigning admission ${duplicateAdmissions[i].name}: ${duplicateId} -> ${newId}`);
        
        await Admission.findByIdAndUpdate(duplicateAdmissions[i]._id, { student_id: newId });
        nextNumber++;
      }
    }
    
    console.log('\nDuplicate student IDs fixed successfully!');
    console.log(`Next available student ID: STU${nextNumber.toString().padStart(4, '0')}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing duplicate student IDs:', error);
    process.exit(1);
  }
}

fixDuplicateStudentIds();
