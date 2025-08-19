import mongoose from 'mongoose';
import User from './models/User.js';
import Admission from './models/Admission.js';
import { generateStudentId } from './utils/helpers.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixStudentIds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    // Find students without student_id
    const studentsWithoutId = await User.find({ 
      role: 'student', 
      $or: [
        { student_id: { $exists: false } },
        { student_id: null },
        { student_id: '' }
      ]
    });
    
    console.log(`Found ${studentsWithoutId.length} students without student_id`);
    
    for (const student of studentsWithoutId) {
      const studentId = await generateStudentId(Admission);
      student.student_id = studentId;
      await student.save();
      console.log(`Updated student ${student.name} with ID: ${studentId}`);
    }
    
    // Show all students with their IDs
    const allStudents = await User.find({ role: 'student' }).select('name email student_id');
    console.log('\nAll students:');
    allStudents.forEach(student => {
      console.log(`- ${student.name} (${student.email}) - ID: ${student.student_id}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixStudentIds();
