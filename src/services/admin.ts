import axios from "../axios.ts";

export class AdminAuthService {
  async login(props: { email: string; password: string }) {
    const response = await axios.post("/users/admin-login", props);
    if (response.status === 200) {
      return response;
    }
    return null;
  }
  async getCurrentAdmin() {
    const response = await axios.get("/users/get-current-admin");
    if (response.status === 200) {
      return response;
    } else return null;
  }
}

const adminAuthService = new AdminAuthService();

export default adminAuthService;
