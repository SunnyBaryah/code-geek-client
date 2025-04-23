import axios from "../axios.ts";
export class AIService {
  async getResponse(props: { prompt: string }) {
    const response = await axios.post(`/ai/getResponse`, props);
    if (response.status === 200) {
      return response;
    }
    return null;
  }
  async getPlagScore(props: { prompt: string }) {
    const response = await axios.post(`/ai/getPlagScore`, props);
    if (response.status === 200) {
      return response;
    }
    return null;
  }
}
const aiService = new AIService();

export default aiService;
