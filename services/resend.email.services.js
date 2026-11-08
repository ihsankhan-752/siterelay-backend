import { Resend } from "resend";
import { invitationTemplate } from "../templates/invitation.template.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailForInvitation = async ({
  userEmail,
  role,
  invitationUrl,
  companyName,
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: userEmail,
      subject: `Invitation for joining company as ${role}`,
      html: invitationTemplate({
        companyName: companyName,
        role: role,
        invitationUrl: invitationUrl,
      }),
    });

    if (error) {
      console.log(`Error ${error}`);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};
