import jwt from "jsonwebtoken";
const generateToken = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "30 days",
    });

    // Verify access token using the public key
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) throw err;
      console.log("decode success", decode);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateToken:", error);
    throw error;
  }
};

export { generateToken };
