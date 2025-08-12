class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  getPermissions() {
    return ['read'];
  }

  describe() {
    return `${this.username} (${this.email}) with permissions: ${this.getPermissions().join(', ')}`;
  }
}

class Admin extends User {
  constructor(username, email) {
    super(username, email);
  }

  getPermissions() {
    return ['read', 'write', 'delete', 'manage-users'];
  }

  manageUsers() {
    return `${this.username} can manage all users.`;
  }
}

class Guest extends User {
  constructor(username, email) {
    super(username, email);
  }

  requestAccess() {
    return `${this.username} has requested additional access.`;
  }
}

const regularUser = new User('Sameer', 'sameer@gmail.com');
const adminUser = new Admin('Haroon', 'haroon@gmail.com');
const guestUser = new Guest('Harish', 'harish@gmail.com');

console.log(regularUser.describe());
console.log(adminUser.describe());
console.log(adminUser.manageUsers());
console.log(guestUser.describe());
console.log(guestUser.requestAccess());

