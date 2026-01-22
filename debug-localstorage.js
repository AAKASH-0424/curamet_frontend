// Debug script to check localStorage state
console.log('=== LocalStorage Debug Info ===');
console.log('All localStorage items:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}

console.log('\nSpecific items:');
console.log('users:', localStorage.getItem('users'));
console.log('currentUser:', localStorage.getItem('currentUser'));

// Check if test account exists
const users = JSON.parse(localStorage.getItem('users') || '{}');
console.log('\nTest account check:');
console.log('test@gmail.com exists:', !!users['test@gmail.com']);
if (users['test@gmail.com']) {
  console.log('test@gmail.com password:', users['test@gmail.com']);
}

// Try to create test account if it doesn't exist
if (!users['test@gmail.com']) {
  console.log('Creating test account...');
  users['test@gmail.com'] = '123';
  localStorage.setItem('users', JSON.stringify(users));
  console.log('Test account created');
} else {
  console.log('Test account already exists');
}