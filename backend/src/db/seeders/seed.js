import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../../models/User.js';
import Patient from '../../models/Patient.js';
import Appointment from '../../models/Appointment.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    console.log('\n👥 Creating users...');
    const users = await User.create([
      {
        email: 'doctor@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Smith',
        role: 'doctor',
        specialty: 'Cardiology',
        licenseNumber: 'MD-12345',
        department: 'Cardiology',
        phone: '+1234567890',
        isActive: true
      },
      {
        email: 'doctor2@example.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'doctor',
        specialty: 'Internal Medicine',
        licenseNumber: 'MD-12346',
        department: 'Internal Medicine',
        phone: '+1234567891',
        isActive: true
      },
      {
        email: 'nurse@example.com',
        password: 'password123',
        firstName: 'Emily',
        lastName: 'Johnson',
        role: 'nurse',
        department: 'Emergency',
        phone: '+1234567892',
        isActive: true
      },
      {
        email: 'pharmacist@example.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Williams',
        role: 'pharmacist',
        licenseNumber: 'PH-54321',
        department: 'Pharmacy',
        phone: '+1234567893',
        isActive: true
      },
      {
        email: 'manager@example.com',
        password: 'password123',
        firstName: 'Emma',
        lastName: 'Davis',
        role: 'manager',
        department: 'Administration',
        phone: '+1234567894',
        isActive: true
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        phone: '+1234567895',
        isActive: true
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create sample patients (one by one to trigger pre-save hooks)
    console.log('\n🏥 Creating patients...');
    const patientData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'male',
        phone: '+1234567896',
        email: 'john.doe@example.com',
        bloodType: 'O+',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        allergies: [
          { 
            allergen: 'Penicillin', 
            reaction: 'Rash', 
            severity: 'moderate' 
          }
        ],
        chronicConditions: [
          {
            condition: 'Hypertension',
            diagnosedDate: new Date('2020-01-15'),
            status: 'controlled'
          }
        ],
        insurance: {
          provider: 'Blue Cross',
          policyNumber: 'BC123456',
          groupNumber: 'GRP001'
        }
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1985-08-22'),
        gender: 'female',
        phone: '+1234567897',
        email: 'jane.smith@example.com',
        bloodType: 'A+',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA'
        },
        allergies: [],
        insurance: {
          provider: 'Aetna',
          policyNumber: 'AET789012',
          groupNumber: 'GRP002'
        }
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        dateOfBirth: new Date('1978-03-10'),
        gender: 'male',
        phone: '+1234567898',
        email: 'michael.brown@example.com',
        bloodType: 'B+',
        address: {
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        allergies: [
          {
            allergen: 'Aspirin',
            reaction: 'Stomach upset',
            severity: 'mild'
          }
        ],
        chronicConditions: [
          {
            condition: 'Type 2 Diabetes',
            diagnosedDate: new Date('2018-06-20'),
            status: 'active'
          }
        ]
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        dateOfBirth: new Date('1995-11-30'),
        gender: 'female',
        phone: '+1234567899',
        email: 'lisa.anderson@example.com',
        bloodType: 'AB-',
        address: {
          street: '321 Elm St',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        },
        allergies: []
      }
    ];

    // Create patients one by one to trigger pre-save hooks for MRN generation
    const patients = [];
    for (const data of patientData) {
      const patient = new Patient(data);
      await patient.save();
      patients.push(patient);
    }

    console.log(`✅ Created ${patients.length} patients`);

    // Create sample appointments (one by one to trigger pre-save hooks)
    console.log('\n📅 Creating appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentData = [
      {
        patientId: patients[0]._id,
        doctorId: users[0]._id, // Dr. John Smith (Cardiology)
        date: today,
        time: '10:00',
        duration: 30,
        type: 'in-person',
        status: 'scheduled',
        reason: 'Annual checkup',
        fee: 150,
        paymentStatus: 'pending'
      },
      {
        patientId: patients[1]._id,
        doctorId: users[1]._id, // Dr. Sarah Wilson (Internal Medicine)
        date: today,
        time: '14:00',
        duration: 30,
        type: 'in-person',
        status: 'scheduled',
        reason: 'Follow-up visit',
        fee: 150,
        paymentStatus: 'pending'
      },
      {
        patientId: patients[2]._id,
        doctorId: users[0]._id,
        date: tomorrow,
        time: '09:00',
        duration: 30,
        type: 'telehealth',
        status: 'scheduled',
        reason: 'Diabetes management',
        fee: 100,
        paymentStatus: 'pending'
      }
    ];

    // Create appointments one by one to trigger pre-save hooks for appointmentId generation
    const appointments = [];
    for (const data of appointmentData) {
      const appointment = new Appointment(data);
      await appointment.save();
      appointments.push(appointment);
    }

    console.log(`✅ Created ${appointments.length} appointments`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('=' .repeat(60));
    console.log('LOGIN CREDENTIALS:');
    console.log('=' .repeat(60));
    console.log('\n👨‍⚕️  Doctor (Cardiology):');
    console.log('   Email: doctor@example.com');
    console.log('   Password: password123\n');
    
    console.log('👨‍⚕️  Doctor (Internal Medicine):');
    console.log('   Email: doctor2@example.com');
    console.log('   Password: password123\n');
    
    console.log('👩‍⚕️  Nurse:');
    console.log('   Email: nurse@example.com');
    console.log('   Password: password123\n');
    
    console.log('💊 Pharmacist:');
    console.log('   Email: pharmacist@example.com');
    console.log('   Password: password123\n');
    
    console.log('📊 Manager:');
    console.log('   Email: manager@example.com');
    console.log('   Password: password123\n');
    
    console.log('🔐 Admin:');
    console.log('   Email: admin@example.com');
    console.log('   Password: password123\n');
    
    console.log('=' .repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   - ${users.length} users created`);
    console.log(`   - ${patients.length} patients created`);
    console.log(`   - ${appointments.length} appointments created`);
    console.log('=' .repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
