import { roleAuthService } from './role-auth-service';

// Function to create a default admin user for testing
export const createDefaultAdmin = async () => {
  try {
    console.log('🔐 Creating default admin user...');
    
    const adminData = {
      displayName: 'System Admin',
      email: 'admin@example.com',
      password: 'admin123'
    };

    const result = await roleAuthService.createAdmin(
      adminData.email,
      adminData.password,
      { displayName: adminData.displayName }
    );

    if (result.success) {
      console.log('✅ Default admin user created successfully!');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password:', adminData.password);
      console.log('🎯 Role: Admin');
      return { success: true, credentials: adminData };
    } else {
      console.error('❌ Error creating admin user:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return { success: false, error: error.message };
  }
};

// Function to create a default staff user for testing
export const createDefaultStaff = async () => {
  try {
    console.log('👥 Creating default staff user...');
    
    const staffData = {
      displayName: 'Staff Member',
      email: 'staff@example.com',
      password: 'staff123'
    };

    const result = await roleAuthService.createStaff(
      staffData.email,
      staffData.password,
      { 
        displayName: staffData.displayName,
        createdBy: 'admin' // In real app, this would be the admin's UID
      }
    );

    if (result.success) {
      console.log('✅ Default staff user created successfully!');
      console.log('📧 Email:', staffData.email);
      console.log('🔑 Password:', staffData.password);
      console.log('🎯 Role: Staff');
      return { success: true, credentials: staffData };
    } else {
      console.error('❌ Error creating staff user:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Error creating staff user:', error);
    return { success: false, error: error.message };
  }
};

// Function to create both admin and staff users
export const createDefaultUsers = async () => {
  try {
    console.log('🚀 Creating default admin and staff users...');
    
    const [adminResult, staffResult] = await Promise.all([
      createDefaultAdmin(),
      createDefaultStaff()
    ]);

    const results = {
      admin: adminResult,
      staff: staffResult
    };

    if (adminResult.success && staffResult.success) {
      console.log('✅ All default users created successfully!');
      console.log('\n📋 Login Credentials:');
      console.log('👑 Admin:', adminResult.credentials.email, '/', adminResult.credentials.password);
      console.log('👥 Staff:', staffResult.credentials.email, '/', staffResult.credentials.password);
    } else {
      console.log('⚠️ Some users may not have been created successfully');
    }

    return results;
  } catch (error) {
    console.error('❌ Error creating default users:', error);
    return { success: false, error: error.message };
  }
};
