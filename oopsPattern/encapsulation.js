class UserProfile {
  #email;
  #username;
  #domain;
  constructor(data) {
    this.setEmail(data.email);
  }
  setEmail(newEmail) {
    if (newEmail.includes("@")) {
      this.#email = newEmail;
      this.#username=this.#email.split("@")[0];
      this.#domain=this.#email.split("@")[1];
    } else {
      throw new Error("Invalid email");
    }
  }
  getEmail() {
    return this.#email;
  }
  getUsername() {
    return this.#username;
  }
  getDomain() {
    return this.#domain;
  }
}

const data = { email: "john.doe@example.com" };
const user = new UserProfile(data);

console.log(user.getEmail());
console.log(user.getUsername());
console.log(user.getDomain());
