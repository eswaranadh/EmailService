const sgMail = require('@sendgrid/mail')
const credentials = require('../config/credentials.json')
sgMail.setApiKey(credentials.sendGridApiKey)
class InboxModel {
  constructor(user) {
    this.actionPerformer = user;
  }
  async _send_email({ subject, body, to, cc, bcc }) {

    const optionsForMail = {
      from: 'noreply <noreply@flairtechno.com',
      fromEmail: 'noreply@flairtechno.com',
      replyTo: 'noreply@flairtechno.com',
    }
    return new Promise((resolve, reject) => {
      console.log(
        `SENDING EMAIL TO: ${"to -->" +
        to.join(",") +
        "\n cc --> " +
        cc.join(",") +
        "\n bcc --> " +
        bcc.join(",")
        }`
      );
      const message = {
        personalizations: [
          {
            to: to.map((email) => ({ email })),
            cc: cc.map((email) => ({ email })),
            bcc: bcc.map((email) => ({ email }))
          }
        ],
        from: {
          email: optionsForMail.fromEmail,
          name: optionsForMail.from
        },
        replyTo: {
          email: optionsForMail.replyTo
          // name: 'Example Customer Service Team'
        },
        subject: subject,
        content: [
          {
            type: "text/html",
            value: body
          }
        ]
      };
      // console.log(message)
      sgMail
        .send(message)
        .then(() => {
          console.log(
            `EMAIL SEND TO: ${"to -->" +
            to.join(",") +
            "\n cc --> " +
            cc.join(",") +
            "\n bcc --> " +
            bcc.join(",")
            }`
          );
          return resolve({
            message: "Email sent"
          });
        })
        .catch((error) => {
          console.error(error.response.body);
          reject(error);
        });
    });
  }


}

module.exports = InboxModel;
