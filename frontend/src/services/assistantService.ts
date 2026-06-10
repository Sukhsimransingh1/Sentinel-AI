import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const askAssistant = async (
  question: string,
  image?: File | null
) => {
  const formData = new FormData();

  formData.append("question", question);

  if (image) {
    formData.append("image", image);
  }
  console.time("Assistant API");
  const response = await API.post(
    "/assistant/",
    formData
  );
  console.timeEnd("Assistant API");

  return response.data;
};