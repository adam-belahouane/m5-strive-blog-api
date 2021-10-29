import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY) 

export const sendBlogPostMadeEmail = async recipientAddress => {
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "BlogPost is up",
    text: "you have successfully post a new blog post",
    html: "<strong>you have successfully made a new post</strong>",
  }

  await sgMail.send(msg)
}