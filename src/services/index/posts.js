const axios = require('axios');
const fs = require('fs');
const path = require('path');

export const getAllPosts = async (searchKeyword = '', page = 1, limit = 10) => {
  try {
    const { data, headers } = await axios.get(
      `https://mern-api-delta.vercel.app/api/posts?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`
    );
    return { data, headers };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSinglePost = async ({ slug }) => {
  try {
    const { data } = await axios.get(
      `https://mern-api-delta.vercel.app/api/posts/${slug}`
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deletePost = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `https://mern-api-delta.vercel.app/api/posts/${slug}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updatePost = async ({ updatedData, slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Simpan file sementara ke /tmp
    const tempFilePath = `/tmp/${Date.now()}-${updatedData.get('postPicture').name}`;
    const tempFileBuffer = await updatedData.get('postPicture').arrayBuffer();
    fs.writeFileSync(tempFilePath, Buffer.from(tempFileBuffer));

    // Baca file sementara
    const fileContent = fs.readFileSync(tempFilePath);

    // Kirim file ke server lokal menggunakan axios
    const { data } = await axios.put(
      `https://mern-api-delta.vercel.app/api/posts/${slug}`,
      updatedData,
      {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Hapus file sementara setelah diunggah
    fs.unlinkSync(tempFilePath);

    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const createPost = async ({ token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `https://mern-api-delta.vercel.app/api/posts`,
      {},
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
