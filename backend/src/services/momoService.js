import crypto from "crypto";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;

const momoService = {
  createMomoPayment: async ({
    amount,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData = "",
  }) => {
    try {
      const requestId = partnerCode + new Date().getTime();
      const orderId = requestId;
      const requestType = "captureWallet";
      const lang = "en";

      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: lang,
      });

      const options = {
        hostname: "test-payment.momo.vn",
        port: 443,
        path: "/v2/gateway/api/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let body = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            body += chunk;
          });

          res.on("end", () => {
            try {
              const parsedBody = JSON.parse(body);
              resolve(parsedBody);
            } catch (parseError) {
              reject(parseError);
            }
          });
        });

        req.on("error", (e) => {
          reject(e);
        });

        req.write(requestBody);
        req.end();
      });
    } catch (error) {
      throw error;
    }
  },
  verifyMomoPayment: ({
    signature,
    requestId,
    orderId,
    amount,
    orderInfo,
    orderType,
    transId,
    message,
    localMessage,
    responseTime,
    errorCode,
    payType,
    extraData = "",
  }) => {
    try {
      const signatureRaw = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&transId=${transId}&message=${message}&localMessage=${localMessage}&responseTime=${responseTime}&errorCode=${errorCode}&payType=${payType}&extraData=${extraData}`;

      const genSignature = crypto
        .createHmac("sha256", secretKey)
        .update(signatureRaw)
        .digest("hex");

      return genSignature === signature;
    } catch (error) {
      throw error;
    }
  },
};

export { momoService };
