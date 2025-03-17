import argon2 from "argon2";
export class User {
  firstname: string;
  lastname: string;
  password: string;
  // original_profile_url: string;
  // resized_profile_url: string;

  constructor(
    firstname: string,
    lastname: string,
    password: string,
    // original_profile_url: string,
    // resized_profile_url: string
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    // this.original_profile_url = original_profile_url;
    // this.resized_profile_url=resized_profile_url;
  }
  encryptPassword = async () => {
    try {
      const hash = await argon2.hash(this.password);
      this.password = hash;
    } catch (err) {
      throw new Error("Error while password encryption");
    }
  };
}
