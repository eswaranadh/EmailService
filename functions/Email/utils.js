const Jwt = require("../../providers/Jwt");
const { db } = require("../../utils/admin");

class InboxUtils {
  static async _check_email_registered(email, clientId) {
    console.log("first", email, clientId);
    return new Promise( (resolve, reject) => {
      return db
        .collection("CLIENTS_MANAGEMENT")
        .doc(clientId)
        .collection("INVITATIONS")
        .where("invitee", "==", email)
        .where("dataReceived", "==", true)
        .get()
        .then((snap) => {
          if (snap.size > 1) {
            console.log(`${email} already registered`);
            throw new Error("already-registered");
          }
          console.log("here");
          return resolve("no-previous-invtation");
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  static async _check_token_expired(token, clientId) {
    console.log("first->token", token);
    return new Promise((resolve, reject) => {
      return db
        .collection("CLIENTS_MANAGEMENT")
        .doc(clientId)
        .collection("INVITATIONS")
        .where("latestToken", "==", token)
        .get()
        .then((snap) => {
          if (snap.size < 1) throw new Error("token-not-found");
          const data = snap.docs[0].data();
          const tokenInfo = Jwt.verifyToken(token);
          const verify = tokenInfo.status;
          if (!verify) {
            console.log(`EXPIRED AT: ${new Date(tokenInfo.error.expiredAt)}`);
            throw new Error("token-expired");
          }
          console.log("tokenInfo", tokenInfo.info.email);
          if (tokenInfo.info.email !== data.invitee)
            throw new Error("invalid-access");
          return resolve(tokenInfo.info.email.toLowerCase());
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  static async _check_employeeregistered(clientId, email) {
    return new Promise((resolve, reject) => {
      return db
        .collection("CLIENTS_MANAGEMENT")
        .doc(clientId)
        .collection("INVITATIONS")
        .doc(email)
        .get()
        .then((snap) => {
          if (snap.data().dataReceived) {
            throw new Error("registration-completed");
          }
          return snap.data();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}

module.exports = InboxUtils;
