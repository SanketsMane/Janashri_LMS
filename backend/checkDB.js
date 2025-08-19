import mongoose from 'mongoose';
import Admission from './models/Admission.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    const total = await Admission.countDocuments();
    console.log('Total admissions:', total);
    
    if (total > 0) {
      const admissions = await Admission.find().limit(3);
      console.log('Sample admissions:');
      admissions.forEach(admission => {
        console.log('- ID:', admission._id.toString());
        console.log('  Name:', admission.firstName, admission.lastName);
        console.log('  Status:', admission.status);
        console.log('  Email:', admission.email);
        console.log('');
      });
    } else {
      console.log('No admission records found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
