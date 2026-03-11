import {
  register,
  login,
  logout,
  getCurrentUser,
  isLoggedIn,
  getUsers,
} from "../utils/auth";

describe("auth utility", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("registers a new user and logs them in", () => {
    const user = register("Anna", "anna@test.se", "1234");
    expect(user.name).toBe("Anna");
    expect(user.email).toBe("anna@test.se");
    expect(isLoggedIn()).toBe(true);
    expect(getCurrentUser()?.email).toBe("anna@test.se");
  });
  it("throws when registering a duplicate email", () => {
    register("Anna", "anna@test.se", "1234");
    expect(() => register("Anna2", "anna@test.se", "5678")).toThrow(
      "redan registrerad",
    );
  });

  it("logs in with correct credentials", () => {
    register("Anna", "anna@test.se", "1234");
    logout();
    expect(isLoggedIn()).toBe(false);

    const user = login("anna@test.se", "1234");
    expect(user.name).toBe("Anna");
    expect(isLoggedIn()).toBe(true);
  });

  it("throws on wrong password", () => {
    register("Anna", "anna@test.se", "1234");
    logout();
    expect(() => login("anna@test.se", "wrong")).toThrow("Fel e-post");
  });

  it("logout clears current user", () => {
    register("Anna", "anna@test.se", "1234");
    expect(isLoggedIn()).toBe(true);
    logout();
    expect(isLoggedIn()).toBe(false);
    expect(getCurrentUser()).toBeNull();
  });

  it("getUsers returns all registered users", () => {
    register("Anna", "anna@test.se", "1234");
    logout();
    register("Erik", "erik@test.se", "5678");
    const users = getUsers();
    expect(users).toHaveLength(2);
  });
});
