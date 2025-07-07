// Simple test to verify the app starts correctly
const { spawn } = require('child_process');

console.log('Starting Vue app test...');

const dev = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe'
});

let output = '';

dev.stdout.on('data', (data) => {
  output += data.toString();
  console.log(data.toString());
  
  if (output.includes('Local:') && output.includes('localhost:3000')) {
    console.log('\n✅ App started successfully on localhost:3000');
    console.log('🔍 You should see the login form at http://localhost:3000/login');
    console.log('📝 The login form includes:');
    console.log('   - Email field');
    console.log('   - Password field');
    console.log('   - Remember me checkbox');
    console.log('   - Sign In button');
    console.log('   - Google OAuth button');
    
    // Keep the server running
    console.log('\nPress Ctrl+C to stop the server');
  }
});

dev.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

dev.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nStopping server...');
  dev.kill();
  process.exit();
});